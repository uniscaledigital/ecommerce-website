# Phase 20 Plan: Favourites Navigation & Persistent Saved Products

**Project:** The Irish Grocer  
**Milestone:** v8.0 — Favourites & Saved Products Experience  
**Phase:** Phase 20 (Single Implementation Phase for Milestone v8.0)  
**Status:** Planned & Awaiting Approval (Planning Mode Only — Zero Application Code Modified)  
**Frameworks:** GSD Primary + CodeRabbit Review + Gravitas Visual & Behavioral QA  
**Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo`  

---

## 1. Executive Summary & Architecture Context

Milestone v8.0 introduces a comprehensive, reliable, and beautifully integrated Favourites experience across The Irish Grocer website within **one single cohesive implementation phase: Phase 20**.

The core architecture reuses and extends the existing `useWishlist` hook and its established `localStorage` key (`irish_grocer_wishlist`), strictly avoiding any competing secondary wishlist state. When a shopper clicks the heart icon on any product surface across the website (grid cards, list cards, Quick View modals, spotlight carousels, or product detail pages), the canonical product identifier (`product.id`) is immediately stored and reactively broadcast to all application components.

On mobile, the fixed bottom navigation is expanded from five to **six equal-width destinations** in strict order:
1. `Home`
2. `Shop`
3. `Search`
4. `Favourites` (new Heart icon with live dynamic badge and active highlight)
5. `Cart` (with dynamic item badge)
6. `Patrick` / `Account`

On the storefront, a new dedicated `/favorites` destination page provides full product curation using the existing shared `ProductCard`, standard sorting controls, immediate heart removal, and an authentic farmhouse empty state when no items are saved.

---

## 2. Baseline Architecture Audit

An inspection of the current codebase reveals the exact touchpoints to reuse and extend:

1. **Existing Storage Engine (`src/hooks/useWishlist.ts`):**
   - Uses `const WISHLIST_STORAGE_KEY = "irish_grocer_wishlist"`.
   - Stores an array of product IDs (`string[]`).
   - Already provides cross-tab `storage` event listening and custom `wishlist-updated` dispatching.
   - *Enhancement required:* Add defensive deduplication via `Set`, robust fallback for malformed or non-array localStorage data, `clearWishlist()` method, and `wishlistCount` property.
2. **Existing Bottom Navigation (`src/components/layout/MobileBottomNav.tsx`):**
   - Currently renders a 5-column grid (`grid-cols-5 h-16`).
   - *Enhancement required:* Transition to a 6-column grid (`grid-cols-6 h-16 px-0.5 sm:px-1`) placing `Favourites` between `Search` and `Cart`. Sizing calculations confirm equal column widths of 59.3px (360px), 64.3px (390px), and 71.0px (430px), satisfying the $\ge 44\times 44\text{px}$ touch target requirement.
3. **Product Card Heart (`src/components/products/ProductImage.tsx`):**
   - Renders floating heart button in top-right corner.
   - Already wired to `useWishlist` via `toggleWishlist(product.id)`.
   - Utilized by `ProductCard.tsx` and all grid instances throughout the site.
4. **Product Surfaces Missing Wishlist Controls:**
   - `ProductListCard.tsx` (list view in `/shop`): Missing heart button.
   - `QuickViewModal.tsx` (quick view dialog): Missing heart button.
   - `ProductDetailsClient.tsx` (PDP): Missing heart button.
5. **Favourites Route:**
   - Currently, `/favorites` does not exist in `src/app/`. Needs creation as a first-class route.

---

## 3. Detailed Implementation Tasks

### Task 1: Audit & Harden `useWishlist` Storage Engine (REQ-802.1, REQ-803.1–803.5)
- **Target File:** `website/src/hooks/useWishlist.ts`
- **Actions:**
  1. Preserve `const WISHLIST_STORAGE_KEY = "irish_grocer_wishlist"`.
  2. Implement defensive JSON parsing: if `localStorage` contains malformed JSON or a non-array value, catch safely and fall back to `[]`.
  3. Ensure deduplication: wrap all incoming and loaded arrays in `Array.from(new Set(arr.filter(id => typeof id === "string" && id.trim())))`.
  4. Expose `wishlistCount: wishlist.length`.
  5. Add `clearWishlist: () => void` that resets state to `[]`, clears `localStorage.removeItem(WISHLIST_STORAGE_KEY)` (or sets `"[]"`), and dispatches `new Event("wishlist-updated")`.
  6. Maintain the dual-listener model (`wishlist-updated` for same-tab updates, `storage` for cross-tab synchronization).

### Task 2: Update Mobile Bottom Navigation to 6 Destinations (REQ-801.1–801.4, REQ-805.1)
- **Target File:** `website/src/components/layout/MobileBottomNav.tsx`
- **Actions:**
  1. Import `Heart` from `lucide-react` and `useWishlist` from `@/hooks/useWishlist`.
  2. Track active route: `const isFavoritesActive = pathname === "/favorites"`.
  3. Change wrapper layout from `grid-cols-5` to `grid-cols-6 h-16 items-center px-0.5 sm:px-1`.
  4. Render 6 destinations in exact order:
     - **1. Home:** Link to `/`, `Home` icon, label `Home`.
     - **2. Shop:** Link to `/shop`, `Store` icon, label `Shop`.
     - **3. Search:** Link to `/search`, `Search` icon, label `Search`.
     - **4. Favourites:** Link to `/favorites`:
       - Inactive: `<Heart className="w-5 h-5 text-current" />`.
       - Active: `<Heart className="w-5 h-5 text-[#14532D] fill-[#14532D]" />`.
       - Label: `Favourites` (`text-[9px] xs:text-[10px] mt-0.5 tracking-tight truncate max-w-full text-center leading-none`).
       - Active highlight: `bg-[#14532D]/10 text-[#14532D] font-bold` when `isFavoritesActive`.
       - Live badge: when `wishlist.length > 0`, render `<span className="absolute -top-1 -right-1 bg-[#22C55E] text-[#14532D] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">{wishlist.length}</span>`.
     - **5. Cart:** Button calling `openCart`, `ShoppingBag` icon, label `Cart`, dynamic badge.
     - **6. Patrick / Account:** Link to `/account`, `User` icon, dynamic label `isAuthenticated ? (customer?.firstName || "Account") : "Account"`.
  5. Responsive verification: Verify each of the 6 items has `min-w-[44px] min-h-[48px]` on 360px, 390px, and 430px viewports without wrapping or clipping.

### Task 3: Unify Multi-Surface Product Heart Interactions (REQ-802.1–802.4)
- **Target Files:**
  - `website/src/components/products/ProductListCard.tsx`
  - `website/src/components/products/QuickViewModal.tsx`
  - `website/src/app/products/[handle]/ProductDetailsClient.tsx`
  - *(Confirm `ProductCard.tsx` and `ProductImage.tsx` require zero edits)*
- **Actions:**
  1. **`ProductListCard.tsx`:**
     - Import `useWishlist` and `Heart`.
     - Add top-right floating heart button on the image container matching `ProductImage.tsx` styling and `min-w-[44px] min-h-[44px]` touch target.
     - Clicking heart calls `toggleWishlist(product.id)`.
  2. **`QuickViewModal.tsx`:**
     - Import `useWishlist` and `Heart`.
     - Add floating heart button on the product image showcase container.
     - Clicking heart calls `toggleWishlist(product.id)`.
  3. **`ProductDetailsClient.tsx` (PDP):**
     - Import `useWishlist` and `Heart`.
     - In the action controls block next to Quantity Stepper and Add to Cart button, add a dedicated styled heart button:
       ```tsx
       <button
         type="button"
         onClick={() => toggleWishlist(product.id)}
         aria-label={isWishlisted(product.id) ? "Remove from Favourites" : "Save to Favourites"}
         aria-pressed={isWishlisted(product.id)}
         className={`h-11 sm:h-12 w-11 sm:w-12 min-w-[44px] min-h-[44px] rounded-full border flex items-center justify-center transition-all ${
           isWishlisted(product.id)
             ? "bg-[#DDF1D5] border-[#22C55E] text-[#14532D] shadow-xs"
             : "bg-white border-[#D0E7C9] text-[#14532D] hover:bg-[#FDF4E3] hover:border-[#62A86A]"
         }`}
       >
         <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? "fill-[#22C55E] text-[#22C55E]" : "text-[#14532D]"}`} />
       </button>
       ```

### Task 4: Author Dedicated `/favorites` Route & Empty State (REQ-804.1–804.6)
- **Target Files:**
  - `website/src/app/favorites/page.tsx` *(new)*
  - `website/src/app/favorites/FavoritesClientView.tsx` *(new)*
- **Actions:**
  1. **`src/app/favorites/page.tsx`:**
     - Server component with metadata: `title: "My Favourites — The Irish Grocer"`, `description: "Your saved authentic Irish groceries and farmhouse provisions."`.
     - Renders `<FavoritesClientView />`.
  2. **`src/app/favorites/FavoritesClientView.tsx` ("use client"):**
     - Imports `useWishlist`, `PRODUCTS`, `ProductCard`, `useCart`, `useAuth`, `formatMoney`.
     - Derives saved products: `PRODUCTS.filter(p => wishlist.includes(p.id))`.
     - Implements standard sorting state (`sortOption`): Alphabetical A-Z, Price: Low to High, Price: High to Low, Rating.
     - **Header Section:**
       - Playfair Display heading: `My Favourites`.
       - Description: `Your saved Irish groceries, all in one place.`
       - Count pill: `{savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} saved`.
       - Top controls bar: Sort dropdown + secondary `Clear All` action button (if `savedProducts.length > 0`).
     - **Product Grid:**
       - Renders responsive grid: `grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6`.
       - Uses existing `ProductCard` for every product. Clicking card heart removes it immediately, updating the grid and navigation badge in real time.
     - **Batch "Add All to Basket" Action:**
       - If `savedProducts.length > 0`:
         - When authenticated: button adds all in-stock wishlisted items to cart and calls `openCart()`.
         - When unauthenticated: displays link to `/account/login` ("Log in to add saved items to basket").
     - **Empty State (`savedProducts.length === 0`):**
       - Warm Cream card (`#FFFAF1`), border `#E8DFCF`, rounded-2xl, p-8 sm:p-12 text-center.
       - Heart illustration/icon (`Heart` with mint circle background).
       - Heading: `No favourites yet` (Playfair Display 2xl).
       - Description: `Save the products you love by tapping the heart icon. They'll appear here for easy shopping.`
       - CTA Button: `Discover Products` linking to `/shop` (Forest Green `#14532D`, min-h-[44px], rounded-full).
     - **Hydration Safety:** Uses an `isMounted` state check to avoid initial empty state flash while `localStorage` is read on client mount.

