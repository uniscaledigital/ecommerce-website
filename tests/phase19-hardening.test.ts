import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { persistOrderEnquiry } from "../src/lib/enquiry/storage";
import { PRODUCTS } from "../src/lib/data/products";

const projectRoot = path.resolve(__dirname, "..");

test("Phase 19 / Milestone v7.0 Code Quality & Stability Hardening Suite", async (t) => {
  // --------------------------------------------------------------------------
  // WP-1: Data Integrity & Storage Safety
  // --------------------------------------------------------------------------
  await t.test("DEF-01: Order enquiry persistence is serialized and atomic", async () => {
    const storageCode = fs.readFileSync(
      path.join(projectRoot, "src/lib/enquiry/storage.ts"),
      "utf-8"
    );

    // Verify in-process write queue serialization
    assert.ok(
      storageCode.includes("let writeQueue") || storageCode.includes("writeQueue = next"),
      "storage.ts must maintain an in-process promise queue to serialize concurrent writes"
    );

    // Verify atomic temporary file write + rename
    assert.ok(
      storageCode.includes(".tmp") && storageCode.includes("fs.rename"),
      "storage.ts must write to a temporary file and atomically rename to prevent corruption"
    );

    // Verify non-ENOENT error propagation (preventing wipe on corrupt parse)
    assert.ok(
      storageCode.includes("ENOENT"),
      "storage.ts must explicitly check for ENOENT and propagate other errors"
    );

    // Functional verification: call persistOrderEnquiry concurrently
    const testEnquiry = {
      enquiryId: `TEST-ENQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
      customerName: "Patrick O'Connor",
      email: "patrick@example.com",
      phone: "617-555-0199",
      deliveryAddress: "45 Hancock St, Quincy, MA",
      notes: "Test enquiry concurrency",
      cartItems: [
        {
          id: "test-item-1",
          quantity: 2,
          merchandise: {
            id: "var-1",
            title: "Tayto Crisps",
            price: { amount: "2.49", currencyCode: "USD" },
            product: {
              id: "prod-1",
              title: "Tayto Cheese & Onion",
              handle: "tayto-cheese-onion",
              vendor: "Tayto",
            },
          },
        },
      ],
      subtotal: "4.98",
    };

    // Trigger concurrent writes
    await Promise.all([
      persistOrderEnquiry(testEnquiry),
      persistOrderEnquiry({ ...testEnquiry, enquiryId: `TEST-ENQ-${Date.now()}-2` }),
    ]);

    const dataFile = path.join(projectRoot, ".data/enquiries.json");
    assert.ok(fs.existsSync(dataFile), "enquiries.json must exist after persistence");
    const saved = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    assert.ok(Array.isArray(saved), "Saved enquiries must be a valid array");
    assert.ok(saved.length >= 2, "Both concurrent enquiries must be preserved without loss");
  });

  await t.test("DEF-14: Wishlist storage event synchronizes when cleared in another tab", () => {
    const wishlistCode = fs.readFileSync(
      path.join(projectRoot, "src/hooks/useWishlist.ts"),
      "utf-8"
    );

    assert.ok(
      wishlistCode.includes("setWishlist([])") &&
      wishlistCode.includes("wishlistRef.current = []"),
      "useWishlist must reset state to empty when storage event newValue is null/empty"
    );
  });

  // --------------------------------------------------------------------------
  // WP-2: Business Logic & B2B Pricing Gate
  // --------------------------------------------------------------------------
  await t.test("DEF-02: ProductListCard gates Add to Basket button behind authentication", () => {
    const listCardCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/ProductListCard.tsx"),
      "utf-8"
    );

    assert.ok(
      listCardCode.includes("{isAuthenticated && (") &&
      listCardCode.includes("Add to Basket"),
      "ProductListCard must wrap Add to Basket button inside {isAuthenticated && ...}"
    );

    assert.ok(
      listCardCode.includes("!isAuthenticated ?") &&
      listCardCode.includes("Log in to view price"),
      "ProductListCard must show Log in to view price when unauthenticated"
    );
  });

  await t.test("DEF-11: MobileBrandsCarousel dynamically derives product counts from catalogue", () => {
    const brandsCode = fs.readFileSync(
      path.join(projectRoot, "src/components/home/mobile/MobileBrandsCarousel.tsx"),
      "utf-8"
    );
    const homeViewCode = fs.readFileSync(
      path.join(projectRoot, "src/components/home/MobileHomeShoppingView.tsx"),
      "utf-8"
    );

    // Verify MobileBrandsCarousel accepts products prop
    assert.ok(
      brandsCode.includes("products?: Product[]") || brandsCode.includes("products = []"),
      "MobileBrandsCarousel must accept products prop"
    );

    // Verify dynamic vendor calculation
    assert.ok(
      brandsCode.includes("getBrandCount") && brandsCode.includes(".filter("),
      "MobileBrandsCarousel must derive counts dynamically from products prop"
    );

    // Verify MobileHomeShoppingView passes products prop
    assert.ok(
      homeViewCode.includes("<MobileBrandsCarousel products={products} />"),
      "MobileHomeShoppingView must pass products={products} to MobileBrandsCarousel"
    );

    // Catalogue verification: Cadbury Ireland and Cadbury products exist
    const cadburyCount = PRODUCTS.filter((p) => p.vendor?.toLowerCase().includes("cadbury")).length;
    assert.ok(cadburyCount > 0, "Catalogue must contain Cadbury vendor items");
  });

  // --------------------------------------------------------------------------
  // WP-3: Filter & Navigation Correctness
  // --------------------------------------------------------------------------
  await t.test("DEF-03: Dual price slider thumbs use pointer-events-none on inputs and pointer-events-auto on thumbs", () => {
    const sliderCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/filters/PriceRangeSlider.tsx"),
      "utf-8"
    );
    const cssCode = fs.readFileSync(
      path.join(projectRoot, "src/app/globals.css"),
      "utf-8"
    );

    assert.ok(
      sliderCode.includes("dual-range") && sliderCode.includes("pointer-events-none"),
      "PriceRangeSlider inputs must have dual-range class and pointer-events-none"
    );

    assert.ok(
      cssCode.includes(".dual-range::-webkit-slider-thumb") &&
      cssCode.includes("pointer-events: auto;"),
      "globals.css must set pointer-events: auto on .dual-range thumbs"
    );
  });

  await t.test("DEF-07: Mobile category rail navigates to collection URL on collection pages", () => {
    const shopViewCode = fs.readFileSync(
      path.join(projectRoot, "src/app/shop/ShopClientView.tsx"),
      "utf-8"
    );

    assert.ok(
      shopViewCode.includes("if (initialCategory)") &&
      shopViewCode.includes("router.push(`/collections/${handle}`)") &&
      shopViewCode.includes('router.push("/shop")'),
      "ShopClientView must route category changes on collection pages to collection URLs"
    );
  });

  await t.test("DEF-08: Homepage anchor IDs are unique and avoid duplicate order-confidence IDs", () => {
    const homePageCode = fs.readFileSync(
      path.join(projectRoot, "src/app/page.tsx"),
      "utf-8"
    );
    const confSectionCode = fs.readFileSync(
      path.join(projectRoot, "src/components/home/OrderConfidenceSection.tsx"),
      "utf-8"
    );

    assert.ok(
      confSectionCode.includes("export function OrderConfidenceSection({ id = \"order-confidence\""),
      "OrderConfidenceSection must accept configurable id prop"
    );

    assert.ok(
      homePageCode.includes('id="order-confidence-mobile"'),
      "Mobile OrderConfidenceSection must use distinct id to prevent duplicate DOM IDs"
    );
  });

  await t.test("DEF-09: MobileFilterDrawer category tab badge excludes locked initialCategory", () => {
    const drawerCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/filters/MobileFilterDrawer.tsx"),
      "utf-8"
    );

    assert.ok(
      drawerCode.includes("!initialCategory || c !== initialCategory"),
      "MobileFilterDrawer must exclude initialCategory when calculating activeCount"
    );
  });

  // --------------------------------------------------------------------------
  // WP-4: Accessibility & Focus Restoration
  // --------------------------------------------------------------------------
  await t.test("DEF-04: FilterToolbar does not hijack mobileFilterTriggerRef", () => {
    const shopViewCode = fs.readFileSync(
      path.join(projectRoot, "src/app/shop/ShopClientView.tsx"),
      "utf-8"
    );

    // FilterToolbar invocation must NOT receive mobileTriggerRef={mobileFilterTriggerRef}
    const filterToolbarIdx = shopViewCode.indexOf("<FilterToolbar");
    const toolbarBlock = shopViewCode.slice(filterToolbarIdx, filterToolbarIdx + 400);
    assert.ok(
      !toolbarBlock.includes("mobileTriggerRef={mobileFilterTriggerRef}"),
      "FilterToolbar inside hidden md:block must not receive mobileFilterTriggerRef"
    );
  });

  await t.test("DEF-05: MobileFilterDrawer guards focus restoration with wasOpenRef", () => {
    const drawerCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/filters/MobileFilterDrawer.tsx"),
      "utf-8"
    );

    assert.ok(
      drawerCode.includes("wasOpenRef = useRef(false)") || drawerCode.includes("wasOpenRef"),
      "MobileFilterDrawer must use wasOpenRef to guard focus restoration"
    );

    assert.ok(
      drawerCode.includes("if (wasOpenRef.current)") &&
      drawerCode.includes("triggerRef?.current?.focus()"),
      "Focus restoration must occur only when transitioning from open to closed"
    );
  });

  await t.test("DEF-06: Modals isolate focus restoration cleanup and guard against stale triggers", () => {
    const cartDrawerCode = fs.readFileSync(
      path.join(projectRoot, "src/components/cart/CartDrawer.tsx"),
      "utf-8"
    );
    const checkoutModalCode = fs.readFileSync(
      path.join(projectRoot, "src/components/cart/DemoCheckoutModal.tsx"),
      "utf-8"
    );
    const quickViewCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/QuickViewModal.tsx"),
      "utf-8"
    );

    for (const code of [cartDrawerCode, checkoutModalCode, quickViewCode]) {
      assert.ok(
        code.includes("triggerElementRef.current = null;"),
        "Modal must clear triggerElementRef.current upon closing"
      );
    }
  });

  // --------------------------------------------------------------------------
  // WP-5: Storefront Resilience & Quality Gates
  // --------------------------------------------------------------------------
  await t.test("DEF-10: Branded not-found.tsx and error.tsx error boundary exist", () => {
    const notFoundPath = path.join(projectRoot, "src/app/not-found.tsx");
    const errorPath = path.join(projectRoot, "src/app/error.tsx");

    assert.ok(fs.existsSync(notFoundPath), "src/app/not-found.tsx must exist");
    assert.ok(fs.existsSync(errorPath), "src/app/error.tsx must exist");

    const notFoundCode = fs.readFileSync(notFoundPath, "utf-8");
    const errorCode = fs.readFileSync(errorPath, "utf-8");

    assert.ok(
      notFoundCode.includes("Aisle Not Found") && notFoundCode.includes("/shop"),
      "not-found.tsx must display branded 404 message and link to /shop"
    );
    assert.ok(
      errorCode.includes('"use client"') && errorCode.includes("reset"),
      "error.tsx must be a client component with error reset function"
    );
  });

  await t.test("DEF-12: Desktop sticky header rule verified by explicit media query regex in tests", () => {
    const phase16TestCode = fs.readFileSync(
      path.join(projectRoot, "tests/phase16-mobile-flow.test.ts"),
      "utf-8"
    );

    assert.ok(
      phase16TestCode.includes("@media") &&
      phase16TestCode.includes("min-width: 1024px") &&
      phase16TestCode.includes("position"),
      "phase16 test must explicitly verify @media (min-width: 1024px) sticky rule"
    );
  });

  await t.test("DEF-13: Shopify checklist documentation specifies 2025-01 default API version", () => {
    const checklistCode = fs.readFileSync(
      path.join(projectRoot, "SHOPIFY_INTEGRATION_CHECKLIST.md"),
      "utf-8"
    );

    assert.ok(
      checklistCode.includes("2025-01"),
      "SHOPIFY_INTEGRATION_CHECKLIST.md must document the canonical 2025-01 API version default"
    );
  });

  // --------------------------------------------------------------------------
  // Safety Invariants: Design Preservation
  // --------------------------------------------------------------------------
  await t.test("Safety Invariant: ProductCard.tsx remains untouched and protected", () => {
    const cardCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/ProductCard.tsx"),
      "utf-8"
    );
    assert.ok(cardCode.length > 0, "ProductCard.tsx must exist");
    // Ensure ProductCard preserves authentication gating
    assert.ok(
      cardCode.includes("Log in to view prices") && cardCode.includes("!isAuthenticated"),
      "ProductCard.tsx must strictly preserve its login-gated customer pricing contract"
    );
  });
});
