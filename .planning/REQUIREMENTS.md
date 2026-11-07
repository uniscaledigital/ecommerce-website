# Requirements: Milestone v8.0 — Favourites & Saved Products Experience

**Defined:** November 7, 2026  
**Core Value:** Deliver an authentic, delightful, and friction-free Irish grocery shopping experience where customers can effortlessly discover, save, and batch-purchase their favorite imported pantry staples across mobile, tablet, and desktop.  
**Milestone:** v8.0  
**Phase:** Phase 20 (Single Implementation Phase)  
**Status:** Scoped & Planned  

---

## v8.0 Requirements Matrix (Phase 20)

### 1. Mobile Bottom Navigation Integration (REQ-A)
- [ ] **REQ-801.1**: Update `MobileBottomNav.tsx` to display exactly six equal-width destinations in strict order:
  1. `Home` (`/`)
  2. `Shop` (`/shop` or `/collections/*`)
  3. `Search` (`/search`)
  4. `Favourites` (`/favorites`)
  5. `Cart` (calls `openCart`)
  6. `Patrick` / `Account` (`/account`)
- [ ] **REQ-801.2**: Favourites tab displays proper heart icon: outline heart when inactive, filled Forest Green heart (`#14532D`) when active (`pathname === "/favorites"`).
- [ ] **REQ-801.3**: Favourites tab shows a dynamic badge with the total number of saved products when count > 0.
- [ ] **REQ-801.4**: Six navigation items fit cleanly without wrapping, overlapping, or clipping across 360px, 390px, and 430px mobile viewports, maintaining $\ge 44\times 44\text{px}$ touch targets and safe-area padding.

### 2. Multi-Surface Heart Interactions & State Synchronization (REQ-B)
- [ ] **REQ-802.1**: Reuse existing `useWishlist` hook and storage architecture across all product surfaces without creating a second wishlist system.
- [ ] **REQ-802.2**: Clicking a heart icon on any product surface (`ProductCard`, `ProductListCard`, `QuickViewModal`, and `ProductDetailsClient`) adds the product ID to the saved-items collection and toggles the icon to filled.
- [ ] **REQ-802.3**: Clicking an active filled heart removes the product from the saved-items collection and toggles the icon back to outline.
- [ ] **REQ-802.4**: All product surfaces share the exact same canonical product ID (`product.id`) and reflect state changes immediately without page refresh.

### 3. Persistent Storage Resilience (REQ-C)
- [ ] **REQ-803.1**: Saved products collection persists reliably in `localStorage` under `const WISHLIST_STORAGE_KEY = "irish_grocer_wishlist"`.
- [ ] **REQ-803.2**: Saved products survive route navigation, page refreshes, and browser restarts.
- [ ] **REQ-803.3**: Changes synchronize reactively across open browser tabs via `storage` event listener and custom `wishlist-updated` dispatch.
- [ ] **REQ-803.4**: Malformed, empty, or non-array localStorage data is safely handled, falling back gracefully to `[]`.
- [ ] **REQ-803.5**: Duplicate product entries are strictly prevented via Set deduplication.

### 4. Dedicated Favourites Destination & Empty State (REQ-D)
- [ ] **REQ-804.1**: Create dedicated `/favorites` route (`src/app/favorites/page.tsx` & `FavoritesClientView.tsx`).
- [ ] **REQ-804.2**: Favourites page header displays `My Favourites` (Playfair Display), `Your saved Irish groceries, all in one place.`, saved item count, and standard sorting controls.
- [ ] **REQ-804.3**: Saved products render using the existing shared `ProductCard` in the standard responsive grid (2 columns on mobile, multi-column on desktop).
- [ ] **REQ-804.4**: Removing a product directly from the grid via its heart button removes it immediately and updates the count without full-page re-render.
- [ ] **REQ-804.5**: When 0 products are saved, display a polished empty state: `No favourites yet`, description `Save the products you love by tapping the heart icon. They'll appear here for easy shopping.`, tasteful heart illustration, and a `Discover Products` CTA button linking to `/shop`.
- [ ] **REQ-804.6**: Safe hydration avoids server/client mismatch, count flashing, or crashes when saved product IDs no longer exist in the catalogue.

### 5. Live Badge Synchronization & Cart Independence (REQ-E & REQ-F)
- [ ] **REQ-805.1**: Bottom navigation heart badge updates instantly on heart toggle, item removal, or cross-tab synchronization.
- [ ] **REQ-805.2**: Full cart independence: favouriting a product does NOT add it to the cart, and removing a favourite does NOT remove it from the cart. Existing cart quantity, checkout, and wholesale pricing gates remain intact.

### 6. Automated Quality Gates & Gravitas Verification (QA)
- [ ] **REQ-806.1**: Dedicated automated test suite (`tests/phase20-favorites.test.ts`) validates all 6-item bottom nav invariants, persistence, multi-surface heart toggles, Favourites page grid/empty state, and cart independence.
- [ ] **REQ-806.2**: Static toolchain passes 100% clean (`npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build` compiling `/favorites`).
- [ ] **REQ-806.3**: Gravitas multi-viewport browser testing across 10 viewports (360px–1920px) confirms 0 console errors, 0 uncaught exceptions, 0 horizontal overflow (`scrollWidth <= innerWidth`), and $\ge 95\%$ baseline visual similarity.

---

## Out of Scope

| Feature | Reason |
| :--- | :--- |
| Server-side database / live Shopify Customer Metafield sync | Preserves responsive, zero-latency standalone demo mode (`NEXT_PUBLIC_COMMERCE_MODE=demo`). |
| Multiple named wishlists / boards | Single unified Favourites collection matches authentic grocery shop flow. |
| Public wishlist sharing URLs / social export | Minimizes external dependencies and keeps scope focused on core shopper utility. |
| Alterations to existing desktop navigation header geometry | Desktop header remains locked to approved visual baselines. |

---

## Traceability

All 17 detailed requirements map directly to **Phase 20**:

| Requirement | Phase | Status |
| :--- | :---: | :---: |
| **REQ-801.1 – REQ-801.4** (6-Item Bottom Navigation) | Phase 20 | Pending Approval |
| **REQ-802.1 – REQ-802.4** (Multi-Surface Heart Sync) | Phase 20 | Pending Approval |
| **REQ-803.1 – REQ-803.5** (Persistent Storage Resilience) | Phase 20 | Pending Approval |
| **REQ-804.1 – REQ-804.6** (Dedicated /favorites Route & Empty State) | Phase 20 | Pending Approval |
| **REQ-805.1 – REQ-805.2** (Live Badge Sync & Cart Independence) | Phase 20 | Pending Approval |
| **REQ-806.1 – REQ-806.3** (Automated Tests & Gravitas Verification) | Phase 20 | Pending Approval |

**Coverage:** 100% mapped to Phase 20.
