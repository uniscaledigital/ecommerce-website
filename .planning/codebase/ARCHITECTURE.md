<!-- refreshed: 2026-11-05 -->
# Architecture

**Analysis Date:** 2026-11-05

## System Overview

The Irish Grocer is a fullstack headless e-commerce platform built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. The workspace is organized into two primary tiers: the root multi-agent governance and validation scaffolding, and the `website/` application workspace housing the storefront and backend route handlers.

The core architectural pattern is a **Dual-Mode Commerce Façade**: the system operates seamlessly either in "Production Mode" connecting to the live Shopify Storefront GraphQL API or in "Demo / Fallback Mode" utilizing local static catalog definitions, mock authentication, and local JSON enquiry persistence.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Browser / Client Tier                                   │
├────────────────────────────┬─────────────────────────────┬──────────────────────────────┤
│      Header & Nav          │     Pages & Client Views    │     Cart Drawer & Modals     │
│  `website/src/components/  │  `website/src/app/shop/     │  `website/src/components/    │
│   layout/Header.tsx`       │   ShopClientView.tsx`       │   cart/CartDrawer.tsx`       │
└─────────────┬──────────────┴──────────────┬──────────────┴──────────────┬───────────────┘
              │                             │                             │
              ▼                             ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 React Context Layer                                     │
├──────────────────────────────────────────┬──────────────────────────────────────────────┤
│               CartContext                │                 AuthContext                  │
│   `website/src/context/CartContext.tsx`   │     `website/src/context/AuthContext.tsx`    │
│   - Optimistic state & serialized queue  │     - Session & customer profile state       │
│   - LocalStorage synchronization         │     - Demo vs Shopify Account gateway        │
└──────────────────────────────────────────┴──────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           Next.js 15 App Router (Fullstack)                             │
├──────────────────────────────────────────┬──────────────────────────────────────────────┤
│         Server Components (RSC)          │             Route Handlers (API)             │
│  `website/src/app/page.tsx`              │  `website/src/app/api/cart/route.ts`         │
│  `website/src/app/shop/page.tsx`         │  `website/src/app/api/shopify/route.ts`      │
│  `website/src/app/products/[handle]/`    │  `website/src/app/api/enquiry/route.ts`      │
│  `website/src/app/collections/[handle]/` │                                              │
└────────────────────┬─────────────────────┴──────────────────────┬───────────────────────┘
                     │                                            │
                     ▼                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            Domain Services & Security Gateway                           │
├─────────────────────────┬──────────────────────────┬────────────────────────────────────┤
│     Shopify Client      │   Validation & Defense   │          Security Engine           │
│  `website/src/lib/      │  `website/src/lib/       │  `website/src/lib/security/        │
│   shopify/index.ts`     │   validation/schemas.ts` │   rateLimit.ts`                    │
│  - shopifyFetch         │  - validateCartInput     │  - Sliding window rate limiting    │
│  - queries & mutations  │  - validateEnquiryInput  │  - Header emission & IP isolation  │
│  - formatShopifyCart    │  - Operation allowlist   │                                    │
└────────────┬────────────┴─────────────┬────────────┴────────────────────────────────────┘
             │                          │
      ┌──────┴──────────────┐           ▼
      ▼                     ▼  ┌──────────────────────────────────────────────────────────┐
┌───────────┐         ┌────────┴──────────┐   Local Enquiry Disk Store                    │
│ Production│         │ Demo Fallback     │   `website/src/lib/enquiry/storage.ts`        │
│ Shopify   │         │ Mock Catalog      │   - `.data/enquiries.json` (max 500 entries)  │
│ Storefront│         │ `website/src/lib/ │   - Zero Customer PII Logging                 │
│ GraphQL   │         │  data/products.ts`│                                               │
└───────────┘         └───────────────────┘                                               │
                               └──────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component / File | Layer | Responsibility | File Path |
