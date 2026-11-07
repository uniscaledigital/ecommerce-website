# Plan 20-03 Summary: Dedicated /favorites Route & Farmhouse Empty State
**Phase:** 20
**Plan:** 03
**Status:** Completed

## Implementation Details
1. **`src/app/favorites/page.tsx`:**
   - Authored App Router server component with comprehensive SEO metadata (`title: "My Favourites — The Irish Grocer"`, description).
   - Renders `<FavoritesClientView />`.
2. **`src/app/favorites/FavoritesClientView.tsx`:**
   - Filtered saved items directly from canonical catalogue via `PRODUCTS.filter(p => wishlist.includes(p.id))` reactively bound to `useWishlist`.
   - Hydration safety: protected via `isMounted` and `isLoaded` skeleton loader to prevent flash of empty state on initial render.
   - Header with Playfair Display heading, subtitle, dynamic count badge (`{n} items saved`), sort dropdown (`alpha-asc`, `alpha-desc`, `price-asc`, `price-desc`, `rating`, `featured`), and `Clear All` button.
   - Farmhouse empty state (`savedProducts.length === 0`): Warm Cream card (`#FFFAF1`, border `#E8DFCF`) with mint heart badge (`#EDF8E9`), Playfair heading "No favourites yet", guidance description, and primary CTA "Discover Products" navigating to `/shop`.
   - Responsive product grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` matching Shop page standards, rendering `ProductCard` with interactive `QuickViewModal` support. Direct heart clicks remove items and update grid and navigation badge immediately.
   - Batch CTA banner ("Add All to Basket"):
     - Authenticated trade accounts: iterates through all in-stock saved items via `addItem(product)` and opens CartDrawer via `openCart()`.
     - Unauthenticated visitors: renders wholesale login gate prompt ("Log in to add saved items to basket") linking to `/account/login?redirect=/favorites`.
   - Cart independence: strict separation guaranteed; saving/removing favourites never mutates cart state.

## Verification
- `npx tsc --noEmit`: 0 errors.
- `npm run lint`: 0 errors, 0 warnings.

