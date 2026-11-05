import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Phase 15: Mobile Shopping Controls & Touch Usability", async (t) => {
  const mobileHomeViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/home/MobileHomeShoppingView.tsx"),
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

  await t.test("1. Sticky discovery controls bar uses verified docking offsets", () => {
    assert.ok(
      mobileHomeViewCode.includes("sticky top-[111px]"),
      "Sticky discovery bar must dock at top-[111px] on mobile viewports (< 640px)"
    );
    assert.ok(
      mobileHomeViewCode.includes("sm:top-[121px]"),
      "Sticky discovery bar must dock at sm:top-[121px] on tablet/large mobile (640px - 767px)"
    );
    assert.ok(
      !mobileHomeViewCode.includes("sticky top-[120px]"),
      "Must not retain unverified sticky top-[120px] offset on standard mobile"
    );
  });

  await t.test("2. Active Search Query chip renders with 1-tap clear action", () => {
    assert.ok(
      mobileHomeViewCode.includes("state.searchQuery"),
      "Must check for active search query in filter chips rail"
    );
    assert.ok(
      mobileHomeViewCode.includes('Search:'),
      "Must render prominent Search: label for active query"
    );
    assert.ok(
      mobileHomeViewCode.includes('setSearchQuery("")'),
      "Dismissing search chip must call setSearchQuery to clear query"
    );
  });

  await t.test("3. Active chip dismiss buttons satisfy >= 44x44px touch bounding bounds", () => {
    assert.ok(
      mobileHomeViewCode.includes("min-w-[44px] min-h-[44px]"),
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