|------------------|-------|----------------|-----------|
| `RootLayout` | Presentation Shell | Global HTML structure, Google fonts, metadata, providers, and root modal mount points | `website/src/app/layout.tsx` |
| `Header` & `MobileDrawer` | Navigation | Sticky 2-row navigation header, search bar input, mobile slideout drawer, category navigation | `website/src/components/layout/Header.tsx`, `website/src/components/layout/MobileDrawer.tsx` |
| `Footer` | Navigation / Trust | Department links, store contact details, Quincy MA pickup hours, and legal navigation | `website/src/components/layout/Footer.tsx` |
| `HomePage` | RSC Page | Homepage composition, data fetching for crisps and new arrivals, promotional grids | `website/src/app/page.tsx` |
| `ShopPage` | RSC Page | Shop catalog route handler; fetches 100 products and collections server-side | `website/src/app/shop/page.tsx` |
| `ShopClientView` | Client View Island | Client-side search, filtering by department, stock status, sorting, pagination, and grid layouts | `website/src/app/shop/ShopClientView.tsx` |
| `CollectionPage` | Dynamic RSC | Dynamic category views (`/collections/[handle]`), static route param generation, 404 triggers | `website/src/app/collections/[handle]/page.tsx` |
| `ProductPage` | Dynamic RSC | Product detail page (`/products/[handle]`), Schema.org JSON-LD structured data, related products | `website/src/app/products/[handle]/page.tsx` |
| `ProductDetailsClient` | Client View Island | PDP interactive gallery, variant selection, quantity picker, add-to-cart, quick order | `website/src/app/products/[handle]/ProductDetailsClient.tsx` |
| `SearchPage` & `SearchClientView` | RSC / Client View | Storefront search query page with debounce, tab switching, and result grid presentation | `website/src/app/search/page.tsx`, `website/src/app/search/SearchClientView.tsx` |
| `CartPage` & `CartDrawer` | Cart Presentation | Standalone cart route (`/cart`) and global side-slide drawer for line management | `website/src/app/cart/page.tsx`, `website/src/components/cart/CartDrawer.tsx` |
| `DemoCheckoutModal` | Checkout Island | Accessible modal displaying mock checkout summary and prompt for order enquiry | `website/src/components/cart/DemoCheckoutModal.tsx` |
| `OrderEnquiryModal` | Enquiry Island | Modal form allowing shoppers to submit verified orders directly to Quincy store staff | `website/src/components/enquiry/OrderEnquiryModal.tsx` |
| `CartProvider` / `useCart` | Client State | Global cart state management, serialized asynchronous mutation queue, LocalStorage persistence | `website/src/context/CartContext.tsx` |
| `AuthProvider` / `useAuth` | Client State | Demo customer profile session, authentication toggling, order history access | `website/src/context/AuthContext.tsx` |
| Cart API Route | Edge / API Gateway | Route handler for cart creation, line additions, updates, deletions, and rate limits | `website/src/app/api/cart/route.ts` |
| Shopify API Proxy | Edge / API Gateway | Secured GraphQL proxy enforcing query size limits and operation allowlists | `website/src/app/api/shopify/route.ts` |
| Enquiry API Route | Edge / API Gateway | Route handler receiving and validating customer order enquiries with zero PII logs | `website/src/app/api/enquiry/route.ts` |
| `shopifyFetch` & Catalog Client | Data Access | High-level data access methods with automatic fallback to local demo catalog | `website/src/lib/shopify/index.ts` |
| Cart Formatter | Data Transformation | Normalizes raw Shopify Storefront GraphQL cart responses into internal `Cart` types | `website/src/lib/shopify/cartFormatter.ts` |
| Validation Schemas | Security & Contract | Strict schema parsers, regex validators, and allowed GraphQL operation definitions | `website/src/lib/validation/schemas.ts` |
| Rate Limiter | Security Infrastructure | Sliding window in-memory rate limiter with standard HTTP headers (`429`, `Retry-After`) | `website/src/lib/security/rateLimit.ts` |
| Enquiry Storage | Local Persistence | File-based append storage (`.data/enquiries.json`) with circular ring buffer capped at 500 items | `website/src/lib/enquiry/storage.ts` |
| Validation Scripts | Scaffolding / CI | PowerShell and Bash scripts for validating skills, agents, templates, workflows, and encoding | `scripts/validate-all.ps1`, `scripts/validate-all.sh` |

## Pattern Overview

**Overall:** Dual-Mode Headless Commerce with React Server Components (RSC) and Defensive API Gateways.

