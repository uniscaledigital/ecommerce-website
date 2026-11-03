# The Irish Grocer — Global Product Card Redesign Documentation

## Executive Summary
This document outlines the global redesign of product cards across the Irish Grocer ecommerce website. The design directly implements the reference visual specification featuring soft mint-green cards, rounded 24px outer corners, pale-green image spotlight areas, subtle Irish shamrock watermarks, floating wishlist buttons, and pill-shaped login-to-view-prices buttons.

---

## 1. Centralized Component Architecture
All product displays throughout the application are powered by a centralized, reusable component library located in `src/components/products/`:

| Component | Path | Purpose |
|---|---|---|
| `ProductCard` | `src/components/products/ProductCard.tsx` | Main reusable product card with support for `standard`, `compact`, and `featured` variants |
| `ProductImage` | `src/components/products/ProductImage.tsx` | Upper image container with `#DDF1D5` background, faint shamrock watermark, and floating wishlist button |
| `ProductGrid` | `src/components/products/ProductGrid.tsx` | Responsive 4/3/2 column product grid with unified spacing and empty state |
| `ProductCardSkeleton` | `src/components/products/ProductCardSkeleton.tsx` | Loading skeleton matching the exact 24px rounded mint geometry |
| `QuickViewModal` | `src/components/products/QuickViewModal.tsx` | Quick view modal harmonized with the mint-green and forest-green design system |
| `useWishlist` | `src/hooks/useWishlist.ts` | Reactive wishlist hook with persistent `localStorage` synchronization |

---

## 2. Design Tokens & Colour Palette
The new card design adheres to the following CSS tokens defined in `src/app/globals.css` and extended in `tailwind.config.ts`:

```css
:root {
  --product-card-bg: #EDF8E9;
  --product-image-bg: #DDF1D5;
  --product-content-bg: #EDF8E9;
  --product-border: #D0E7C9;

  --product-text: #14532D;
  --product-muted: #42634A;
  --product-accent: #22C55E;
  --product-stock: #22C55E;

  --product-button-border: #62A86A;
  --product-button-bg: transparent;

  --product-shadow: 0 6px 18px rgba(20, 83, 45, 0.09);
}
```

---

## 3. Card Anatomy & Visual Hierarchy

### A. Outer Card Container
- **Corner Radius**: `rounded-[24px]` (24px continuous border radius)
- **Border**: 1px solid `#D0E7C9`
- **Background**: Soft Mint `#EDF8E9`
- **Shadow**: `0 6px 18px rgba(20, 83, 45, 0.09)`
- **Hover Micro-interaction**: Subtle `-translate-y-1` elevation with `0 12px 24px rgba(20, 83, 45, 0.13)` shadow over 200ms

### B. Product Image Section (~58–62% Height)
- **Background**: Pale Mint Green `#DDF1D5`
- **Corners**: Upper corners rounded `rounded-t-[23px]`
- **Watermark**: Faint SVG shamrock leaf motif positioned in the bottom-left corner with 14% opacity
- **Image Fitting**: `object-contain` with internal padding (`p-4 sm:p-5`) to preserve original packaging aspect ratio and packaging authenticity
- **Floating Wishlist Button**:
  - Located in top-right corner (`top-3.5 right-3.5`)
  - White circular button (`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white`)
  - Border `#D0E7C9` and soft shadow
  - Green outline heart (`text-[#14532D]`), fills to vibrant green (`fill-[#22C55E]`) when active
  - Fully keyboard accessible and connected to `localStorage`

### C. Lower Product Content Section
- **Background**: `#EDF8E9` with responsive internal padding (`p-4 sm:p-5`)
- **Brand Name**: Uppercase `text-[11px] sm:text-xs font-semibold text-[#42634A] tracking-wider mb-1`
- **Product Title**: Dark forest green `#14532D`, `text-sm sm:text-[17px] font-bold font-sans line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem]` to ensure identical row heights
- **Ratings**: Renders green star `★` (`#22C55E`), numerical rating, and review count when rating data exists
- **Stock Indicator**: Dynamic availability indicator with `#22C55E` dot for in-stock and red dot for out-of-stock items
- **Action Button**:
  - **Logged-out**: Pill-shaped `rounded-full`, thin green border `#62A86A`, translucent white background, dark green text `#14532D`, "Log in to view prices" linking to `/account/login`
  - **Logged-in**: Real formatted price, variant indicator, and pill-shaped "Add to Cart" button with "Added!" checkmark state

---

## 4. Codebase-Wide Surface Audit & Updates

| Surface / Page | Route | Component Used | Status |
|---|---|---|---|
| Homepage — Crisps & Savory Snacks | `/` | `CrispsSection` → `ProductGrid` → `ProductCard` | Updated & Verified |
| Homepage — Fresh New Arrivals | `/` | `NewArrivalsSection` → `ProductGrid` → `ProductCard` | Updated & Verified |
| Homepage — Pantry Staples | `/` | `FamiliarBrandsSection` | Harmonized to mint-green tokens |
| All Products Catalog | `/shop` | `ShopClientView` → `ProductGrid` → `ProductCard` | Updated & Verified |
| Collection Pages | `/collections/[handle]` | `ShopClientView` → `ProductGrid` → `ProductCard` | Updated & Verified |
| Search Results Grids | `/search` | `SearchClientView` → `ProductGrid` → `ProductCard` | Updated & Verified |
| PDP Related Favourites | `/products/[handle]` | `ProductDetailsClient` → `ProductGrid` → `ProductCard` | Updated & Verified |
| Quick View Modal | Any Product Card | `QuickViewModal` | Updated & Verified |

---

## 5. Responsive Behavior

| Breakpoint | Window Width | Grid Columns | Gap | Card Experience |
|---|---|---|---|---|
| **Large Desktop** | 1440px+ | 4 columns | 24px (`lg:gap-6`) | Full spacious presentation |
| **Desktop / Laptop** | 1024px – 1366px | 3–4 columns | 20px (`sm:gap-5`) | Balanced 3/4 column layout |
| **Tablet** | 768px – 1023px | 2–3 columns | 16px (`sm:gap-4`) | Clean readable touch targets |
| **Mobile** | 375px – 430px | 2 columns | 14px (`gap-3.5`) | Compact pill buttons, 2-column grid |

---

## 6. Verification Results
1. **TypeScript Checks**: `tsc --noEmit` passed with 0 errors.
2. **Production Build**: `next build` compiled all 32 static and dynamic routes successfully with 0 errors.
3. **Local Dev Server**: Tested on `http://localhost:3000` with HTTP 200 responses across all routes.
4. **Visual Snapshots**: Headless Chrome rendered and verified across 1440px, 1024px, 768px, and 390px viewports.

