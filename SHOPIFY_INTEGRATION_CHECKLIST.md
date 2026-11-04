# THE IRISH GROCER — SHOPIFY INTEGRATION ACTIONABLE CHECKLIST

**Project:** The Irish Grocer  
**Status Key:**  
- `[COMPLETE]` — Architecture, code, or configuration fully implemented and verified in the codebase.  
- `[PARTIALLY COMPLETE]` — Implemented with local mock fallback, pending live store handshake.  
- `[NOT STARTED]` — Future phase item scheduled for live integration.  
- `[REQUIRES SHOPIFY STORE ACCESS]` — Dependent on live Shopify Admin access or API credentials.  

---

## 1. Store Setup & Shopify Admin Prerequisites

- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Create or log in to The Irish Grocer Shopify Admin (`the-irish-grocer.myshopify.com`).
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Install the official **Headless** sales channel from the Shopify App Store.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Create a Storefront API client in the Headless channel.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Enable the following Storefront API scopes:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
  - `unauthenticated_read_product_tags`
  - `unauthenticated_write_checkouts`
  - `unauthenticated_read_checkouts`
  - `unauthenticated_write_customers`
  - `unauthenticated_read_customers`
  - `unauthenticated_read_content`
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Obtain Public Storefront API Access Token.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Set up primary domain and checkout subdomains (`theirishgrocer.com` and `checkout.theirishgrocer.com`).
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Configure Quincy, MA location, in-store pickup, and local delivery zones.

---

## 2. Environment & Configuration

- [x] `[COMPLETE]` Standard `.env.example` created with all Hydrogen 2026-10 configuration keys.
- [x] `[COMPLETE]` `.gitignore` audited to ensure `.env*` files are strictly excluded from source control.
- [x] `[COMPLETE]` Dual-mode flag (`NEXT_PUBLIC_COMMERCE_MODE="demo" | "production"`) established.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Populate live production values in Vercel Project Settings:
  - `SHOPIFY_STORE_DOMAIN`
  - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - `SHOPIFY_STOREFRONT_API_VERSION=2026-10`
  - `SHOPIFY_PRIVATE_STOREFRONT_TOKEN` (optional server token)
  - `NEXT_PUBLIC_SITE_URL`

---

## 3. SDK & Dependencies

- [x] `[COMPLETE]` `@shopify/hydrogen@2026.10.2` installed in `website/package.json`.
- [x] `[COMPLETE]` Peer dependencies resolved with React 19 and Next.js 15.
- [x] `[COMPLETE]` TypeScript 5.7 compilation passes with zero errors (`tsc --noEmit`).
- [x] `[COMPLETE]` Production Next.js build passes cleanly (`next build` 32/32 routes).
- [x] `[COMPLETE]` Zero dependency on Shopify Oxygen hosting (100% decoupled for Vercel).

---

## 4. Service Layer & API Client

- [x] `[COMPLETE]` GraphQL request client `shopifyFetch` implemented in `src/lib/shopify/index.ts`.
- [x] `[COMPLETE]` API version pinned to `2026-10`.
- [x] `[COMPLETE]` Dual-mode routing: automatic fallback to local 34-product mock catalog when API key is unset or network fails.
- [x] `[COMPLETE]` Error handling and error-boundary fallbacks implemented for all commerce methods.
- [ ] `[PARTIALLY COMPLETE]` Integrate `@shopify/hydrogen` `createStorefrontClient` for automatic client-side memoization and retry backoff.

---

## 5. Product & Catalog Integration

- [x] `[COMPLETE]` Storefront API `PRODUCT_FRAGMENT` defined in `src/lib/shopify/queries.ts`.
- [x] `[COMPLETE]` `PRODUCTS_QUERY` implemented for catalog listings.
- [x] `[COMPLETE]` `PRODUCT_BY_HANDLE_QUERY` implemented for dynamic product detail pages (`/products/[handle]`).
- [x] `[COMPLETE]` Normalization helper to map Shopify GraphQL Product node to local `Product` interface.
- [x] `[COMPLETE]` Visual card styling preserved: pale mint background `#DDF1D5`, shamrock badge, wishlist heart, add to cart button.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Synchronize 34 local products to Shopify Admin catalog with matching handles and barcodes.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Set up product tags in Shopify Admin (`bestseller`, `new-arrival`, `irish-classic`).

---

## 6. Collections & Navigation Integration

- [x] `[COMPLETE]` `COLLECTIONS_QUERY` and `COLLECTION_BY_HANDLE_QUERY` implemented.
- [x] `[COMPLETE]` 16 Irish department handles mapped to Next.js dynamic routing (`/collections/[handle]`).
- [x] `[COMPLETE]` Pre-rendering via `generateStaticParams()` verified for all 16 collections.
- [x] `[COMPLETE]` Department fallback cards with authentic British & Irish categories.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Create corresponding Automated/Smart Collections in Shopify Admin matching the 16 handles.

---

## 7. Cart & Checkout Integration

