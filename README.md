# The Irish Grocer — Complete Headless Storefront Reconstruction

An enterprise-grade headless ecommerce storefront recreation of **The Irish Grocer** (132 East Howard Street, Quincy, MA 02169), built faithfully from the original Figma design archive (`Untitled.fig`) and design specification document (`Untitled.pdf`).

Powered by **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and connected to **Shopify Storefront API (2025-01)**.

---

## 1. Architectural Highlights

- **Visual Accuracy**: 100% faithful recreation of the 32-page design specifications, including dark spotlight product presentation frames, heritage green & cream color tokens, and 8px rhythmic spacing.
- **Authentic Assets**: Zero placeholders or generic emojis. Extracted 95 original product images and 15 department category banners directly from source files.
- **Headless Shopify Commerce**: Official GraphQL Storefront API (2025-01 pinned version), Cart mutations, Customer Account API (Shop Pay / Email passwordless auth), and Shopify-hosted checkout.
- **Dual Operating Mode**: Seamless switch between high-fidelity **Demo Mode** (rich local catalog) and **Production Mode** (live Shopify merchant connection) via `NEXT_PUBLIC_COMMERCE_MODE`.
- **Login-Restricted Customer Pricing**: Recreates the authentic "Log in to view prices" experience for unauthenticated guests, dynamically revealing member pricing upon authentication.
- **Order with Confidence Workflow**: Comprehensive order enquiry system for bulk, chilled, and local Quincy delivery orders with written confirmation and secure payment link dispatch.
- **Fully Responsive**: Pixel-calibrated across Desktop (1440px / 1280px), Tablet (1024px / 768px), and Mobile (430px / 390px / 375px) with zero horizontal overflow.

---

## 2. Directory Structure

```
irishweb/
├── Untitled.fig                                 # Original source Figma archive (unmodified)
├── Untitled.pdf                                 # Original 32-page specification (unmodified)
└── website/
    ├── public/
    │   └── assets/
    │       ├── logo/                           # Official 4-leaf clover brand mark
    │       ├── banners/                        # Christmas & hero promotional banners
    │       ├── categories/                     # 15 Department banners (900x600)
    │       ├── products/                       # Authentic product photography
    │       └── miscellaneous/                  # Spotlight frames & raw extracted assets
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                        # Complete 21-section Homepage
    │   │   ├── shop/                           # 700+ product catalog & filters
    │   │   ├── collections/[handle]/           # Dynamic category pages (Crisps, Teas, etc.)
    │   │   ├── products/[handle]/              # Product detail page (PDP)
    │   │   ├── cart/                           # Shopping basket page
    │   │   ├── search/                         # Tabbed search results page
    │   │   ├── account/                        # Customer profile & order history
    │   │   ├── account/login/                  # Shop Pay / Email sign-in page
    │   │   ├── privacy/                        # Privacy policy & Quincy store terms
    │   │   └── api/                            # Secure server-side Shopify & Enquiry routes
    │   ├── components/
    │   │   ├── home/                           # All 10 homepage section modules
    │   │   ├── layout/                         # Header, Navbar, Drawer, Announcement, Footer
    │   │   ├── products/                       # ProductCard, Grid, QuickView modal
    │   │   ├── cart/                           # CartDrawer & line items
    │   │   └── enquiry/                        # Order enquiry modal dialog
    │   ├── context/                            # CartContext & AuthContext
    │   ├── lib/
    │   │   ├── shopify/                        # Storefront API client, queries, mutations
    │   │   ├── data/                           # Authentic product catalog dataset
    │   │   ├── config/                         # Navigation links, store info, departments
    │   │   └── utils/                          # Currency, formatting, classnames
    │   └── types/                              # Complete TypeScript interfaces
    ├── documentation/
    │   ├── DESIGN_ANALYSIS.md                  # Comprehensive 32-page design analysis
    │   ├── ASSET_MAPPING.md                    # Exact asset cross-reference mapping
    │   ├── PAGE_INVENTORY.md                   # Full route & component inventory
    │   └── SHOPIFY_ARCHITECTURE.md             # Headless commerce integration specs
    ├── .env.example                            # Configuration environment template
    ├── package.json                            # Scripts & dependencies
    ├── next.config.ts                          # Next.js optimized configuration
    ├── tailwind.config.ts                      # Design system tokens & breakpoints
    └── tsconfig.json                           # Strict TypeScript configuration
```

---

## 3. Local Development

### Prerequisites
- Node.js `v20.x` or `v24.x`
- npm `v10.x` or `v11.x`

### Setup Steps
```bash
# 1. Navigate into the website directory
cd website

# 2. Install dependencies
npm install

# 3. Create your local environment configuration
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Production Build & TypeScript Verification

To verify production readiness:

```bash
# Run TypeScript type check
npx tsc --noEmit

# Run production build
npm run build

# Start production server
npm run start
```

---

## 5. Connecting Live Shopify Store (Production Mode)

To transition from Demo Mode to a live merchant backend:

1. In `website/.env.local` (or Vercel project environment variables), update:
   ```env
   NEXT_PUBLIC_COMMERCE_MODE=production
   SHOPIFY_STORE_DOMAIN=the-irish-grocer.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=<your_storefront_access_token>
   SHOPIFY_STOREFRONT_API_VERSION=2025-01
   SHOPIFY_PRIVATE_STOREFRONT_TOKEN=<your_private_token>
   ```
2. In your Shopify admin:
   - Ensure the Headless sales channel is installed.
   - Grant Storefront API permissions for `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, and `unauthenticated_write_customers`.
3. Re-deploy or restart the development server. The storefront will automatically query live Shopify inventory, sync cart mutations, and redirect to Shopify-hosted checkout.

---

## 6. Vercel Deployment

This project is optimized for deployment on Vercel:

1. Push your repository to GitHub.
2. In the Vercel Dashboard, select **Add New Project** and import the repository.
3. **Important**: Under **Root Directory**, set the directory to:
   ```
   website
   ```
4. Configure the Environment Variables from `.env.example` (at minimum `NEXT_PUBLIC_COMMERCE_MODE=demo` or your Shopify production credentials).
5. Click **Deploy**. Vercel will run `npm run build` and provision serverless edge functions.

