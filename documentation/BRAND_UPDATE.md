# The Irish Grocer — Global Brand Update Documentation
## Animated SVG Logo Replacement & Warm Cream Background (#FDF4E3)

**Date**: November 2026  
**Implementation**: Senior Frontend Engineer & Design Systems Architect  
**Scope**: Entire existing Irish Grocer Next.js ecommerce web application  

---

### 1. New Brand Logo Asset
- **Source**: `C:\Users\kumar\Downloads\irishweb\irish-grocer-animated.svg` (preserved root file untouched).
- **Public Website Path**: `/assets/logo/irish-grocer-animated.svg` (`website/public/assets/logo/irish-grocer-animated.svg`).
- **File Validation**:
  - **ViewBox**: `0 0 366 212` (natural aspect ratio: `366 / 212` ≈ `1.726 : 1`).
  - **Color Palette**: `#FDF4E3` (solid warm ivory background rectangle), `#0D4927` (official dark green vector-outlined Irish Grocer wordmark), `#1E7B45`, `#298944`, `#3EA24C`, `#4A9D63`, `#5BB167`, `#6EBC47`, `#87C462` (clover leaves & smiling heart leaf), `#14502C` (eyes & mouth), `#D9A68B` (smiling blush cheeks), `#E4E5D2` (animated shadow).
  - **Animation**: Native vector SMIL animations (`<animateTransform>` & `<animate>`) providing a gentle bouncing clover, rotating shamrock leaves, smiling heart-face leaf, and synchronized pulsing shadow.
  - **Rendering Rule**: Self-contained animated clover and full wordmark; rendered with `unoptimized` across all desktop and mobile views to preserve SMIL vector animations without optimizer interference.

---

