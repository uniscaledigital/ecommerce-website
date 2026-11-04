# Coding Conventions

**Analysis Date:** 2026-11-05

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension — `website/src/components/cart/CartDrawer.tsx`, `website/src/components/layout/Header.tsx`, `website/src/components/products/ProductCard.tsx`.
- Next.js App Router route and layout files: lowercase kebab-case or Next.js convention files — `website/src/app/page.tsx`, `website/src/app/layout.tsx`, `website/src/app/robots.ts`, `website/src/app/sitemap.ts`, `website/src/app/api/cart/route.ts`.
- Dynamic route segment folders: square brackets notation — `website/src/app/collections/[handle]/page.tsx`, `website/src/app/products/[handle]/page.tsx`.
- Business logic, security, and utility modules: camelCase with `.ts` extension — `website/src/lib/security/rateLimit.ts`, `website/src/lib/shopify/cartFormatter.ts`, `website/src/lib/utils/index.ts`.
- Schema and validation modules: lowercase descriptive names — `website/src/lib/validation/schemas.ts`, `website/src/lib/data/products.ts`.
- React Contexts: PascalCase with `.tsx` extension — `website/src/context/CartContext.tsx`, `website/src/context/AuthContext.tsx`.
- Custom Hooks: camelCase with `use` prefix — `website/src/hooks/useWishlist.ts`.
- Tests: lowercase descriptive with `.test.ts` extension — `website/tests/remediation.test.ts`.
- Shell and automation scripts: lowercase kebab-case with `.ps1` or `.sh` extension — `scripts/validate-all.ps1`, `scripts/validate-agents.sh`.

**Functions:**
- React Components: PascalCase named exports — `export function CartDrawer()`, `export function Header()`, `export function ProductCard({ product }: ProductCardProps)`.
- Next.js App Router Page components: PascalCase default exports — `export default function HomePage()`, `export default function LoginPage()`.
- Route Handlers: UPPERCASE corresponding to HTTP method — `export async function POST(request: Request)` in `website/src/app/api/cart/route.ts` and `website/src/app/api/shopify/route.ts`.
- Custom Hooks: camelCase starting with `use` — `export function useCart()`, `export function useAuth()`, `export function useWishlist()`.
- Utility, validation, and domain helper functions: camelCase with active verbs — `formatMoney()`, `cn()`, `slugify()`, `checkRateLimit()`, `validateEnquiryInput()`, `formatShopifyCart()`, `persistOrderEnquiry()`.
- Event Handlers: camelCase prefixed with `handle` or `on` — `handleSearchSubmit()`, `handleQuantityChange()`, `onClose()`.
- PowerShell Scripts: Verb-Noun in PascalCase — `function Invoke-Validator` in `scripts/validate-all.ps1`.

**Variables:**
- Local variables, function arguments, and object properties: camelCase — `clientIp`, `windowMs`, `maxRequests`, `rateLimit`, `formattedCart`, `cartItems`.
- Boolean variables and state flags: camelCase prefixed with `is`, `has`, or `can` — `isCartOpen`, `isLoading`, `isScrolled`, `isMobileMenuOpen`, `isValid`, `isAuthenticated`.
- React state setters: `set[StateName]` pattern — `const [isCartOpen, setIsCartOpen] = useState(false)`.
- React Refs: camelCase ending in `Ref` — `syncQueueRef`, `cartRef`, `pendingRef`.
- Module-level constants, configuration singletons, and regular expressions: UPPER_SNAKE_CASE — `ALLOWED_SHOPIFY_OPERATIONS`, `INITIAL_CART`, `EMAIL_REGEX`, `PHONE_REGEX`, `CART_STORAGE_KEY`, `SITE_CONFIG`, `DEPARTMENTS`, `PRODUCTS`.

