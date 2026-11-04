# Milestone v2.0 Requirements: Advanced Product Filtering & Discovery

## Requirements Overview
This document defines the functional and non-functional requirements for the Advanced Product Filtering & Discovery milestone on The Irish Grocer storefront.

---

### REQ-FILTER-01: Filter Dimensions & Data Mapping
- **REQ-01.1 (Availability)**: Filter by "In Stock" (`availableForSale === true`) and "Out of Stock" (`availableForSale === false`).
- **REQ-01.2 (Categories)**: Multi-select filtering across the 16 storefront departments, with live search inside the category list.
- **REQ-01.3 (Brand / Vendor)**: Multi-select filtering across all 24 unique vendors/brands, with live search inside the brand list.
- **REQ-01.4 (Price Range)**: Dual-bound filtering with numeric inputs (min and max) plus dual-thumb range slider, operating over `priceRange.minVariantPrice.amount`.
- **REQ-01.5 (Product Type)**: Multi-select filtering across all distinct `productType` values present in the catalogue.
- **REQ-01.6 (Dietary & Lifestyle)**: Multi-select filtering by product attributes (`Gluten-Free`, `Vegetarian`, `Vegan`, `Irish Made`, `Artisanal`, `Multipack`) mapped to normalized product tags.
- **REQ-01.7 (Customer Rating)**: Minimum star rating filter (4★ & above, 3★ & above, 2★ & above, 1★ & above) mapped to `product.rating.value`.

### REQ-FILTER-02: Filtering Logic & Calculations
- **REQ-02.1 (Boolean Logic)**: Apply AND logic between different filter groups (e.g. Category = Crisps AND Brand = Tayto AND Rating >= 4), and OR logic within multi-select groups (e.g. Brand = Tayto OR Walkers).
- **REQ-02.2 (Dynamic Facet Counts)**: Every filter option must display the dynamic count of matching products based on the current catalogue context. No hardcoded or fake counts.
- **REQ-02.3 (Empty & Zero-Result Handling)**: When no products match the combined active filters, display a graceful zero-results state with a "Clear Filters" CTA.

### REQ-FILTER-03: Desktop Filter Sidebar & Toolbar
- **REQ-03.1 (Sidebar Layout)**: Left-side vertical sidebar with clean Irish Grocer styling (deep green `#14532D`, cream `#FFFAF1`, border `#E8DFCF`).
- **REQ-03.2 (Active Filter Chips)**: Horizontal bar of removable chips above product grid displaying active selections with quick 'X' dismiss controls.
- **REQ-03.3 (Clear All Action)**: Prominent "Clear All" action in sidebar and chips bar resetting all filter dimensions simultaneously.
- **REQ-03.4 (Sorting Control)**: Dropdown supporting Alphabetical A-Z, Alphabetical Z-A, Price Low to High, Price High to Low, and Rating Highest First.
- **REQ-03.5 (Grid / List View Switcher)**: Toggle allowing users to switch between 3/4-column Grid view and horizontal List view.

### REQ-FILTER-04: Mobile Flipkart-Style Filter Drawer
- **REQ-04.1 (Slide-in Drawer)**: Smooth slide-in drawer with dark backdrop overlay and body scroll-lock.
- **REQ-04.2 (Expandable Accordion / Dual-Pane)**: Intuitive mobile layout allowing users to browse and toggle filter sections easily.
- **REQ-04.3 (Sticky Apply Footer)**: Sticky bottom bar with a primary "Apply Filters (N)" button reflecting real-time matching product count, alongside a "Clear All" secondary action.
- **REQ-04.4 (Touch & Accessibility Standards)**: Tap targets $\ge 44 \times 44\text{px}$, Escape key dismissal, initial focus trapping, and focus restoration to filter trigger button.

### REQ-FILTER-05: Discovery Integration & State Synchronization
- **REQ-05.1 (Shared Filter State)**: Unified custom hook (`useProductFilters`) synchronizing state between desktop sidebar, mobile drawer, and URL params.
- **REQ-05.2 (Deep Linking & Bookmarking)**: Filter state serialized to URL search parameters (e.g. `?brand=tayto,walkers&min_price=5&rating=4&view=list`).
- **REQ-05.3 (Integration Coverage)**: Active on `/shop` and `/collections/[handle]` routes, fully preserving existing cart, wishlist, and quick-view functionality.

### REQ-FILTER-06: Verification & Automated Testing
- **REQ-06.1 (Unit & Integration Tests)**: Dedicated automated test suite (`tests/filtering.test.ts`) validating boolean logic, edge-case price bounds, facet counts, chip removals, and URL serialization.
- **REQ-06.2 (Zero Regressions)**: All 38 existing remediation tests pass (`tests/remediation.test.ts`), `npx tsc --noEmit` exits 0, `npm run lint` exits 0, and `npm run build` exits 0.

