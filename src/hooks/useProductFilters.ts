"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product } from "@/types";
import {
  FilterState,
  AvailabilityFilter,
  SortOption,
  ViewMode,
  ActiveChip,
} from "@/lib/filtering/types";
import {
  getDefaultFilterState,
  filterProducts,
  calculateFacetCounts,
  getActiveChips,
  DEFAULT_PRICE_BOUNDS,
} from "@/lib/filtering/engine";

interface UseProductFiltersProps {
  products: Product[];
  categoryTitleMap?: Record<string, string>;
  initialCategory?: string; // If on a collection page
  syncUrl?: boolean;
}

export function useProductFilters({
  products,
  categoryTitleMap = {},
  initialCategory,
  syncUrl = true,
}: UseProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine initial catalogue price bounds
  const defaultBounds = useMemo<[number, number]>(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const p of products) {
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      if (price < min) min = price;
      if (price > max) max = price;
    }
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 250;
    return [Math.floor(min), Math.ceil(max)];
  }, [products]);

  // Initial state derived from URL or props
  const [state, setState] = useState<FilterState>(() => {
    const base = getDefaultFilterState(defaultBounds);

    if (initialCategory) {
      base.categories = [initialCategory];
    }

    if (!searchParams) return base;

    const availParam = searchParams.get("availability") as AvailabilityFilter;
    if (availParam && ["all", "in_stock", "out_of_stock"].includes(availParam)) {
      base.availability = availParam;
    }

    const catParam = searchParams.get("categories");
    if (catParam) {
      const cats = catParam.split(",").map((c) => c.trim()).filter(Boolean);
      if (cats.length > 0) base.categories = cats;
    }

    const brandParam = searchParams.get("brands");
    if (brandParam) {
      const brands = brandParam.split(",").map((b) => b.trim()).filter(Boolean);
      if (brands.length > 0) base.brands = brands;
    }

    const minPriceParam = searchParams.get("min_price");
    const maxPriceParam = searchParams.get("max_price");
    if (minPriceParam || maxPriceParam) {
      const min = minPriceParam ? parseFloat(minPriceParam) : defaultBounds[0];
      const max = maxPriceParam ? parseFloat(maxPriceParam) : defaultBounds[1];
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        base.priceRange = [min, max];
      }
    }

    const typeParam = searchParams.get("types");
    if (typeParam) {
      const types = typeParam.split(",").map((t) => t.trim()).filter(Boolean);
      if (types.length > 0) base.productTypes = types;
    }

    const dietParam = searchParams.get("dietary");
    if (dietParam) {
      const diets = dietParam.split(",").map((d) => d.trim()).filter(Boolean);
      if (diets.length > 0) base.dietary = diets;
    }

    const ratingParam = searchParams.get("min_rating");
    if (ratingParam) {
      const rating = parseFloat(ratingParam);
      if (!isNaN(rating) && rating > 0) base.minRating = rating;
    }

    const sortParam = searchParams.get("sort") as SortOption;
    if (sortParam) base.sortBy = sortParam;

    const viewParam = searchParams.get("view") as ViewMode;
    if (viewParam && (viewParam === "grid" || viewParam === "list")) {
      base.viewMode = viewParam;
    }

    const queryParam = searchParams.get("q");
    if (queryParam) base.searchQuery = queryParam;

    return base;
  });

  const isFirstRender = useRef(true);

  // Sync state changes to URL search params
  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (state.availability !== "all") {
      params.set("availability", state.availability);
    }
    if (state.categories.length > 0 && !initialCategory) {
      params.set("categories", state.categories.join(","));
    }
    if (state.brands.length > 0) {
      params.set("brands", state.brands.join(","));
    }
    if (state.priceRange[0] > defaultBounds[0]) {
      params.set("min_price", state.priceRange[0].toString());
    }
    if (state.priceRange[1] < defaultBounds[1]) {
      params.set("max_price", state.priceRange[1].toString());
    }
    if (state.productTypes.length > 0) {
      params.set("types", state.productTypes.join(","));
    }
    if (state.dietary.length > 0) {
      params.set("dietary", state.dietary.join(","));
    }
    if (state.minRating > 0) {
      params.set("min_rating", state.minRating.toString());
    }
    if (state.sortBy !== "alphabetical-az") {
      params.set("sort", state.sortBy);
    }
    if (state.viewMode !== "grid") {
      params.set("view", state.viewMode);
    }
    if (state.searchQuery) {
      params.set("q", state.searchQuery);
    }

    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, "", newUrl);
  }, [state, defaultBounds, initialCategory, pathname, syncUrl]);

  // Actions
  const setAvailability = useCallback((availability: AvailabilityFilter) => {
    setState((prev) => ({ ...prev, availability }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setState((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setState((prev) => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      };
    });
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    setState((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const toggleProductType = useCallback((type: string) => {
    setState((prev) => {
      const exists = prev.productTypes.includes(type);
      return {
        ...prev,
        productTypes: exists
          ? prev.productTypes.filter((t) => t !== type)
          : [...prev.productTypes, type],
      };
    });
  }, []);

  const toggleDietary = useCallback((diet: string) => {
    setState((prev) => {
      const exists = prev.dietary.includes(diet);
      return {
        ...prev,
        dietary: exists
          ? prev.dietary.filter((d) => d !== diet)
          : [...prev.dietary, diet],
      };
    });
  }, []);

  const setMinRating = useCallback((minRating: number) => {
    setState((prev) => ({
      ...prev,
      minRating: prev.minRating === minRating ? 0 : minRating,
    }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setState((prev) => ({ ...prev, sortBy }));
  }, []);

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState((prev) => ({ ...prev, searchQuery }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setState((prev) => ({
      ...getDefaultFilterState(defaultBounds),
      categories: initialCategory ? [initialCategory] : [],
      viewMode: prev.viewMode,
      sortBy: prev.sortBy,
    }));
  }, [defaultBounds, initialCategory]);

  const removeChip = useCallback((chipId: string) => {
    setState((prev) => {
      if (chipId.startsWith("avail-")) {
        return { ...prev, availability: "all" };
      }
      if (chipId.startsWith("cat-")) {
        const cat = chipId.replace("cat-", "");
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      }
      if (chipId.startsWith("brand-")) {
        const brand = chipId.replace("brand-", "");
        return { ...prev, brands: prev.brands.filter((b) => b !== brand) };
      }
      if (chipId === "price-range") {
        return { ...prev, priceRange: [defaultBounds[0], defaultBounds[1]] };
      }
      if (chipId.startsWith("type-")) {
        const type = chipId.replace("type-", "");
        return { ...prev, productTypes: prev.productTypes.filter((t) => t !== type) };
      }
      if (chipId.startsWith("diet-")) {
        const diet = chipId.replace("diet-", "");
        return { ...prev, dietary: prev.dietary.filter((d) => d !== diet) };
      }
      if (chipId.startsWith("rating-")) {
        return { ...prev, minRating: 0 };
      }
      return prev;
    });
  }, [defaultBounds]);

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, state);
  }, [products, state]);

  // Derived dynamic facet counts
  const facetCounts = useMemo(() => {
    return calculateFacetCounts(products, state);
  }, [products, state]);

  // Derived active chips
  const activeChips = useMemo(() => {
    return getActiveChips(state, categoryTitleMap, defaultBounds);
  }, [state, categoryTitleMap, defaultBounds]);

  const hasActiveFilters = activeChips.length > 0;

  return {
    state,
    filteredProducts,
    facetCounts,
    activeChips,
    hasActiveFilters,
    matchingCount: filteredProducts.length,
    defaultBounds,
    // Actions
    setAvailability,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    toggleProductType,
    toggleDietary,
    setMinRating,
    setSortBy,
    setViewMode,
    setSearchQuery,
    removeChip,
    clearAllFilters,
  };
}

