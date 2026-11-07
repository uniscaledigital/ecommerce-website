"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  X,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { Product, Collection } from "@/types";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useWishlist } from "@/hooks/useWishlist";
import { DesktopFilterSidebar } from "@/components/products/filters/DesktopFilterSidebar";
import { FilterToolbar } from "@/components/products/filters/FilterToolbar";
import { MobileFilterDrawer } from "@/components/products/filters/MobileFilterDrawer";
import { MobileCategoryScrollRail } from "@/components/products/filters/MobileCategoryScrollRail";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCard } from "@/components/products/ProductCard";
import { SortOption } from "@/lib/filtering/types";

interface ShopClientViewProps {
  initialProducts: Product[];
  collections: Collection[];
  title?: string;
  totalCountLabel?: string;
  initialCategory?: string;
}

export function ShopClientView({
  initialProducts,
  collections,
  title = "All Products",
  initialCategory,
}: ShopClientViewProps) {
  const router = useRouter();
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);

  // Bookmark / Saved Items state (wired to useWishlist)
  const { wishlist } = useWishlist();
  const [showOnlyWishlisted, setShowOnlyWishlisted] = useState(false);

  const itemsPerPage = 12;

  // Extract unique brands and product types from catalogue
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialProducts) {
      if (p.vendor) set.add(p.vendor);
    }
    return Array.from(set).sort();
  }, [initialProducts]);

  const allProductTypes = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialProducts) {
      if (p.productType) set.add(p.productType);
    }
    return Array.from(set).sort();
  }, [initialProducts]);

  const categoryTitleMap = useMemo(() => {
    return Object.fromEntries(collections.map((c) => [c.handle, c.title]));
  }, [collections]);

  // Hook into the central filtering engine
  const {
    state,
    filteredProducts,
    facetCounts,
    activeChips,
    hasActiveFilters,
    matchingCount,
    defaultBounds,
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
    commitDraftState,
    removeChip,
    clearAllFilters,
  } = useProductFilters({
    products: initialProducts,
    categoryTitleMap,
    initialCategory,
    syncUrl: true,
  });

  // Mobile local search input state synchronized with central filter state
  const [mobileSearchInput, setMobileSearchInput] = useState(state.searchQuery || "");
  useEffect(() => {
    setMobileSearchInput(state.searchQuery || "");
  }, [state.searchQuery]);

  // Reset page whenever filter criteria or wishlist toggle changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    state.availability,
    state.categories,
    state.brands,
    state.priceRange,
    state.productTypes,
    state.dietary,
    state.minRating,
    state.sortBy,
    state.searchQuery,
    showOnlyWishlisted,
  ]);

  // Derived wishlisted products for mobile and desktop
  const wishlistedFilteredProducts = useMemo(() => {
    if (!showOnlyWishlisted) return filteredProducts;
    return filteredProducts.filter((p) => wishlist.includes(p.id));
  }, [filteredProducts, showOnlyWishlisted, wishlist]);

  // Desktop Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Mobile Pagination
  const mobileTotalPages = Math.max(
    1,
    Math.ceil(wishlistedFilteredProducts.length / itemsPerPage)
  );
  const mobilePaginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return wishlistedFilteredProducts.slice(start, start + itemsPerPage);
  }, [wishlistedFilteredProducts, currentPage]);

  const activeCategory = state.categories.length === 1 ? state.categories[0] : null;
  const isAnyFilterActive = hasActiveFilters || !!state.searchQuery || showOnlyWishlisted;

  const handleClearAll = () => {
    clearAllFilters();
    setShowOnlyWishlisted(false);
    setMobileSearchInput("");
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* MOBILE SHOPPING DISCOVERY SUITE (< 768px / block md:hidden)   */}
      {/* Complete product browsing and filtering experience             */}
      {/* ============================================================== */}
      <div className="block md:hidden space-y-4">
        {/* Mobile Page Title */}
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[#14532D]">
            {title}
          </h1>
          <p className="text-xs text-[#42634A] mt-0.5">
            Authentic Irish &amp; UK imports delivered fresh from our Marshfield storefront.
          </p>
        </div>

        {/* Compact Search & Action Toolbar (Screenshot 2 Reference — 3-Row Usability Polish) */}
        <div className="sticky top-2 z-30 bg-[#FFFAF1]/95 backdrop-blur-md p-2.5 rounded-2xl border border-[#E8DFCF] shadow-xs space-y-2">
          {/* ROW 1: Full-width product search input & clear action */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(mobileSearchInput.trim());
            }}
            className="w-full relative flex items-center bg-white rounded-xl border border-[#14532D]/20 shadow-2xs px-3 py-1.5 focus-within:border-[#14532D] focus-within:ring-2 focus-within:ring-[#14532D]/15 transition-all min-h-[44px]"
          >
            <Search className="w-4 h-4 text-[#14532D]/70 shrink-0 mr-2" />
            <input
              type="text"
              placeholder={initialCategory ? `Search in ${title}...` : "Search products..."}
              value={mobileSearchInput}
              onChange={(e) => {
                setMobileSearchInput(e.target.value);
                if (e.target.value === "") {
                  setSearchQuery("");
                }
              }}
              className="w-full bg-transparent text-xs sm:text-sm text-[#173B2A] placeholder-[#52665B]/65 focus:outline-none"
              aria-label={initialCategory ? `Search products in ${title}` : "Search products in shop"}
            />
            {mobileSearchInput && (
              <button
                type="button"
                onClick={() => {
                  setMobileSearchInput("");
                  setSearchQuery("");
                }}
                className="w-8 h-8 flex items-center justify-center text-[#42634A] hover:text-[#14532D] rounded-full min-w-[44px] min-h-[44px] shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* ROW 2: Filter button with active count & Saved-items bookmark toggle with live count */}
          <div className="grid grid-cols-2 gap-2">
            {/* Filter Trigger Button with Active Count Badge */}
            <button
              ref={mobileFilterTriggerRef}
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className={`w-full min-h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                activeChips.length > 0
                  ? "bg-[#14532D] text-white border-[#14532D]"
                  : "bg-white text-[#14532D] border-[#E8DFCF] hover:bg-[#F7EBD8]"
              }`}
              aria-label={`Open filter drawer${activeChips.length > 0 ? `, ${activeChips.length} active filters` : ""}`}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    activeChips.length > 0
                      ? "bg-white text-[#14532D]"
                      : "bg-[#14532D] text-white"
                  }`}
                >
                  {activeChips.length}
                </span>
              )}
            </button>

            {/* Bookmark / Saved Items Filter Action Button */}
            <button
              type="button"
              onClick={() => setShowOnlyWishlisted((prev) => !prev)}
              className={`w-full min-h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                showOnlyWishlisted
                  ? "bg-[#14532D] text-white border-[#14532D]"
                  : "bg-white text-[#14532D] border-[#E8DFCF] hover:bg-[#F7EBD8]"
              }`}
              aria-label={`Filter by saved items, ${wishlist.length} saved`}
              aria-pressed={showOnlyWishlisted}
            >
              <Bookmark className={`w-4 h-4 shrink-0 ${showOnlyWishlisted ? "fill-current" : ""}`} />
              <span>Saved Items</span>
              {wishlist.length > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    showOnlyWishlisted
                      ? "bg-white text-[#14532D]"
                      : "bg-[#EDF8E9] text-[#14532D] border border-[#D0E7C9]"
                  }`}
                >
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          {/* ROW 3: Product count & Sort dropdown */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E8DFCF]/70 text-xs">
            <span className="text-[#42634A] font-semibold">
              {wishlistedFilteredProducts.length}{" "}
              {wishlistedFilteredProducts.length === 1 ? "item" : "items"}
              {showOnlyWishlisted && " (Saved)"}
            </span>
            <div className="relative">
              <select
                value={state.sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-[#E8DFCF] rounded-lg px-3 py-2 pr-8 text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D] min-h-[44px]"
                aria-label="Sort products"
              >
                <option value="relevance">Featured</option>
                <option value="alphabetical-az">A to Z</option>
                <option value="alphabetical-za">Z to A</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high-low">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#42634A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Category Scroll Rail */}
        <MobileCategoryScrollRail
          collections={collections}
          selectedCategory={activeCategory}
          onSelectCategory={(handle) => {
            if (initialCategory) {
              if (!handle) {
                router.push("/shop");
              } else {
                router.push(`/collections/${handle}`);
              }
            } else {
              if (!handle) {
                commitDraftState({ ...state, categories: [] });
              } else {
                commitDraftState({ ...state, categories: [handle] });
              }
            }
          }}
        />

        {/* Active Filter Chips Rail */}
        {isAnyFilterActive && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {/* Search Query Chip */}
            {state.searchQuery && (
              <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs font-medium bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/20 shrink-0">
                <span>
                  Search: <strong>&ldquo;{state.searchQuery}&rdquo;</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setMobileSearchInput("");
                  }}
                  className="min-w-[44px] min-h-[44px] -mr-1 flex items-center justify-center text-[#14532D] hover:bg-[#14532D]/15 rounded-full transition-colors"
                  aria-label={`Remove search filter for ${state.searchQuery}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Saved Items Filter Chip */}
            {showOnlyWishlisted && (
              <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs font-medium bg-[#14532D] text-white shrink-0">
                <span>
                  Saved Items (<strong>{wishlist.length}</strong>)
                </span>
                <button
                  type="button"
                  onClick={() => setShowOnlyWishlisted(false)}
                  className="min-w-[44px] min-h-[44px] -mr-1 flex items-center justify-center text-white/90 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Remove saved items filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Facet Chips */}
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs font-medium bg-[#EDF8E9] text-[#14532D] border border-[#D0E7C9] shrink-0"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeChip(chip.id)}
                  className="min-w-[44px] min-h-[44px] -mr-1 flex items-center justify-center text-[#14532D] hover:bg-[#14532D]/15 rounded-full transition-colors"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Clear All Button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#14532D] hover:bg-[#14532D]/10 shrink-0 min-h-[44px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* 2-Column Mobile Product Discovery Grid */}
        {wishlistedFilteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl space-y-3">
            <p className="text-sm font-semibold text-[#14532D]">
              {showOnlyWishlisted
                ? "No saved products match your current filters."
                : "No products found matching your filter criteria."}
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold shadow-xs hover:bg-[#064E3B] transition-colors min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {mobilePaginatedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        )}

        {/* Mobile Pagination */}
        {mobileTotalPages > 1 && (
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-[#E8DFCF]">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 border border-[#E8DFCF] rounded-xl bg-[#FFFAF1] hover:bg-[#F7EBD8] disabled:opacity-40 min-h-[44px] text-xs font-bold text-[#14532D]"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-[#42634A]">
              Page {currentPage} of {mobileTotalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(mobileTotalPages, p + 1))}
              disabled={currentPage === mobileTotalPages}
              className="px-4 py-2.5 border border-[#E8DFCF] rounded-xl bg-[#FFFAF1] hover:bg-[#F7EBD8] disabled:opacity-40 min-h-[44px] text-xs font-bold text-[#14532D]"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* DESKTOP SHOPPING LAYOUT (>= 768px / hidden md:block)           */}
      {/* 100% preservation of approved desktop visual baseline          */}
      {/* ============================================================== */}
      <div className="hidden md:block space-y-6">
        {/* Page Title & Breadcrumb Header */}
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14532D]">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#42634A] mt-1">
            Authentic Irish &amp; UK imports delivered fresh from our Marshfield, Massachusetts storefront.
          </p>
        </div>

        {/* Discovery Toolbar */}
        <FilterToolbar
          totalCount={initialProducts.length}
          matchingCount={matchingCount}
          sortBy={state.sortBy}
          viewMode={state.viewMode}
          gridColumns={gridColumns}
          activeChips={activeChips}
          onOpenMobileFilter={() => setIsMobileDrawerOpen(true)}
          onSortChange={setSortBy}
          onViewModeChange={setViewMode}
          onGridColumnsChange={setGridColumns}
          onRemoveChip={removeChip}
          onClearAll={clearAllFilters}
        />

        {/* Main Listing Layout: Left Sidebar + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start">
          {/* Desktop Vertical Sidebar */}
          <div className="hidden md:block md:col-span-1 sticky top-24">
            <DesktopFilterSidebar
              state={state}
              facetCounts={facetCounts}
              collections={collections}
              allBrands={allBrands}
              allProductTypes={allProductTypes}
              defaultBounds={defaultBounds}
              hasActiveFilters={hasActiveFilters}
              initialCategory={initialCategory}
              onSetAvailability={setAvailability}
              onToggleCategory={toggleCategory}
              onToggleBrand={toggleBrand}
              onSetPriceRange={setPriceRange}
              onToggleProductType={toggleProductType}
              onToggleDietary={toggleDietary}
              onSetMinRating={setMinRating}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="md:col-span-3 space-y-8">
            <ProductGrid
              products={paginatedProducts}
              columns={gridColumns}
              viewMode={state.viewMode}
              onClearFilters={clearAllFilters}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-[#E8DFCF] text-xs font-semibold text-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 border border-[#E8DFCF] rounded-xl bg-[#FFFAF1] hover:bg-[#F7EBD8] disabled:opacity-40 min-h-[44px] transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[240px] sm:max-w-none py-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isNearCurrent =
                      Math.abs(pageNum - currentPage) <= 1 ||
                      pageNum === 1 ||
                      pageNum === totalPages;
                    if (!isNearCurrent && totalPages > 5) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span key={pageNum} className="px-1 text-[#4B5563]">
                            …
                          </span>
                        );
                      }
                      return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl border text-xs font-bold transition-all min-h-[40px] ${
                          currentPage === pageNum
                            ? "bg-[#14532D] text-white border-[#14532D] shadow-xs"
                            : "border-[#E8DFCF] bg-[#FFFAF1] hover:bg-[#F7EBD8] text-[#1F2937]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 border border-[#E8DFCF] rounded-xl bg-[#FFFAF1] hover:bg-[#F7EBD8] disabled:opacity-40 min-h-[44px] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Flipkart-Style Filter Drawer Instance */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        triggerRef={mobileFilterTriggerRef}
        state={state}
        products={initialProducts}
        collections={collections}
        allBrands={allBrands}
        allProductTypes={allProductTypes}
        defaultBounds={defaultBounds}
        onApply={(draft) => {
          commitDraftState(draft);
          setIsMobileDrawerOpen(false);
        }}
        initialCategory={initialCategory}
      />
    </div>
  );
}
