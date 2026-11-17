import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS } from "../src/lib/data/products";

const projectRoot = path.resolve(__dirname, "..");

test("Product Pricing Removal Specification Suite", async (t) => {
  const productCardPath = path.join(projectRoot, "src/components/products/ProductCard.tsx");
  const productListCardPath = path.join(projectRoot, "src/components/products/ProductListCard.tsx");
  const productCardCode = fs.readFileSync(productCardPath, "utf-8");
  const productListCardCode = fs.readFileSync(productListCardPath, "utf-8");

  await t.test("ProductCard: Completely removes visible prices, currency symbols, and price labels", () => {
    // Must NOT contain formatMoney or priceRange
    assert.ok(
      !productCardCode.includes("formatMoney"),
      "ProductCard must not use formatMoney"
    );
    assert.ok(
      !productCardCode.includes("priceRange"),
      "ProductCard must not access priceRange"
    );
    assert.ok(
      !productCardCode.includes("minVariantPrice"),
      "ProductCard must not access minVariantPrice"
    );

    // Must NOT contain price labels or login gates for prices
    assert.ok(
      !productCardCode.includes("Log in to view prices"),
      "ProductCard must not display 'Log in to view prices' label"
    );
    assert.ok(
      !productCardCode.includes("useAuth"),
      "ProductCard must not gate pricing behind useAuth"
    );

    // Must NOT contain currency symbols in rendered markup (excluding JS template interpolation ${})
    const hasCurrencyPriceSymbol = /\$[\s0-9]|[€£₹]/.test(productCardCode);
    assert.ok(
      !hasCurrencyPriceSymbol,
      "ProductCard must not contain currency symbols for pricing"
    );
  });

  await t.test("ProductCard: Preserves Add to Cart button, Plus icon, styling, and functionality", () => {
    // Add to Cart button must be present
    assert.ok(
      productCardCode.includes("Add to Cart"),
      "ProductCard must render 'Add to Cart' button text"
    );
    assert.ok(
      productCardCode.includes("<Plus"),
      "ProductCard must render Plus icon"
    );
    assert.ok(
      productCardCode.includes("handleAddToCart"),
      "ProductCard must wire handleAddToCart handler"
    );
    assert.ok(
      productCardCode.includes("addItem(product)"),
      "ProductCard handleAddToCart must invoke addItem(product)"
    );
    assert.ok(
      productCardCode.includes("bg-[#14532D]"),
      "ProductCard must preserve Irish Grocer brand color bg-[#14532D]"
    );
    assert.ok(
      productCardCode.includes("rounded-full"),
      "ProductCard must preserve rounded pill button styling"
    );
    assert.ok(
      productCardCode.includes("min-h-[44px]"),
      "ProductCard must guarantee minimum 44px touch target on mobile"
    );
    assert.ok(
      productCardCode.includes("disabled={!product.availableForSale}"),
      "ProductCard must respect product availability state"
    );
  });

  await t.test("ProductCard: Preserves product information, image, and stock status", () => {
    assert.ok(
      productCardCode.includes("<ProductImage"),
      "ProductCard must render ProductImage"
    );
    assert.ok(
      productCardCode.includes("product.title"),
      "ProductCard must display product title"
    );
    assert.ok(
      productCardCode.includes("product.vendor"),
      "ProductCard must display product brand/vendor"
    );
    assert.ok(
      productCardCode.includes("In stock") && productCardCode.includes("Out of stock"),
      "ProductCard must display stock indicator"
    );
  });

  await t.test("ProductListCard: Completely removes visible prices, currency symbols, and price labels", () => {
    // Must NOT contain formatMoney or priceRange
    assert.ok(
      !productListCardCode.includes("formatMoney"),
      "ProductListCard must not use formatMoney"
    );
    assert.ok(
      !productListCardCode.includes("priceRange"),
      "ProductListCard must not access priceRange"
    );
    assert.ok(
      !productListCardCode.includes("minVariantPrice"),
      "ProductListCard must not access minVariantPrice"
    );

    // Must NOT contain price labels or login gates for prices
    assert.ok(
      !productListCardCode.includes("Log in to view price"),
      "ProductListCard must not display 'Log in to view price' label"
    );
    assert.ok(
      !productListCardCode.includes("useAuth"),
      "ProductListCard must not gate pricing behind useAuth"
    );

    // Must NOT contain currency symbols in rendered markup (excluding JS template interpolation ${})
    const hasCurrencyPriceSymbol = /\$[\s0-9]|[€£₹]/.test(productListCardCode);
    assert.ok(
      !hasCurrencyPriceSymbol,
      "ProductListCard must not contain currency symbols for pricing"
    );
  });

  await t.test("ProductListCard: Preserves Add to Basket button, Plus icon, styling, and functionality", () => {
    assert.ok(
      productListCardCode.includes("Add to Basket"),
      "ProductListCard must render 'Add to Basket' button text"
    );
    assert.ok(
      productListCardCode.includes("<Plus"),
      "ProductListCard must render Plus icon"
    );
    assert.ok(
      productListCardCode.includes("handleAddToCart"),
      "ProductListCard must wire handleAddToCart handler"
    );
    assert.ok(
      productListCardCode.includes("addItem(product)"),
      "ProductListCard handleAddToCart must invoke addItem(product)"
    );
    assert.ok(
      productListCardCode.includes("bg-[#14532D]"),
      "ProductListCard must preserve Irish Grocer brand color bg-[#14532D]"
    );
    assert.ok(
      productListCardCode.includes("min-h-[44px]"),
      "ProductListCard must guarantee minimum 44px touch target on mobile"
    );
    assert.ok(
      productListCardCode.includes("disabled={!product.availableForSale}"),
      "ProductListCard must respect product availability state"
    );
  });

  await t.test("Checkout and cart calculation integrity: product price data remains in catalogue model", () => {
    // Verify that underlying mock data model still contains priceRange for checkout / cart calculation
    assert.ok(PRODUCTS.length > 0, "Products catalogue must exist");
    for (const p of PRODUCTS) {
      assert.ok(p.priceRange?.minVariantPrice?.amount, `Product ${p.id} must retain price amount for checkout`);
      assert.ok(p.variants?.[0]?.price?.amount, `Product ${p.id} must retain variant price amount`);
    }
  });
});
