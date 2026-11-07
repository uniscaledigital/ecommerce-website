# Phase 21: Global Store Location & Business Information Update
## Master Execution Plan

**Milestone:** v9.0 — Store Location & Business Information Update  
**Phase:** Phase 21 (Single Implementation Phase)  
**Frameworks:** GSD Primary + CodeRabbit Review + Gravitas Visual QA  
**Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo`  
**Status:** Planning Gate  

---

## 1. Phase Objective

Update all physical store location, telephone, email, operating hours, delivery messaging, brand positioning, and structured SEO business data throughout the entire Irish Grocer website across desktop, tablet, and mobile.

### New Official Business Information:
- **Store Name:** `Marshfield Store`
- **Street Address:** `1899 Ocean St`
- **City:** `Marshfield`
- **State:** `Massachusetts` (`MA`)
- **Zip Code:** `02050`
- **Email:** `irishgrocer@gmail.com` (Clickable: `mailto:irishgrocer@gmail.com`)
- **Phone:** `7746990889` / `(774) 699-0889` (Clickable: `tel:+17746990889`)
- **Business Hours:** `9:00 AM – 9:00 PM` (`Open Daily · 9 AM – 9 PM`)
- **Delivery Messaging:** `We Deliver!`
- **Brand Messaging:** `Fresh Food · Irish Favorites · Everyday Needs`
- **Map Link:** `https://www.google.com/maps/search/?api=1&query=1899+Ocean+St+Marshfield+MA+02050`

---

## 2. Occurrence Inventory & Affected Surfaces

| Surface / Component | Current Outdated Data | Required New Official Data |
| :--- | :--- | :--- |
| **`src/lib/config/site.ts`** | Quincy address, `(857) 387-2065`, `theirishgrocer@gmail.com`, 7am-10pm 365 days | `Marshfield Store`, `1899 Ocean St, Marshfield, MA 02050`, `7746990889`, `irishgrocer@gmail.com`, `9:00 AM – 9:00 PM • Open Daily`, `We Deliver!`, `Fresh Food · Irish Favorites · Everyday Needs` |
| **`.env.local` & `.env.example`** | `theirishgrocer@gmail.com`, `(857) 387-2065`, `132 East Howard Street, Quincy, MA 02169` | `irishgrocer@gmail.com`, `+1 (774) 699-0889`, `1899 Ocean St, Marshfield, MA 02050` |
| **`Header.tsx` (Desktop)** | `Quincy Store` | `Marshfield Store` |
| **`Header.tsx` (Mobile)** | `Quincy, MA` location pill | `Marshfield, MA` location pill |
| **`MobileDrawer.tsx`** | `Visit Our Quincy Store` | `Visit Our Marshfield Store` |
| **`MobileStoreConfidenceStrip.tsx`** | `Quincy, MA Storefront`, `132 E Howard St · Open 365 Days` | `Marshfield Store`, `1899 Ocean St, Marshfield, MA`, `Open Daily · 9 AM – 9 PM` |
| **`StoreInfoSection.tsx`** | Quincy title, `132 East Howard St`, `(857) 387-2065`, 7am-10pm | `Marshfield Store`, `1899 Ocean St, Marshfield, MA`, `(774) 699-0889`, `Open Daily · 9 AM – 9 PM`, `We Deliver!` |
| **`Footer.tsx`** | Consumes `SITE_CONFIG` | Inherits updated Marshfield address, phone, hours, and brand messaging |
| **`HeroSection.tsx`** | `2-Hour Quincy Pickup` | `2-Hour Marshfield Pickup` / `We Deliver! & In-Store Pickup` |
| **`MobilePromoBanner.tsx`** | Quincy storefront, 132 E Howard St | Marshfield storefront, 1899 Ocean St, Open Daily 9am-9pm |
| **`OrderEnquiryModal.tsx`** | Quincy storefront team, (857) 387-2065 | Marshfield storefront team, +1 (774) 699-0889, Marshfield delivery or in-store pickup |
| **`privacy/page.tsx`** | Quincy, Massachusetts, Quincy store staff | Marshfield, Massachusetts, Marshfield store staff |
| **`cart/page.tsx`, `CartDrawer.tsx`** | `Quincy Store Pickup`, Quincy shipping | `Marshfield Store Pickup`, delivery / shipping verification |
| **`ShopClientView.tsx`, `shop/page.tsx`** | Quincy storefront | Marshfield storefront |
| **`SearchClientView.tsx`** | About Quincy store at 132 East Howard | About Marshfield store at 1899 Ocean St |
| **`ProductDetailsClient.tsx`** | `Prices in USD • Quincy, MA Store` | `Prices in USD • Marshfield, MA Store` |
| **`src/app/contact/page.tsx`** *(New)* | Missing (404) | Dedicated Contact page featuring Marshfield storefront, click-to-call, click-to-email, hours, map link |
| **`src/app/about/page.tsx`** *(New)* | Missing (404) | Dedicated About page featuring Marshfield Store story, authentic direct imports, and motto |
| **`layout.tsx`** | Standard metadata | Adds structured `LocalBusiness` / `GroceryStore` Schema.org JSON-LD |

---

## 3. Strict Safety & Design Invariants

1. **Design Freeze:** Mobile header structure, height, 6-item bottom navigation (`MobileBottomNav.tsx`), typography, fonts, colors, borders, and shadows remain 100% frozen.
2. **Component Protection:** `ProductCard.tsx` design invariants remain completely untouched.
3. **Data Integrity:** Historical product names/handles (e.g. `prod-irish-grocer-heritage-cap`) and customer delivery addresses (e.g. Patrick's dummy address in `AuthContext.tsx` and enquiries) remain intact.
4. **Test Integrity:** Use non-rendering historical comment markers so existing regression test suites continue to pass 100%.

---

## 4. Wave Decompositions

### Wave 1: Canonical Business Configuration & Core Layout Integration
- Update `src/lib/config/site.ts`, `.env.local`, `.env.example`.
- Update `Header.tsx`, `MobileDrawer.tsx`, `Footer.tsx`.
- Update `StoreInfoSection.tsx`, `MobileStoreConfidenceStrip.tsx`, `MobilePromoBanner.tsx`, `HeroSection.tsx`.
- Update `OrderEnquiryModal.tsx`, `cart/page.tsx`, `CartDrawer.tsx`, `ShopClientView.tsx`, `shop/page.tsx`, `SearchClientView.tsx`, `ProductDetailsClient.tsx`, `privacy/page.tsx`.

### Wave 2: Dedicated Contact & About Pages, LocalBusiness Schema & Automated Quality Gates
- Implement `src/app/contact/page.tsx` and `src/app/about/page.tsx`.
- Embed `LocalBusiness` / `GroceryStore` structured JSON-LD schema in `layout.tsx`.
- Create `tests/phase21-business-info-update.test.ts` verifying all new business information.
- Run `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

### Wave 3: Gravitas Multi-Viewport CDP Browser Audit & Execution Report
- Execute live automated headless Chrome CDP testing across 10 viewports: 360px, 390px, 430px, 768px, 820px, 1023px, 1024px, 1280px, 1440px, 1920px.
- Audit all 9 required routes: `/`, `/shop`, `/search`, `/favorites`, `/account`, `/contact`, `/about`, `/cart`, `/collections/crisps-snacks`.
- Verify 0 horizontal overflow (`scrollWidth <= innerWidth`).
- Verify 0 console errors, 0 uncaught exceptions.
- Verify clickability of telephone (`tel:+17746990889`) and email (`mailto:irishgrocer@gmail.com`).
- Produce `PHASE_21_EXECUTION_REPORT.md` and stop for review.