**Types:**
- Interfaces and Type Aliases: PascalCase — `Product`, `ProductVariant`, `Cart`, `CartLineItem`, `Money`, `ImageNode`, `ValidationResult<T>`, `EnquiryInput`, `CartAction`, `RateLimitResult`, `CartContextType`.
- Generics: Single capital letter or PascalCase identifier — `ValidationResult<T>`.
- Component Prop Interfaces: PascalCase ending in `Props` — `ProductCardProps`, `CartDrawerProps`.
- Union string literals: PascalCase type name with string literal members — `export type CartAction = "create" | "add" | "update" | "remove" | "get"`.

## Code Style

**Formatting:**
- Indentation: 2 spaces.
- Quotes: Double quotes for TypeScript strings and JSX attributes (`"use client"`, `className="..."`).
- Semicolons: Always use trailing semicolons.
- Line endings: LF normalized via `.gitattributes`.
- Styling framework: Tailwind CSS 3.4 utility classes with design system tokens defined in `website/tailwind.config.ts`.
- Class merging: Use `cn()` helper (`twMerge(clsx(inputs))`) from `website/src/lib/utils/index.ts` for dynamic conditional classes.

**Linting:**
- Tool: ESLint 9 (`website/.eslintrc.json`) extending `next/core-web-vitals`.
- TypeScript Compiler: TypeScript 5.7 with strict type checking enabled (`strict: true`, `noEmit: true`, `skipLibCheck: true`, `target: "ES2022"` in `website/tsconfig.json`).
- Script validation: Automated encoding and structure validation via `scripts/validate-all.ps1` and `scripts/validate-all.sh`.
- Enforcement command: `npm run lint` and `npm run typecheck` inside `website/`.

## Import Organization

**Order:**
1. React and Next.js framework imports:
   ```typescript
   import React, { useState, useEffect, useCallback, useRef } from "react";
   import Link from "next/link";
   import Image from "next/image";
   import { useRouter, usePathname } from "next/navigation";
   import { NextResponse } from "next/server";
   ```
2. Third-party library imports:
   ```typescript
   import { ShoppingBag, X, Plus, Minus } from "lucide-react";
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";
   ```
3. Internal path-aliased modules (`@/*`):
   ```typescript
   import { Cart, Product } from "@/types";
   import { useCart } from "@/context/CartContext";
   import { checkRateLimit } from "@/lib/security/rateLimit";
   import { validateCartInput } from "@/lib/validation/schemas";
   import { formatShopifyCart } from "@/lib/shopify/cartFormatter";
   ```
4. Relative sibling/subcomponent imports:
   ```typescript
   import { MobileDrawer } from "./MobileDrawer";
   import { QuickViewModal } from "./QuickViewModal";
   ```

**Path Aliases:**
- `@/*` mapped to `./src/*` in `website/tsconfig.json`.
- Use path aliases (`@/lib/...`, `@/context/...`, `@/components/...`, `@/types`) for cross-module imports.
- Reserve relative paths (`./...`, `../...`) strictly for immediate sibling components or test files importing `../src/...`.

## Error Handling

**Patterns:**
- Schema & Input Validation:
  Functions return structured `ValidationResult<T>` instead of throwing runtime exceptions:
  ```typescript
  // website/src/lib/validation/schemas.ts
  export interface ValidationResult<T> {
    isValid: boolean;
    errors: string[];
    data?: T;
  }
  ```
- API Route Validation & Early Return Pipeline:
  API handlers enforce a consistent 5-step defensive guard pattern:
  1. Rate limiting check (`checkRateLimit()`) → return HTTP 429 on exhaustion.
  2. Content-Type header inspection → return HTTP 415 if not `application/json`.
  3. Body parsing guard with try/catch → return HTTP 400 on malformed JSON.
  4. Schema and allowlist validation → return HTTP 400 with `{ error: "Validation failed", details: [...] }`.
  5. Timeout-guarded upstream fetch using `AbortSignal.timeout(10_000)` → return HTTP 504 on `TimeoutError` and HTTP 500/502 on upstream gateway failures.
