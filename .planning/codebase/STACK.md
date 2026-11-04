# Technology Stack

**Analysis Date:** 2026-11-05

## Languages

**Primary:**
- TypeScript 5.7.2 - All application source code, API routes, React server/client components, types, and test suites (`website/src/**/*.ts`, `website/src/**/*.tsx`, `website/tests/remediation.test.ts`, `website/tsconfig.json`)
- CSS3 (Tailwind CSS 3.4.17) - Utility classes, bespoke theme design tokens, and global styles (`website/src/app/globals.css`, `website/tailwind.config.ts`)

**Secondary:**
- JavaScript / ESM - Configuration files (`website/postcss.config.mjs`)
- JSON - Project and tool manifests (`website/package.json`, `website/.eslintrc.json`, `website/prd.json`)

## Runtime

**Environment:**
- Node.js (>=20.0.0 / >=22.0.0 LTS) - Server runtime executing Next.js 15, route handlers, and Node test runner (`@types/node` ^22.10.0 in `website/package.json`)
- Next.js Turbopack / Webpack Bundler - App Router compilation, client hydration, and server rendering (`website/next.config.ts`)

**Package Manager:**
- npm
- Lockfile: Present (`website/package-lock.json`, lockfileVersion 3)
- Overrides: `postcss` ^8.5.32, `minimatch` ^11.0.4

## Frameworks

**Core:**
- Next.js 15.1.0 - Fullstack App Router framework powering SSR, static generation, React Server Components, and API routes (`website/package.json`)
- React 19.0.0 & React DOM 19.0.0 - Component lifecycle, concurrent rendering, and UI context (`website/package.json`)
- @shopify/hydrogen 2026.10.2 - Headless commerce library providing types and storefront integration utilities (`website/package.json`)

**Testing:**
- Node.js Built-in Test Runner (`node:test` + `node:assert/strict`) - Test runner executing fast assertions without external test libraries (`website/tests/remediation.test.ts`)
- tsx 4.23.15 - TypeScript direct execution CLI for test execution (`website/package.json`)

**Build/Dev:**
- Next.js CLI - Commands: `next dev`, `next build`, `next start`, `next lint` (`website/package.json`)
- TypeScript (`tsc` 5.7.2) - Type validation via `npm run typecheck` (`website/package.json`, `website/tsconfig.json`)
- PostCSS 8.5.32 & Autoprefixer 10.4.20 - CSS preprocessing (`website/postcss.config.mjs`)
- Tailwind CSS 3.4.17 - Utility-first CSS generation (`website/tailwind.config.ts`)
- ESLint 9.16.0 & eslint-config-next 15.1.0 - Linter configuration (`website/.eslintrc.json`)

## Key Dependencies

**Critical:**
- `@shopify/hydrogen` (^2026.10.2) - Shopify headless architecture tools and Storefront API contracts (`website/package.json`)
- `next` (^15.1.0) - Core application framework (`website/package.json`)
- `react` / `react-dom` (^19.0.0) - Core UI rendering engine (`website/package.json`)
- `lucide-react` (^1.16.0) - SVG iconography throughout user interface (`website/src/components/layout/Header.tsx`, `website/src/components/cart/CartDrawer.tsx`)

**Infrastructure:**
- `clsx` (^2.1.1) - Utility for constructing `className` strings conditionally (`website/src/lib/utils/index.ts`)
- `tailwind-merge` (^3.0.0) - Merges Tailwind CSS classes without stylesheet conflicts (`website/src/lib/utils/index.ts`)
- `tsx` (^4.23.15) - Direct TypeScript runtime loader for running node tests (`website/package.json`)

## Configuration

**Environment:**
- Runtime variables accessed through `process.env.*`
- Dual-mode commerce architecture: `NEXT_PUBLIC_COMMERCE_MODE="production"` vs `"demo"`
- Key variables:
  - `SHOPIFY_STORE_DOMAIN` - Shopify store URL domain (`website/src/lib/shopify/index.ts`)
  - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Storefront API access token (`website/src/lib/shopify/index.ts`, `website/src/app/api/shopify/route.ts`)
  - `SHOPIFY_STOREFRONT_API_VERSION` - Pinned GraphQL API version (`2025-01`)
  - `NEXT_PUBLIC_COMMERCE_MODE` - Toggle between live Shopify queries and local mock catalog (`website/src/context/AuthContext.tsx`, `website/src/context/CartContext.tsx`)
  - `NEXT_PUBLIC_SITE_URL` - Canonical website URL for sitemap and metadata (`website/src/app/layout.tsx`, `website/src/app/sitemap.ts`)
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` - Public store domain for checkout redirections (`website/src/components/layout/Footer.tsx`)

**Build:**
- `website/next.config.ts` - Next.js configuration defining Strict Mode and image remote patterns (`cdn.shopify.com`, `images.unsplash.com`, `mock.shop`)
- `website/tailwind.config.ts` - Theme palette containing custom colors (`shamrock`, `gold`, `peat`, `cream`) and layout variables
- `website/tsconfig.json` - Compiler options (`target: "ES2017"`, `moduleResolution: "bundler"`, path alias `@/*` -> `./src/*`)
- `website/postcss.config.mjs` - PostCSS configuration with Tailwind and Autoprefixer
- `website/.eslintrc.json` - ESLint configuration with `next/core-web-vitals`

## Platform Requirements

**Development:**
- Node.js >=20.0.0 LTS
- npm 10+
- Modern web browser (Chrome, Firefox, Safari, Edge)

**Production:**
- Vercel or any Node.js containerized environment (Docker / AWS ECS / Render)
- Node.js >=20.0.0 LTS runtime
- Write permissions for `.data/` directory if file-based order enquiry persistence is active (`website/src/lib/enquiry/storage.ts`)

---

*Stack analysis: 2026-11-05*
