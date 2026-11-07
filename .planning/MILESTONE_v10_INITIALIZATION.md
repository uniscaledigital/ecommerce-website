# Milestone v10.0 Initialization: Global Business Information Update

**Project:** The Irish Grocer  
**Milestone:** v10.0 — Global Business Information Update  
**Previous Milestone:** v9.0 — Desktop Favourites Navigation Integration (Completed & Verified in Phase 21)  
**Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo`  
**Primary Discipline:** GSD Workflow + CodeRabbit Review + Gravitas QA  
**Status:** **MILESTONE INITIALIZED — READY FOR REQUIREMENTS SPECIFICATION**  
**Next Phase Number:** Phase 22  

---

## 1. Executive Summary & Direction

With Milestones v1.0 through v9.0 completed, The Irish Grocer website features a complete e-commerce experience across mobile, tablet, and desktop:
- Advanced product filtering & search
- Curated mobile shopping flow with dedicated 3-row toolbar
- Complete 6-item mobile bottom navigation
- Persistent wishlist engine & dedicated `/favorites` destination
- Desktop first-row header Favourites heart navigation action with live numeric badge

**Milestone v10.0** focuses on a **Global Business Information Update** to ensure all operational business details, physical store data, contact endpoints, operating hours, announcement banners, social links, and structured SEO metadata are completely harmonized, accurate, and consistent across every touchpoint on the website.

---

## 2. Potential Target Areas for Global Business Information

### Pillar 1: Single Source of Truth Configuration
- `website/src/lib/config/site.ts` (`SITE_CONFIG`, `FOOTER_HELP_LINKS`, `FOOTER_SHOP_LINKS`, `STORE_ADDRESS`, `STORE_PHONE`, `STORE_EMAIL`, store hours, motto, announcement banner).
- `website/.env.local` / `website/.env.example` (`STORE_CONTACT_EMAIL`, `STORE_CONTACT_PHONE`, `STORE_ADDRESS`).

### Pillar 2: Navigation & Header Surfaces
- **Desktop Header (`Header.tsx`):**
  - Location pill (`Quincy, MA`)
  - Quincy Store information / links
  - Top announcement banner
- **Mobile Header & Drawer (`Header.tsx`, `MobileDrawer.tsx`):**
  - Location pill & store phone link
  - Visit Quincy Store quick navigation card
  - Customer contact actions
- **Mobile Bottom Navigation (`MobileBottomNav.tsx`):**
  - Verify labels and destinations remain strictly frozen and preserved.

### Pillar 3: Homepage & Store Information Sections
- **Store Info Section (`StoreInfoSection.tsx`):**
  - Physical storefront address, interactive directions link, Google Maps embed / link
  - Operating days & hours (e.g., 7:00 AM – 10:00 PM, 365 days a year)
  - Phone number click-to-call (`tel:`)
  - Email contact (`mailto:`)
  - Curbside / In-store pickup terms and details

### Pillar 4: Footer & Informational Pages
- **Global Footer (`Footer.tsx`):**
  - Store hours, address, phone, email, social links (Facebook, Twitter/X, Instagram, Pinterest)
  - Copyright notices and business entity name
- **Policy & Contact Pages (`src/app/privacy/page.tsx`, etc.):**
  - Legal business entity, contact address, and support email

### Pillar 5: SEO & Structured Schema Data
- **Structured Data (JSON-LD Schema.org):**
  - `LocalBusiness` / `GroceryStore` schema with updated address, geo coordinates, telephone, openingHours, priceRange, and URL.
  - OpenGraph / Twitter metadata in `layout.tsx`.

---

## 3. Invariants & Safety Constraints

- **Design System Fidelity:** Maintain existing Irish Grocer palette (Forest Green `#14532D`, Emerald `#22C55E`, warm creams, mint badges), typography (Playfair Display / Inter), and card tokens.
- **Shared Component Protection:** `ProductCard.tsx` design invariants remain protected.
- **Mobile Design Freeze:** Mobile layout and bottom navigation structure remain protected.
- **Commerce Mode:** Standalone demo mode (`NEXT_PUBLIC_COMMERCE_MODE=demo`).
- **Automated Verification:** 100% test pass rate, 0 TypeScript errors, 0 ESLint warnings, 0 build errors, 0 viewport overflow.