**Key Characteristics:**
- **Graceful Degradation / Dual Mode:** Detects whether `NEXT_PUBLIC_COMMERCE_MODE === "production"` and valid credentials exist. If absent or if upstream network requests fail, methods in `website/src/lib/shopify/index.ts` automatically fall back to curated local mock datasets in `website/src/lib/data/products.ts` without throwing unhandled exceptions to the UI.
- **RSC Data Ingestion + Interactive Client Islands:** Pages (`website/src/app/page.tsx`, `website/src/app/shop/page.tsx`, `website/src/app/products/[handle]/page.tsx`) execute server-side data queries and render static HTML structures. Interactive islands (`ShopClientView.tsx`, `ProductDetailsClient.tsx`, `CartDrawer.tsx`) hydrate only client-necessary logic.
- **Serialized Mutation Queue:** High-frequency cart operations in `website/src/context/CartContext.tsx` are sequenced through an internal `Promise` queue (`syncQueueRef.current.catch().then(...)`) to prevent out-of-order race conditions when users rapidly adjust quantities.
- **Defensive API Gateways:** All `/api/*` endpoints enforce IP-based sliding rate limits, strict JSON Content-Type validation, structural payload validation, query length checks (<10KB), and 10-second request abort timeouts (`AbortSignal.timeout(10_000)`).

## Layers

**1. Presentation Shell & Routing Layer:**
- Purpose: Delivers layouts, routes, SEO metadata, and user interactions.
- Location: `website/src/app/`, `website/src/components/`
- Contains: Next.js App Router route segments (`layout.tsx`, `page.tsx`, `robots.ts`, `sitemap.ts`), UI layout containers (`Header.tsx`, `Footer.tsx`), and atomic UI components (`ProductCard.tsx`, `ProductGrid.tsx`, `CategoryCard.tsx`).
- Depends on: React Context Layer (`CartContext.tsx`, `AuthContext.tsx`), Domain Services (`website/src/lib/shopify/index.ts`), Configuration (`website/src/lib/config/site.ts`).
- Used by: Browser clients and search engine web crawlers.

**2. Client State & Session Layer:**
- Purpose: Synchronizes browser-local cart state, customer authentication, and UI modal states across routes.
- Location: `website/src/context/`, `website/src/hooks/`
- Contains: `CartContext.tsx`, `AuthContext.tsx`, `useWishlist.ts`.
- Depends on: Browser LocalStorage APIs and Next.js backend API routes (`/api/cart`, `/api/enquiry`).
- Used by: All interactive client components (`CartDrawer.tsx`, `Header.tsx`, `ProductCard.tsx`, `OrderEnquiryModal.tsx`).

**3. Edge & Route Handler API Layer:**
- Purpose: Mediates incoming browser client requests, validates inputs, controls traffic flow, and proxies calls to upstream services or persistence sinks.
- Location: `website/src/app/api/`
- Contains: `/api/cart/route.ts`, `/api/shopify/route.ts`, `/api/enquiry/route.ts`.
- Depends on: Security rate limiter (`website/src/lib/security/rateLimit.ts`), Validation schemas (`website/src/lib/validation/schemas.ts`), Cart formatter (`website/src/lib/shopify/cartFormatter.ts`), Local disk storage (`website/src/lib/enquiry/storage.ts`).
- Used by: Client Contexts and interactive components.

**4. Commerce Domain & Integration Layer:**
- Purpose: Abstracts GraphQL operations, formats payload data, provides fallback mechanisms, and defines typed domain entities.
- Location: `website/src/lib/shopify/`, `website/src/types/`
- Contains: `index.ts`, `queries.ts`, `mutations.ts`, `cartFormatter.ts`, `index.ts` (types).
- Depends on: Global configuration (`website/src/lib/config/site.ts`), Static mock data (`website/src/lib/data/products.ts`), `@shopify/hydrogen`.
- Used by: React Server Components and `/api/cart/route.ts`.

**5. Persistence & Local Storage Layer:**
- Purpose: Provides filesystem-backed durable storage for inquiries and local mock states.
- Location: `website/src/lib/enquiry/storage.ts`, `website/.data/`
- Contains: JSON file storage (`.data/enquiries.json`) with FIFO truncation up to 500 entries.
- Depends on: Node.js standard library `node:fs/promises`, `node:path`.
- Used by: `website/src/app/api/enquiry/route.ts`.

