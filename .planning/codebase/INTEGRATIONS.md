# External Integrations

**Analysis Date:** 2026-11-05

## APIs & External Services

**E-Commerce Platform (Shopify Storefront API):**
- Shopify Storefront GraphQL API (Pinned Version: `2025-01`) - Headless product catalog queries, collections retrieval, predictive product search, variant selection, and live cart mutations.
  - SDK/Client: Built-in `fetch` with `AbortSignal.timeout(10_000)` and `@shopify/hydrogen` (^2026.10.2) types (`website/src/lib/shopify/index.ts`, `website/src/lib/shopify/queries.ts`, `website/src/lib/shopify/mutations.ts`).
  - Auth: `SHOPIFY_STOREFRONT_ACCESS_TOKEN` provided via `X-Shopify-Storefront-Access-Token` request header.
  - Upstream URL: `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`.
  - Secure Server Proxies:
    - `website/src/app/api/shopify/route.ts` - Enforces payload validation via `validateShopifyPayload`, restricts queries to an operation allowlist (`ALLOWED_SHOPIFY_OPERATIONS`), enforces 10KB size limit, and applies sliding-window IP rate limiting (60 req/min).
    - `website/src/app/api/cart/route.ts` - Server-side cart mutation proxy (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cartQuery`) with schema validation via `validateCartInput` and rate limiting (30 req/min).
  - Offline / Demo Mode: Automatic fallback to local static data (`website/src/lib/data/products.ts`, `website/src/components/home/category-data.ts`) when in demo mode (`NEXT_PUBLIC_COMMERCE_MODE !== "production"`) or token is `"demo_token"`.

**Image Delivery & CDN Services:**
- Shopify CDN (`cdn.shopify.com`) - High-performance product images and variant thumbnails (`website/next.config.ts`, `website/src/components/products/ProductImage.tsx`).
- Unsplash CDN (`images.unsplash.com`) - High-resolution lifestyle imagery for homepage category cards and hero banners (`website/next.config.ts`, `website/src/components/home/category-data.ts`).
- Mock Shop CDN (`mock.shop`) - Fallback mock assets configured in `website/next.config.ts`.

## Data Storage

**Databases:**
- None detected (stateless headless architecture; Shopify acts as the source of truth for products, collections, inventory, customer records, and orders).

**File Storage:**
- Local Filesystem (`website/src/lib/enquiry/storage.ts`):
  - File: `.data/enquiries.json` (created automatically upon first enquiry).
  - Purpose: Records customer order enquiries submitted via `website/src/app/api/enquiry/route.ts`. Retains up to 500 records using FIFO trimming.
- Browser LocalStorage (`client-side storage`):
  - Cart state: `irish_grocer_cart` and `irish_grocer_cart_id` in `website/src/context/CartContext.tsx`.
  - Wishlist items: `irish_grocer_wishlist` in `website/src/hooks/useWishlist.ts`.
  - Customer profile & auth: `irish_grocer_auth` and `irish_grocer_customer` in `website/src/context/AuthContext.tsx`.

**Caching:**
- Next.js Fetch Cache: Configured on server-side queries via `website/src/lib/shopify/index.ts` (`cache: "force-cache"` or incremental revalidation `{ next: { revalidate } }`).
- In-memory Security Cache: Sliding-window rate limiter stores IP request timestamps in `website/src/lib/security/rateLimit.ts` with unreferenced 5-minute cleanup interval.

## Authentication & Identity

**Auth Provider:**
- Custom / Shopify Customer Account API hybrid:
  - Demo Implementation: Local client-side authentication managed via `website/src/context/AuthContext.tsx`. Provides preloaded test customer profile (`DEMO_CUSTOMER`: Patrick O'Connor, Quincy MA) with demo order history (`#IG-1001`, `#IG-1002`).
  - Production Implementation: Designed for Shopify Customer Account API using OAuth 2.0 with PKCE and Shopify Multipass (`website/documentation/SHOPIFY_ARCHITECTURE.md`, `website/src/app/account/login/page.tsx`).

## Monitoring & Observability

**Error Tracking:**
- None detected (no third-party APM or Sentry SDK).
- Graceful API error reporting: Error responses formatted as structured JSON with appropriate HTTP status codes (400, 415, 429, 500, 502, 504) across API routes.

**Logs:**
- Console Logging: Standard `console.info`, `console.warn`, and `console.error`.
- Privacy Sanitization: `website/src/app/api/enquiry/route.ts` logs order enquiry metrics (enquiry ID, unit counts, line counts, dollar subtotal) without logging customer name, email, phone, or delivery address, ensuring GDPR/CCPA compliance.

## CI/CD & Deployment

**Hosting:**
- Primary Target: Vercel / containerized Node.js (Docker, AWS ECS, DigitalOcean App Platform).

**CI Pipeline:**
- Test runner: `npm test` runs Node test runner against `website/tests/remediation.test.ts`.
- Type checking: `npm run typecheck` (`tsc --noEmit`).
- Linting: `npm run lint` (`next lint`).

## Environment Configuration

**Required env vars:**
- `SHOPIFY_STORE_DOMAIN` - Shopify store subdomain (default: `the-irish-grocer.myshopify.com`).
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Storefront API access token.
- `SHOPIFY_STOREFRONT_API_VERSION` - GraphQL API version (pinned: `2025-01`).
- `NEXT_PUBLIC_COMMERCE_MODE` - Commerce toggle (`"production"` or `"demo"`).
- `NEXT_PUBLIC_SITE_URL` - Canonical website URL (default: `http://localhost:3000`).
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` - Public-facing domain for external checkout redirection and footer links.

**Secrets location:**
- Stored in `website/.env.local` (not checked into source control).
- Environment template provided in `website/.env.example`.

## Webhooks & Callbacks

**Incoming:**
- None currently active in Next.js routes.

**Outgoing:**
- Shopify Hosted Checkout: After cart creation or update, users proceed to checkout by navigating to `cart.checkoutUrl` hosted directly on Shopify (`website/src/context/CartContext.tsx`).

---

*Integration audit: 2026-11-05*
