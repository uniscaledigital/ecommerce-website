import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validateCartInput } from "@/lib/validation/schemas";
import { formatShopifyCart } from "@/lib/shopify/cartFormatter";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
} from "@/lib/shopify/mutations";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "the-irish-grocer.myshopify.com";
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-01";
const IS_DEMO = !TOKEN || TOKEN === "demo_token" || process.env.NEXT_PUBLIC_COMMERCE_MODE === "demo";

async function shopifyRequest(query: string, variables: Record<string, unknown>) {
  const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Shopify API responded with status ${res.status}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || "Shopify GraphQL execution error");
  }

  return json.data;
}

export async function POST(request: Request) {
  // 1. Rate limiting
  const rateLimit = checkRateLimit(request, "cart", {
    windowMs: 60_000,
    maxRequests: 30,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many cart operations. Please slow down." },
      { status: 429, headers: rateLimit.headers }
    );
  }

  // 2. Content-Type check
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid Content-Type; expected application/json" },
      { status: 415, headers: rateLimit.headers }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: rateLimit.headers }
    );
  }

  try {
    // 3. Payload validation
    const validation = validateCartInput(rawBody);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const { action, cartId, lines, lineIds, input } = validation.data;

    // 4. Demo Mode Handler
    if (IS_DEMO) {
      return NextResponse.json(
        {
          mode: "demo",
          message: "Demo mode cart operation handled locally",
          action,
        },
        { headers: rateLimit.headers }
      );
    }

    // 5. Production Shopify Cart Operations
    let rawCart: unknown = null;
    let userErrors: Array<{ field?: string[]; message: string }> = [];

    if (action === "create") {
      const data = await shopifyRequest(CART_CREATE_MUTATION, {
        input: input || (lines ? { lines } : {}),
      });
      rawCart = data?.cartCreate?.cart;
      userErrors = data?.cartCreate?.userErrors || [];
    } else if (action === "add") {
      const data = await shopifyRequest(CART_LINES_ADD_MUTATION, {
        cartId,
        lines,
      });
      rawCart = data?.cartLinesAdd?.cart;
      userErrors = data?.cartLinesAdd?.userErrors || [];
    } else if (action === "update") {
      const data = await shopifyRequest(CART_LINES_UPDATE_MUTATION, {
        cartId,
        lines,
      });
      rawCart = data?.cartLinesUpdate?.cart;
      userErrors = data?.cartLinesUpdate?.userErrors || [];
    } else if (action === "remove") {
      const data = await shopifyRequest(CART_LINES_REMOVE_MUTATION, {
        cartId,
        lineIds,
      });
      rawCart = data?.cartLinesRemove?.cart;
      userErrors = data?.cartLinesRemove?.userErrors || [];
    } else if (action === "get") {
      const data = await shopifyRequest(CART_QUERY, { cartId });
      rawCart = data?.cart;
    }

    if (userErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Shopify cart error",
          userErrors,
        },
        { status: 400, headers: rateLimit.headers }
      );
    }

    if (!rawCart) {
      return NextResponse.json(
        {
          error: "Shopify cart not found or expired",
          cartId,
        },
        { status: 404, headers: rateLimit.headers }
      );
    }

    const formattedCart = formatShopifyCart(rawCart);

    return NextResponse.json(
      {
        success: true,
        mode: "production",
        cart: formattedCart,
      },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";
    console.error("Cart API error:", error);
    return NextResponse.json(
      {
        error: isTimeout
          ? "Shopify cart service timed out"
          : "Cart mutation failed",
      },
      { status: isTimeout ? 504 : 500, headers: rateLimit.headers }
    );
  }
}
