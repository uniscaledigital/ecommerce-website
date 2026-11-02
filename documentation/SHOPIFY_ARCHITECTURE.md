# Shopify Headless Architecture — The Irish Grocer

## 1. Architecture Overview

The Irish Grocer storefront is constructed as a headless commerce application built on **Next.js (App Router)** and connected to **Shopify** via the **Storefront API** and **Customer Account API**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│  (React Server Components + Optimized Client Components)   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
        Public/Server SSR              Cart & Account Mutations
               │                              │
               ▼                              ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│    Shopify Storefront API   │  │   Shopify Customer Account  │
│      GraphQL (2025-01)      │  │        OAuth / PKCE         │
│  - Products & Collections   │  │  - Customer Profile         │
│  - Inventory & Variants     │  │  - Order History & Tracking │
│  - Predictive Search        │  │  - Passwordless Sign-In     │
└──────────────┬──────────────┘  └────────────┬────────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
               ┌─────────────────────────────┐
               │   Shopify-Hosted Checkout   │
               │   (Checkout URL redirect)   │
               └─────────────────────────────┘
```

---

## 2. API Version & Configuration

- **Shopify Storefront API Version**: `2025-01` (Stable pinned release)
- **Shopify Domain**: Configured via `SHOPIFY_STORE_DOMAIN`
- **Shopify Public Storefront Access Token**: Configured via `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Shopify Private Admin/Storefront Token**: Server-only environment variables (never exposed to the browser)
- **Demo Mode Switch**: `NEXT_PUBLIC_COMMERCE_MODE=demo` or `production`

---

## 3. Demo Mode vs Production Mode

To support immediate previewing, local development, and CI/CD testing without requiring immediate live merchant credentials, the system features an architectural dual-mode:

### 3.1 Demo Mode (`NEXT_PUBLIC_COMMERCE_MODE=demo`)
- Powered by high-fidelity local catalog data matching the exact 717 products and 15 categories documented in the Figma & PDF references.
- Authentic product images, exact pricing, variants, and descriptions extracted from `Untitled.fig` and `Untitled.pdf`.
- Fully functional local cart persistence with real item totals, quantity stepping, and enquiry submission.
- Simulated checkout notice explaining live Shopify checkout configuration.
- Simulated customer account authentication demonstrating the exact Shop Pay / Email sign-in experience shown on PDF page 8.

### 3.2 Production Mode (`NEXT_PUBLIC_COMMERCE_MODE=production`)
- Direct GraphQL queries to `https://${SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`.
- Uses `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, and `cartLinesRemove` mutations.
- Cart persistence using HTTP-only or client cookie storing the Shopify Storefront `cartId`.
- Redirects directly to `cart.checkoutUrl` on Shopify-hosted checkout.
- Customer authentication via Shopify Customer Account API OAuth endpoints.

---

## 4. GraphQL Schema & Operations

### 4.1 Product Query
```graphql
query getProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    description
    descriptionHtml
    availableForSale
    vendor
    productType
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 25) {
      edges {
        node {
          id
          title
          sku
          barcode
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}
```

### 4.2 Cart Mutations
```graphql
# Create Cart
mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}

# Add Lines
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      totalQuantity
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 5. Customer Pricing & Login-Restricted Rules
In accordance with the design specifications:
- Unauthenticated visitors view the `Log in to view prices` CTA.
- Customer pricing is retrieved server-side only for verified customer sessions.
- Private wholesale pricing or customer tier pricing is never exposed in client bundles or public endpoints.