**6. Scaffolding, Governance & Agent Runtime Layer:**
- Purpose: Multi-agent coordination, GSD protocol enforcement, tool adapters, and automated repo verification.
- Location: Root repository directories (`.agent/`, `.agents/`, `.gsd/`, `scripts/`, `adapters/`).
- Contains: Agent personas, skills (`codebase-mapper`, `executor`, `planner`), PowerShell/Bash validation scripts.
- Depends on: Node.js, PowerShell 5.1/7+, POSIX Bash.
- Used by: Autonomous AI agents and developers.

## Data Flow

### Primary Request Path (Catalog Navigation & Product Details)

1. **Client Request:** Browser requests `/products/[handle]` or `/collections/[handle]` (`website/src/app/products/[handle]/page.tsx:23`).
2. **RSC Execution:** Server executes `getProductByHandle(handle)` in `website/src/lib/shopify/index.ts:103`.
3. **Façade Resolution:** 
   - If `IS_PRODUCTION` is true and valid `STOREFRONT_TOKEN` is present: executes `shopifyFetch` (`website/src/lib/shopify/index.ts:17`) against Shopify Storefront API GraphQL endpoint using `PRODUCT_BY_HANDLE_QUERY`.
   - If running in demo mode or if Shopify API request fails: catches error, logs warning, and retrieves item from local `PRODUCTS` array (`website/src/lib/shopify/index.ts:116`).
4. **HTML Stream:** Server generates Schema.org JSON-LD microdata, breadcrumbs, and renders `ProductDetailsClient` (`website/src/app/products/[handle]/ProductDetailsClient.tsx`) with pre-fetched product and related products props.
5. **Client Hydration:** Browser renders layout, hooks up `useCart` actions, and attaches image gallery interactivity.

### Shopping Cart Mutation Flow

1. **User Action:** Customer clicks "Add to Basket" on `ProductCard` (`website/src/components/products/ProductCard.tsx:29`).
2. **Context Dispatch:** Invokes `addItem(product)` in `website/src/context/CartContext.tsx:142`.
3. **Optimistic Local Update:** `CartContext` updates React state immediately and writes updated cart to `localStorage` (`website/src/context/CartContext.tsx:81`).
4. **Queue Dispatch:** Task is enqueued onto `syncQueueRef` (`website/src/context/CartContext.tsx:71`).
5. **Network Mutation:** 
   - In demo mode: returns local mock confirmation immediately.
   - In production mode: dispatches `POST /api/cart` with action `create` or `add` (`website/src/app/api/cart/route.ts:42`).
6. **API Gateway Validation:** `/api/cart` executes `checkRateLimit` (`website/src/lib/security/rateLimit.ts:36`), verifies JSON header, parses payload via `validateCartInput` (`website/src/lib/validation/schemas.ts:136`).
7. **Shopify Upstream Execution:** Performs `shopifyRequest` with `CART_LINES_ADD_MUTATION` (`website/src/lib/shopify/mutations.ts:75`) with 10s timeout.
8. **Cart Normalization:** Output is processed via `formatShopifyCart` (`website/src/lib/shopify/cartFormatter.ts:43`) and returned to client.
9. **State Reconciliation:** `CartContext` verifies line consistency and saves remote Shopify Cart ID to storage for subsequent queries.

### Customer Order Enquiry Flow

1. **Form Submission:** Customer completes details in `OrderEnquiryModal` and clicks submit (`website/src/components/enquiry/OrderEnquiryModal.tsx:28`).
2. **Network Dispatch:** Dispatches `POST /api/enquiry` (`website/src/app/api/enquiry/route.ts:6`).
3. **Rate Limiting:** Gateway enforces strict limit of 15 requests per minute per IP.
4. **Schema Sanitization:** `validateEnquiryInput` verifies email format, phone format, character bounds, line item quantities, and subtotal numbers (`website/src/lib/validation/schemas.ts:31`).
5. **Disk Persistence:** `persistOrderEnquiry` (`website/src/lib/enquiry/storage.ts:14`) ensures `.data/` directory exists, prepends inquiry with unique `ENQ-...` identifier, trims queue to 500 items, and writes JSON to disk.
6. **Audit Logging:** System logs anonymized order summary (item count, units, subtotal, ID) strictly omitting Customer PII (`website/src/app/api/enquiry/route.ts:65`).
7. **Client Feedback:** Modal displays success confirmation, triggers `clearCart()`, and clears checkout fields.

