# Theme Update Specification — Irish Grocer Premium Light Theme

## 1. Executive Summary
This document specifies the transformation of **The Irish Grocer** headless ecommerce storefront from its original dark/spotlight aesthetic into the **Premium Light Theme**.

The update introduces an editorial, warm Irish countryside atmosphere characterized by natural light backgrounds, cream card surfaces, rich forest green branding, and fresh green accents, while strictly maintaining all existing Next.js App Router structures, Shopify API integrations, authentication logic, and responsive routes.

---

## 2. Design System Tokens (New Theme)

### 2.1 Color Palette
| Token Name | Hex Code | Visual Role | Application |
| :--- | :--- | :--- | :--- |
| **Primary** | `#14532D` | Rich Forest Green | Header announcement bar, primary CTAs, brand identity, navigation titles |
| **Accent** | `#22C55E` | Vibrant Fresh Green | Active navigation indicators, stock badges, highlights, secondary focus states |
| **Surface** | `#E8F5E9` | Pale Fresh Tint | Banner backdrops, subtle card highlights, input focus rings, tag pills |
| **Background**| `#FAF9F5` | Warm Light Ivory | Primary global page background, container surfaces |
| **Card** | `#F3EAD6` | Warm Farmhouse Cream | Product cards, group buying cards, provisions panels, dropdown surfaces |
| **Text** | `#1F2937` | Charcoal Slate | High-contrast body typography, titles, form labels |
| **Text Muted**| `#4B5563` | Slate Grey | Subtitles, descriptions, SKUs, vendor names |
| **Border** | `#E5E0D5` | Warm Neutral Border | Subtle card outlines, table borders, dividers |

### 2.2 Typography Hierarchy
- **Editorial Headings**: `Playfair Display`, serif (Weights: 600, 700, 800).
  - Used for: Hero headline (*"Taste of Home: Traditional Pantry & Farmhouse Essentials"*), section titles, promotional banners, modal headers.
- **Body & Commerce**: `Inter`, sans-serif (Weights: 400, 500, 600, 700).
  - Used for: Navigation links, body copy, product cards, pricing, buttons, filters, form fields, checkout tables.

---

## 3. Component Transformation Plan

### 3.1 Header & Navigation (`src/components/layout/`)
- **AnnouncementBar.tsx**:
  - Background updated to `#14532D` (Primary forest).
  - Content: Free in-store pickup in Quincy, MA | (857) 387-2065 | Open 365 days a year | Store locator | Contact.
- **Header.tsx**:
  - Background updated to `#FAF9F5` (Warm Ivory) with subtle border `#E5E0D5`.
  - Added Product Aisle dropdown selector in search bar.
  - Cart counter badge styled with `#22C55E` / `#14532D`.
- **Navigation Row**:
  - Horizontal aisle navigation for the 9 core departments:
    - *All Products*, *Christmas Treats*, *Tea & Coffee*, *Crisps & Snacks*, *Chocolates & Sweets*, *Bread & Bakery*, *Meats & Refrigerated*, *Sauces & Merchandise*, *Exclusive Finds*.
  - Active category highlighted with `#22C55E` accent underline/pill.

### 3.2 Homepage Sections (`src/components/home/`)
- **HeroSection.tsx**:
  - Redesigned into the editorial split layout featuring:
    - Scenic Irish countryside visual composition with warm vignette blending.
    - Headline: *"Taste of Home: Traditional Pantry & Farmhouse Essentials"*.
    - Copy: *"From crusty Irish soda bread and artisanal preserves to iconic Barry's gold tea, Tayto cheese & onion crisps, and traditional breakfast pudding — delivered straight from Dublin and Cork to New England weekly."*
    - Actions: `Explore Fresh Imports →` (Primary `#14532D`), `Shop All Aisles` (Secondary).
    - 3 Trust Benefits: *Direct Cork & Dublin Imports*, *2-Hour Quincy Pickup*, *Cold-Chain Guaranteed*.
  - Adjacent **Featured Provisions Panel** (*"This Week's Fresh Provisions"*):
    - Live list of 4 core Irish essentials: Artisan Soda Bread, Barry's Gold Blend, Tayto Crisps Caddy, Irish Pork Banger 6pk.
    - Badges: *"Guaranteed Authentic • Quincy, MA"*.
- **ChristmasSection.tsx** (Group Buying):
  - Container updated to `#FAF9F5` with `#F3EAD6` cards.
  - 4 bundle cards restyled with green accents and clean layout.
- **FamiliarBrandsSection.tsx**:
  - Restyled with `#F3EAD6` card surfaces and clean product presentation.
- **DepartmentGridSection.tsx**:
  - 15 category cards updated with warm cream overlays and `#14532D` hover states.
- **Product Showcases** (`CrispsSection.tsx`, `NewArrivalsSection.tsx`):
  - Updated with the new light product card design.
- **StoreInfoSection.tsx**:
  - Styled with `#14532D` or `#E8F5E9` surface, highlighting Quincy store hours and address.
- **OrderConfidenceSection.tsx**:
  - Warm cream container `#FAF9F5` with border `#E5E0D5` and green accent badges.

### 3.3 Product Presentation (`src/components/products/`)
- **ProductCard.tsx**:
  - Replaced dark spotlight box with light, elegant `#FAF9F5` / `#F3EAD6` card surface.
  - Crisp product photography with natural hover zoom.
  - Fresh green `#22C55E` stock indicator dot.
  - Pricing in bold `#14532D`.
  - Buttons styled in primary `#14532D` with `#22C55E` accents.
- **ProductDetailsClient.tsx**:
  - Clean light gallery with Playfair Display editorial title.
  - Refined variant buttons and price display.

### 3.4 Catalog, Cart, Account, and Search
- **Shop / Collections**: Warm sidebar filters, `#F3EAD6` card grids, and pagination.
- **Cart & Drawer**: Light cream surfaces, clean lines, clear subtotal typography.
- **Customer Account / Sign-in**: Refined light layout matching the authentic Shopify Shop Pay experience.
- **Footer**: Warm `#FAF9F5` background, `#14532D` brand identity, store details, and newsletter signup.

---

## 4. Execution & Validation Rules
- All code changes remain strictly **local** in `website/`.
- No git commits, no git pushes, no Vercel deployments.
- Verify `npm run typecheck` and `npm run build` succeed with 0 errors.

