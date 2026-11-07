# Requirements: Milestone v8.0 — Favourites & Saved Products Experience

**Defined:** November 7, 2026  
**Core Value:** Deliver an authentic, delightful, and friction-free Irish grocery shopping experience where customers can effortlessly discover, save, and batch-purchase their favorite imported pantry staples across mobile, tablet, and desktop.  
**Milestone:** v8.0  
**Status:** Scoped & Approved  

---

## v8.0 Requirements

### 1. State & Hook Architecture (STATE)

- [ ] **REQ-FAV-01**: `useWishlist` hook provides complete reactive methods: `wishlist` (array of product IDs), `wishlistCount` (number), `isWishlisted(id)` (boolean), `toggleWishlist(id)` (void), and `clearWishlist()` (void), with synchronized `localStorage` (`irish_grocer_wishlist`) and cross-tab storage events.
- [ ] **REQ-FAV-02**: Product Details Page ([`ProductDetailsClient.tsx`](file:///c:/Users/kumar/Downloads/irishweb/website/src/app/products/[handle]/ProductDetailsClient.tsx)) integrates a dedicated, touch-accessible ($\ge 44\times 44\text{px}$) styled Heart toggle button alongside the quantity selector and Add to Basket actions, supporting active heart styling, visual feedback, and screen reader announcements.

### 2. Dedicated Favourites Destination & Batch Operations (ROUTE)

- [ ] **REQ-FAV-03**: Dedicated `/favorites` route (`src/app/favorites/page.tsx` and `FavoritesClientView.tsx`) renders all saved items in the standard responsive product grid (2-column mobile, multi-column desktop) with page header, item count, and individual remove actions.
- [ ] **REQ-FAV-04**: Dedicated `/favorites` page features a prominent "Add All to Basket" batch action that adds all in-stock wishlisted items to the active basket in a single tap and opens the CartDrawer.
- [ ] **REQ-FAV-05**: Batch cart actions strictly honor B2B wholesale pricing gates: unauthenticated visitors are prompted to log in before adding items to basket.
- [ ] **REQ-FAV-06**: When 0 items are saved, `/favorites` renders a warm farmhouse empty state card in Warm Cream (`#FFFAF1`) with Playfair Display heading, reassuring copy, and 4 quick-link shortcut pills to popular Irish aisles (Crisps & Snacks, Tea & Coffee, Biscuits & Cakes, Cadbury).
- [ ] **REQ-FAV-07**: Individual item remove button and a secondary "Clear All Saved" confirmation action allow easy wishlist curation.

### 3. Global Navigation & Discovery (NAV)

- [ ] **REQ-FAV-08**: Desktop floating header ([`Header.tsx`](file:///c:/Users/kumar/Downloads/irishweb/website/src/components/layout/Header.tsx)) integrates a Heart icon button with live dynamic counter badge in the top right utility controls row alongside Account and Cart.
- [ ] **REQ-FAV-09**: Mobile navigation drawer ([`MobileDrawer.tsx`](file:///c:/Users/kumar/Downloads/irishweb/website/src/components/layout/MobileDrawer.tsx)) includes a "Saved Items" navigation link with heart icon and live item count badge.
- [ ] **REQ-FAV-10**: Customer account page ([`/account`](file:///c:/Users/kumar/Downloads/irishweb/website/src/app/account/page.tsx)) features a "Saved Farmhouse Provisions" summary card displaying current saved count and a direct link to `/favorites`.

### 4. Quality Gates & Regression Verification (QA)

- [ ] **REQ-FAV-11**: Author dedicated automated test suite (`tests/phase20-favorites.test.ts`) validating reactive wishlist methods, PDP heart integration, batch cart operations, B2B pricing gating, and navigation badge counts.
- [ ] **REQ-FAV-12**: Static toolchain verification passes 100% clean (`npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` compiling all routes including `/favorites`).
- [ ] **REQ-FAV-13**: Gravitas multi-viewport browser verification across 10 viewports (360px to 1920px) confirms 0 console errors, 0 uncaught exceptions, 0 horizontal overflow (`scrollWidth <= innerWidth`), and $\ge 95\%$ visual similarity on existing approved pages.

---

## Out of Scope

| Feature | Reason |
| :--- | :--- |
| Server-side database / Shopify Customer Metafield wishlist sync | Preserves responsive, private, zero-latency standalone demo mode without requiring customer login to save items. |
| Multiple named wishlists / boards | Single unified "Farmhouse Favourites" collection matches authentic grocery shop flow. |
| Public wishlist sharing URLs / social export | Minimizes external dependencies and keeps scope focused on core shopper utility. |
| Modification to `ProductCard.tsx` design invariants | Preserves approved card layout and touch targets. |

---

## Traceability

| Requirement | Phase | Status |
| :--- | :---: | :---: |
| **REQ-FAV-01** (useWishlist expansion) | Phase 20 | Pending |
| **REQ-FAV-02** (PDP heart integration) | Phase 20 | Pending |
| **REQ-FAV-03** (Dedicated /favorites route) | Phase 21 | Pending |
| **REQ-FAV-04** (Batch Add All to Basket) | Phase 21 | Pending |
| **REQ-FAV-05** (Wholesale B2B pricing gate on batch CTA) | Phase 21 | Pending |
| **REQ-FAV-06** (Warm farmhouse empty state) | Phase 21 | Pending |
| **REQ-FAV-07** (Clear all & item remove actions) | Phase 21 | Pending |
| **REQ-FAV-08** (Desktop header heart button & badge) | Phase 22 | Pending |
| **REQ-FAV-09** (Mobile drawer Saved Items link & badge) | Phase 22 | Pending |
| **REQ-FAV-10** (Account page Saved Provisions card) | Phase 22 | Pending |
| **REQ-FAV-11** (Automated regression test suite) | Phase 23 | Pending |
| **REQ-FAV-12** (Static toolchain verification) | Phase 23 | Pending |
| **REQ-FAV-13** (Gravitas multi-viewport visual regression) | Phase 23 | Pending |

**Coverage:**
- Total v8.0 Requirements: 13
- Mapped to Phases (Phases 20–23): 13 (100%)
- Unmapped: 0
