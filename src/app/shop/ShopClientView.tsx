"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Product, Collection } from "@/types";
import { useProductFilters } from "@/hooks/useProductFilters";
import { DesktopFilterSidebar } from "@/components/products/filters/DesktopFilterSidebar";
import { FilterToolbar } from "@/components/products/filters/FilterToolbar";
import { MobileFilterDrawer } from "@/components/products/filters/MobileFilterDrawer";
import { ProductGrid } from "@/components/products/ProductGrid";

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
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);

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
    removeChip,
    clearAllFilters,
  } = useProductFilters({
    products: initialProducts,
    categoryTitleMap,
    initialCategory,
    syncUrl: true,
  });

  // Reset page whenever filter criteria change
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
  ]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header */}
      <div>
        <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14532D]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#42634A] mt-1">
          Authentic Irish &amp; UK imports delivered fresh from our Quincy, MA storefront.
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
                    Math.abs(pageNum - currentPage) <= 1 || pageNum === 1 || pageNum === totalPages;
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

      {/* Mobile Flipkart-Style Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        triggerRef={mobileFilterTriggerRef}
        state={state}
        facetCounts={facetCounts}
        collections={collections}
        allBrands={allBrands}
        allProductTypes={allProductTypes}
        defaultBounds={defaultBounds}
        matchingCount={matchingCount}
        hasActiveFilters={hasActiveFilters}
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
  );
}
