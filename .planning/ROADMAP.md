# Milestone v2.0 Roadmap: Advanced Product Filtering & Discovery

## Milestone Overview
- **Milestone**: v2.0
- **Goal**: Implement a complete, high-fidelity, accurately mapped product filtering and discovery experience across desktop and mobile storefront views.
- **Prerequisite**: Milestone v1.0 complete (Commit `da4f20d`).

---

## Phase Breakdown

### Phase 1: Catalogue Data Enhancement & Attribute Mapping
- **Goal**: Ensure the mock product catalogue contains authentic, clean data for all 7 filter dimensions without schema breaks.
- **Tasks**:
  1. Inspect and normalize dietary & lifestyle tags (`Vegan`, `Vegetarian`, `Gluten-Free`, `Irish Made`, `Artisanal`, `Multipack`) in `src/lib/data/products.ts`.
  2. Populate realistic customer rating objects (`rating: { value, count }`) on products, utilizing existing `ProductRating` interface in `src/types/index.ts`.
  3. Mark 2-3 specific seasonal/specialty items as `availableForSale: false` to enable realistic testing of stock availability filtering.
  4. Verify backward compatibility with existing tests and mock loader functions.

### Phase 2: Core Filtering Engine & State Management
- **Goal**: Build a deterministic, pure filtering engine and reactive hook with dynamic facet counts.
- **Tasks**:
  1. Implement `filterProducts(products, filterState)` supporting AND logic across groups and OR logic within multi-select groups.
  2. Implement dynamic facet count calculator `calculateFacetCounts(products, filterState)` calculating live counts per option.
  3. Build `useProductFilters` hook managing active filters, sorting, search within options, pagination reset, and URL search query parameter synchronization.
  4. Implement chip removal and full "Clear All" state resets.

### Phase 3: Desktop Filter Sidebar & Toolbar Components
- **Goal**: Build the desktop filtering experience matching the Irish Grocer visual design.
- **Tasks**:
  1. Build vertical sidebar component with collapsible accordion sections for Availability, Categories, Brands, Price, Product Type, Dietary, and Star Ratings.
  2. Add live search inputs inside Category and Brand lists for quick selection.
  3. Build dual-thumb price range slider with synchronized min/max numeric currency inputs.
  4. Build discovery toolbar with active filter chips, sort dropdown, and Grid/List view toggle.

### Phase 4: Flipkart-Style Mobile Filter Drawer
- **Goal**: Build a high-usability mobile slide-in filter drawer with Flipkart-style interactions.
- **Tasks**:
  1. Build slide-in drawer layout with dark overlay, body scroll-lock, and smooth touch-optimized transitions.
  2. Implement category/brand search and expandable filter sections with tap targets $\ge 44 \times 44\text{px}$.
  3. Implement sticky bottom action bar with primary "Apply Filters (N)" button reflecting real-time matching product count and "Clear All" secondary action.
  4. Implement accessibility: focus trap, initial focus, focus restoration on close, and Escape key dismissal.

### Phase 5: List View Card & Storefront Integration
- **Goal**: Support Grid vs List view toggle and integrate into storefront routes.
- **Tasks**:
  1. Implement horizontal `ProductListCard` component with image, tags, rating stars, price, description snippet, and direct Add-to-Cart CTA.
  2. Update `ShopClientView.tsx` to use the unified discovery experience and render Grid vs List views.
  3. Update `/collections/[handle]` to respect the enhanced discovery experience while scoping to the current collection.
  4. Ensure zero-results state displays helpful message and single-click "Clear All Filters" button.

### Phase 6: Automated Testing, Quality Gates & Verification
- **Goal**: Provide empirical test proof and verify all quality gates.
- **Tasks**:
  1. Author `tests/filtering.test.ts` testing AND/OR combination logic, price range boundary conditions, dynamic facet counts, and chip removal.
  2. Run `npx tsc --noEmit` to verify TypeScript typing.
  3. Run `npm run lint` to verify ESLint compliance.
  4. Run `npm test` verifying 100% pass rate across all test suites.
  5. Run `npm run build` verifying static export and SSR route compilation.

