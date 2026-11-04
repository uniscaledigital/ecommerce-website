import { Product } from "@/types";
import { FilterState, FacetCounts, ActiveChip, SortOption } from "./types";

export const DEFAULT_PRICE_BOUNDS: [number, number] = [0, 250];

export const CANONICAL_DIETARY_OPTIONS = [
  "Vegetarian",
  "Gluten-Free",
  "Irish Made",
  "Multipack",
  "Vegan",
  "Artisanal",
] as const;

export function getDefaultFilterState(priceBounds: [number, number] = DEFAULT_PRICE_BOUNDS): FilterState {
  return {
    availability: "all",
    categories: [],
    brands: [],
    priceRange: [priceBounds[0], priceBounds[1]],
    productTypes: [],
    dietary: [],
    minRating: 0,
    sortBy: "alphabetical-az",
    viewMode: "grid",
    searchQuery: "",
  };
}

/**
 * Pure filter predicate checking if a product matches a given filter state
 * Supports disabling specific dimension checks for disjunctive facet calculation.
 */
export function matchesFilter(
  product: Product,
  state: FilterState,
  skipDimension?: keyof FilterState
): boolean {
  // 1. Availability (In Stock / Out of Stock)
  if (skipDimension !== "availability" && state.availability !== "all") {
    if (state.availability === "in_stock" && !product.availableForSale) return false;
    if (state.availability === "out_of_stock" && product.availableForSale) return false;
  }

  // 2. Categories (OR logic within group)
  if (skipDimension !== "categories" && state.categories.length > 0) {
    const inCategory =
      product.collections?.some((c) => state.categories.includes(c)) ||
      state.categories.some(
        (cat) =>
          product.productType.toLowerCase().includes(cat.toLowerCase()) ||
          product.tags?.some((t) => t.toLowerCase() === cat.toLowerCase())
      );
    if (!inCategory) return false;
  }

  // 3. Brand / Vendor (OR logic within group)
  if (skipDimension !== "brands" && state.brands.length > 0) {
    if (!state.brands.includes(product.vendor)) return false;
  }

  // 4. Price Range (Numeric Min & Max)
  if (skipDimension !== "priceRange") {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    if (price < state.priceRange[0] || price > state.priceRange[1]) return false;
  }

  // 5. Product Type (OR logic within group)
  if (skipDimension !== "productTypes" && state.productTypes.length > 0) {
    if (!state.productTypes.includes(product.productType)) return false;
  }

  // 6. Dietary & Lifestyle (OR logic within group)
  if (skipDimension !== "dietary" && state.dietary.length > 0) {
    const hasDietaryTag = product.tags?.some((tag) => state.dietary.includes(tag));
    if (!hasDietaryTag) return false;
  }

  // 7. Minimum Rating
  if (skipDimension !== "minRating" && state.minRating > 0) {
    const productRating = product.rating?.value ?? 0;
    if (productRating < state.minRating) return false;
  }

  // 8. Search Query (Optional freeform keyword)
  if (state.searchQuery && state.searchQuery.trim().length > 0) {
    const q = state.searchQuery.toLowerCase();
    const matchesQuery =
      product.title.toLowerCase().includes(q) ||
      product.vendor.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.tags?.some((t) => t.toLowerCase().includes(q));
    if (!matchesQuery) return false;
  }

  return true;
}

/**
 * Filters and sorts products according to the given filter state.
 */
export function filterProducts(products: Product[], state: FilterState): Product[] {
  const filtered = products.filter((p) => matchesFilter(p, state));

  return sortProducts(filtered, state.sortBy);
}

/**
 * Sorts products according to the given sort option.
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const result = [...products];

  switch (sortBy) {
    case "alphabetical-az":
      return result.sort((a, b) => a.title.localeCompare(b.title));
    case "alphabetical-za":
      return result.sort((a, b) => b.title.localeCompare(a.title));
    case "price-low-high":
      return result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      );
    case "price-high-low":
      return result.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
      );
    case "rating-high-low":
      return result.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
    case "relevance":
    default:
      return result;
  }
}

/**
 * Calculates dynamic facet counts for each filter option based on actual catalogue data.
 * Uses disjunctive facet counts for selected multi-select groups for an intuitive shopping experience.
 */