**State Management:**
- Cart state is managed through `CartContext.tsx`, combining in-memory React state, LocalStorage persistence (`irish_grocer_cart`), and an asynchronous mutation serializer.
- Customer session is managed via `AuthContext.tsx` supporting demo customer authentication (`irish_grocer_auth`, `irish_grocer_customer`) and prepared for Shopify Customer Account API OAuth PKCE flow.
- Wishlist state is stored in LocalStorage via `useWishlist.ts`.

## Key Abstractions

**1. Unified Product & Collection Models:**
- Purpose: Canonical TypeScript representation of catalog items across Shopify GraphQL responses and local mock data.
- Examples: `Product`, `ProductVariant`, `Collection`, `ImageNode`, `Money` (`website/src/types/index.ts:1-61`).
- Pattern: Domain Entity Interface.

**2. Standardized Cart Data Contract:**
- Purpose: Decouples the frontend cart presentation from the Shopify Storefront Cart GraphQL schema.
- Examples: `Cart`, `CartLineItem` (`website/src/types/index.ts:63-91`), transformed by `formatShopifyCart` (`website/src/lib/shopify/cartFormatter.ts:43`).
- Pattern: Data Mapper / Adapter Pattern.

**3. Input Validation Result Monad:**
- Purpose: Predictable type-safe payload validation result object with error accumulators.
- Examples: `ValidationResult<T>`, `validateCartInput`, `validateEnquiryInput`, `validateShopifyPayload` (`website/src/lib/validation/schemas.ts:1-5`).
- Pattern: Result Object Pattern.

**4. Rate Limiter Contract:**
- Purpose: Sliding window memory rate limiter producing standards-compliant HTTP headers (`X-RateLimit-*`, `Retry-After`).
- Examples: `RateLimitRecord`, `RateLimitResult`, `checkRateLimit` (`website/src/lib/security/rateLimit.ts:28-92`).
- Pattern: Interceptor / Middleware Utility.

## Entry Points

**Storefront User Interface:**
- Location: `website/src/app/layout.tsx` & `website/src/app/page.tsx`
- Triggers: Inbound HTTP GET requests to root path `/`.
- Responsibilities: Mounts context providers, global header, footer, modal drawers, and renders hero, carousel, and product sections.

**Cart Mutation API:**
- Location: `website/src/app/api/cart/route.ts`
- Triggers: Client cart modifications (`POST /api/cart`).
- Responsibilities: Rate checks, validates inputs, executes Shopify Cart GraphQL mutations or demo mode response, returns normalized cart.

**Shopify Proxy API:**
- Location: `website/src/app/api/shopify/route.ts`
- Triggers: Client or proxy queries (`POST /api/shopify`).
- Responsibilities: Enforces strict GraphQL operation allowlist, blocks arbitrary operations, applies 10KB size limit and 10s timeout.

**Order Enquiry API:**
- Location: `website/src/app/api/enquiry/route.ts`
- Triggers: Direct order inquiry form submissions (`POST /api/enquiry`).
- Responsibilities: Validates customer inquiry fields, writes record to `.data/enquiries.json`, emits zero-PII operational log.

**Automated Test Suite:**
- Location: `website/tests/remediation.test.ts`
- Triggers: Execution of `npm test` or `npx tsx --test tests/remediation.test.ts`.
- Responsibilities: Validates GraphQL allowlist security, enquiry input schemas, cart payload checks, sliding rate limiting, and cart formatting.

**Scaffolding Validation Suite:**
- Location: `scripts/validate-all.ps1` (Windows) / `scripts/validate-all.sh` (POSIX)
- Triggers: Development validation commands.
- Responsibilities: Verifies skills, agents, templates, workflows, UTF-8 clean encoding, and repository health.

## Architectural Constraints

