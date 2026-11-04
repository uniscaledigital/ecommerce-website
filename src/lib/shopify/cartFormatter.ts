import type { Cart, CartLineItem } from "@/types";

interface ShopifyGraphQLCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount?: { amount: string; currencyCode: string } | null;
  };
  lines?: {
    edges?: Array<{
      node: {
        id: string;
        quantity: number;
        cost?: {
          totalAmount: { amount: string; currencyCode: string };
        };
        merchandise: {
          id: string;
          title: string;
          sku?: string | null;
          price: { amount: string; currencyCode: string };
          product: {
            id: string;
            title: string;
            handle: string;
            vendor: string;
            featuredImage?: {
              url: string;
              altText?: string | null;
              width?: number;
              height?: number;
            } | null;
          };
        };
      };
    }>;
  };
}

export function formatShopifyCart(rawCart: unknown): Cart | null {
  if (!rawCart || typeof rawCart !== "object") return null;

  const c = rawCart as ShopifyGraphQLCart;

  const lines: CartLineItem[] = [];
  if (c.lines?.edges && Array.isArray(c.lines.edges)) {
    for (const edge of c.lines.edges) {
      const node = edge.node;
      if (!node || !node.merchandise) continue;

      lines.push({
        id: node.id,
        quantity: node.quantity,
        merchandise: {
          id: node.merchandise.id,
          title: node.merchandise.title,
          sku: node.merchandise.sku || "",
          price: {
            amount: node.merchandise.price?.amount || "0.00",
            currencyCode: node.merchandise.price?.currencyCode || "USD",
          },
          product: {
            id: node.merchandise.product?.id || "",
            title: node.merchandise.product?.title || "",
            handle: node.merchandise.product?.handle || "",
            vendor: node.merchandise.product?.vendor || "",
            featuredImage: {
              url: node.merchandise.product?.featuredImage?.url || "/assets/placeholder.png",
              altText: node.merchandise.product?.featuredImage?.altText || node.merchandise.product?.title || "",
              width: node.merchandise.product?.featuredImage?.width || 600,
              height: node.merchandise.product?.featuredImage?.height || 600,
            },
          },
        },
      });
    }
  }

  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl || "",
    totalQuantity: typeof c.totalQuantity === "number" ? c.totalQuantity : lines.reduce((sum, l) => sum + l.quantity, 0),
    lines,
    cost: {
      subtotalAmount: {
        amount: c.cost?.subtotalAmount?.amount || "0.00",
        currencyCode: c.cost?.subtotalAmount?.currencyCode || "USD",
      },
      totalAmount: {
        amount: c.cost?.totalAmount?.amount || "0.00",
        currencyCode: c.cost?.totalAmount?.currencyCode || "USD",
      },
      totalTaxAmount: c.cost?.totalTaxAmount
        ? {
            amount: c.cost.totalTaxAmount.amount,
            currencyCode: c.cost.totalTaxAmount.currencyCode,
          }
        : null,
    },
  };
}
