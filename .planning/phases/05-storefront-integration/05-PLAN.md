---
phase: "05-storefront-integration"
plan: "05"
title: "List View Card & Storefront Integration"
wave: 1
dependencies: ["04-mobile-filter-drawer"]
files_modified:
  - "src/components/products/ProductListCard.tsx"
  - "src/components/products/ProductGrid.tsx"
  - "src/app/shop/ShopClientView.tsx"
---

# Plan 05: List View Card & Storefront Integration

## Objective
Author the horizontal `ProductListCard` component, update `ProductGrid` to support both grid and list view modes, and integrate the full discovery system into `ShopClientView` (serving `/shop` and `/collections/[handle]`).

## Tasks
1. **List View Card (`src/components/products/ProductListCard.tsx`)**:
   - Horizontal responsive layout (`sm:flex-row`).
   - Image on left with quick-view trigger and stock badge.
   - Middle details area: brand, title, rating stars with count, tags badges, description snippet.
   - Right action area: price display, variant badge, and primary Add to Cart / View button.
2. **ProductGrid Enhancements (`src/components/products/ProductGrid.tsx`)**:
   - Add `viewMode?: "grid" | "list"` prop.
   - Add `onClearFilters?: () => void` prop to the zero-results state for single-click recovery.
3. **ShopClientView Overhaul (`src/app/shop/ShopClientView.tsx`)**:
   - Integrate `useProductFilters` hook.
   - Extract unique brands, product types, and category mapping from props.
   - Render `FilterToolbar` at top with active chips, sorting dropdown, and view switcher.
   - Render `DesktopFilterSidebar` in left column (hidden on mobile).
   - Render `MobileFilterDrawer` with trigger ref and state sync.
   - Render `ProductGrid` with `filteredProducts` and pagination.
4. **Automated Verification**:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm test`
   - `npm run build`

