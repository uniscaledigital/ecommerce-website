import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validateShopifyPayload } from "@/lib/validation/schemas";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "the-irish-grocer.myshopify.com";
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-01";

export async function POST(request: Request) {
  // 1. Rate limiting (60 requests per minute per IP)
  const rateLimit = checkRateLimit(request, "shopify-proxy", {
    windowMs: 60_000,
    maxRequests: 60,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
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

  try {
    const rawBody = await request.json();

    // 3. Payload & Operation Allowlist Validation
    const validation = validateShopifyPayload(rawBody);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const { query, variables } = validation.data;

    // 4. Demo Mode Check
    if (!TOKEN || TOKEN === "demo_token") {
      return NextResponse.json(
        {
          data: null,
          mode: "demo",
          message: "Local demo mode active. Configure SHOPIFY_STOREFRONT_ACCESS_TOKEN for live operations.",
        },
        { headers: rateLimit.headers }
      );
    }

    // 5. Secure Outbound Request with Timeout
    const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Shopify service returned HTTP ${response.status}` },
        { status: response.status >= 500 ? 502 : response.status, headers: rateLimit.headers }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: rateLimit.headers });
  } catch (error: unknown) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "Upstream Shopify gateway timed out."
          : "Internal error processing Shopify request.",
      },
      { status: isTimeout ? 504 : 500, headers: rateLimit.headers }
    );
  }
}
