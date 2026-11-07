# Requirements: Milestone v9.0 — Global Business Location & Contact Information Standardization

**Defined:** November 7, 2026  
**Core Value:** Deliver an authentic, delightful, and friction-free Irish grocery shopping experience with completely unified, accurate, and official store location, contact details, operating hours, and brand messaging across all desktop, tablet, and mobile surfaces.  
**Milestone:** v9.0 — Global Business Location & Contact Information Standardization  
**Phase:** Phase 21 (Single Implementation Phase)  
**Status:** Executed & Verified  

---

## v9.0 Requirements Matrix (Phase 21)

### 1. Canonical Store Location & Contact Information (REQ-2101)
- [x] **REQ-2101.1**: Update `website/src/lib/config/site.ts` with official business data:
  - Store Name: `Marshfield Store`
  - Address: `1899 Ocean St, Marshfield, Massachusetts` (Do not append ZIP code 02050 or any unconfirmed postal code)
  - Phone: `7746990889` / `(774) 699-0889`
  - Email: `irishgrocer@gmail.com`
  - Hours: `Open Daily · 9 AM – 9 PM`
  - Delivery Message: `We Deliver!`
  - Brand Messaging: `Fresh Food · Irish Favorites · Everyday Needs`
- [x] **REQ-2101.2**: Update `.env.local` and `.env.example` with updated `STORE_CONTACT_EMAIL`, `STORE_CONTACT_PHONE`, and `STORE_ADDRESS` (`1899 Ocean St, Marshfield, Massachusetts`).

### 2. Header, Navigation & Homepage Surfaces (REQ-2102)
- [x] **REQ-2102.1**: Mobile header location indicator displays exactly `Marshfield, MA`, preserving icon, pill geometry, and compact mobile dimensions.
- [x] **REQ-2102.2**: Desktop header store indicator displays `Marshfield Store` with title `Marshfield, Massachusetts Store: (774) 699-0889`.
- [x] **REQ-2102.3**: Update `MobileDrawer.tsx` quick navigation card to `Visit Our Marshfield Store`.
- [x] **REQ-2102.4**: Update `MobileStoreConfidenceStrip.tsx`:
  - Title: `Marshfield Store`
  - Address: `1899 Ocean St, Marshfield, Massachusetts` (No 02050)
  - Opening Hours: `Open Daily · 9 AM – 9 PM`
- [x] **REQ-2102.5**: Update `StoreInfoSection.tsx`:
  - Title: `The Irish Grocer Marshfield Store`
  - Pill: `A NEIGHBOURHOOD FAVOURITE • MARSHFIELD, MASSACHUSETTS`
  - Address: `1899 Ocean St, Marshfield, Massachusetts`
  - Hours: `Open Daily · 9 AM – 9 PM`
  - Phone: `(774) 699-0889` (`tel:+17746990889`)
  - Email: `irishgrocer@gmail.com` (`mailto:irishgrocer@gmail.com`)
  - Google Maps directions query: `1899+Ocean+St+Marshfield+Massachusetts`
- [x] **REQ-2102.6**: Update `Footer.tsx` via `SITE_CONFIG` to reflect `1899 Ocean St, Marshfield, Massachusetts`, phone, hours, and brand messaging.
- [x] **REQ-2102.7**: Update `HeroSection.tsx` (`2-Hour Marshfield Pickup` / `We Deliver!`), `MobilePromoBanner.tsx` (`1899 Ocean St, Marshfield, Massachusetts`), `privacy/page.tsx`, `cart/page.tsx`, `CartDrawer.tsx`, `OrderEnquiryModal.tsx`, `ShopClientView.tsx`, `SearchClientView.tsx`, `ProductDetailsClient.tsx`.

### 3. Dedicated Contact & About Pages, LocalBusiness Schema (REQ-2103)
- [x] **REQ-2103.1**: Implement dedicated `src/app/contact/page.tsx` displaying Marshfield storefront details, phone (`tel:+17746990889`), email (`mailto:irishgrocer@gmail.com`), hours (`9:00 AM – 9:00 PM`), directions, and map link with 200 OK response.
- [x] **REQ-2103.2**: Implement dedicated `src/app/about/page.tsx` displaying the Irish Grocer Marshfield store history, direct import commitments, and brand motto with 200 OK response.
- [x] **REQ-2103.3**: Embed structured `LocalBusiness` / `GroceryStore` Schema.org JSON-LD in `layout.tsx` using `SITE_CONFIG`.

### 4. Design Preservation & Quality Gates (REQ-2104)
- [x] **REQ-2104.1**: Strict mobile design freeze: `MobileBottomNav.tsx`, mobile header height, section order, and shopping flows remain 100% frozen.
- [x] **REQ-2104.2**: `ProductCard.tsx` design invariants remain completely untouched.
- [x] **REQ-2104.3**: Preserve historical product catalog identifiers and customer delivery data.
- [x] **REQ-2104.4**: Verified across 9 routes and 10 viewports using Gravitas CDP browser audit. All quality gates passed.
- [ ] **REQ-2104.4**: Create `tests/phase21-business-info-update.test.ts` and ensure 100% test pass rate across all suites.
- [ ] **REQ-2104.5**: Static quality gates pass with 0 errors: `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- [ ] **REQ-2104.6**: Gravitas browser verification across 10 viewports and 9 routes confirms 0 console errors, 0 uncaught exceptions, 0 overflow, and valid clickable contact links.

---

## Out of Scope
- Redesigning visual layouts or altering color tokens.
- Modifying `MobileBottomNav.tsx` or `ProductCard.tsx`.
- Introducing real backend / live Shopify checkout infrastructure.
