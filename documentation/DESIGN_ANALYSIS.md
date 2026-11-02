# Design Analysis — The Irish Grocer

## 1. Executive Summary
This document provides the foundational design analysis for the complete ecommerce reconstruction of **The Irish Grocer** storefront. The reconstruction is based on the authoritative source files:
- `Untitled.fig` (Figma archive with 95 embedded production assets, Kiwi scenegraph, vector frames, and component variants)
- `Untitled.pdf` (32-page specification document detailing Desktop, Tablet, and Mobile layouts, Design System tokens, and responsive behaviours)

The Irish Grocer is a specialized Irish and UK grocery merchant situated at 132 East Howard Street, Quincy, MA 02169 (+1 857-387-2065), serving both local and national shoppers seeking beloved Irish brands (Tayto, Barry's Tea, Cadbury, Ballygowan, Abbey Farm, Adam's Village, Butcher's Fancy).

---

## 2. Source Inspection Breakdown

### 2.1 PDF Page Reference Analysis
| Pages | Dimensions | Layout / Content Description | Responsive Role |
| :--- | :--- | :--- | :--- |
| **Pages 1–3** | 1440x5578, 768x7305, 390x7955 | Full Homepage Raster Renders | Desktop, Tablet, Mobile visual master references |
| **Pages 4–5** | 1440x1000, 390x1000 | Product Listing Screen (Crisps & Snacks) | 4-col Desktop grid, 2-col Mobile grid with quick-view |
| **Pages 6–7** | 1440x1000, 390x1000 | Product Detail Page (Tayto Cheese & Onion 35g) | Desktop 2-col layout, Mobile stacked PDP |
| **Pages 8–9** | 1440x1000, 390x1000 | Shopify Customer Account Sign-In | Official Shop Pay authentication & email OTP flow |
| **Pages 10–12** | 1440x5568, 768x7292, 390x7945 | Full Homepage Vector & Text Layouts | Source for all copy, bounding boxes, and image placements |
| **Page 13** | 1560x3464 | Design System & Reusable Components | Master design tokens, typography, colors, controls |
| **Pages 14–16** | 1440x3454, 768x7160, 390x5521 | Main Product Catalog ("Shop") | 717 products, filter sidebar, sorting, pagination |
| **Page 17** | 1440x810 | Christmas & Bundle Promotional Banner | Standalone hero promotional visual |
| **Pages 18–20** | 1440x3393, 768x7160, 390x5561 | Crisps & Snacks Collection View | Category view with 91 products and stock filter |
| **Pages 21–23** | 1440x2962, 768x6100, 390x4750 | Skeleton / Loading states | Wireframe layout for loading skeletons |
| **Pages 24–26** | 1440x2656, 768x4065, 390x3588 | Search Results Experience ("tea" query) | Tabs (Products, Collections, Blog, Pages), grid |
| **Pages 27–29** | 1440x4548, 768x8200, 390x7600 | Wireframe responsive grids | Secondary page structure benchmarks |
| **Pages 30–32** | 1440x1368, 768x1700, 390x1850 | Checkout & Order review wireframes | Enquiry flow and checkout container benchmarks |

---

## 3. Design System & Tokens (Page 13 Authority)

### 3.1 Color Palette
The Irish Grocer design system employs a heritage Irish grocery palette grounded in deep greens, warm creams, rich ink, and deliberate accent colors:

```css
:root {
  --color-commerce: #214D3B;     /* Primary brand green, buttons, primary accents */
  --color-forest: #17392D;       /* Deep forest green, hero dark elements, headers */
  --color-ivory: #FAF7EF;        /* Primary warm background, container surfaces */
  --color-christmas: #F8F3E6;    /* Festive cream container tone, cards */
  --color-gold: #E5C781;         /* Warm Irish gold, accents, icons */
  --color-offer: #962D2D;        /* Offer badge red, alert states, festive badges */
  --color-ink: #1F2421;          /* Dark ink neutral for typography and high-contrast text */
  --color-border: #E8E5DF;       /* Subtle neutral border rule */
  --color-card-bg: #FFFFFF;      /* Clean card surface */
  --color-spotlight: #121312;    /* Dark spotlight backdrop for product imagery */
}
```

### 3.2 Typography Tokens
The typography hierarchy establishes a balance between authentic grocery tradition and clean modern ecommerce:
- **Display Typography**: `Georgia`, `Lora`, serif. Used for section headlines (`A little taste of home`, `Christmas favourites & festive offers`).
- **Heading Typography**: `Urbanist`, sans-serif (weights 600, 700). Used for departmental cards, product titles, section headers.
- **Commerce & Numerical Content**: `Outfit`, sans-serif (weights 300, 400, 600, 700). Used for pricing, counts, buttons, tabular data.
- **Navigation & Supporting Text**: `Arial`, `Arimo`, system sans-serif. Used for global navigation bar items, utility strips, legal disclosures.

### 3.3 Spacing & Layout Grid
- **Base Grid**: 8px rhythmic grid (`8px`, `16px`, `24px`, `32px`, `40px`, `48px`, `64px`, `72px`).
- **Container Max Widths**:
  - Desktop Max: `1440px` (Inner content centered at `1280px` to `1360px` with `40px` to `80px` padding).
  - Tablet Breakpoint: `768px` to `1024px` with `24px` horizontal gutters.
  - Mobile Breakpoint: `375px` to `430px` (fluid width with `16px` horizontal gutters).

---

## 4. Component Analysis & Visual Hierarchy

### 4.1 Product Cards
- **Card Background**: Clean white (`#FFFFFF`) with subtle border (`#E8E5DF`), rounded corners (`8px`).
- **Spotlight Frame**: The product image is displayed on an inset dark vignette/spotlight background (`#121312`), creating a premium grocery showcase effect.
- **Title**: Styled in warm golden-olive / brass typography (`#8D7017` / `#214D3B`), hovering to primary green.
- **In-Stock Indicator**: Blue/green indicator dot (`#2563EB` / `#16A34A`) accompanied by "In stock" or "Out of stock".
- **Price & Access Action**:
  - Logged-out state: Dashed border container with button `Log in to view prices` (underlined `Log in`).
  - Authenticated state: Direct currency display (e.g. `$2.49`), quantity stepper (`− 1 +`), and `Add to cart` CTA.
- **Mobile Quick-Action**: Floating circular action button (white circle with eye icon) positioned in the bottom-right of the image frame.

### 4.2 Department & Category Cards
- 15 core departments displayed in a 4-column desktop grid, 2-column tablet/mobile grid:
  1. Christmas (`/collections/christmas`)
  2. Bread & Bakery (`/collections/bread-bakery`)
  3. Candies & Sweets (`/collections/candies-sweets`)
  4. Biscuits & Cookies (`/collections/biscuits-cookies`)
  5. Clothing (`/collections/clothing`)
  6. Crisps & Snacks (`/collections/crisps-snacks`)
  7. Drinks (`/collections/drinks`)
  8. Meats (`/collections/meats`)
  9. Gifts & Merchandise (`/collections/gifts-merchandise`)
  10. Grocery (`/collections/grocery`)
  11. Oats & Cereals (`/collections/oats-cereals`)
  12. New Arrivals (`/collections/new-arrivals`)
  13. Sauces & Condiments (`/collections/sauces-condiments`)
  14. Tea & Coffee (`/collections/tea-coffee`)
  15. Bundles (`/collections/bundles`)
- Card treatment: 900x600 imagery with dark gradient overlay, white category title, and directional arrow `↗`.

### 4.3 Group Buying & Christmas Bundle Offer
- Cream container (`#F8F3E6`) with festive accent.
- Top section: Christmas basket photo + headline + `Shop all Christmas →`.
- Bottom section: 4 distinct bundle tiers:
  - Buy 10, Get 1 Free (Cadbury Medium Santa Selection Box 125g — $79.99, Receive 11 boxes)
  - Buy 10, Get 2 Free (Cadbury Roses Tub 475g — $219.99, Receive 12 tubs)
  - Buy 26, Get 5 Free (Cadbury Santa Small Selection Box 78g — $155.99, Receive 31 boxes)
  - Buy 10, Get 1 Free (Cadbury Stocking Selection Box 174g — $109.99, Receive 11 boxes)

### 4.4 Order Enquiry Business Workflow ("Order with Confidence")
The Irish Grocer implements a specialized order enquiry experience for bulk, chilled, or custom orders:
1. Customer reviews their basket and clicks `Review basket & request confirmation →`.
2. Customer submits an enquiry with delivery address and contact details.
3. Quincy store team verifies stock availability and calculates tax & regional delivery charges.
4. Customer receives written confirmation and a secure payment link.
5. No phone credit card numbers needed; slot reservations are confirmed upon payment.