### Task 5: Live Badge Synchronization & Cart Independence (REQ-805.1–805.2)
- **Actions:**
  1. Verify badge in `MobileBottomNav.tsx` updates immediately upon:
     - Clicking heart on any product card.
     - Removing a product from `/favorites`.
     - Clearing all favourites.
     - Storage event from another browser tab.
  2. Verify cart independence:
     - Adding a favourite does NOT add it to `cart`.
     - Removing a favourite does NOT remove it from `cart`.
     - Existing cart checkout, wholesale demo orders, and quantities remain 100% unaffected.

### Task 6: Author Automated Regression Test Suite (REQ-806.1)
- **Target File:** `website/tests/phase20-favorites.test.ts` *(new)*
- **Update:** `website/package.json` test script to include `tests/phase20-favorites.test.ts`.
- **Test Scenarios Covered:**
  1. `useWishlist`: Initial load, toggle add, toggle remove, deduplication, malformed data fallback, clear wishlist, cross-tab event handling.
  2. `MobileBottomNav`: 6 destinations in exact order, Heart icon active/inactive classes, live badge count rendering, and minimum touch target contracts.
  3. `FavoritesClientView`: Matching catalogue product resolution, sorting logic, empty state copy and Discover Products link, B2B wholesale pricing gate on batch add action.
  4. Multi-surface heart wiring: Asserts `ProductListCard`, `QuickViewModal`, and `ProductDetailsClient` import and use `useWishlist(product.id)`.
  5. Cart independence: Asserts wishlist mutations have zero impact on cart state.
  6. Shared component preservation: Confirms `ProductCard.tsx` design invariants remain protected.

