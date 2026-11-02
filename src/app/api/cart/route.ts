import { NextResponse } from "next/server";
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

async function shopifyRequest(query: string, variables: Record<string, unknown>) {
  const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

export async function POST(request: Request) {
  try {
    const { action, cartId, lines, lineIds, input } = await request.json();

    if (!TOKEN || TOKEN === "demo_token") {
      return NextResponse.json({
        mode: "demo",
        message: "Demo mode simulated cart transaction",
      });
    }

    let result;
    if (action === "create") {
      result = await shopifyRequest(CART_CREATE_MUTATION, { input: input || {} });
    } else if (action === "add") {
      result = await shopifyRequest(CART_LINES_ADD_MUTATION, { cartId, lines });
    } else if (action === "update") {
      result = await shopifyRequest(CART_LINES_UPDATE_MUTATION, { cartId, lines });
    } else if (action === "remove") {
      result = await shopifyRequest(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
    } else if (action === "get") {
      result = await shopifyRequest(CART_QUERY, { cartId });
    } else {
      return NextResponse.json({ error: "Invalid cart action" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json({ error: "Cart mutation failed" }, { status: 500 });
  }
}

