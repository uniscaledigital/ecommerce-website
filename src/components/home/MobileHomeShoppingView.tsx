"use client";

import React, { useState, useMemo, useRef } from "react";
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";
import { Product, Collection } from "@/types";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { MobileFilterDrawer } from "@/components/products/filters/MobileFilterDrawer";
import { MobileCategoryScrollRail } from "@/components/products/filters/MobileCategoryScrollRail";
import { SortOption } from "@/lib/filtering/types";

// Mobile section subcomponents
import { MobilePromoBanner } from "./mobile/MobilePromoBanner";
import { MobileStoreConfidenceStrip } from "./mobile/MobileStoreConfidenceStrip";
import { MobileCategoryGrid } from "./mobile/MobileCategoryGrid";
import { MobileProductSpotlight } from "./mobile/MobileProductSpotlight";
import { MobileBrandsCarousel } from "./mobile/MobileBrandsCarousel";

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

  // Curated spotlight subsets
  const teaAndBakeryProducts = useMemo(() => {
    return products.filter((p) =>
      p.collections?.includes("tea-coffee") ||
      p.collections?.includes("bread-bakery") ||
      p.productType === "Tea & Coffee" ||
      p.productType === "Bread & Bakery" ||
      p.tags.some((t) => {
        const lower = t.toLowerCase();
        return lower.includes("tea") || lower.includes("bakery") || lower.includes("soda bread");
      })
    );
  }, [products]);

  const crispsAndSnacksProducts = useMemo(() => {
    return products.filter((p) =>
      p.collections?.includes("crisps-snacks") ||
      p.productType === "Crisps & Snacks" ||
      p.tags.some((t) => {
        const lower = t.toLowerCase();
        return lower.includes("crisp") || lower.includes("snack");
      })
    );
  }, [products]);

  const {
    state,
    filteredProducts,
    activeChips,
    matchingCount,
    defaultBounds,
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
    <div className="w-full space-y-6 px-3 sm:px-4 py-3">
      {/* ============================================================== */}
      {/* SECTION 1: PROMOTIONAL BANNER                                  */}
      {/* Compact swipeable promotional banner with Irish Grocer styling */}
      {/* ============================================================== */}
      <MobilePromoBanner />

      {/* ============================================================== */}
      {/* SECTION 2: STORE CONFIDENCE STRIP                              */}
      {/* Compact Quincy storefront and honest delivery/demo badge       */}
      {/* ============================================================== */}
      <MobileStoreConfidenceStrip />

      {/* ============================================================== */}
      {/* SECTION 3: VISUAL CATEGORY GRID                                */}
      {/* 2 rows x 4 categories + expandable "See All" 15 aisles         */}
      {/* ============================================================== */}
      <MobileCategoryGrid />

      {/* ============================================================== */}
      {/* SECTION 4: PRODUCT SPOTLIGHT SECTIONS                          */}
      {/* Compact horizontal carousels from authentic catalog items      */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-1">
        {/* Spotlight 4A: Morning Tea & Fresh Bakery */}
        <MobileProductSpotlight
          eyebrow="TRADITIONAL MORNINGS"
          title="Morning Tea & Fresh Bakery"
          viewAllHref="/collections/tea-coffee"
          products={teaAndBakeryProducts}
        />

        {/* Spotlight 4B: Irish Crisps & Pub Snacks */}
        <MobileProductSpotlight
          eyebrow="ORIGINAL IRISH CRUNCH"
          title="Irish Crisps & Pub Snacks"
          viewAllHref="/collections/crisps-snacks"
          products={crispsAndSnacksProducts}
        />
      </div>

      {/* ============================================================== */}
      {/* SECTION 5: FEATURED IRISH BRANDS                               */}
      {/* Compact horizontal carousel for famous Irish brands            */}
      {/* ============================================================== */}
      <MobileBrandsCarousel />

      {/* ============================================================== */}
      {/* SECTION 6: ALL PRODUCTS DISCOVERY GRID                         */}
      {/* Preserved 2-column grid, department rail, filter & sort bar    */}
      {/* ============================================================== */}
      <section className="space-y-3 pt-2 border-t border-[#D0E7C9]/60">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D]">
              ALL GROCERY AISLES
            </span>
            <h2 className="text-base font-bold text-[#14532D] font-serif-display leading-tight">
              Browse All Irish Favourites
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#14532D] bg-[#EDF8E9] border border-[#D0E7C9] px-2.5 py-1 rounded-full">
            {matchingCount} {matchingCount === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Quick Category Scroll Rail */}
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

        {/* Sticky Discovery Controls Bar (Docked smoothly below header) */}
        <div className="sticky top-[111px] sm:top-[121px] z-30 bg-[#FFFAF1]/95 backdrop-blur-md pt-2 pb-2.5 -mx-3 px-3 sm:-mx-4 sm:px-4 border-b border-[#E8DFCF]/80 shadow-[0_4px_12px_rgba(20,83,45,0.04)] space-y-2">
          {/* Controls Row: Filters Trigger + Sort Dropdown */}
          <div className="flex items-center justify-between gap-2">
            {/* Filter Trigger Button */}
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

            {/* Sort Dropdown */}
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

          {/* Active Filter & Search Chips Rail */}
          {(activeChips.length > 0 || (state.searchQuery && state.searchQuery.trim().length > 0)) && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {/* Active Search Query Chip */}
              {state.searchQuery && state.searchQuery.trim().length > 0 && (
                <span className="inline-flex items-center gap-1 bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/20 pl-2.5 pr-0.5 py-1 rounded-lg text-[11px] font-medium shrink-0">
                  <span className="text-[10px] text-[#42634A] uppercase font-bold">
                    Search:
                  </span>
                  <span className="max-w-[120px] truncate">&ldquo;{state.searchQuery.trim()}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="min-w-[44px] min-h-[44px] -my-2.5 -mr-1 flex items-center justify-center hover:bg-[#14532D]/20 rounded-full transition-colors cursor-pointer text-[#14532D]"
                    aria-label={`Remove search query ${state.searchQuery.trim()}`}
                  >
                    <X className="w-3 h-3 text-[#14532D]" />
                  </button>
                </span>
              )}

              {/* Active Category, Brand, Price, etc. Chips */}
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1 bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/20 pl-2.5 pr-0.5 py-1 rounded-lg text-[11px] font-medium shrink-0"
                >
                  <span className="text-[10px] text-[#42634A] uppercase font-bold">
                    {chip.group}:
                  </span>
                  <span className="max-w-[140px] truncate">{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip.id)}
                    className="min-w-[44px] min-h-[44px] -my-2.5 -mr-1 flex items-center justify-center hover:bg-[#14532D]/20 rounded-full transition-colors cursor-pointer text-[#14532D]"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X className="w-3 h-3 text-[#14532D]" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] hover:text-[#B45309] px-2.5 min-h-[44px] shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Mobile Product Grid */}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold shadow-xs hover:bg-[#064E3B] transition-colors min-h-[44px]"
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

        {/* Mobile Pagination / Load More CTA */}
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
      </section>

      {/* Flipkart-Style Filter Drawer Instance */}
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