### Task 7: Quality Gates & Gravitas Multi-Viewport Browser Verification (REQ-806.2–806.3)
- **Automated Toolchain Execution:**
  - `npm test` $\rightarrow$ All 8 test suites pass (100% clean).
  - `npx tsc --noEmit` $\rightarrow$ 0 errors.
  - `npm run lint` $\rightarrow$ 0 warnings, 0 errors.
  - `npm run build` $\rightarrow$ Successful compilation of all 33 static/dynamic routes including `/favorites`.
- **Gravitas Headless Chrome CDP Verification:**
  - Audit across 10 viewports: 360px, 390px, 430px, 768px, 820px, 1023px, 1024px, 1280px, 1440px, 1920px.
  - Test 20 functional scenarios specified in prompt (click heart on home, fill heart, badge increment, navigate to /favorites, refresh persistence, remove item, empty state, Discover Products navigation, collection heart sync, cross-tab sync, cart independence).
  - Check horizontal overflow: `scrollWidth <= innerWidth` across all 10 viewports (0 overflow).
  - Runtime health: 0 console errors, 0 uncaught exceptions.
  - Visual baseline comparisons: Compare desktop viewports ($\ge 1024\text{px}$) against Phase 18 baselines to verify $\ge 95\%$ similarity.

---

## 4. Exact File Manifest

