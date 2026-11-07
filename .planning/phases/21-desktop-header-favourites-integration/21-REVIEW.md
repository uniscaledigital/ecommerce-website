---
phase: 21-desktop-header-favourites-integration
reviewed: 2026-11-07T14:45:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - website/src/components/layout/Header.tsx
  - website/tests/phase21-desktop-favorites.test.ts
  - website/package.json
findings:
  critical: 0
  warning: 2
  info: 4
  total: 6
  necessity: 0
status: issues_found
---

# Phase 21: Desktop Header Favourites Integration — Code Review Report

**Reviewed:** 2026-11-07T14:45:00Z  
**Depth:** standard  
**Files Reviewed:** 3  
**Status:** issues_found  

## Summary

Milestone v9.0 Phase 21 integrates a desktop-only Favourites navigation action (heart icon with live count badge) into the first row of `Header.tsx` between Account and Cart for viewports $\ge 1024\text{px}$.

The implementation demonstrates strong adherence to the strict mobile design freeze: `MobileBottomNav.tsx` remains completely untouched (100% frozen), and no edits were made to the `lg:hidden` mobile/tablet header. React hook rules and hydration safety are well observed: the live badge relies on `isLoaded && wishlistCount > 0`, ensuring that the initial client render matches the SSR output before localStorage is read in `useEffect`. All 155 unit and regression tests pass, and `tsc --noEmit` and `next lint` report zero errors.

Adversarial inspection identified two warnings and four informational quality items:
1. **Test Assertion Truncation (`WR-01`):** In `phase21-desktop-favorites.test.ts`, the mobile header freeze test searches for a comment delimiter containing `=======` that does not exist in the mobile header region. It evaluates to `-1` and falls back to slicing only 2,000 characters from line 233, which truncates the check at line 266. This leaves 3,776 characters of the mobile header (Cart, Hamburger button, and the entire mobile search bar) untested for accidental heart injections.
2. **Icon Hover Color Independence (`WR-02`):** In `Header.tsx`, the `<Heart>` SVG defines `text-[#14532D] hover:text-[#064E3B]`. Because CSS `:hover` on a child element requires direct mouse presence over the 16×16px SVG, hovering the parent link text "Favourites" turns the text emerald `#064E3B`, while the heart icon remains dark green `#14532D`.
3. Several minor quality improvements regarding font weight class clashing (`IN-01`), singular/plural accessibility grammar (`IN-02`), SVG `shrink-0` resilience (`IN-03`), and a pre-existing 768px–1023px tablet navigation gap (`IN-04`).

---

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Mobile Header Slice Truncation in Regression Test

**File:** `website/tests/phase21-desktop-favorites.test.ts:135-142`  
**Issue:**  
The test asserting that no Favourites link is injected into the mobile header attempts to locate the end of the mobile section using:
```ts
const mobileHeaderEnd = headerCode.indexOf('{/* ======================================================== */}', mobileHeaderStart + 50);
const mobileHeaderBlock = headerCode.substring(mobileHeaderStart, mobileHeaderEnd !== -1 ? mobileHeaderEnd : mobileHeaderStart + 2000);
```
In `Header.tsx`, the comment separating Row 1 from Row 2 uses hyphens (`{/* ------------------------------------------------------------ */}`), not equal signs. As a result, `mobileHeaderEnd` is `-1`, and the fallback `mobileHeaderStart + 2000` is used.  
The actual mobile header block in `Header.tsx` is 5,776 characters long (from line 233 to line 333). Truncating at 2,000 characters cuts off analysis at line 266 (inside the Account control). The Cart button, Hamburger menu trigger, and the entire second-row mobile search capsule are omitted from the assertion `!mobileHeaderBlock.includes('href="/favorites"')`. If a developer accidentally placed a Favourites link in the mobile controls or search row, this test would still pass.

**Fix:**  
Target the actual category navigation delimiter or search the full block up to `header-categories`:
```ts
// Extract the mobile header region (<div className="lg:hidden flex flex-col gap-1.5">)
const mobileHeaderStart = headerCode.indexOf('<div className="lg:hidden flex flex-col gap-1.5">');
const mobileHeaderEnd = headerCode.indexOf('header-categories', mobileHeaderStart);
const mobileHeaderBlock = headerCode.substring(
  mobileHeaderStart,
  mobileHeaderEnd !== -1 ? mobileHeaderEnd : mobileHeaderStart + 6000
);

assert.ok(
  !mobileHeaderBlock.includes('href="/favorites"'),
  "Mobile header region must NOT contain any Favourites link (strictly desktop only)"
);
```

