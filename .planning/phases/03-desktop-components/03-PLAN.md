---
phase: "03-desktop-components"
plan: "03"
title: "Desktop Filter Sidebar & Toolbar Components"
wave: 1
dependencies: ["02-filtering-engine"]
files_modified:
  - "src/components/products/filters/DesktopFilterSidebar.tsx"
  - "src/components/products/filters/FilterToolbar.tsx"
  - "src/components/products/filters/PriceRangeSlider.tsx"
---

# Plan 03: Desktop Filter Sidebar & Toolbar Components

## Objective
Implement high-fidelity desktop filtering components: vertical left-hand filter sidebar with collapsible sections, brand/category inline search, dual price range inputs & slider, active filter chips bar, sort dropdown, and grid/list view switcher.

## Tasks
1. **Price Range Component (`src/components/products/filters/PriceRangeSlider.tsx`)**:
   - Numeric Min & Max currency inputs with `$` prefix.
   - Dual-slider / range controls allowing visual dragging between `defaultBounds[0]` and `defaultBounds[1]`.
   - Debounced or immediate state update on change.

2. **Desktop Filter Sidebar (`src/components/products/filters/DesktopFilterSidebar.tsx`)**:
   - Sidebar container styled in `#FFFAF1` cream, `#E8DFCF` border, and `#14532D` accents.
   - Header with "Filters" title, matching count badge, and "Clear All" link.
   - Collapsible accordion sections for all 7 filter groups:
     - Availability (In stock / Out of stock radio/checkbox with live counts).
     - Categories (Search input + multi-select checkboxes with live counts).
     - Brand / Vendor (Search input + multi-select checkboxes with live counts).
     - Price Range (`PriceRangeSlider`).
     - Product Type (Multi-select checkboxes with live counts).
     - Dietary & Lifestyle (Multi-select checkboxes with live counts).
     - Rating (Star rating choices with visual stars and live counts).

3. **Discovery Toolbar (`src/components/products/filters/FilterToolbar.tsx`)**:
   - Total matching products count.
   - Removable active filter chips (`ActiveChip[]`) with quick `X` dismissal.
   - Global "Clear All" button when filters are active.
   - Sort dropdown (`SortOption`).
   - View mode toggle (Grid 4-col, Grid 3-col, List mode).

4. **Automated Verification**:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm test`

