# Requirements: Milestone v9.0 — Desktop Favourites Navigation Integration

**Defined:** November 7, 2026  
**Core Value:** Deliver an authentic, delightful, and friction-free Irish grocery shopping experience where customers can effortlessly discover, save, and batch-purchase their favorite imported pantry staples across mobile, tablet, and desktop.  
**Milestone:** v9.0 — Desktop Favourites Navigation Integration  
**Phase:** Phase 21 (Single Implementation Phase)  
**Status:** Scoped & Planned  

---

## v9.0 Requirements Matrix (Phase 21)

### 1. Desktop Header Favourites Action Integration (REQ-901)
- [ ] **REQ-901.1**: Add a dedicated `Favourites` navigation action in the desktop header controls row (`website/src/components/layout/Header.tsx`) on screens $\ge 1024\text{px}$ (`hidden lg:inline-flex`).
- [ ] **REQ-901.2**: Position the Favourites action cleanly in the desktop actions group: alongside Store, Account, and Cart, maintaining consistent gap and visual balance.
- [ ] **REQ-901.3**: Use the official `Heart` icon from `lucide-react`. Render outline heart when idle/empty, filled `#14532D` when active (`pathname === "/favorites"`).
- [ ] **REQ-901.4**: Render responsive label `Favourites` (visible on xl screens, with subtle icon capsule on lg) matching existing Account/Cart conventions with minimum $44\times 44\text{px}$ touch target.
- [ ] **REQ-901.5**: Link destination points directly to `/favorites`.
- [ ] **REQ-901.6**: Active state highlight: when customer is currently on `/favorites`, apply active styling (`text-[#14532D] font-bold` and active background tint `bg-[#14532D]/10`), with `aria-current="page"`.

### 2. Desktop Live Numeric Count Badge (REQ-902)
- [ ] **REQ-902.1**: Render a live count badge on the desktop Favourites heart icon showing `wishlist.length` whenever `wishlist.length > 0`.
- [ ] **REQ-902.2**: Match the styling of the existing Cart badge: Emerald `#22C55E` background, Forest Green `#14532D` text, 10px bold font, circular pill shape with white border.
- [ ] **REQ-902.3**: Badge updates instantaneously without page reload on any same-tab wishlist change (`wishlist-updated`) and cross-tab update (`storage`).
- [ ] **REQ-902.4**: Badge is omitted/hidden when `wishlist.length === 0`.

### 3. Responsive Breakpoint Boundaries & Desktop Lock (REQ-903)
- [ ] **REQ-903.1**: On mobile/tablet viewports below 1024px, the desktop header Favourites action is hidden (`hidden lg:inline-flex`), preventing duplicate navigation with `MobileBottomNav`.
- [ ] **REQ-903.2**: On desktop viewports (1024px, 1280px, 1440px, 1920px), the header container geometry preserves the 2-row rounded capsule layout with zero wrapping, zero clipping, and zero horizontal overflow (`scrollWidth <= innerWidth`).
- [ ] **REQ-903.3**: Desktop action controls row maintains flexible spacing so that adding Favourites does not cause the search capsule or logo to shrink or shift awkwardly.

### 4. Automated Quality Gates & Gravitas Verification (REQ-904)
- [ ] **REQ-904.1**: Create automated regression test suite `tests/phase21-desktop-favorites.test.ts` asserting desktop header Favourites presence, placement, icon, label, live badge count, `/favorites` href, and mobile exclusion.
- [ ] **REQ-904.2**: Static quality gates pass with 0 errors: `npm test` (all 9 suites passing), `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm run build` (all 33 routes compiled).
- [ ] **REQ-904.3**: Gravitas CDP browser verification across 10 viewports confirms 0 console errors, 0 uncaught exceptions, 0 horizontal overflow across all viewports, and $\ge 95\%$ visual similarity on desktop baselines.

---

## Out of Scope

| Feature | Reason |
|:---|:---|
| Redesigning the desktop navigation | Strictly preserving existing 2-row rounded capsule header design. |
| Mobile header duplicate favourites | Mobile already has the 6-item `MobileBottomNav` with Favourites tab. |
| Backend wishlist synchronization | Demo commerce mode relies on resilient local storage synchronization. |
