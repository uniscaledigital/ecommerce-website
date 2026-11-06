import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Phase 16 / Milestone v5.0: Mobile Header, Shop Discovery and Menu Reliability", async (t) => {
  const headerCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/layout/Header.tsx"),
    "utf-8"
  );

  const globalsCss = fs.readFileSync(
    path.resolve(__dirname, "../src/app/globals.css"),
    "utf-8"
  );

  const mobileHomeViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/home/MobileHomeShoppingView.tsx"),
    "utf-8"
  );

  const mobileDrawerCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/layout/MobileDrawer.tsx"),
    "utf-8"
  );

  const shopViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/app/shop/ShopClientView.tsx"),
    "utf-8"
  );

  const footerCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/layout/Footer.tsx"),
    "utf-8"
  );

  await t.test("Requirement A: Mobile header is non-sticky on Homepage below 1024px and sticky at >= 1024px", () => {
    // Header applies home-header and relative below 1024px, and lg:sticky on desktop
    assert.ok(
      headerCode.includes('isHomepage ? "home-header relative lg:sticky" : "sticky"'),
      "Header must be relative below 1024px on homepage and lg:sticky on desktop"
    );
    assert.ok(
      globalsCss.includes(".site-header.home-header"),
      "globals.css must define .site-header.home-header rule"
    );
    assert.ok(
      globalsCss.includes("position: relative;\n  top: auto;"),
      "home-header must have position: relative and top: auto below 1024px"
    );
    assert.ok(
      globalsCss.includes("@media (min-width: 1024px) {\n  .site-header,\n  .site-header.home-header {\n    position: sticky;\n    top: 16px;"),
      "Desktop visual lock: header must remain floating sticky at top: 16px at min-width: 1024px"
    );
  });

  await t.test("Requirement B: Mobile Homepage is curated with 5 sections + Shop All Groceries CTA", () => {
    // Check 5 curated sections in strict order
    const promoIdx = mobileHomeViewCode.indexOf("<MobilePromoBanner");
    const stripIdx = mobileHomeViewCode.indexOf("<MobileStoreConfidenceStrip");
    const catGridIdx = mobileHomeViewCode.indexOf("<MobileCategoryGrid");
    const spotlightsIdx = mobileHomeViewCode.indexOf("<MobileProductSpotlight");
    const brandsIdx = mobileHomeViewCode.indexOf("<MobileBrandsCarousel");
    const ctaIdx = mobileHomeViewCode.indexOf('href="/shop"');

    assert.ok(promoIdx !== -1, "Section 1: MobilePromoBanner must be present");
    assert.ok(stripIdx !== -1, "Section 2: MobileStoreConfidenceStrip must be present");
    assert.ok(catGridIdx !== -1, "Section 3: MobileCategoryGrid must be present");
    assert.ok(spotlightsIdx !== -1, "Section 4: MobileProductSpotlight must be present");
    assert.ok(brandsIdx !== -1, "Section 5: MobileBrandsCarousel must be present");
    assert.ok(ctaIdx !== -1, "Section 6: Shop All Groceries CTA must be present");

    assert.ok(promoIdx < stripIdx, "Section 1 must precede Section 2");
    assert.ok(stripIdx < catGridIdx, "Section 2 must precede Section 3");
    assert.ok(catGridIdx < spotlightsIdx, "Section 3 must precede Section 4");
    assert.ok(spotlightsIdx < brandsIdx, "Section 4 must precede Section 5");
    assert.ok(brandsIdx < ctaIdx, "Section 5 must precede Section 6 CTA");

    // Discovery grid and filter drawer must NOT be on mobile homepage
    assert.ok(
      !mobileHomeViewCode.includes("MobileFilterDrawer"),
      "MobileFilterDrawer must be relocated to Shop and absent from mobile Homepage"
    );
    assert.ok(
      !mobileHomeViewCode.includes("MobileCategoryScrollRail"),
      "MobileCategoryScrollRail must be relocated to Shop and absent from mobile Homepage"
    );
  });

  await t.test("Requirement D: Mobile hamburger menu uses React createPortal to document.body with z-[1200]", () => {
    assert.ok(
      mobileDrawerCode.includes("createPortal("),
      "MobileDrawer must use createPortal to escape containing block"
    );
    assert.ok(
      mobileDrawerCode.includes("document.body"),
      "MobileDrawer must portal into document.body"
    );
    assert.ok(
      mobileDrawerCode.includes("z-[1200]"),
      "MobileDrawer must have z-[1200] to overlay sticky header and bottom nav"
    );
    assert.ok(
      mobileDrawerCode.includes('overflow = "hidden"'),
      "MobileDrawer must lock body overflow while open"
    );
    assert.ok(
      mobileDrawerCode.includes('e.key === "Escape"'),
      "MobileDrawer must close on Escape key"
    );
  });

  await t.test("Requirement C: Dedicated Mobile Shop Suite with Compact Toolbar, Saved Items & Filters", () => {
    // Compact toolbar
    assert.ok(
      shopViewCode.includes("sticky top-2"),
      "Mobile Shop must feature docked toolbar"
    );
    assert.ok(
      shopViewCode.includes("useWishlist"),
      "Must wire bookmark action to useWishlist hook"
    );
    assert.ok(
      shopViewCode.includes("showOnlyWishlisted"),
      "Must support showOnlyWishlisted in-place grid filtering"
    );
    assert.ok(
      shopViewCode.includes("wishlist.length"),
      "Must display active wishlist count badge"
    );
    assert.ok(
      shopViewCode.includes("MobileCategoryScrollRail"),
      "Must feature quick category scroll rail in Shop"
    );
    assert.ok(
      shopViewCode.includes("MobileFilterDrawer"),
      "Must feature Flipkart-style mobile filter drawer in Shop"
    );
    assert.ok(
      shopViewCode.includes("grid-cols-2"),
      "Must render 2-column mobile product grid in Shop"
    );
    assert.ok(
      shopViewCode.includes("min-w-[44px] min-h-[44px]"),
      "Filter chip dismiss buttons and actions must satisfy >= 44x44px touch targets"
    );
  });

  await t.test("Safe-Area & Desktop Visual Lock Invariants", () => {
    assert.ok(
      footerCode.includes("pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0"),
      "Footer must preserve safe-area clearance on mobile"
    );
    assert.ok(
      shopViewCode.includes("hidden md:block"),
      "Desktop shop layout must remain preserved behind hidden md:block"
    );
  });
});
