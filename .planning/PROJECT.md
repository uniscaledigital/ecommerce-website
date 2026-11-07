# PROJECT.md — The Irish Grocer E-Commerce Storefront

## Project Overview
The Irish Grocer is a premier authentic Irish and British goods storefront operating in Quincy, MA.
- **Active Milestone:** v8.0 — Favourites and Saved Products Experience
- **Milestone Structure:** Phases 20–23
- **Previous Completed Milestones:**
  - Milestone v1.0 — Frontend Demo Remediation & Core Storefront Foundation
  - Milestone v2.0 — Advanced Product Filtering & Discovery (Commit `54ab672`)
  - Milestone v3.0 — Dedicated Mobile Shopping Experience & Responsive Layout Restructuring (Commit `ccc46d0`)
  - Milestone v4.0 — Minimal Mobile Shopping Experience (Commit `762ca02`)
  - Milestone v5.0 — Mobile Shopping Flow Refinement (Commit `ca75927`)
  - Milestone v6.0 — Mobile Route-Specific Navigation & Homepage Refinement (Commits `b1e2d35`, `d378ae1`)
  - Milestone v7.0 — Full Website Code Quality & Stability Hardening (Commit `899b365`)
- **Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo`
- **Active Branch:** `main`
- **Primary Framework:** GSD (Get Shit Done)
- **Secondary Quality Layer:** Gravitas (Read-before-write, Policy records, Visual Lock, Zero Design Redesign)

---

## Core Value
Deliver an authentic, delightful, and friction-free Irish grocery shopping experience where customers can effortlessly discover, save, and batch-purchase their favorite imported pantry staples across mobile, tablet, and desktop.

---

## Core Invariants for Milestone v8.0

1. **Brand Fidelity & Visual Invariants:**
   - Preserve existing Irish Grocer logo, branding, and color palette (forest green `#14532D`, hover green `#064E3B`, warm cream `#FFFAF1`/`#F7EBD8`/`#FDF4E3`, mint `#EDF8E9`/`#D0E7C9`).
   - Preserve serif headings (`font-serif-display` Playfair Display) and Inter body typography.
   - Preserve mobile and desktop layouts, product cards, bottom navigation, and drawers.
   - Do NOT modify shared `ProductCard.tsx` design invariants.

2. **Desktop Visual Lock ($\ge 1024\text{px}$):**
   - Floating sticky header anchored at `top: 16px` across desktop viewports (`1024px`, `1280px`, `1440px`, `1920px`).
   - Header action items cleanly aligned with consistent $\ge 44\text{px}$ touch targets.

3. **Wholesale & Pricing Gating:**
   - Unauthenticated visitors see "Log in to view prices" and are prompted to log in before adding items to cart.
   - Batch "Add All to Basket" on `/favorites` respects authentication status.

4. **Technical & Execution Safety:**
   - Planning mode only during planning turns; zero application code edits without explicit approval.
   - Standalone demo mock mode (`NEXT_PUBLIC_COMMERCE_MODE=demo`). No live Shopify credentials or real payment integrations.
   - Zero unapproved commits, pushes, stashes, or branch switches. Ralph Wiggum remains completely disabled.

---

## Requirements

### Validated
- Milestone v1.0 through v7.0 requirements (Advanced Filtering, Mobile Navigation Suite, 3-Row Toolbar, 14 Hardening Bug Fixes, 133/133 tests passing).

### Active (Milestone v8.0 Scope)
- [ ] **REQ-FAV-01**: Enhanced `useWishlist` hook with batch operations, clear action, and count tracking.
- [ ] **REQ-FAV-02**: Product Details Page (PDP) heart button toggle alongside quantity & Add to Basket actions.
- [ ] **REQ-FAV-03**: Dedicated `/favorites` route with responsive product grid and clear-all capability.
- [ ] **REQ-FAV-04**: Batch "Add All Available to Basket" CTA on `/favorites` respecting B2B pricing gates.
- [ ] **REQ-FAV-05**: Warm farmhouse empty state with friendly copy and quick links to popular Irish aisles.
- [ ] **REQ-FAV-06**: Desktop floating header Heart icon button with live dynamic counter badge.
- [ ] **REQ-FAV-07**: Mobile hamburger drawer "Saved Items" entry with live counter badge.
- [ ] **REQ-FAV-08**: Customer account page (`/account`) "Saved Provisions" quick-access summary card.
- [ ] **REQ-FAV-09**: Comprehensive automated regression test suite covering all favorites user flows.
- [ ] **REQ-FAV-10**: Gravitas multi-viewport visual regression verification confirming zero visual drift.

### Out of Scope
- Server-side database / Shopify Customer Metafield wishlist sync (kept local in `localStorage` for responsive demo mode).
- Multiple named wishlists / boards (single unified "Farmhouse Favourites" collection matches grocery flow).
- Public wishlist sharing links / social media export.

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
