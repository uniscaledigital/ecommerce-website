import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Phase 14 / v4-P3: Mobile Homepage Shopping Sections Architecture", async (t) => {
  const homeViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/home/MobileHomeShoppingView.tsx"),
    "utf-8"
  );

  await t.test("Section Order: enforces strictly ordered mobile shopping sequence", () => {
    const promoIdx = homeViewCode.indexOf("<MobilePromoBanner");
    const stripIdx = homeViewCode.indexOf("<MobileStoreConfidenceStrip");
    const catGridIdx = homeViewCode.indexOf("<MobileCategoryGrid");
    const spotlightsIdx = homeViewCode.indexOf("<MobileProductSpotlight");
    const brandsIdx = homeViewCode.indexOf("<MobileBrandsCarousel");
    const ctaIdx = homeViewCode.indexOf('href="/shop"');

    assert.ok(promoIdx !== -1, "Section 1: MobilePromoBanner must be present");
    assert.ok(stripIdx !== -1, "Section 2: MobileStoreConfidenceStrip must be present");
    assert.ok(catGridIdx !== -1, "Section 3: MobileCategoryGrid must be present");
    assert.ok(spotlightsIdx !== -1, "Section 4: MobileProductSpotlight must be present");
    assert.ok(brandsIdx !== -1, "Section 5: MobileBrandsCarousel must be present");
    assert.ok(ctaIdx !== -1, "Section 6: Shop All Groceries CTA must be present");

    // Strictly verify sequence order
    assert.ok(promoIdx < stripIdx, "Section 1 (Promo) must precede Section 2 (Store Confidence)");
    assert.ok(stripIdx < catGridIdx, "Section 2 (Store Confidence) must precede Section 3 (Category Grid)");
    assert.ok(catGridIdx < spotlightsIdx, "Section 3 (Category Grid) must precede Section 4 (Product Spotlights)");
    assert.ok(spotlightsIdx < brandsIdx, "Section 4 (Product Spotlights) must precede Section 5 (Brands Carousel)");
    assert.ok(brandsIdx < ctaIdx, "Section 5 (Brands Carousel) must precede Section 6 (Shop CTA)");
  });

  await t.test("Section 1: MobilePromoBanner invariants & non-seasonal rule", () => {
    const promoCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/home/mobile/MobilePromoBanner.tsx"),
      "utf-8"
    );

    assert.ok(promoCode.includes("snap-x snap-mandatory"), "Promo banner must support swipeable scroll snap");
    assert.ok(promoCode.includes("irish-grocer-hero-background.png"), "Must reuse approved Irish Grocer banner");
    assert.ok(!promoCode.includes("christmas"), "Promo banner must not display out-of-season holiday promotions");
    assert.ok(promoCode.includes("min-h-[44px]"), "CTA buttons must guarantee minimum 44px tap targets");
  });

  await t.test("Section 2: MobileStoreConfidenceStrip storefront truthfulness", () => {
    const stripCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/home/mobile/MobileStoreConfidenceStrip.tsx"),
      "utf-8"
    );

    assert.ok(stripCode.includes("Quincy, MA Storefront"), "Must communicate Quincy storefront location");
    assert.ok(stripCode.includes("132 E Howard St"), "Must include authentic street address");
    assert.ok(!stripCode.includes("mins delivery") && !stripCode.includes("minutes away"), "Must not invent fake delivery times");
    assert.ok(stripCode.includes("Demo"), "Must honestly indicate demo shopping mode");
  });

  await t.test("Section 3: MobileCategoryGrid 2-row x 4-col layout & See All expander", () => {
    const gridCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/home/mobile/MobileCategoryGrid.tsx"),
      "utf-8"
    );

    assert.ok(gridCode.includes("grid-cols-4"), "Category grid must use 4 columns on mobile");
    assert.ok(gridCode.includes("tea-coffee.png"), "Must use authentic transparent category PNGs");
    assert.ok(gridCode.includes("crisps-snacks.png"), "Must use authentic crisps-snacks image");
    assert.ok(gridCode.includes("bread-bakery.png"), "Must use authentic bread-bakery image");
    assert.ok(gridCode.includes("candies-sweets.png"), "Must use authentic candies-sweets image");
    assert.ok(gridCode.includes("See All (15)") || gridCode.includes("+8 More"), "Must include See All 15 aisles option");
  });

  await t.test("Section 4: Product Spotlights for Tea & Bakery and Crisps & Snacks", () => {
    assert.ok(
      homeViewCode.includes("Morning Tea & Fresh Bakery"),
      "Must include Morning Tea & Fresh Bakery spotlight"
    );
    assert.ok(
      homeViewCode.includes("Irish Crisps & Pub Snacks"),
      "Must include Irish Crisps & Pub Snacks spotlight"
    );
    assert.ok(
      homeViewCode.includes("/collections/tea-coffee"),
      "Morning Tea spotlight must link to tea-coffee collection"
    );
    assert.ok(
      homeViewCode.includes("/collections/crisps-snacks"),
      "Crisps spotlight must link to crisps-snacks collection"
    );

    const spotlightCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/home/mobile/MobileProductSpotlight.tsx"),
      "utf-8"
    );
    assert.ok(
      spotlightCode.includes('variant="compact"'),
      "Product spotlight must render compact product cards"
    );
    assert.ok(
      spotlightCode.includes("min-h-[44px]"),
      "See All link must have at least 44px touch target"
    );
  });

  await t.test("Section 5: MobileBrandsCarousel authentic Irish pantry legends", () => {
    const brandsCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/home/mobile/MobileBrandsCarousel.tsx"),
      "utf-8"
    );

    assert.ok(brandsCode.includes("Tayto"), "Must feature Tayto brand");
    assert.ok(brandsCode.includes("Barry's Tea"), "Must feature Barry's Tea brand");
    assert.ok(brandsCode.includes("Cadbury"), "Must feature Cadbury brand");
    assert.ok(brandsCode.includes("O'Donnells"), "Must feature O'Donnells brand");
    assert.ok(brandsCode.includes("snap-x snap-mandatory"), "Brands carousel must support touch snap scrolling");
  });

  await t.test("Section 6: Single unified search and dedicated shop discovery grid relocation", () => {
    // Verify duplicate in-view search bar is not inside home content stream
    assert.ok(
      !homeViewCode.includes('placeholder="Search groceries in view..."'),
      "Duplicate in-view search bar must be removed in favor of unified header search"
    );
    // Verify discovery grid is housed in ShopClientView
    const shopViewCode = fs.readFileSync(
      path.resolve(__dirname, "../src/app/shop/ShopClientView.tsx"),
      "utf-8"
    );
    assert.ok(shopViewCode.includes("grid-cols-2"), "Product grid must maintain 2-column layout in Shop");
    assert.ok(shopViewCode.includes("MobileFilterDrawer"), "Filter drawer must remain integrated in Shop");
    assert.ok(shopViewCode.includes("MobileCategoryScrollRail"), "Category scroll rail must remain integrated in Shop");
  });
});
