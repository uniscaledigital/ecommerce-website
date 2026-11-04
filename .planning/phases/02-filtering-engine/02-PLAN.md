---
phase: "02-filtering-engine"
plan: "02"
title: "Core Filtering Engine & State Management"
wave: 1
dependencies: ["01-catalogue-data-enhancement"]
files_modified:
  - "src/lib/filtering/types.ts"
  - "src/lib/filtering/engine.ts"
  - "src/hooks/useProductFilters.ts"
---

# Plan 02: Core Filtering Engine & State Management

## Objective
Build a deterministic, pure filtering engine and reactive hook (`useProductFilters`) supporting all 7 filter dimensions, AND/OR combination logic, dynamic facet counts, URL query parameter synchronization, and active chips management.

## Tasks
1. **Types Definition (`src/lib/filtering/types.ts`)**:
   - Define `FilterState`:
     - `availability: "all" | "in_stock" | "out_of_stock"`
     - `categories: string[]`
     - `brands: string[]`
     - `priceRange: [number, number]`
     - `productTypes: string[]`
     - `dietary: string[]`
     - `minRating: number` (0 to 5)
     - `sortBy: SortOption`
     - `viewMode: "grid" | "list"`
     - `searchQuery: string`
   - Define `FacetCounts` for dynamic counter generation.
   - Define `ActiveChip` interface for removable tags.

2. **Pure Filtering & Facet Engine (`src/lib/filtering/engine.ts`)**:
   - `filterProducts(products: Product[], state: FilterState): Product[]`:
     - Applies AND logic between filter groups.
     - Applies OR logic within multi-select groups (categories, brands, types, dietary).
     - Applies numeric price range `[min, max]`.
     - Applies min star rating (`p.rating?.value >= minRating`).
     - Applies availability (`availableForSale`).
     - Applies sorting (A-Z, Z-A, Price Low-High, Price High-Low, Rating High-Low, Relevance).
   - `calculateFacetCounts(products: Product[], state: FilterState)`:
     - Calculates dynamic product count for each category, brand, type, dietary tag, availability, and rating tier.
     - Calculates counts against the context of other active filters.

3. **Reactive Hook (`src/hooks/useProductFilters.ts`)**:
   - Manages state, toggle handlers, range setters, search queries.
   - Synchronizes with URL search parameters (using `useRouter` / `useSearchParams` or `window.history`).
   - Provides `activeChips` array with `label`, `dimension`, and `onRemove`.
   - Provides `clearAllFilters()` resetting to default state.
   - Resets pagination on filter change.

4. **Automated Verification**:
   - Verify TypeScript compilation (`npx tsc --noEmit`).
   - Verify ESLint (`npm run lint`).
   - Run tests (`npm test`).