- **Single Process In-Memory Rate Limiting:** The sliding rate limiter (`website/src/lib/security/rateLimit.ts`) stores IP state in a Node.js `Map`. In a multi-instance serverless or cluster deployment (such as Vercel Edge or multi-container Kubernetes), rate limiting state is not shared across instances. Upstream Redis or distributed cache (e.g. Upstash) is required for horizontally scaled production setups.
- **Node.js LTS Runtime:** Requires Node.js `>=20.0.0` or `>=22.0.0` to support native `node:test`, `node:assert/strict`, `AbortSignal.timeout`, and React 19.
- **Zero-PII Logging Constraint:** No route handler or utility is permitted to output customer email, phone, physical address, or names into server console logs. Operational logs must log only IDs, counts, subtotal amounts, and timestamps (`website/src/app/api/enquiry/route.ts:65`).
- **File-based Persistence Boundary:** Local enquiry storage writes directly to `website/.data/enquiries.json`. In read-only serverless platforms (e.g. AWS Lambda without EFS), `.data/` writes must be routed to a managed database (PostgreSQL, Supabase, or DynamoDB).

## Anti-Patterns

### Bypassing Validation Schemas in Route Handlers

**What happens:** Reading `await request.json()` and directly casting to TypeScript types using `as CartInput` without runtime validation.
**Why it's wrong:** TypeScript types are erased at compile time. Malicious payloads or malformed requests cause runtime crashes or permit prototype injection.
**Do this instead:** Always pass raw payloads through `validateCartInput(rawBody)` or `validateEnquiryInput(rawBody)` in `website/src/lib/validation/schemas.ts`.

### Logging Sensitive Customer Data in Error Catch Blocks

**What happens:** Executing `console.error("Order failed for customer:", rawBody)`.
**Why it's wrong:** Violates GDPR, CCPA, and project security rules by leaking PII into persistent log aggregators.
**Do this instead:** Extract only non-identifying telemetry: `console.error("Order failed for enquiry ID:", enquiryId)` as demonstrated in `website/src/app/api/enquiry/route.ts:64-68`.

### Making Unbounded Direct GraphQL Storefront Queries from Client

**What happens:** Client components making raw `fetch()` calls directly to Shopify Storefront API with exposed tokens.
**Why it's wrong:** Leaks tokens, allows arbitrary query execution, and circumvents rate limiting.
**Do this instead:** Always route through `website/src/lib/shopify/index.ts` server methods or call `/api/shopify` where operations are restricted to `ALLOWED_SHOPIFY_OPERATIONS` (`website/src/lib/validation/schemas.ts:215`).

## Error Handling

**Strategy:** Defensive layered error handling with automatic fallback to local datasets on network disruption and standards-compliant HTTP status codes.

**Patterns:**
- **Try/Catch with Graceful Fallback:** `shopifyFetch` in `website/src/lib/shopify/index.ts` logs warnings on network/upstream failures and falls back to static catalog definitions rather than letting pages 500.
- **Standardized API Error Responses:** Route handlers return structured JSON `{ error: string, details?: string[] }` alongside appropriate HTTP status codes:
  - `400 Bad Request` for validation failures (`website/src/app/api/enquiry/route.ts:49`)
  - `415 Unsupported Media Type` for non-JSON headers (`website/src/app/api/cart/route.ts:61`)
  - `429 Too Many Requests` with `Retry-After` header for rate limit exceedances (`website/src/lib/security/rateLimit.ts:89`)
  - `504 Gateway Timeout` when upstream Shopify requests exceed 10 seconds (`website/src/app/api/shopify/route.ts:87`)
- **Next.js Not Found Triggers:** Route segments invoke `notFound()` when requested handles do not match any known collection or product (`website/src/app/collections/[handle]/page.tsx:39`, `website/src/app/products/[handle]/page.tsx:32`).

## Cross-Cutting Concerns

**Logging:**
- Standard Node.js `console.info` / `console.warn` / `console.error` with strict PII filtering.
- Operational logs record only transaction IDs, line counts, unit totals, subtotal amounts, and ISO timestamps (`website/src/app/api/enquiry/route.ts:67`).

**Validation:**
- Centralized validation in `website/src/lib/validation/schemas.ts`.
- Validates structure, strings, length boundaries, regexes (email, phone), array maximums, and GraphQL operation names against `ALLOWED_SHOPIFY_OPERATIONS`.

**Authentication:**
- In Demo mode: Client-side mocked authentication managed via `AuthContext.tsx` with credentials in LocalStorage.
- In Production mode: Architecture is structured for Shopify Customer Account API utilizing OAuth 2.0 PKCE flow.

---

*Architecture analysis: 2026-11-05*