export function calculateFacetCounts(
  products: Product[],
  state: FilterState
): FacetCounts {
  // Find global price bounds
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  for (const p of products) {
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    if (price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
  }
  if (minPrice === Infinity) minPrice = 0;
  if (maxPrice === -Infinity) maxPrice = 250;

  // Base products matching all filters except availability
  const availabilityBase = products.filter((p) => matchesFilter(p, state, "availability"));
  const inStock = availabilityBase.filter((p) => p.availableForSale).length;
  const outOfStock = availabilityBase.filter((p) => !p.availableForSale).length;

  // Base products for categories
  const categoriesBase = products.filter((p) => matchesFilter(p, state, "categories"));
  const categoriesCounts: Record<string, number> = {};
  for (const p of categoriesBase) {
    if (p.collections) {
      for (const col of p.collections) {
        categoriesCounts[col] = (categoriesCounts[col] || 0) + 1;
      }
    }
  }

  // Base products for brands
  const brandsBase = products.filter((p) => matchesFilter(p, state, "brands"));
  const brandsCounts: Record<string, number> = {};
  for (const p of brandsBase) {
    if (p.vendor) {
      brandsCounts[p.vendor] = (brandsCounts[p.vendor] || 0) + 1;
    }
  }

  // Base products for product types
  const typesBase = products.filter((p) => matchesFilter(p, state, "productTypes"));
  const productTypesCounts: Record<string, number> = {};
  for (const p of typesBase) {
    if (p.productType) {
      productTypesCounts[p.productType] = (productTypesCounts[p.productType] || 0) + 1;
    }
  }

  // Base products for dietary & lifestyle
  const dietaryBase = products.filter((p) => matchesFilter(p, state, "dietary"));
  const dietaryCounts: Record<string, number> = {};
  for (const p of dietaryBase) {
    if (p.tags) {
      for (const tag of p.tags) {
        dietaryCounts[tag] = (dietaryCounts[tag] || 0) + 1;
      }
    }
  }

  // Base products for ratings
  const ratingsBase = products.filter((p) => matchesFilter(p, state, "minRating"));
  const ratings = {
    fourPlus: ratingsBase.filter((p) => (p.rating?.value ?? 0) >= 4.0).length,
    threePlus: ratingsBase.filter((p) => (p.rating?.value ?? 0) >= 3.0).length,
    twoPlus: ratingsBase.filter((p) => (p.rating?.value ?? 0) >= 2.0).length,
    onePlus: ratingsBase.filter((p) => (p.rating?.value ?? 0) >= 1.0).length,
  };

  return {
    availability: {
      inStock,
      outOfStock,
      all: availabilityBase.length,
    },
    categories: categoriesCounts,
    brands: brandsCounts,
    productTypes: productTypesCounts,
    dietary: dietaryCounts,
    ratings,
    priceBounds: {
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
    },
  };
}

/**
 * Builds the active chip representations from current filter state.
 */
export function getActiveChips(
  state: FilterState,
  categoryTitleMap: Record<string, string>,
  defaultPriceBounds: [number, number] = DEFAULT_PRICE_BOUNDS
): ActiveChip[] {
  const chips: ActiveChip[] = [];

  // Availability chip
  if (state.availability === "in_stock") {
    chips.push({ id: "avail-in_stock", label: "In Stock", group: "availability", value: "in_stock" });
  } else if (state.availability === "out_of_stock") {
    chips.push({ id: "avail-out_of_stock", label: "Out of Stock", group: "availability", value: "out_of_stock" });
  }

  // Category chips
  for (const cat of state.categories) {
    const label = categoryTitleMap[cat] || cat;
    chips.push({ id: `cat-${cat}`, label: `Category: ${label}`, group: "category", value: cat });
  }

  // Brand chips
  for (const brand of state.brands) {
    chips.push({ id: `brand-${brand}`, label: `Brand: ${brand}`, group: "brand", value: brand });
  }

  // Price chip (if bounds differ from default)
  if (state.priceRange[0] > defaultPriceBounds[0] || state.priceRange[1] < defaultPriceBounds[1]) {
    chips.push({
      id: "price-range",
      label: `$${state.priceRange[0]} - $${state.priceRange[1]}`,
      group: "price",
      value: `${state.priceRange[0]}-${state.priceRange[1]}`,
    });
  }

  // Product Type chips
  for (const type of state.productTypes) {
    chips.push({ id: `type-${type}`, label: `Type: ${type}`, group: "productType", value: type });
  }

  // Dietary chips
  for (const diet of state.dietary) {
    chips.push({ id: `diet-${diet}`, label: diet, group: "dietary", value: diet });
  }

  // Rating chip
  if (state.minRating > 0) {
    chips.push({
      id: `rating-${state.minRating}`,
      label: `${state.minRating}★ & above`,
      group: "rating",
      value: state.minRating,
    });
  }

  return chips;
}