### Application Code (7 files to modify / create)
1. `website/src/components/layout/MobileBottomNav.tsx` — Add 4th Favourites tab with live badge & 6-column grid.
2. `website/src/hooks/useWishlist.ts` — Add deduplication, malformed data safety, `clearWishlist()`, and `wishlistCount`.
3. `website/src/components/products/ProductListCard.tsx` — Add floating heart button wired to `useWishlist`.
4. `website/src/components/products/QuickViewModal.tsx` — Add floating heart button wired to `useWishlist`.
5. `website/src/app/products/[handle]/ProductDetailsClient.tsx` — Add styled heart toggle button next to Add to Cart.
6. `website/src/app/favorites/page.tsx` *(new)* — Next.js page route with SEO metadata.
7. `website/src/app/favorites/FavoritesClientView.tsx` *(new)* — Favourites view with grid, sorting, batch CTA, and empty state.

### Test & Configuration Files (2 files)
8. `website/tests/phase20-favorites.test.ts` *(new)* — Comprehensive 20-scenario test suite.
9. `website/package.json` — Add `tests/phase20-favorites.test.ts` to `npm test` script.

---

## 5. Non-Negotiable Invariants

1. **Brand Identity:** Forest Green (`#14532D`), Warm Cream (`#FFFAF1`), Mint accents, Playfair Display serif headings, Inter body font contracts preserved.
2. **Desktop Visual Lock ($\ge 1024\text{px}$):** Zero modifications to desktop header geometry or desktop page baselines.
3. **Card Contract:** `ProductCard.tsx` design invariants remain 100% untouched.
4. **Wholesale Pricing:** Unauthenticated visitors cannot bypass price gating.
5. **Commerce Mode:** Preserved at `NEXT_PUBLIC_COMMERCE_MODE=demo`.
6. **Git Safety:** Zero commits, pushes, stashes, or branch resets during planning.

---

## 6. Acceptance Criteria Checklist & Stop Condition

- [ ] Mobile bottom navigation contains exactly 6 destinations in order: Home, Shop, Search, Favourites, Cart, Account.
- [ ] Favourites tab displays outline heart when inactive, filled Forest Green heart when active.
- [ ] Favourites tab displays live numeric badge when saved items > 0.
- [ ] 6 navigation items fit cleanly without wrapping or overflow across 360px, 390px, and 430px.
- [ ] Product hearts on grid, list, Quick View, and PDP toggle saved state reactively.
- [ ] Saved items persist reliably in `localStorage` under `irish_grocer_wishlist` across refresh and navigation.
- [ ] Changes synchronize across browser tabs.
- [ ] `/favorites` displays saved products in 2-column mobile / multi-column desktop grid.
- [ ] Removing an item updates the grid and badge immediately.
- [ ] Empty state renders with `No favourites yet` copy and `Discover Products` link to `/shop`.
- [ ] Favouriting does not affect cart; cart operations remain completely independent.
- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with 100% clean outputs.
- [ ] Gravitas CDP confirms 0 console errors and 0 horizontal overflow across all 10 viewports.

**STOP CONDITION:** After planning is approved and Phase 20 is implemented and verified, STOP and wait for review. Do NOT start Phase 21 or another milestone. Do NOT push to GitHub without explicit authorization.

