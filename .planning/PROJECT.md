# PROJECT.md — The Irish Grocer E-Commerce Storefront

## Project Overview
The Irish Grocer is a premier authentic Irish and British goods storefront operating in Quincy, MA.
- **Active Milestone:** v9.0 — Desktop Favourites Navigation Integration
- **Milestone Structure:** Phase 21 (Single Implementation Phase)
- **Previous Completed Milestones:**
  - Milestone v1.0 — Frontend Demo Remediation & Core Storefront Foundation
  - Milestone v2.0 — Advanced Product Filtering & Discovery (Commit `54ab672`)
  - Milestone v3.0 — Dedicated Mobile Shopping Experience & Responsive Layout Restructuring (Commit `ccc46d0`)
  - Milestone v4.0 — Minimal Mobile Shopping Experience (Commit `762ca02`)
  - Milestone v5.0 — Mobile Shopping Flow Refinement (Commit `ca75927`)
  - Milestone v6.0 — Mobile Route-Specific Navigation & Homepage Refinement (Commits `b1e2d35`, `d378ae1`)
  - Milestone v7.0 — Full Website Code Quality & Stability Hardening (Commit `899b365`)
  - Milestone v8.0 — Favourites & Saved Products Experience (Commit `eb04ecc`)
- **Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo`
- **Active Branch:** `main`
- **Primary Framework:** GSD (Get Shit Done)
- **Secondary Quality Layer:** Gravitas (Read-before-write, Policy records, Visual Lock, Zero Design Redesign)

---

## Core Value
Deliver an authentic, delightful, and friction-free Irish grocery shopping experience where customers can effortlessly discover, save, and batch-purchase their favorite imported pantry staples across mobile, tablet, and desktop.

---

## Core Invariants for Milestone v9.0

1. **Brand Fidelity & Visual Invariants:**
   - Preserve existing Irish Grocer logo, branding, and color palette (forest green `#14532D`, hover green `#064E3B`, warm cream `#FFFAF1`/`#F7EBD8`/`#FDF4E3`, mint `#EDF8E9`/`#D0E7C9`).
   - Preserve serif headings (`font-serif-display` Playfair Display) and Inter body typography.
   - Preserve mobile and desktop layouts, product cards, bottom navigation, and drawers.
   - Do NOT modify shared `ProductCard.tsx` design invariants.

2. **Desktop Visual Lock ($\ge 1024\text{px}$):**
   - Floating sticky header anchored at `top: 16px` across desktop viewports (`1024px`, `1280px`, `1440px`, `1920px`).
   - Header action items cleanly aligned with consistent $\ge 44\text{px}$ touch targets.
   - Seamlessly integrate Favourites navigation into the desktop action row without breaking layout geometry or causing overflow.

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
- Milestone v1.0 through v8.0 requirements (Advanced Filtering, Mobile Navigation Suite, 3-Row Toolbar, 14 Hardening Bug Fixes, 6-Item Mobile Bottom Nav, Persistent Wishlist Engine, Multi-Surface Hearts, Dedicated `/favorites` Route, 146/146 tests passing).

### Active (Milestone v9.0 Scope)
- [ ] **REQ-901**: Desktop Header Favourites Action Integration in `Header.tsx` on $\ge 1024\text{px}$ viewports.
- [ ] **REQ-902**: Live numeric count badge on desktop Favourites icon matching Cart badge styling.
- [ ] **REQ-903**: Responsive breakpoint boundaries and desktop lock (hidden below 1024px, zero overflow $\ge 1024\text{px}$).
- [ ] **REQ-904**: Automated regression suite and Gravitas multi-viewport browser verification.
