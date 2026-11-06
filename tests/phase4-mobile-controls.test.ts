import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Phase 15: Mobile Shopping Controls & Touch Usability", async (t) => {
  const shopViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/app/shop/ShopClientView.tsx"),
    "utf-8"
  );

  const mobilePromoBannerCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/home/mobile/MobilePromoBanner.tsx"),
    "utf-8"
  );

  const footerCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/layout/Footer.tsx"),
    "utf-8"
  );

  const productCardCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/products/ProductCard.tsx"),
    "utf-8"
  );

  await t.test("1. Sticky discovery controls bar is present in mobile Shop destination", () => {
    assert.ok(
      shopViewCode.includes("sticky top-2"),
      "Sticky discovery bar must dock cleanly on mobile Shop viewports"
    );
    assert.ok(
      shopViewCode.includes("SlidersHorizontal"),
      "Must include filter trigger button"
    );
    assert.ok(
      shopViewCode.includes("Bookmark"),
      "Must include bookmark saved items action"
    );
  });

  await t.test("2. Active Search Query chip renders with 1-tap clear action", () => {
    assert.ok(
      shopViewCode.includes("state.searchQuery"),
      "Must check for active search query in filter chips rail"
    );
    assert.ok(
      shopViewCode.includes('Search:'),
      "Must render prominent Search: label for active query"
    );
    assert.ok(
      shopViewCode.includes('setSearchQuery("")'),
      "Dismissing search chip must call setSearchQuery to clear query"
    );
  });

  await t.test("3. Active chip dismiss buttons satisfy >= 44x44px touch bounding bounds", () => {
    assert.ok(
      shopViewCode.includes("min-w-[44px] min-h-[44px]"),
      "Filter and search chip dismiss buttons must enforce min-w-[44px] min-h-[44px]"
    );
  });

  await t.test("4. Promo banner indicator dots enforce >= 44x44px touch targets", () => {
    assert.ok(
      mobilePromoBannerCode.includes("min-h-[44px] min-w-[44px]"),
      "Indicator dot buttons must enforce minimum 44x44px touch bounds"
    );
    assert.ok(
      mobilePromoBannerCode.includes("w-11 h-11"),
      "Indicator dot buttons must provide 44px (w-11 h-11) accessible tap area"
    );
  });

  await t.test("5. Footer incorporates safe-area bottom clearance on mobile", () => {
    assert.ok(
      footerCode.includes("pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0"),
      "Footer must include safe-area bottom clearance padding on mobile, reset to 0 on desktop"
    );
  });

  await t.test("6. ProductCard.tsx design invariant is preserved", () => {
    assert.ok(
      productCardCode.includes('variant === "compact"'),
      "ProductCard compact variant handling must remain intact"
    );
    assert.ok(
      productCardCode.includes("rounded-[20px]"),
      "ProductCard pale mint squircle styling must remain untouched"
    );
  });
});