- [x] `[COMPLETE]` `CART_FRAGMENT` implemented with subtotal, tax, currency, and line items.
- [x] `[COMPLETE]` `CART_CREATE_MUTATION` implemented.
- [x] `[COMPLETE]` `CART_LINES_ADD_MUTATION` implemented.
- [x] `[COMPLETE]` `CART_LINES_UPDATE_MUTATION` implemented.
- [x] `[COMPLETE]` `CART_LINES_REMOVE_MUTATION` implemented.
- [x] `[COMPLETE]` Next.js Route Handler `/api/cart` scaffolded for server-side cart operations.
- [x] `[COMPLETE]` Local state cart drawer and floating bottom bar fully functional.
- [ ] `[PARTIALLY COMPLETE]` Bridge `CartContext.tsx` to store Shopify `cartId` in HTTP-only cookie on production mode.
- [ ] `[PARTIALLY COMPLETE]` Direct redirect from "Proceed to Checkout" button to Shopify `cart.checkoutUrl`.

---

## 8. Customer Accounts & Authentication

- [x] `[COMPLETE]` Customer account UI components (`/account`, `/account/login`) implemented.
- [x] `[COMPLETE]` Customer TypeScript types (`Customer`, `CustomerOrder`, `defaultAddress`) defined.
- [ ] `[NOT STARTED]` Enable Shopify Customer Account API (OAuth 2.0 PKCE) in Shopify Admin.
- [ ] `[NOT STARTED]` Configure redirect URIs in Shopify Admin: `https://theirishgrocer.com/api/auth/callback`.
- [ ] `[NOT STARTED]` Implement OAuth exchange route in Next.js using `@shopify/hydrogen/customer-account`.

---

## 9. Search & Predictive Search

- [x] `[COMPLETE]` `SEARCH_PRODUCTS_QUERY` implemented in `src/lib/shopify/queries.ts`.
- [x] `[COMPLETE]` Dedicated search page at `/search` with instant filtering.
- [x] `[COMPLETE]` Header search input with auto-suggestions.
- [ ] `[PARTIALLY COMPLETE]` Connect Storefront API `predictiveSearch` query for sub-second autocomplete results.

---

## 10. Media, Images & CDN

- [x] `[COMPLETE]` `cdn.shopify.com` configured in `next.config.ts` `remotePatterns`.
- [x] `[COMPLETE]` Global product image background standardized to pale mint green `#DDF1D5`.
- [x] `[COMPLETE]` Center alignment, `object-fit: contain`, and responsive padding verified across all breakpoints.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Upload high-resolution transparent product images to Shopify Admin Media Library.

---

## 11. SEO, Metadata & Structured Data

- [x] `[COMPLETE]` Dynamic metadata generation (`generateMetadata`) in `src/app/products/[handle]/page.tsx`.
- [x] `[COMPLETE]` Schema.org `Product` JSON-LD structured data embedded.
- [x] `[COMPLETE]` Dynamic XML sitemap (`/sitemap.xml`) indexing products and collections.
- [x] `[COMPLETE]` Dynamic `robots.txt` generated.
- [ ] `[PARTIALLY COMPLETE]` Populate live Shopify product schema ratings and availability when live data connects.

---

## 12. Caching, ISR & Webhook Revalidation

- [x] `[COMPLETE]` Next.js fetch caching strategy configured (`force-cache` with optional revalidation).
- [ ] `[NOT STARTED]` Implement Next.js On-Demand Revalidation Webhook Handler (`/api/shopify/revalidate`).
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Register Shopify Webhooks in Shopify Admin:
  - `products/create` -> `https://theirishgrocer.com/api/shopify/revalidate`
  - `products/update` -> `https://theirishgrocer.com/api/shopify/revalidate`
  - `products/delete` -> `https://theirishgrocer.com/api/shopify/revalidate`
  - `collections/update` -> `https://theirishgrocer.com/api/shopify/revalidate`
- [ ] `[NOT STARTED]` Implement HMAC SHA-256 webhook signature validation using Shopify Webhook Secret.

---

## 13. Security & Token Hygiene

- [x] `[COMPLETE]` Public Storefront token exposed only where required; private tokens kept server-side.
- [x] `[COMPLETE]` Environment variable audit verified zero hardcoded tokens.
- [x] `[COMPLETE]` Cross-Site Request Forgery (CSRF) protections in Next.js Route Handlers.
- [ ] `[PARTIALLY COMPLETE]` Content Security Policy (CSP) headers updated for Shopify checkout domain embedding.

---

## 14. End-to-End Verification & Pre-Launch Testing

- [x] `[COMPLETE]` Codebase builds cleanly with 0 type errors (`tsc --noEmit`).
- [x] `[COMPLETE]` Production Next.js build passes with 32 static/dynamic routes.
- [x] `[COMPLETE]` Responsive verification across desktop (1440px) and mobile (390px).
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Execute test checkout order using Shopify Bogus Gateway.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Verify inventory deduction upon order completion.
- [ ] `[REQUIRES SHOPIFY STORE ACCESS]` Verify customer order confirmation email delivery.

