# Irish Grocer — Global Footer Redesign Documentation (Option 2: Full-Width Mint Green + Clover Glass)

## 1. Overview
The Irish Grocer global footer layout has been updated to span the **full 100% viewport width** edge-to-edge across the entire browser, eliminating outer cream margins and rounded box restrictions while keeping the inner content beautifully centered.

---

## 2. Two-Container Architecture
### A. Outer Full-Width Footer (`.site-footer`)
- **Width**: `100%` (`max-width: none; margin: 0; padding: 0;`)
- **Background Image**: `url("/assets/footer/footer-background.png")`
- **Background Size**: `cover`
- **Background Position**: `right center` (adapts to `right bottom` on tablet/mobile)
- **Background Repeat**: `no-repeat`
- **Background Color**: `#EAF7E8` (Soft mint base)
- **Border**: Top edge subtle boundary (`border-t border-[rgba(20,83,45,0.14)]`)
- **Zero Outer Margins/Gaps**: Completely covers the viewport width from the extreme left edge to the extreme right edge.

### B. Inner Content Container
- **Width**: `max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16`
- **Alignment**: Neatly centered with generous responsive padding.
- **Columns**: 4-column balanced layout:
  - **Column 1 — Brand and Store Information** (~30%): Official animated logo (`irish-grocer-animated.svg`), tagline, address, phone (`tel:8573872065`), opening hours, Lucide outline icons.
  - **Column 2 — Shop Aisles** (~20%): All 8 collection routes separated on desktop with subtle vertical border divider.
  - **Column 3 — Customer Care** (~23%): Exclusive Finds, Store Locator, Order Confidence, Pickup, and contact routes.
  - **Column 4 — Stay in Touch** (~27%): Weekly shipment newsletter description, white input field with rounded-xl corners, forest-green `Join Farmhouse Club` CTA.
  - **Translucent Clover Watermark**: Visible behind Column 4 on the right.

### C. Full-Width Bottom Copyright Strip
- **Width**: `w-full` spanning edge-to-edge.
- **Background**: `#FDF4E3` (Warm farmhouse cream) with `border-t border-[rgba(20,83,45,0.14)]`.
- **Inner Content Container**: `max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4`
  - Left: `© 2026 The Irish Grocer. Authentic Irish Provisions.`
  - Center: `“Enter as a Stranger • Leave as a Friend.”` in dark green italic serif typography.
  - Right: `Privacy Policy | Order Confidence` interactive links.

---

## 3. Global Ingestion
- Handled globally through `RootLayout` in `src/app/layout.tsx`.
- Displays edge-to-edge across all pages:
  - `/` (Homepage)
  - `/shop` (Shop All Aisles)
  - `/collections/[handle]` (All collections)
  - `/products/[handle]` (All product details)
  - `/search`
  - `/cart`
  - `/privacy`
  - `/account` and `/account/login`

---

## 4. Verification and Build
- **Dev Server**: Running on `http://localhost:3000`.
- **Production Build**: `npm run build` executed and passed with **0 errors** across all 32 static and dynamic routes.
