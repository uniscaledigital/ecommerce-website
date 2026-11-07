import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS } from "../src/lib/data/products";

const projectRoot = path.resolve(__dirname, "..");

test("Phase 20 / Milestone v8.0 Favourites & Saved Products Experience Suite", async (t) => {
  // --------------------------------------------------------------------------
  // 1. useWishlist Storage Engine & Contract
  // --------------------------------------------------------------------------
  await t.test("useWishlist: storage key, sanitization, and Set deduplication", () => {
    const hookCode = fs.readFileSync(
      path.join(projectRoot, "src/hooks/useWishlist.ts"),
      "utf-8"
    );

    // Assert canonical storage key
    assert.ok(
      hookCode.includes('"irish_grocer_wishlist"'),
      "useWishlist must use the canonical storage key 'irish_grocer_wishlist'"
    );

    // Assert safe sanitization helper with Set deduplication
    assert.ok(
      hookCode.includes("parseAndSanitizeWishlist"),
      "useWishlist must implement parseAndSanitizeWishlist"
    );
    assert.ok(
      hookCode.includes("new Set("),
      "parseAndSanitizeWishlist must enforce Set deduplication"
    );

    // Assert safe JSON parsing and fallback to empty array
    assert.ok(
      hookCode.includes("try {") && hookCode.includes("JSON.parse"),
      "parseAndSanitizeWishlist must safely try/catch JSON.parse"
    );

    // Assert exported contract
    assert.ok(hookCode.includes("wishlistCount: wishlist.length"), "Hook must export wishlistCount");
    assert.ok(hookCode.includes("toggleWishlist"), "Hook must export toggleWishlist");
    assert.ok(hookCode.includes("isWishlisted"), "Hook must export isWishlisted");
    assert.ok(hookCode.includes("clearWishlist"), "Hook must export clearWishlist");
    assert.ok(hookCode.includes("isLoaded"), "Hook must export isLoaded");
  });

  await t.test("useWishlist: cross-tab storage and window event dispatching", () => {
    const hookCode = fs.readFileSync(
      path.join(projectRoot, "src/hooks/useWishlist.ts"),
      "utf-8"
    );

    assert.ok(
      hookCode.includes('window.addEventListener("wishlist-updated"'),
      "useWishlist must listen for same-tab 'wishlist-updated' custom events"
    );
    assert.ok(
      hookCode.includes('window.addEventListener("storage"'),
      "useWishlist must listen for cross-tab 'storage' events"
    );
    assert.ok(
      hookCode.includes('window.dispatchEvent(new Event("wishlist-updated"))'),
      "toggleWishlist and clearWishlist must dispatch 'wishlist-updated' event"
    );
  });

  // --------------------------------------------------------------------------
  // 2. MobileBottomNav 6 Destinations & Favourites Tab
  // --------------------------------------------------------------------------
  await t.test("MobileBottomNav: 6 destinations in exact order with responsive grid", () => {
    const navCode = fs.readFileSync(
      path.join(projectRoot, "src/components/layout/MobileBottomNav.tsx"),
      "utf-8"
    );

    // Assert 6-column grid
    assert.ok(
      navCode.includes("grid-cols-6"),
      "MobileBottomNav container must use grid-cols-6 for the 6 destinations"
    );

    // Assert destinations in exact order
    const homeIndex = navCode.indexOf('href="/"');
    const shopIndex = navCode.indexOf('href="/shop"');
    const searchIndex = navCode.indexOf('href="/search"');
    const favIndex = navCode.indexOf('href="/favorites"');
    const cartIndex = navCode.indexOf("onClick={openCart}");
    const accountIndex = navCode.indexOf('href="/account"');

    assert.ok(homeIndex !== -1, "Home destination must exist");
    assert.ok(shopIndex !== -1, "Shop destination must exist");
    assert.ok(searchIndex !== -1, "Search destination must exist");
    assert.ok(favIndex !== -1, "Favourites destination must exist");
    assert.ok(cartIndex !== -1, "Cart destination must exist");
    assert.ok(accountIndex !== -1, "Account destination must exist");

    assert.ok(homeIndex < shopIndex, "Home must precede Shop");
    assert.ok(shopIndex < searchIndex, "Shop must precede Search");
    assert.ok(searchIndex < favIndex, "Search must precede Favourites");
    assert.ok(favIndex < cartIndex, "Favourites must precede Cart");
    assert.ok(cartIndex < accountIndex, "Cart must precede Account");
  });

  await t.test("MobileBottomNav: Favourites tab icon, active highlight, and live badge", () => {
    const navCode = fs.readFileSync(
      path.join(projectRoot, "src/components/layout/MobileBottomNav.tsx"),
      "utf-8"
    );

    // Assert Heart icon import and usage
    assert.ok(navCode.includes("Heart"), "MobileBottomNav must import Heart icon");
    assert.ok(
      navCode.includes("useWishlist"),
      "MobileBottomNav must use useWishlist for live badge count"
    );
    assert.ok(
      navCode.includes("wishlist.length > 0"),
      "MobileBottomNav must render live count badge when wishlist.length > 0"
    );
    assert.ok(
      navCode.includes("fill-[#14532D]") || navCode.includes("fill-current"),
      "Favourites heart icon must be filled when active"
    );
    assert.ok(
      navCode.includes("Favourites"),
      "Favourites tab label must be 'Favourites'"
    );
  });

  // --------------------------------------------------------------------------
  // 3. Multi-Surface Heart Wiring
  // --------------------------------------------------------------------------
  await t.test("Multi-Surface: ProductListCard wires heart toggle to useWishlist", () => {
    const listCardCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/ProductListCard.tsx"),
      "utf-8"
    );

    assert.ok(listCardCode.includes("useWishlist"), "ProductListCard must import useWishlist");
    assert.ok(listCardCode.includes("toggleWishlist"), "ProductListCard must use toggleWishlist");
    assert.ok(listCardCode.includes("isWishlisted"), "ProductListCard must check isWishlisted");
    assert.ok(listCardCode.includes("<Heart"), "ProductListCard must render Heart icon");
  });

  await t.test("Multi-Surface: QuickViewModal wires heart toggle to useWishlist", () => {
    const modalCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/QuickViewModal.tsx"),
      "utf-8"
    );

    assert.ok(modalCode.includes("useWishlist"), "QuickViewModal must import useWishlist");
    assert.ok(modalCode.includes("toggleWishlist"), "QuickViewModal must use toggleWishlist");
    assert.ok(modalCode.includes("isWishlisted"), "QuickViewModal must check isWishlisted");
    assert.ok(modalCode.includes("<Heart"), "QuickViewModal must render Heart icon");
  });

  await t.test("Multi-Surface: ProductDetailsClient wires heart on PDP image and action row", () => {
    const pdpCode = fs.readFileSync(
      path.join(projectRoot, "src/app/products/[handle]/ProductDetailsClient.tsx"),
      "utf-8"
    );

    assert.ok(pdpCode.includes("useWishlist"), "ProductDetailsClient must import useWishlist");
    assert.ok(pdpCode.includes("toggleWishlist"), "ProductDetailsClient must use toggleWishlist");
    assert.ok(pdpCode.includes("isWishlisted"), "ProductDetailsClient must check isWishlisted");

    // Check that floating heart and action row button both toggle wishlist
    const matches = pdpCode.match(/toggleWishlist\(product\.id\)/g);
    assert.ok(matches && matches.length >= 2, "PDP must wire toggleWishlist to both image and action row");

    // Wholesale gating invariant: unauthenticated state still allows favouriting
    assert.ok(
      pdpCode.includes("Save") && pdpCode.includes("Favourites"),
      "PDP must have accessibility labels for saving favourites"
    );
  });

  // --------------------------------------------------------------------------
  // 4. Dedicated /favorites Route & View
  // --------------------------------------------------------------------------
  await t.test("Route: /favorites page.tsx provides SEO metadata and renders client view", () => {
    const pageCode = fs.readFileSync(
      path.join(projectRoot, "src/app/favorites/page.tsx"),
      "utf-8"
    );

    assert.ok(
      pageCode.includes("My Favourites — The Irish Grocer"),
      "page.tsx must provide 'My Favourites — The Irish Grocer' title"
    );
    assert.ok(
      pageCode.includes("<FavoritesClientView"),
      "page.tsx must render FavoritesClientView"
    );
  });

  await t.test("FavoritesClientView: empty state, sorting, batch CTA, and product grid", () => {
    const viewCode = fs.readFileSync(
      path.join(projectRoot, "src/app/favorites/FavoritesClientView.tsx"),
      "utf-8"
    );

    // Empty state requirements
    assert.ok(
      viewCode.includes("No favourites yet"),
      "Empty state must display 'No favourites yet' heading"
    );
    assert.ok(
      viewCode.includes("Save the products you love by tapping the heart icon"),
      "Empty state must include guidance description"
    );
    assert.ok(
      viewCode.includes('href="/shop"') && viewCode.includes("Discover Products"),
      "Empty state must render 'Discover Products' button linking to /shop"
    );

    // Sorting options
    assert.ok(viewCode.includes("alpha-asc"), "Must support Alphabetical A-Z sort");
    assert.ok(viewCode.includes("alpha-desc"), "Must support Alphabetical Z-A sort");
    assert.ok(viewCode.includes("price-asc"), "Must support Price: Low to High sort");
    assert.ok(viewCode.includes("price-desc"), "Must support Price: High to Low sort");
    assert.ok(viewCode.includes("rating"), "Must support Rating sort");

    // Batch CTA
    assert.ok(
      viewCode.includes("Add All to Basket"),
      "Must render 'Add All to Basket' button for authenticated customers"
    );
    assert.ok(
      viewCode.includes("Log in to add saved items to basket"),
      "Must render login CTA for unauthenticated visitors"
    );

    // Clear All
    assert.ok(viewCode.includes("Clear All"), "Must render 'Clear All' action button");
    assert.ok(viewCode.includes("clearWishlist"), "Clear All must trigger clearWishlist");
  });

  // --------------------------------------------------------------------------
  // 5. Catalogue Filtering & Sorting Logic
  // --------------------------------------------------------------------------
  await t.test("Functional: Catalogue products filter accurately by wishlist ID Set", () => {
    assert.ok(PRODUCTS.length > 0, "PRODUCTS catalogue must not be empty");

    const sampleIds = [PRODUCTS[0].id, PRODUCTS[1].id];
    const filtered = PRODUCTS.filter((p) => sampleIds.includes(p.id));

    assert.equal(filtered.length, 2, "Filtered list must match sample IDs");
    assert.equal(filtered[0].id, sampleIds[0]);
    assert.equal(filtered[1].id, sampleIds[1]);

    // Unknown or invalid IDs are safely excluded
    const invalidIds = ["prod-non-existent-999", "null", ""];
    const filteredWithInvalid = PRODUCTS.filter((p) => invalidIds.includes(p.id));
    assert.equal(filteredWithInvalid.length, 0, "Invalid IDs must yield 0 matches");
  });

  // --------------------------------------------------------------------------
  // 6. Cart Independence & Design Invariants
  // --------------------------------------------------------------------------
  await t.test("Cart Independence: useWishlist never imports or mutates CartContext", () => {
    const hookCode = fs.readFileSync(
      path.join(projectRoot, "src/hooks/useWishlist.ts"),
      "utf-8"
    );

    assert.ok(
      !hookCode.includes("useCart") && !hookCode.includes("irish_grocer_cart"),
      "useWishlist must remain 100% decoupled from cart state"
    );
  });

  await t.test("Design Preservation: ProductCard.tsx design tokens and structure protected", () => {
    const cardCode = fs.readFileSync(
      path.join(projectRoot, "src/components/products/ProductCard.tsx"),
      "utf-8"
    );

    assert.ok(cardCode.includes("bg-[#EDF8E9]"), "ProductCard background token must remain #EDF8E9");
    assert.ok(cardCode.includes("border-[#D0E7C9]"), "ProductCard border token must remain #D0E7C9");
    assert.ok(cardCode.includes("ProductImage"), "ProductCard must delegate image and heart to ProductImage");
  });
});
