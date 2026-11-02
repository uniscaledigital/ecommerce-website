import { NextResponse } from "next/server";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "the-irish-grocer.myshopify.com";
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-01";

export async function POST(request: Request) {
  try {
    const { query, variables } = await request.json();

    if (!TOKEN || TOKEN === "demo_token") {
      return NextResponse.json({
        data: null,
        mode: "demo",
        message: "Running in local demo mode. Shopify Storefront token is not configured.",
      });
    }

    const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Shopify proxy error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with Shopify API" },
      { status: 500 }
    );
  }
}

