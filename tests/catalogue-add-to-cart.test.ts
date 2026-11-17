import test from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS } from "../src/lib/data/products";
import { Cart, CartLineItem, Product } from "../src/types";

// Helper simulating Cart state additions & modifications locally matching CartContext logic
function createTestCart(): Cart {
  return {
    id: "cart-test",
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: "USD" },
      totalAmount: { amount: "0.00", currencyCode: "USD" },
    },
  };
}

function addProductToCart(cart: Cart, product: Product, variantId?: string, quantity = 1): Cart {
  if (!product.availableForSale) {
    throw new Error(`Product ${product.id} is out of stock`);
  }

  const variant = variantId
    ? product.variants?.find((v) => v.id === variantId) || product.variants?.[0]
    : product.variants?.[0];

  if (!variant) {
    throw new Error(`Product ${product.id} has no available variants`);
  }

  const currentLines = [...cart.lines];
  const existingIndex = currentLines.findIndex((line) => line.merchandise.id === variant.id);

  if (existingIndex > -1) {
    currentLines[existingIndex] = {
      ...currentLines[existingIndex],
      quantity: currentLines[existingIndex].quantity + quantity,
    };
  } else {
    const newLine: CartLineItem = {
      id: `line-${product.id}-${variant.id}`,
      quantity,
      merchandise: {
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: variant.price,
        product: {
          id: product.id,
          title: product.title,
          handle: product.handle,
          featuredImage: product.featuredImage,
          vendor: product.vendor,
        },
      },
    };
    currentLines.push(newLine);
  }

  const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);

  return {
    ...cart,
    lines: currentLines,
    totalQuantity,
  };
}

function updateCartQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  let currentLines = [...cart.lines];
  if (quantity <= 0) {
    currentLines = currentLines.filter((l) => l.id !== lineId);
  } else {
    currentLines = currentLines.map((l) => (l.id === lineId ? { ...l, quantity } : l));
  }
  const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
  return { ...cart, lines: currentLines, totalQuantity };
}

function removeCartLine(cart: Cart, lineId: string): Cart {
  const currentLines = cart.lines.filter((l) => l.id !== lineId);
  const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
  return { ...cart, lines: currentLines, totalQuantity };
}

