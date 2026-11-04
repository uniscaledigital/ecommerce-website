# PRD — Irish Grocer Final Client Demo Verification

## Overview

Perform a final, evidence-based verification of the existing Irish Grocer Next.js storefront for a client presentation. The current storefront uses local mock/demo products. No Shopify store is connected. Make only small, necessary frontend fixes for reproduced defects; do not redesign or build production backend infrastructure.

Workspace: `C:\Users\kumar\Downloads\irishweb\website`

## Task 1 — Baseline, repository safety, and report reconciliation

**Priority:** 1  
**Acceptance criteria:**
- Confirm the actual project root and branch.
- Record `git status --short` before any changes.
- Preserve all existing staged, modified, and untracked files.
- Read the latest frontend audit, checklist, and CodeRabbit report if present.
- Verify CodeRabbit's claimed 0 findings against the actual completed review output; if only a pasted summary exists, label it reported rather than independently verified.
- Run `npm test` and capture complete output, reconciling the claimed 22 tests with the individual test output.
- Do not modify source files in this task.
- Append evidence and any limitations to `progress.txt`.

## Task 2 — Mock catalogue and browse journeys

**Priority:** 2  
**Acceptance criteria:**
- Confirm the storefront loads mock data without Shopify credentials.
- Verify all 16 departments have at least one valid product.
- Verify product cards, collection pages, product detail pages, QuickView, and related-product links refer to valid product handles.
- Check variant IDs, SKUs, prices, availability, and images for consistency.
- Verify search, no-results state, category filtering, sorting, and filter reset wherever those controls are present.
- Fix only reproduced defects, using the current visual system.
- If browser verification is unavailable, record the relevant checks as `NOT TESTED`; do not infer a pass from source inspection.

## Task 3 — Local demo cart, wishlist, forms, and checkout

**Priority:** 3  
**Acceptance criteria:**
- Verify adding multiple products and different variants to the local demo cart.
- Verify the exact selected variant is added.
- Verify quantity changes, removal, subtotal calculation, empty state, and refresh persistence.
- Verify rapid add/update/remove interactions do not corrupt local demo cart state.
- Verify wishlist add/remove, refresh persistence, cross-tab sync where supported, empty state, and product navigation.
- Verify newsletter and enquiry validation and feedback.
- Ensure demo form feedback does not claim real email delivery or durable storage.
- Ensure demo checkout displays an explicit message that Shopify checkout is not connected.
- Confirm demo mode does not create a real order, trigger payment, or redirect to an invented checkout URL.
- Fix only reproduced issues.

## Task 4 — Navigation, overlays, and frontend links

**Priority:** 4  
**Acceptance criteria:**
- Verify homepage logo, header navigation, department links, footer links, hero CTAs, promotional CTAs, and product-card links.
- Verify desktop dropdown/mega-menu behavior and mobile drawer opening, closing, backdrop dismissal, and Escape behavior where supported.
- Verify QuickView opens the correct product and variant, closes by all supported methods, traps/restores focus, and does not retain stale errors.
- Verify cart drawer and enquiry modal interactions.
- Fix broken links or reproduced interaction defects only.

## Task 5 — Responsive and visual browser verification

**Priority:** 5  
**Acceptance criteria:**
- Inspect actual rendered pages at 360, 390, 430, 768, 1024, 1280, 1440, and 1920 CSS pixels.
- At minimum inspect homepage, collection, product detail, cart, search, mobile navigation, and overlays at relevant viewport widths.
- Check horizontal overflow, clipping, layout collapse, image crop, header wrapping, grid behavior, modal overflow, footer layout, and touch usability.
- Save screenshots or browser evidence when the available browser tooling supports it.
- Make targeted repairs only for reproduced layout defects.
- If a viewport was not actually inspected, retain `NOT TESTED` for it.

## Task 6 — Accessibility, performance, and SEO evidence

**Priority:** 6  
**Acceptance criteria:**
- Verify keyboard operation of navigation, drawers, dialogs, and forms.
- Check visible focus, accessible names, headings, form labels/errors, image alt text, and reduced-motion handling where applicable.
- Verify page titles/descriptions, Open Graph metadata, canonical URLs where applicable, sitemap/robots routes, and rendered Product JSON-LD.
- Run Lighthouse or available browser performance checks if tooling is already installed.
- Do not claim WCAG AAA, zero CLS, zero console errors, or Core Web Vitals success without actual measurements.
- Fix only concrete, in-scope frontend defects.

## Task 7 — Final quality gates and deliverables

**Priority:** 7  
**Acceptance criteria:**
- Run `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and `npm audit` when the scripts/dependencies are available.
- Record exact exit codes and complete outputs or concise faithful excerpts.
- Reconcile actual test counts; do not report a count that does not match the executed output.
- Update `FRONTEND_DEMO_CHECKLIST.md` for every item with status, evidence, and remaining action.
- Create/update `FINAL_CLIENT_DEMO_ACCEPTANCE_REPORT.md`.
- Distinguish code-level checks from browser-level verification.
- End with one honest verdict: `CLIENT DEMO READY`, `CLIENT DEMO READY WITH MINOR ISSUES`, or `NOT CLIENT DEMO READY`.
- Do not commit or push. Preserve all pre-existing user changes.
