# Plan 21-01 Summary: Desktop Header Favourites Action & Live Badge Integration
**Phase:** 21
**Plan:** 01
**Status:** Completed

## Implementation Details
1. **`src/components/layout/Header.tsx`:**
   - Imported `Heart` from `lucide-react` and `useWishlist` from `@/hooks/useWishlist`.
   - Connected wishlist state via `const { wishlistCount, isLoaded } = useWishlist();`.
   - Connected active route detection: `const isFavoritesActive = pathname === "/favorites";`.
   - Inserted dedicated Favourites `<Link>` inside the desktop action controls row (`hidden lg:grid`) between Account and Cart:
     - Exact order: 1. Logo $\rightarrow$ 2. Search $\rightarrow$ 3. Quincy Store $\rightarrow$ 4. Sign in / Account $\rightarrow$ 5. Favourites $\rightarrow$ 6. Cart.
     - Outlined Forest Green `Heart` (`#14532D`) when idle; filled `#14532D` with active tint background (`bg-[#14532D]/10 font-bold`) when on `/favorites`.
     - Live badge: rendered top-right on heart icon (`-top-1.5 -right-2`) with Emerald background (`#22C55E`), Forest Green text (`#14532D`), 10px bold font, and white border matching Cart badge. Rendered only when `isLoaded && wishlistCount > 0`.
     - Responsive label `<span className="hidden xl:inline">Favourites</span>` matching `Quincy Store`'s convention, preserving tight-breakpoint spacing on 1024px while displaying both icon and label on xl+ (1280px+).
     - Link target: `/favorites` (`href="/favorites"`).
     - Accessibility: `aria-current={isFavoritesActive ? "page" : undefined}`, `aria-label={\`Favourites, ${wishlistCount} saved products\`}`, and `title="Favourites"`.
   - **Strict Mobile Freeze:** Zero modifications made to `lg:hidden` mobile header block. `MobileBottomNav.tsx` remains completely untouched.

## Verification
- `npx tsc --noEmit`: 0 errors.
- `npm run lint`: 0 errors, 0 warnings.

