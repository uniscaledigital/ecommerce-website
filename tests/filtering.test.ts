import test from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS } from "../src/lib/data/products";
import {
  filterProducts,
  calculateFacetCounts,
  getActiveChips,
  getDefaultFilterState,
  matchesFilter,
} from "../src/lib/filtering/engine";
import { FilterState } from "../src/lib/filtering/types";

test("Filtering Engine: Availability Dimension", async (t) => {
  const base = getDefaultFilterState();

  await t.test("returns all 34 products when availability is 'all'", () => {
    const results = filterProducts(PRODUCTS, { ...base, availability: "all" });
    assert.equal(results.length, 34);
  });

  await t.test("returns 32 products when availability is 'in_stock'", () => {
    const results = filterProducts(PRODUCTS, { ...base, availability: "in_stock" });
    assert.equal(results.length, 32);
    assert.ok(results.every((p) => p.availableForSale));
  });

  await t.test("returns 2 products when availability is 'out_of_stock'", () => {
    const results = filterProducts(PRODUCTS, { ...base, availability: "out_of_stock" });
    assert.equal(results.length, 2);
    assert.ok(results.every((p) => !p.availableForSale));
  });
});

test("Filtering Engine: Category Multi-Select with OR Logic", async (t) => {
  const base = getDefaultFilterState();

  await t.test("filters by a single category", () => {
    const results = filterProducts(PRODUCTS, { ...base, categories: ["tea-coffee"] });
    assert.ok(results.length >= 3);
    assert.ok(results.every((p) => p.collections?.includes("tea-coffee") || p.productType.toLowerCase().includes("tea")));
  });

  await t.test("combines multiple categories with OR logic", () => {
    const teaResults = filterProducts(PRODUCTS, { ...base, categories: ["tea-coffee"] });
    const meatResults = filterProducts(PRODUCTS, { ...base, categories: ["meats"] });
    const combinedResults = filterProducts(PRODUCTS, { ...base, categories: ["tea-coffee", "meats"] });

    assert.equal(combinedResults.length, teaResults.length + meatResults.length);
  });
});

test("Filtering Engine: Brand Multi-Select with OR Logic", async (t) => {
  const base = getDefaultFilterState();

  await t.test("filters by single vendor brand", () => {
    const results = filterProducts(PRODUCTS, { ...base, brands: ["Tayto"] });
    assert.ok(results.length > 0);
    assert.ok(results.every((p) => p.vendor === "Tayto"));
  });

  await t.test("combines multiple brands with OR logic", () => {
    const taytoCount = PRODUCTS.filter((p) => p.vendor === "Tayto").length;
    const walkersCount = PRODUCTS.filter((p) => p.vendor === "Walkers").length;
    const results = filterProducts(PRODUCTS, { ...base, brands: ["Tayto", "Walkers"] });

    assert.equal(results.length, taytoCount + walkersCount);
    assert.ok(results.every((p) => p.vendor === "Tayto" || p.vendor === "Walkers"));
  });
});

test("Filtering Engine: Price Range Boundaries", async (t) => {
  const base = getDefaultFilterState();

  await t.test("filters products within specific price range", () => {
    const results = filterProducts(PRODUCTS, { ...base, priceRange: [5.0, 10.0] });
    assert.ok(results.length > 0);
    for (const p of results) {
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      assert.ok(price >= 5.0 && price <= 10.0, `Price ${price} out of range [5, 10]`);
    }
  });

  await t.test("returns zero products for an impossible price range", () => {
    const results = filterProducts(PRODUCTS, { ...base, priceRange: [1000, 2000] });
    assert.equal(results.length, 0);
  });
});

test("Filtering Engine: Dietary & Lifestyle Attributes", async (t) => {
  const base = getDefaultFilterState();

  await t.test("filters by Vegan tag", () => {
    const results = filterProducts(PRODUCTS, { ...base, dietary: ["Vegan"] });
    assert.equal(results.length, 8);
    assert.ok(results.every((p) => p.tags.includes("Vegan")));
  });

  await t.test("filters by Gluten-Free tag", () => {
    const results = filterProducts(PRODUCTS, { ...base, dietary: ["Gluten-Free"] });
    assert.equal(results.length, 13);
    assert.ok(results.every((p) => p.tags.includes("Gluten-Free")));
  });

  await t.test("combines multiple dietary tags with OR logic", () => {
    const results = filterProducts(PRODUCTS, { ...base, dietary: ["Vegan", "Gluten-Free"] });
    assert.ok(results.length >= 13);
    assert.ok(results.every((p) => p.tags.includes("Vegan") || p.tags.includes("Gluten-Free")));
  });
});