---

### WR-02: Child Heart Icon Hover Class Does Not Inherit Parent Link Hover State

**File:** `website/src/components/layout/Header.tsx:194-199`  
**Issue:**  
The desktop Favourites link sets `text-[#14532D] hover:text-[#064E3B]` on the parent `<Link>`, and the child `<Heart>` SVG sets:
```tsx
<Heart
  className={`w-4 h-4 transition-colors ${
    isFavoritesActive
      ? "fill-[#14532D] text-[#14532D]"
      : "text-[#14532D] hover:text-[#064E3B]"
  }`}
/>
```
Because the child element explicitly declares `text-[#14532D]`, CSS specificity prevents it from inheriting the parent's `hover:text-[#064E3B]` when the cursor is positioned over the text label "Favourites" or the link's padding. The icon only changes color if the mouse hovers directly over the 16×16px SVG boundary itself, causing an awkward split hover effect where the text darkens but the icon remains static.

**Fix:**  
Use `text-current` for the idle state so the SVG cleanly inherits the parent `<Link>`'s text color and hover transitions:
```tsx
<Heart
  className={`w-4 h-4 transition-colors ${
    isFavoritesActive
      ? "fill-[#14532D] text-[#14532D]"
      : "text-current"
  }`}
/>
```

---

## Info

### IN-01: Conflicting Font Weight Utility Classes on Active State

**File:** `website/src/components/layout/Header.tsx:185-187`  
**Issue:**  
The `<Link>` className specifies `font-semibold` in its base class string, and appends `font-bold` when `isFavoritesActive` is true:
```tsx
className={`hidden lg:inline-flex items-center gap-1.5 text-xs xl:text-[13px] font-semibold text-[#14532D] hover:text-[#064E3B] hover:bg-[#14532D]/6 px-2.5 py-1.5 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
  isFavoritesActive ? "bg-[#14532D]/10 font-bold" : ""
}`}
```
While Tailwind's CSS rule ordering currently resolves `font-bold` over `font-semibold`, passing conflicting utility classes on the same element is an anti-pattern.  
**Fix:**  
Conditionally branch the font weight:
```tsx
${isFavoritesActive ? "bg-[#14532D]/10 font-bold" : "font-semibold"}
```

---

### IN-02: Missing Singular Pluralization in Accessible Label

**File:** `website/src/components/layout/Header.tsx:189`  
**Issue:**  
When `wishlistCount === 1`, the label renders as `"Favourites, 1 saved products"`, which is grammatically inaccurate for screen reader announcements.  
**Fix:**  
```tsx
aria-label={`Favourites, ${wishlistCount} saved ${wishlistCount === 1 ? "product" : "products"}`}
```

---

### IN-03: Missing `shrink-0` on Heart Icon Wrapper

**File:** `website/src/components/layout/Header.tsx:192-205`  
**Issue:**  
Store (`Store`), Account (`User`), and Shopping Cart (`ShoppingBag`) icons all declare `shrink-0` on their SVG elements to protect their geometry in flex containers. The Favourites `<div className="relative">` and `<Heart>` lack `shrink-0`. While current desktop container spacing is sufficient, adding `shrink-0` ensures the 16×16px icon can never be compressed in dense desktop layouts.  
**Fix:**  
```tsx
<div className="relative shrink-0">
```

---

### IN-04: Pre-Existing Tablet Viewport Navigation Gap (768px – 1023px)

**File:** `website/src/components/layout/Header.tsx` & `website/src/components/layout/MobileBottomNav.tsx`  
**Issue:**  
The desktop header action row is hidden below 1024px (`hidden lg:grid`), whereas `MobileBottomNav` is hidden above 767px (`md:hidden`). Between 768px and 1023px (medium viewport / tablet screens), neither the desktop header nor the mobile bottom navigation bar is rendered, and `MobileDrawer.tsx` does not list `/favorites`. Tablet users currently have no direct navigation control to `/favorites`.  
While Phase 21 strictly adhered to the `< 1024px` mobile freeze requirement and did not introduce this discrepancy, standardizing the bottom nav breakpoint (or adding Favourites to `MobileDrawer.tsx`) should be scheduled in an upcoming milestone.

---

_Reviewed: 2026-11-07T14:45:00Z_  
_Reviewer: the agent (gsd-code-reviewer)_  
_Depth: standard_