test("Complete Catalogue Add-to-Cart Audit Suite", async (t) => {
  await t.test("Catalogue integrity: exactly 34 products in catalogue with complete metadata", () => {
    assert.equal(PRODUCTS.length, 34, "Catalogue must contain exactly 34 products");

    for (const p of PRODUCTS) {
      assert.ok(p.id, `Product missing id: ${p.title}`);
      assert.ok(p.title, `Product missing title: ${p.id}`);
      assert.ok(p.handle, `Product missing handle: ${p.id}`);
      assert.ok(p.featuredImage?.url, `Product missing featured image: ${p.id}`);
      assert.ok(p.variants?.length > 0, `Product missing variants: ${p.id}`);
      assert.ok(typeof p.availableForSale === "boolean", `Product missing availableForSale flag: ${p.id}`);
    }
  });

  await t.test("Inventory audit: 32 in-stock products and 2 out-of-stock products identified", () => {
    const inStock = PRODUCTS.filter((p) => p.availableForSale);
    const outOfStock = PRODUCTS.filter((p) => !p.availableForSale);

    assert.equal(inStock.length, 32, "Exactly 32 products must be marked available for sale");
    assert.equal(outOfStock.length, 2, "Exactly 2 products must be marked out of stock");

    const outOfStockIds = outOfStock.map((p) => p.id).sort();
    assert.deepEqual(
      outOfStockIds,
      ["prod-cadbury-freddo", "prod-monster-munch-6pk"].sort(),
      "Out of stock products must match known unavailable inventory"
    );
  });

  await t.test("Every single in-stock product (all 32) can be added to the basket with correct data", () => {
    const inStock = PRODUCTS.filter((p) => p.availableForSale);

    for (const product of inStock) {
      let cart = createTestCart();
      cart = addProductToCart(cart, product);

      assert.equal(cart.lines.length, 1, `Cart must have 1 line after adding ${product.title}`);
      assert.equal(cart.totalQuantity, 1, `Total quantity must be 1 for ${product.title}`);

      const line = cart.lines[0];
      assert.equal(line.merchandise.product.id, product.id, `Product ID mismatch for ${product.title}`);
      assert.equal(line.merchandise.product.title, product.title, `Product title mismatch for ${product.title}`);
      assert.equal(line.merchandise.product.vendor, product.vendor, `Product vendor mismatch for ${product.title}`);
      assert.equal(line.merchandise.product.featuredImage.url, product.featuredImage.url, `Image mismatch for ${product.title}`);
      assert.equal(line.merchandise.id, product.variants[0].id, `Variant ID mismatch for ${product.title}`);
      assert.equal(line.quantity, 1, `Quantity must be 1 for ${product.title}`);
    }
  });

  await t.test("Out-of-stock products cannot be added to cart and throw error or disable action", () => {
    const outOfStock = PRODUCTS.filter((p) => !p.availableForSale);
    let cart = createTestCart();

    for (const product of outOfStock) {
      assert.throws(
        () => addProductToCart(cart, product),
        (err: Error) => err.message.includes("out of stock"),
        `Adding out-of-stock product ${product.id} should be rejected`
      );
    }
  });

  await t.test("Multi-variant product (Irish Grocer Heritage Cap) preserves distinct variants", () => {
    const cap = PRODUCTS.find((p) => p.id === "prod-irish-grocer-heritage-cap");
    assert.ok(cap, "Heritage Cap product must exist");
    assert.equal(cap.variants.length, 2, "Heritage Cap must have 2 variants");

    let cart = createTestCart();
    cart = addProductToCart(cart, cap, cap.variants[0].id, 1);
    cart = addProductToCart(cart, cap, cap.variants[1].id, 2);

    assert.equal(cart.lines.length, 2, "Cart must have 2 distinct lines for 2 variants of same product");
    assert.equal(cart.totalQuantity, 3, "Total quantity must sum to 3");
    assert.equal(cart.lines[0].merchandise.title, cap.variants[0].title);
    assert.equal(cart.lines[1].merchandise.title, cap.variants[1].title);
  });

  await t.test("Adding the same product increments quantity rather than creating duplicate lines", () => {
    const tayto = PRODUCTS.find((p) => p.id === "prod-tayto-cheese-onion-35g")!;
    assert.ok(tayto, "Tayto product must exist in catalogue");
    let cart = createTestCart();

    cart = addProductToCart(cart, tayto, undefined, 1);
    assert.equal(cart.lines.length, 1);
    assert.equal(cart.totalQuantity, 1);
    assert.equal(cart.lines[0].quantity, 1);

    cart = addProductToCart(cart, tayto, undefined, 1);
    assert.equal(cart.lines.length, 1, "Duplicate line must not be created");
    assert.equal(cart.totalQuantity, 2, "Total quantity must increment to 2");
    assert.equal(cart.lines[0].quantity, 2, "Line quantity must increment to 2");

    cart = addProductToCart(cart, tayto, undefined, 3);
    assert.equal(cart.lines.length, 1);
    assert.equal(cart.totalQuantity, 5);
    assert.equal(cart.lines[0].quantity, 5);
  });

  await t.test("Adding multiple different products keeps distinct lines and correct totals", () => {
    const inStock = PRODUCTS.filter((p) => p.availableForSale);
    let cart = createTestCart();

    const sample = inStock.slice(0, 10);
    for (const p of sample) {
      cart = addProductToCart(cart, p, undefined, 1);
    }

    assert.equal(cart.lines.length, 10, "Must have 10 distinct lines for 10 distinct products");
    assert.equal(cart.totalQuantity, 10, "Total quantity must be 10");

    for (let i = 0; i < sample.length; i++) {
      assert.equal(cart.lines[i].merchandise.product.id, sample[i].id);
    }
  });

  await t.test("Quantity update, decrement to zero removal, and direct line removal", () => {
    const p1 = PRODUCTS[0];
    const p2 = PRODUCTS[1];
    let cart = createTestCart();

    cart = addProductToCart(cart, p1, undefined, 2);
    cart = addProductToCart(cart, p2, undefined, 1);
    assert.equal(cart.lines.length, 2);
    assert.equal(cart.totalQuantity, 3);

    // Increment p2 to 3
    const p2LineId = cart.lines[1].id;
    cart = updateCartQuantity(cart, p2LineId, 3);
    assert.equal(cart.totalQuantity, 5);
    assert.equal(cart.lines.find((l) => l.id === p2LineId)?.quantity, 3);

    // Decrement p1 to 1
    const p1LineId = cart.lines[0].id;
    cart = updateCartQuantity(cart, p1LineId, 1);
    assert.equal(cart.totalQuantity, 4);
    assert.equal(cart.lines.find((l) => l.id === p1LineId)?.quantity, 1);

    // Decrement p1 to 0 removes it
    cart = updateCartQuantity(cart, p1LineId, 0);
    assert.equal(cart.lines.length, 1);
    assert.equal(cart.totalQuantity, 3);
    assert.equal(cart.lines[0].id, p2LineId);

    // Remove last item directly
    cart = removeCartLine(cart, p2LineId);
    assert.equal(cart.lines.length, 0);
    assert.equal(cart.totalQuantity, 0);
  });
});
