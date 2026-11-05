"use client";

import React, { useState, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";
import { Product, Collection } from "@/types";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { MobileFilterDrawer } from "@/components/products/filters/MobileFilterDrawer";
import { MobileCategoryScrollRail } from "@/components/products/filters/MobileCategoryScrollRail";
import { SortOption } from "@/lib/filtering/types";

interface MobileHomeShoppingViewProps {
  products: Product[];
  collections: Collection[];
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Featured" },
  { value: "alphabetical-az", label: "A to Z" },
  { value: "alphabetical-za", label: "Z to A" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "rating-high-low", label: "Highest Rated" },
];

export function MobileHomeShoppingView({
  products,
  collections,
}: MobileHomeShoppingViewProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  // Extract unique brands and product types from catalogue
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.vendor) set.add(p.vendor);
    }
    return Array.from(set).sort();
  }, [products]);

  const allProductTypes = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.productType) set.add(p.productType);
    }
    return Array.from(set).sort();
  }, [products]);

  const categoryTitleMap = useMemo(() => {
    return Object.fromEntries(collections.map((c) => [c.handle, c.title]));
  }, [collections]);

  const {
    state,
    filteredProducts,
    activeChips,
    hasActiveFilters,
    matchingCount,
    defaultBounds,
    toggleCategory,
    setSortBy,
    setSearchQuery,
    commitDraftState,
    removeChip,
    clearAllFilters,
  } = useProductFilters({
    products,
    categoryTitleMap,
    syncUrl: true,
  });

  const activeCategory = state.categories.length === 1 ? state.categories[0] : null;

  // Paginated/windowed list for mobile performance
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, itemsToShow);
  }, [filteredProducts, itemsToShow]);

  return (
    <div className="w-full space-y-4 px-3 sm:px-4 py-4">
      {/* 1. Mobile Quick Shopping Header */}
      <div className="bg-[#EDF8E9] border border-[#D0E7C9] rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D] bg-[#22C55E]/15 px-2 py-0.5 rounded-full inline-block mb-1">
            Fresh Import Delivery
          </span>
          <h2 className="text-base font-bold text-[#14532D] font-serif-display leading-tight">
            Shop Irish &amp; UK Favourites
          </h2>
          <p className="text-xs text-[#42634A] mt-0.5">
            Direct from our Quincy, MA storefront
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-semibold text-[#14532D]">
            {matchingCount} {matchingCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* 2. Horizontal Quick-Category Scroll Rail */}
      <MobileCategoryScrollRail
        collections={collections}
        selectedCategory={activeCategory}
        onSelectCategory={(handle) => {
          if (!handle) {
            commitDraftState({ ...state, categories: [] });
          } else {
            commitDraftState({ ...state, categories: [handle] });
          }
        }}
      />

      {/* 3. Sticky Search & Filter Access Bar (Docked smoothly below mobile header) */}
      <div className="sticky top-[120px] sm:top-[124px] z-30 bg-[#FFFAF1]/95 backdrop-blur-md pt-2 pb-2.5 -mx-3 px-3 sm:-mx-4 sm:px-4 border-b border-[#E8DFCF]/80 shadow-[0_4px_12px_rgba(20,83,45,0.04)] space-y-2">
        {/* Instant Search in View */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#14532D]/60 shrink-0 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={state.searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries in view..."
            className="w-full bg-white border border-[#E8DFCF] rounded-full pl-9 pr-9 py-2 text-xs font-medium text-[#1F2937] placeholder-[#42634A]/60 focus:outline-none focus:ring-2 focus:ring-[#14532D] shadow-2xs"
            aria-label="Filter products in view"
          />
          {state.searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 p-1 text-[#42634A] hover:text-[#14532D] rounded-full"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Discovery Controls Bar (Sort & Filter) */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Mobile Filter Button with Active Count Badge */}
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl text-xs font-bold text-[#14532D] hover:bg-[#F7EBD8] transition-colors min-h-[44px] shadow-xs"
            aria-label={`Open filter drawer${activeChips.length > 0 ? `, ${activeChips.length} active filters` : ""}`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#14532D]" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#14532D] text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeChips.length}
              </span>
            )}
          </button>

          {/* Right: Compact Sort Dropdown */}
          <div className="relative flex-1">
            <select
              value={state.sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full appearance-none bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#14532D] min-h-[44px] shadow-xs"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#42634A] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Active Filter Chips (if any active) */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/20 px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0"
              >
                <span className="text-[10px] text-[#42634A] uppercase font-bold">
                  {chip.group}:
                </span>
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeChip(chip.id)}
                  className="w-4 h-4 flex items-center justify-center hover:bg-[#14532D]/20 rounded-full transition-colors ml-0.5"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-2.5 h-2.5 text-[#14532D]" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] hover:text-[#B45309] px-2 py-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. 2-Column Mobile Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl space-y-3">
          <p className="text-sm font-semibold text-[#14532D]">
            No imported groceries match your selected filters.
          </p>
          <p className="text-xs text-[#42634A]">
            Try clearing filters or switching departments.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold shadow-xs hover:bg-[#064E3B] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {visibleProducts.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      )}

      {/* 6. Mobile Pagination / Load More CTA */}
      {filteredProducts.length > itemsToShow && (
        <div className="pt-3 pb-2 text-center">
          <button
            type="button"
            onClick={() => setItemsToShow((prev) => prev + 12)}
            className="w-full py-3 bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl text-xs font-bold text-[#14532D] hover:bg-[#F7EBD8] transition-colors min-h-[44px] shadow-xs"
          >
            Show more products ({filteredProducts.length - itemsToShow} remaining)
          </button>
        </div>
      )}

      {/* 7. Flipkart-Style Filter Drawer Instance */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        triggerRef={filterTriggerRef}
        state={state}
        products={products}
        collections={collections}
        allBrands={allBrands}
        allProductTypes={allProductTypes}
        defaultBounds={defaultBounds}
        onApply={(draft) => {
          commitDraftState(draft);
          setIsFilterDrawerOpen(false);
        }}
      />
    </div>
  );
}

