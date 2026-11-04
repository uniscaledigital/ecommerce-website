# Codebase Structure

**Analysis Date:** 2026-11-05

## Directory Layout

```text
irishweb/                               # Repository Root
├── .agent/                             # Agent workflow specifications
│   └── workflows/                      # Multi-step task flows
├── .agents/                            # Native Antigravity agent definitions & skills
│   ├── agents/                         # Agent persona definitions
│   └── skills/                         # Skill packages (codebase-mapper, executor, planner, etc.)
├── .gsd/                               # Get Shit Done (GSD) governance templates
│   ├── examples/                       # Reference phase and plan templates
│   └── templates/                      # Standardized project templates
├── .planning/                          # Planning and codebase intelligence
│   └── codebase/                       # Architectural and technical reference maps
├── adapters/                           # AI CLI runtime adapter definitions
│   ├── CLAUDE.md                       # Claude Code adapter instructions
│   ├── GEMINI.md                       # Gemini CLI adapter instructions
│   └── GPT_OSS.md                      # Open-source model adapter guidelines
├── scripts/                            # Scaffolding and repository validation scripts
│   ├── search_repo.ps1 / .sh           # Cross-platform repository search helpers
│   ├── setup_search.ps1 / .sh          # Search indexing setup
│   ├── validate-agents.ps1 / .sh       # Agent definition validator
│   ├── validate-all.ps1 / .sh          # Master repository health and encoding validator
│   ├── validate-encoding.ps1 / .sh     # UTF-8 encoding verification
│   ├── validate-skills.ps1 / .sh       # Agent skill specification validator
│   ├── validate-templates.ps1 / .sh    # GSD template structure validator
│   └── validate-workflows.ps1 / .sh    # Workflow definition validator
├── website/                            # Next.js 15 Fullstack Headless Storefront
│   ├── .data/                          # Local disk persistence sink (generated)
│   │   └── enquiries.json              # Ring-buffered order enquiries (max 500 records)
│   ├── .planning/                      # Storefront planning directory
│   │   └── codebase/                   # Mirrored codebase maps
│   ├── documentation/                  # Architecture audits & client demo documentation
│   ├── public/                         # Static public assets
│   │   └── assets/                     # Category imagery, banners, brand logos
│   ├── src/                            # Application Source Code
│   │   ├── app/                        # Next.js App Router (RSC & API Handlers)
│   │   │   ├── account/                # Customer profile & login views
│   │   │   ├── api/                    # Server Route Handlers
│   │   │   │   ├── cart/               # POST /api/cart (Cart CRUD & mutations)
│   │   │   │   ├── enquiry/            # POST /api/enquiry (Order enquiry queue)
│   │   │   │   └── shopify/            # POST /api/shopify (GraphQL proxy)
│   │   │   ├── cart/                   # Dedicated cart summary page
│   │   │   ├── collections/[handle]/   # Dynamic collection catalog views
│   │   │   ├── privacy/                # Privacy policy & terms
│   │   │   ├── products/[handle]/      # Dynamic PDP & client view island
│   │   │   ├── search/                 # Storefront search interface
│   │   │   ├── shop/                   # All-products catalog & filter view
│   │   │   ├── globals.css             # Tailwind base styles & theme tokens
│   │   │   ├── layout.tsx              # Root HTML shell & context providers
│   │   │   ├── page.tsx                # Homepage composition
│   │   │   ├── robots.ts               # Search engine crawl directives
│   │   │   └── sitemap.ts              # Dynamic XML sitemap generator
│   │   ├── components/                 # React UI Component Library
│   │   │   ├── cart/                   # CartDrawer, DemoCheckoutModal
│   │   │   ├── enquiry/                # OrderEnquiryModal
│   │   │   ├── home/                   # HeroSection, CategoryCarousel, Promo sections
│   │   │   ├── layout/                 # Header, Footer, MobileDrawer
│   │   │   └── products/               # ProductCard, ProductGrid, ProductImage, QuickViewModal
│   │   ├── context/                    # React Context State Providers
│   │   │   ├── AuthContext.tsx         # Customer session state & demo login
│   │   │   └── CartContext.tsx         # Cart mutation queue & LocalStorage sync
│   │   ├── hooks/                      # Custom React hooks
│   │   │   └── useWishlist.ts          # LocalStorage-backed wishlist hook
│   │   ├── lib/                        # Core Domain Logic, Services & Utilities
│   │   │   ├── config/site.ts          # Store metadata, departments, hours, navigation
│   │   │   ├── data/products.ts        # Curated 700+ line local mock product catalog
│   │   │   ├── enquiry/storage.ts      # Node.js fs append storage for order enquiries
│   │   │   ├── security/rateLimit.ts   # In-memory sliding window IP rate limiter
│   │   │   ├── shopify/                # Headless commerce client, queries, formatter
│   │   │   ├── utils/index.ts          # Formatting, clsx/tailwind-merge utilities
│   │   │   └── validation/schemas.ts   # Zod-like type validation & GraphQL allowlist
│   │   └── types/                      # TypeScript Domain Types
│   │       └── index.ts                # Product, Cart, Collection, Customer types
│   ├── tests/                          # Automated Test Suite
│   │   └── remediation.test.ts         # Security, schema, rate limit & cart unit tests
│   ├── .eslintrc.json                  # Next.js and ESLint rule configuration
│   ├── next.config.ts                  # Next.js bundler, remote image hostname patterns
│   ├── package.json                    # Application scripts and dependencies
│   ├── postcss.config.mjs              # PostCSS & Tailwind plugin setup
│   ├── tailwind.config.ts              # Theme palette (Cream/Forest Green), typography
│   └── tsconfig.json                   # TypeScript compiler options & `@/*` alias
├── PROJECT_RULES.md                    # Canonical rules for GSD workflow execution
├── SHOPIFY_ARCHITECTURE_AUDIT.md       # Root-level architectural analysis
├── model_capabilities.yaml             # AI model profile capabilities configuration
└── skills-lock.json                    # Lockfile for agent skills
```

## Directory Purposes

**`website/src/app/`:**
- Purpose: Application routing using Next.js 15 App Router.
- Contains: React Server Components (`page.tsx`), root metadata and layouts (`layout.tsx`), route handlers (`/api/*`), and SEO entry points (`robots.ts`, `sitemap.ts`).
- Key files: `website/src/app/layout.tsx`, `website/src/app/page.tsx`, `website/src/app/shop/page.tsx`.

**`website/src/app/api/`:**
- Purpose: Backend API endpoints serving client components and proxying upstream operations.
- Contains: Route handlers for cart mutations (`api/cart/route.ts`), GraphQL requests (`api/shopify/route.ts`), and order enquiries (`api/enquiry/route.ts`).
- Key files: `website/src/app/api/cart/route.ts`, `website/src/app/api/enquiry/route.ts`, `website/src/app/api/shopify/route.ts`.

**`website/src/components/`:**
- Purpose: Reusable React presentation components and interactive client islands.
- Contains: Layout chrome (`layout/Header.tsx`, `layout/Footer.tsx`), cart elements (`cart/CartDrawer.tsx`, `cart/DemoCheckoutModal.tsx`), enquiry modals (`enquiry/OrderEnquiryModal.tsx`), product display (`products/ProductCard.tsx`, `products/ProductGrid.tsx`), and homepage sections (`home/HeroSection.tsx`, `home/CategoryCarousel.tsx`).
- Key files: `website/src/components/layout/Header.tsx`, `website/src/components/products/ProductCard.tsx`, `website/src/components/cart/CartDrawer.tsx`.

**`website/src/context/`:**
- Purpose: Global client-side state providers for cross-component coordination.
- Contains: `CartContext.tsx` (cart lines, serialized mutation queue, local persistence) and `AuthContext.tsx` (customer login, verified customer status, address, order history).
- Key files: `website/src/context/CartContext.tsx`, `website/src/context/AuthContext.tsx`.

**`website/src/lib/`:**
- Purpose: Shared domain business logic, configuration, external integrations, security, and data validation.
- Contains: Shopify Storefront API GraphQL client (`shopify/index.ts`, `shopify/queries.ts`, `shopify/mutations.ts`, `shopify/cartFormatter.ts`), site configuration (`config/site.ts`), validation schemas (`validation/schemas.ts`), rate limiting (`security/rateLimit.ts`), and enquiry storage (`enquiry/storage.ts`).
- Key files: `website/src/lib/shopify/index.ts`, `website/src/lib/validation/schemas.ts`, `website/src/lib/security/rateLimit.ts`.

**`website/src/types/`:**
- Purpose: Canonical TypeScript interface definitions and contracts for products, collections, carts, customers, and offers.
- Contains: `index.ts`.
- Key files: `website/src/types/index.ts`.

**`website/tests/`:**
- Purpose: Automated tests executed via Node.js native test runner and `tsx`.
- Contains: Comprehensive regression tests covering input validation, rate limiting, GraphQL allowlists, and cart normalization.
- Key files: `website/tests/remediation.test.ts`.

**`scripts/`:**
- Purpose: Cross-platform workspace maintenance and validation utilities.
- Contains: PowerShell (`.ps1`) and Bash (`.sh`) scripts for validating agent files, skills, templates, workflows, and character encodings.
- Key files: `scripts/validate-all.ps1`, `scripts/validate-all.sh`.

**`.agents/`:**
- Purpose: Native agent definition files and modular skills library.
- Contains: Persona configurations and skill directories with instructions, references, and validation rules.
- Key files: `.agents/skills/codebase-mapper/SKILL.md`, `.agents/skills/executor/SKILL.md`.

## Key File Locations

**Entry Points:**
- `website/src/app/layout.tsx`: Root HTML layout, font setup, and top-level context provider wrapping.
- `website/src/app/page.tsx`: Storefront landing page composition.
- `website/src/app/api/cart/route.ts`: Entry point for all cart state changes.
- `website/src/app/api/enquiry/route.ts`: Entry point for customer order enquiry submissions.
- `website/src/app/api/shopify/route.ts`: Protected proxy gateway for Storefront GraphQL queries.

**Configuration:**
- `website/package.json`: Storefront scripts, package dependencies, and overrides.
- `website/next.config.ts`: Next.js config, image domains (`cdn.shopify.com`, `images.unsplash.com`, `mock.shop`).
- `website/tailwind.config.ts`: Color palette (`#FDF4E3`, `#14532D`, `#22C55E`, `#1F2937`), font families, container metrics.
- `website/tsconfig.json`: TypeScript paths (`@/*` -> `./src/*`) and build options.
- `website/.env.example`: Template for required environment variables (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `NEXT_PUBLIC_COMMERCE_MODE`).
- `PROJECT_RULES.md`: Canonical rules and proof requirements for the GSD methodology.
- `model_capabilities.yaml`: Capability profiles for multi-model orchestration.

**Core Logic:**
- `website/src/lib/shopify/index.ts`: Unified catalog access with automatic demo mode fallback.
- `website/src/lib/shopify/cartFormatter.ts`: Converts GraphQL Cart structures to frontend domain objects.
- `website/src/lib/validation/schemas.ts`: Request validation schemas and GraphQL operation allowlist.
- `website/src/lib/security/rateLimit.ts`: In-memory sliding window rate limiting engine.
- `website/src/lib/enquiry/storage.ts`: Disk persistence for order inquiries.
- `website/src/context/CartContext.tsx`: Serialized cart mutation queue and state reconciliation.

**Testing:**
- `website/tests/remediation.test.ts`: Automated test suite executed via `npm test`.

## Naming Conventions

**Files:**
- React Components & Modals: PascalCase with `.tsx` extension (e.g., `ProductCard.tsx`, `CartDrawer.tsx`, `OrderEnquiryModal.tsx`).
- Next.js Routing Files: lowercase kebab-case standard Next.js names (e.g., `layout.tsx`, `page.tsx`, `route.ts`, `robots.ts`, `sitemap.ts`).
- Dynamic Route Segments: Bracketed parameter names (e.g., `[handle]/page.tsx`).
- Utility & Service Modules: camelCase with `.ts` extension (e.g., `cartFormatter.ts`, `rateLimit.ts`, `schemas.ts`).
- Context Providers: PascalCase with Context suffix (e.g., `CartContext.tsx`, `AuthContext.tsx`).
- Test Files: Kebab-case or descriptor with `.test.ts` extension (e.g., `remediation.test.ts`).
- Automation Scripts: Kebab-case with platform extensions (e.g., `validate-all.ps1`, `validate-all.sh`).

**Directories:**
- Route Segments: Lowercase kebab-case (e.g., `src/app/collections/`, `src/app/products/`).
- Component Categories: Lowercase kebab-case (e.g., `components/cart/`, `components/home/`, `components/layout/`, `components/products/`).
- Service Modules: Lowercase kebab-case (e.g., `lib/shopify/`, `lib/security/`, `lib/validation/`).

## Where to Add New Code

**New Feature (e.g., Product Reviews or Customer Subscriptions):**
- Presentation & UI: Add feature-specific components under `website/src/components/<feature>/` (e.g., `website/src/components/reviews/ReviewCard.tsx`).
- Dedicated Page Route: Add route segment under `website/src/app/<feature>/page.tsx`.
- Client State / Context: Add dedicated context provider under `website/src/context/<Feature>Context.tsx` or hook under `website/src/hooks/use<Feature>.ts`.
- Domain Logic & Data Fetching: Add service methods in `website/src/lib/<feature>/` or extend `website/src/lib/shopify/index.ts`.
- Tests: Add test suites in `website/tests/<feature>.test.ts`.

**New Component/Module:**
- Layout chrome: Place in `website/src/components/layout/`.
- Product-specific widgets: Place in `website/src/components/products/`.
- Homepage promo sections: Place in `website/src/components/home/`.

**New Route Handler (API Endpoint):**
- Place in `website/src/app/api/<endpoint>/route.ts`.
- Always wrap handlers with `checkRateLimit` from `website/src/lib/security/rateLimit.ts`.
- Always validate incoming payloads with schemas from `website/src/lib/validation/schemas.ts`.
- Never log Customer PII.

**New Utility or Helper:**
- General UI or string helpers: Place in `website/src/lib/utils/index.ts`.
- Security or cryptographic helpers: Place in `website/src/lib/security/`.
- Validation schemas: Place in `website/src/lib/validation/schemas.ts`.

**New Data Contracts / Types:**
- Add domain entity interfaces to `website/src/types/index.ts`.

## Special Directories

**`website/.data/`:**
- Purpose: File-based persistence sink storing `enquiries.json`.
- Generated: Yes (automatically created on first inquiry submission).
- Committed: No (contains operational customer submissions; kept local or mounted volume).

**`website/.planning/` & `.planning/`:**
- Purpose: GSD workflow planning artifacts, phase roadmaps, and codebase reference architecture.
- Generated: Yes (generated by GSD tools and mappers).
- Committed: Yes.

**`website/.next/`:**
- Purpose: Next.js build compilation cache and static asset outputs.
- Generated: Yes.
- Committed: No (ignored via `.gitignore`).

**`website/node_modules/`:**
- Purpose: Installed npm dependencies.
- Generated: Yes.
- Committed: No.

**`website/public/assets/`:**
- Purpose: Committed static image assets (product photos, department tiles, banner artwork).
- Generated: No.
- Committed: Yes.

**`.agents/`:**
- Purpose: Antigravity agent definition files and skill libraries.
- Generated: No.
- Committed: Yes.

---

*Structure analysis: 2026-11-05*
