---
phase: "04-mobile-filter-drawer"
plan: "04"
title: "Flipkart-Style Mobile Filter Drawer"
wave: 1
dependencies: ["03-desktop-components"]
files_modified:
  - "src/components/products/filters/MobileFilterDrawer.tsx"
---

# Plan 04: Flipkart-Style Mobile Filter Drawer

## Objective
Implement a high-performance, touch-optimized Flipkart-style mobile filter drawer with dual-pane category tabs, live search, sticky bottom "Apply Filters (N)" bar, and full WCAG 2.1 AA keyboard/modal accessibility.

## Tasks
1. **Drawer Architecture (`src/components/products/filters/MobileFilterDrawer.tsx`)**:
   - Slide-in transition from right/left with dark translucent backdrop.
   - Header with "Filters" title, active filter count badge, "Clear All" action, and accessible Close (`X`) button ($\ge 44 \times 44\text{px}$).
   - Dual-pane Flipkart layout:
     - Left pane: Dimension tabs (Availability, Categories, Brands, Price, Product Types, Dietary, Ratings) with selected indicator.
     - Right pane: Option list for active tab with search input (for Brands and Categories), checkboxes, and dynamic live counts.
   - Sticky bottom footer:
     - Secondary "Reset" button.
     - Primary full-width "Apply Filters (N)" button updating matching product count in real time.
2. **Accessibility & Usability**:
   - Focus trapping inside dialog.
   - Initial focus on close trigger.
   - Focus restoration to trigger element on dismiss.
   - Escape key dismiss listener.
   - Body scroll locking while drawer is open.
3. **Automated Verification**:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm test`