test("Filtering Engine: Customer Star Ratings", async (t) => {
  const base = getDefaultFilterState();

  await t.test("filters products with rating >= 4.8", () => {
    const results = filterProducts(PRODUCTS, { ...base, minRating: 4.8 });
    assert.ok(results.length > 0);
    assert.ok(results.every((p) => (p.rating?.value ?? 0) >= 4.8));
  });

  await t.test("all products pass minRating of 1.0", () => {
    const results = filterProducts(PRODUCTS, { ...base, minRating: 1.0 });
    assert.equal(results.length, 34);
  });
});

test("Filtering Engine: Multi-Group AND Combination Logic", async (t) => {
  const base = getDefaultFilterState();

  await t.test("combines Category AND Brand AND Price AND In-Stock", () => {
    const state: FilterState = {
      ...base,
      categories: ["crisps-snacks"],
      brands: ["Tayto"],
      priceRange: [1.0, 5.0],
      availability: "in_stock",
    };

    const results = filterProducts(PRODUCTS, state);
    assert.ok(results.length > 0);
    for (const p of results) {
      assert.equal(p.vendor, "Tayto");
      assert.ok(p.availableForSale);
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      assert.ok(price >= 1.0 && price <= 5.0);
    }
  });
});

test("Filtering Engine: Dynamic Facet Counts Calculation", async (t) => {
  const base = getDefaultFilterState();
  const counts = calculateFacetCounts(PRODUCTS, base);

  await t.test("accurately counts availability dimensions", () => {
    assert.equal(counts.availability.all, 34);
    assert.equal(counts.availability.inStock, 32);
    assert.equal(counts.availability.outOfStock, 2);
  });

  await t.test("accurately counts brands across catalogue", () => {
    assert.equal(counts.brands["Tayto"], 2);
    assert.equal(counts.brands["Walkers"], 3);
    assert.equal(counts.brands["Barry's Tea"], 2);
  });

  await t.test("accurately calculates price bounds", () => {
    assert.equal(counts.priceBounds.min, 0);
    assert.equal(counts.priceBounds.max, 220);
  });
});

test("Filtering Engine: Active Chips Generation", async (t) => {
  const base = getDefaultFilterState();
  const categoryMap = { "crisps-snacks": "Crisps & Snacks" };

  await t.test("generates correct chips for active criteria", () => {
    const state: FilterState = {
      ...base,
      availability: "in_stock",
      brands: ["Tayto"],
      dietary: ["Gluten-Free"],
      minRating: 4.5,
    };

    const chips = getActiveChips(state, categoryMap);
    assert.equal(chips.length, 4);

    const groups = chips.map((c) => c.group);
    assert.ok(groups.includes("availability"));
    assert.ok(groups.includes("brand"));
    assert.ok(groups.includes("dietary"));
    assert.ok(groups.includes("rating"));
  });
});

test("Filtering Engine: Sorting Invariants", async (t) => {
  const base = getDefaultFilterState();

  await t.test("sorts alphabetically A-Z", () => {
    const sorted = filterProducts(PRODUCTS, { ...base, sortBy: "alphabetical-az" });
    for (let i = 0; i < sorted.length - 1; i++) {
      assert.ok(sorted[i].title.localeCompare(sorted[i + 1].title) <= 0);
    }
  });

  await t.test("sorts by price low to high", () => {
    const sorted = filterProducts(PRODUCTS, { ...base, sortBy: "price-low-high" });
    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = parseFloat(sorted[i].priceRange.minVariantPrice.amount);
      const p2 = parseFloat(sorted[i + 1].priceRange.minVariantPrice.amount);
      assert.ok(p1 <= p2, `Sort violation: ${p1} > ${p2}`);
    }
  });

  await t.test("sorts by price high to low", () => {
    const sorted = filterProducts(PRODUCTS, { ...base, sortBy: "price-high-low" });
    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = parseFloat(sorted[i].priceRange.minVariantPrice.amount);
      const p2 = parseFloat(sorted[i + 1].priceRange.minVariantPrice.amount);
      assert.ok(p1 >= p2, `Sort violation: ${p1} < ${p2}`);
    }
  });

  await t.test("sorts by customer rating descending", () => {
    const sorted = filterProducts(PRODUCTS, { ...base, sortBy: "rating-high-low" });
    for (let i = 0; i < sorted.length - 1; i++) {
      const r1 = sorted[i].rating?.value ?? 0;
      const r2 = sorted[i + 1].rating?.value ?? 0;
      assert.ok(r1 >= r2, `Rating sort violation: ${r1} < ${r2}`);
    }
  });
});