- Client-Side Async Mutations:
  Sequential mutation queue pattern via `useRef<Promise<void>>` in `website/src/context/CartContext.tsx` ensures asynchronous Cart operations do not race:
  ```typescript
  const syncQueueRef = useRef<Promise<void>>(Promise.resolve());
  const enqueue = useCallback((task: () => Promise<void>) => {
    const next = syncQueueRef.current.catch(() => {}).then(task);
    syncQueueRef.current = next.catch((err) => {
      console.warn("Cart sync task failed:", err);
    });
    return syncQueueRef.current;
  }, []);
  ```
- Storage Fallback:
  Local storage operations in `website/src/context/CartContext.tsx` and `website/src/context/AuthContext.tsx` wrap storage calls in `try/catch` to fail silently when quota is exceeded or under private browsing modes.

## Logging

**Framework:**
- Native Node.js/Browser `console` methods (`console.error`, `console.warn`, `console.info`).

**Patterns:**
- `console.error`: Reserved for unrecoverable errors in API route catches or unexpected mutation failures:
  ```typescript
  console.error("Cart API error:", error);
  console.error("Order enquiry processing failure:", err);
  ```
- `console.warn`: Used for non-fatal background synchronization retries or recoverable storage glitches:
  ```typescript
  console.warn("Cart sync task failed:", err);
  ```
- `console.info`: Used for operational audit traces:
  ```typescript
  console.info(`[Order Enquiry Queued] ID: ${enquiryId} | Lines: ${cartItems.length} | Units: ${totalUnits} | Subtotal: $${subtotal}`);
  ```
- **Privacy & GDPR/CCPA Rule**: Never log customer personally identifiable information (PII) such as customer names, raw phone numbers, delivery addresses, or credit card information. Log only anonymous aggregate quantities, IDs, and timestamps.

## Comments

**When to Comment:**
- Boundary markers and section headers: Used to clearly distinguish complex JSX layouts (e.g., `/* ==================== ROW 1: MAIN NAVIGATION BAR ==================== */`).
- Security decisions: Document reasoning behind security constraints (e.g., query size limits, sliding-window rate limit cleanup timers).
- Avoid obvious comments that restate what the code does; write comments that explain *why* a constraint or edge-case handling exists.

**JSDoc/TSDoc:**
- Lightly used for exported library contracts and security helpers. Explicit TypeScript interfaces and typed function signatures serve as the primary contract documentation.

## Function Design

**Size:**
- Single responsibility: API routes delegate to standalone validators (`website/src/lib/validation/schemas.ts`) and formatters (`website/src/lib/shopify/cartFormatter.ts`).
- Large UI components are broken down into section modules (e.g. `website/src/components/home/HeroSection.tsx`, `FamiliarBrandsSection.tsx`, `CategoryCarousel.tsx`).

**Parameters:**
- Functions with more than 2 related arguments accept an options or payload object rather than positional arguments:
  ```typescript
  export function checkRateLimit(request: Request, prefix = "general", options: RateLimitOptions = {}): RateLimitResult
  ```
- React components use typed destructured props interfaces:
  ```typescript
  export function ProductCard({ product, priority = false }: ProductCardProps)
  ```

**Return Values:**
- Data mutations and validators return structured result objects `{ success, ... }` or `{ isValid, errors, data }` rather than boolean primitives or throwing exceptions.
- Async service methods return typed promises: `Promise<ValidationResult<T>>` or `Promise<{ success: boolean; cart?: Cart }>`.

## Module Design

**Exports:**
- Named exports are standard across components, contexts, types, and utility functions:
  ```typescript
  export function CartDrawer() { ... }
  export function formatMoney(...) { ... }
  ```
- Default exports are strictly reserved for Next.js routing entry points:
  - `export default function Page()` in page routes.
  - `export default function RootLayout()` in layout files.
- Route Handlers export named async functions matching HTTP methods:
  - `export async function POST(request: Request)`

**Barrel Files:**
- Internal utility modules provide centralized entry points:
  - `website/src/types/index.ts` re-exports all core domain data interfaces.
  - `website/src/lib/utils/index.ts` exports standard shared formatting and styling helpers.
  - `website/src/lib/shopify/index.ts` re-exports GraphQL operations and API methods.

---

*Convention analysis: 2026-11-05*
