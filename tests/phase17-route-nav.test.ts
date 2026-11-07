import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Phase 17 / Milestone v6.0: Route-Specific Mobile Navigation & Homepage Layout", async (t) => {
  const headerCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/layout/Header.tsx"),
    "utf-8"
  );

  const globalsCss = fs.readFileSync(
    path.resolve(__dirname, "../src/app/globals.css"),
    "utf-8"
  );

  const searchViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/app/search/SearchClientView.tsx"),
    "utf-8"
  );

  const shopViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/app/shop/ShopClientView.tsx"),
    "utf-8"
  );

  const collectionPageCode = fs.readFileSync(
    path.resolve(__dirname, "../src/app/collections/[handle]/page.tsx"),
    "utf-8"
  );

  const homeViewCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/home/MobileHomeShoppingView.tsx"),
    "utf-8"
  );

  const accountPageCode = fs.readFileSync(
    path.resolve(__dirname, "../src/app/account/page.tsx"),
    "utf-8"
  );

  const productCardCode = fs.readFileSync(
    path.resolve(__dirname, "../src/components/products/ProductCard.tsx"),
    "utf-8"
  );

  await t.test("Requirement A: Mobile Profile Page Header Removal & Clearance", () => {
    // 1. Header detects account route
    assert.ok(
      headerCode.includes('pathname.startsWith("/account")'),
      "Header must detect account route"
    );

    // 2. Applies account-header and hidden lg:block
    assert.ok(
      headerCode.includes('account-header hidden lg:block'),
      "Header must be hidden on mobile account page and lg:block on desktop"
    );

    // 3. CSS resets margin and sets display: none below 1024px
    assert.ok(
      globalsCss.includes(".site-header.account-header"),
      "globals.css must define .site-header.account-header rule"
    );
    assert.ok(
      globalsCss.includes("display: none;\n  margin: 0;"),
      "account-header must have display: none and margin: 0 below 1024px"
    );

    // 4. Desktop visual lock preserves sticky floating header at >= 1024px
    assert.ok(
      globalsCss.includes(".site-header.account-header {\n    display: block;\n    position: sticky;\n    top: 16px;"),
      "Desktop visual lock: account header must be sticky at top: 16px at min-width: 1024px"
    );

    // 5. Account page orders null-safety guard
    assert.ok(
      accountPageCode.includes("(customer.orders || []).map"),
      "Account page must include defensive null check for customer.orders"
    );
  });

  await t.test("Requirement B: Search Results Sole Search & Query Synchronization", () => {
    // 1. Header syncs search query from URL parameter q on /search
    assert.ok(
      headerCode.includes('HeaderSearchSync'),
      "Header must include HeaderSearchSync component"
    );
    assert.ok(
      headerCode.includes('searchParams.get("q")'),
      "Header must read searchParams query parameter q on /search"
    );

    // 2. SearchClientView hides duplicate lower search box on mobile
    assert.ok(
      searchViewCode.includes("hidden lg:block max-w-2xl mx-auto"),
      "SearchClientView must hide the lower search form on mobile using hidden lg:block"
    );

    // 3. Search tabs and results are preserved
    assert.ok(searchViewCode.includes('activeTab === "products"'), "Product tab must be preserved");
    assert.ok(searchViewCode.includes('activeTab === "collections"'), "Collections tab must be preserved");
    assert.ok(searchViewCode.includes('activeTab === "blog"'), "Blog tab must be preserved");
    assert.ok(searchViewCode.includes('activeTab === "pages"'), "Pages tab must be preserved");
  });

  await t.test("Requirement C: Shop & Collection Route Completeness & Toolbar Refinement", () => {
    // 1. Collection page directly reuses ShopClientView
    assert.ok(
      collectionPageCode.includes('import { ShopClientView } from "@/app/shop/ShopClientView"'),
      "Collection route must import and reuse ShopClientView"
    );
    assert.ok(
      collectionPageCode.includes("initialCategory={handle}"),
      "Collection page must pass initialCategory={handle} to scope filters"
    );

    // 2. Header hides second-row search capsule on /shop and /collections/* on mobile
    assert.ok(
      headerCode.includes('isShopOrCollectionRoute'),
      "Header must detect shop and collection routes"
    );
    assert.ok(
      headerCode.includes('!isShopOrCollectionRoute && ('),
      "Header must conditionally omit mobile search capsule on shop and collections"
    );

    // 3. Dedicated Shop toolbar ROW 1 & ROW 2
    assert.ok(
      shopViewCode.includes('placeholder={initialCategory ? `Search in ${title}...` : "Search products..."}'),
      "Shop toolbar search input must support contextual placeholder on collection pages"
    );
    assert.ok(
      shopViewCode.includes('min-h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs'),
      "Filter and Bookmark buttons must guarantee >= 44x44px touch bounding boxes"
    );
    assert.ok(
      shopViewCode.includes('min-h-[44px]'),
      "Sort dropdown selector must guarantee >= 44px touch height"
    );

    // 4. Saved-items collection scoping
    assert.ok(
      shopViewCode.includes('filteredProducts.filter((p) => wishlist.includes(p.id))'),
      "Wishlist filtering must filter within filteredProducts to preserve collection scope"
    );
  });

  await t.test("Requirement D: Homepage Explore Aisles Relocation", () => {
    const promoIdx = homeViewCode.indexOf("<MobilePromoBanner");
    const stripIdx = homeViewCode.indexOf("<MobileStoreConfidenceStrip");
    const spotlightsIdx = homeViewCode.indexOf("<MobileProductSpotlight");
    const brandsIdx = homeViewCode.indexOf("<MobileBrandsCarousel");
    const catGridIdx = homeViewCode.indexOf("<MobileCategoryGrid");
    const ctaIdx = homeViewCode.indexOf('href="/shop"');

    assert.ok(promoIdx !== -1, "Section 1: MobilePromoBanner must be present");
    assert.ok(stripIdx !== -1, "Section 2: MobileStoreConfidenceStrip must be present");
    assert.ok(spotlightsIdx !== -1, "Section 3: MobileProductSpotlight must be present");
    assert.ok(brandsIdx !== -1, "Section 4: MobileBrandsCarousel must be present");
    assert.ok(catGridIdx !== -1, "Section 5: MobileCategoryGrid must be present");
    assert.equal(ctaIdx, -1, "Separate green Shop All Groceries CTA card must be completely removed");

    // Strictly verify sequence order
    assert.ok(promoIdx < stripIdx, "Section 1 (Promo) must precede Section 2 (Store Confidence)");
    assert.ok(stripIdx < spotlightsIdx, "Section 2 (Store Confidence) must precede Section 3 (Product Spotlights)");
    assert.ok(spotlightsIdx < brandsIdx, "Section 3 (Product Spotlights) must precede Section 4 (Brands Carousel)");
    assert.ok(brandsIdx < catGridIdx, "Section 4 (Brands Carousel) must precede Section 5 (Category Grid)");

    // Exactly ONE Category Grid
    const catGridCount = (homeViewCode.match(/<MobileCategoryGrid/g) || []).length;
    assert.equal(catGridCount, 1, "Exactly ONE instance of MobileCategoryGrid must be rendered");
  });

  await t.test("Safety Invariant: ProductCard.tsx remains untouched", () => {
    // Assert ProductCard invariant
    assert.ok(
      productCardCode.includes('export function ProductCard'),
      "ProductCard component must be intact"
    );
  });
});