### 2. Previous Logos Replaced
All instances of old Irish Grocer website logos have been replaced across the codebase:
- `/assets/logo/irish-grocer-seal.svg` replaced everywhere.
- `/assets/logo/the-irish-grocer-logo.png` references confirmed removed.
- Third-party brand logos and genuine product packaging (Tayto, Barry's Tea, Cadbury Dairy Milk, Hula Hoops, etc.) are strictly preserved intact.

---

### 3. Components & Pages Updated
1. **Desktop & Sticky Navigation Header** ([`Header.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/layout/Header.tsx)):
   - Replaced seal logo with `/assets/logo/irish-grocer-animated.svg` using responsive width `w-36 sm:w-44 lg:w-48` and height `h-10 sm:h-11 lg:h-12`.
   - Adapted iOS glassmorphism navbar (`.ios-glass-nav`) with warm cream undertones (`rgba(253, 248, 238, 0.90)`) to seamlessly match the `#FDF4E3` canvas.
2. **Mobile Slide-Out Navigation Drawer** ([`MobileDrawer.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/layout/MobileDrawer.tsx)):
   - Updated header branding to use `/assets/logo/irish-grocer-animated.svg` (`w-36 h-10`).
   - Drawer container updated to `--brand-surface` (`#FFFAF1`) with `--brand-border` (`#E8DFCF`).
3. **Global Website Footer** ([`Footer.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/layout/Footer.tsx)):
   - Brand logo updated to `/assets/logo/irish-grocer-animated.svg`.
   - Upper footer styled in `#FDF4E3` with `#E8DFCF` border.
   - Farmhouse club newsletter and motto banner aligned with `--brand-soft-cream` (`#F7EBD8`).
4. **Customer Login Page** ([`src/app/account/login/page.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/account/login/page.tsx)):
   - Centered login emblem updated to `/assets/logo/irish-grocer-animated.svg` (`w-56 h-16`).
   - Card background refreshed to clean white (`#FFFFFF`) with `#E8DFCF` borders.
5. **Customer Account Portal** ([`src/app/account/page.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/account/page.tsx)):
   - Customer profile and order history cards transitioned to `--brand-surface` (`#FFFAF1`).
6. **Homepage Sections**:
   - **Hero Section** ([`HeroSection.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/HeroSection.tsx)): Preserves the original `/assets/banners/irish-grocer-hero-background.png` grocery photograph, blending seamlessly via radial/linear gradient into `#FDF4E3`.
   - **Category Carousel** ([`CategoryCarousel.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/CategoryCarousel.tsx)): Edge gradient masks updated to `#FDF4E3`.
   - **Category Cards** ([`CategoryCard.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/CategoryCard.tsx)): Clean white card bodies with `#E8DFCF` borders.
   - **Product Cards** ([`ProductCard.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/products/ProductCard.tsx)): Clean white surfaces for sharp contrast against `#FDF4E3`.
   - **Familiar Brands Section** ([`FamiliarBrandsSection.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/FamiliarBrandsSection.tsx)): Brand showcase cards updated to `#FFFAF1` with white footers.
   - **Store Info Section** ([`StoreInfoSection.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/StoreInfoSection.tsx)): Store details card updated to `#FFFAF1` within `#E8F5E9` container.
   - **Easy Gifting Section** ([`GiftingSection.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/GiftingSection.tsx)): Card surface updated to `--brand-soft-cream` (`#F7EBD8`).
   - **Exclusive Finds Section** ([`ExclusiveFindsSection.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/ExclusiveFindsSection.tsx)): Surface updated to `#FFFAF1` with `#F7EBD8` phone callout card.
   - **Order with Confidence Section** ([`OrderConfidenceSection.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/home/OrderConfidenceSection.tsx)): Background transitioned to `#FFFAF1`.
7. **Shop Catalog & Filter View** ([`ShopClientView.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/shop/ShopClientView.tsx)):
   - Filter sidebar, sort control bar, and pagination controls harmonized to `#FFFAF1` and `#E8DFCF`.
8. **Product Details View** ([`ProductDetailsClient.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/products/[handle]/ProductDetailsClient.tsx)):
   - Spotlight showcase and pricing/inventory controls styled with `#FFFAF1` and `#E8DFCF`.
9. **Cart & Order Enquiry Drawers/Modals** ([`CartDrawer.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/cart/CartDrawer.tsx), [`OrderEnquiryModal.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/enquiry/OrderEnquiryModal.tsx), [`QuickViewModal.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/components/products/QuickViewModal.tsx)):
   - All drawers and modal bodies updated to `#FFFAF1` with `#E8DFCF` borders.

---

### 4. New Global Website Background & Design Tokens
Solid background color sampled directly from the new logo artwork:
- **HEX**: `#FDF4E3`
- **RGB**: `253, 244, 227`

#### Centralized CSS Variables ([`globals.css`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/globals.css))
```css
:root {
  --brand-background: #FDF4E3;
  --brand-surface: #FFFAF1;
  --brand-card: #FFFFFF;
  --brand-soft-green: #E8F5E9;
  --brand-soft-cream: #F7EBD8;
  --brand-border: #E8DFCF;
  --brand-primary: #14532D;
  --brand-dark: #064E3B;
  --brand-accent: #22C55E;
  --brand-text: #1F2937;
  --brand-muted: #64748B;
}

body {
  color: #1F2937;
  background-color: #FDF4E3;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

#### Tailwind Configuration ([`tailwind.config.ts`](file:///C:/Users/kumar/Downloads/irishweb/website/tailwind.config.ts))
Added first-class `brand.*` utility mappings and aligned legacy semantic tokens (`surface`, `irish`, `ivory`, `spotlight`) to the new warm ivory palette.

---

### 5. Favicon & Metadata
- **Browser Favicon** ([`public/favicon.svg`](file:///C:/Users/kumar/Downloads/irishweb/website/public/favicon.svg)) & **App Icon** ([`src/app/icon.svg`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/icon.svg)):
  - Centered square emblem derived directly from the artwork of `irish-grocer-animated.svg`.
  - Displays the animated clover with smiling heart face, bouncing animation, and `#FDF4E3` squircle backdrop.
- **Viewport Theme**: Updated `themeColor` in [`layout.tsx`](file:///C:/Users/kumar/Downloads/irishweb/website/src/app/layout.tsx) to `#FDF4E3`.

---

### 6. Verification & Quality Checklist
1. **TypeScript Typecheck**: `npm run typecheck` passed with 0 errors.
2. **Production Build**: `npm run build` compiled all 32 static/SSG/dynamic routes successfully.
3. **Local Server**: Running actively on `http://localhost:3000`.
4. **Git Status**: 0 commits staged, 0 commits pushed, all changes kept strictly local to `website/`.
5. **Third-Party Branding**: 100% preserved (Tayto, Barry's Tea, Cadbury, Kerrygold, etc.).

