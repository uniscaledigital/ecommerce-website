"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, LayoutGrid, Grid3X3 } from "lucide-react";
import { Product, Collection } from "@/types";
import { ProductGrid } from "@/components/products/ProductGrid";

interface ShopClientViewProps {
  initialProducts: Product[];
  collections: Collection[];
  title?: string;
  totalCountLabel?: string;
}

export function ShopClientView({
  initialProducts,
  collections,
  title = "All Products",
  totalCountLabel = "717 products",
}: ShopClientViewProps) {
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>("alphabetical-az");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const itemsPerPage = 16;

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (onlyInStock) {
      result = result.filter((p) => p.availableForSale);
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.collections?.includes(selectedCategory) ||
          p.productType.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (sortBy === "alphabetical-az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "alphabetical-za") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "price-low-high") {
      result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === "price-high-low") {
      result.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
      );
    }

    return result;
  }, [initialProducts, onlyInStock, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="space-y-6">
      {/* Top Header & Bar */}
      <div>
        <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937]">
          {title}
        </h1>
      </div>

      {/* Control Bar */}
      <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Left: Filter Toggle for Mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E8DFCF] rounded-md text-xs font-semibold text-[#1F2937] bg-[#F7EBD8]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <span className="text-xs text-[#4B5563] font-medium">
            {totalCountLabel}
          </span>
        </div>

        {/* Right: Sort & Grid Layout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4B5563] hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-[#E8DFCF] rounded-md px-3 py-1.5 pr-8 text-xs font-medium text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              >
                <option value="alphabetical-az">Alphabetically, A-Z</option>
                <option value="alphabetical-za">Alphabetically, Z-A</option>
                <option value="price-low-high">Price, low to high</option>
                <option value="price-high-low">Price, high to low</option>
                <option value="relevant">Most relevant</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4B5563] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Grid Switcher */}
          <div className="hidden lg:flex items-center border border-[#E8DFCF] rounded-md overflow-hidden bg-white">
            <button
              onClick={() => setGridColumns(4)}
              className={`p-1.5 ${
                gridColumns === 4 ? "bg-[#14532D] text-white" : "text-[#1F2937] hover:bg-[#F7EBD8]"
              }`}
              aria-label="4 columns view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridColumns(3)}
              className={`p-1.5 ${
                gridColumns === 3 ? "bg-[#14532D] text-white" : "text-[#1F2937] hover:bg-[#F7EBD8]"
              }`}
              aria-label="3 columns view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop) */}
        <aside
          className={`space-y-6 ${
            isMobileFilterOpen ? "block" : "hidden"
          } md:block md:col-span-1`}
        >
          <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-4 sm:p-5 space-y-5 shadow-xs">
            <div>
              <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider mb-3">
                Availability
              </h3>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#1F2937] font-medium">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => {
                    setOnlyInStock(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                />
                <span>In stock only</span>
              </label>
            </div>

            <div className="border-t border-[#E8DFCF] pt-4">
              <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs text-[#4B5563] max-h-64 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#E8F5E9] text-[#14532D] font-bold"
                      : "hover:bg-[#F7EBD8] text-[#1F2937]"
                  }`}
                >
                  All Categories
                </button>
                {collections.map((col) => (
                  <button
                    key={col.handle}
                    onClick={() => {
                      setSelectedCategory(col.handle);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                      selectedCategory === col.handle
                        ? "bg-[#E8F5E9] text-[#14532D] font-bold"
                        : "hover:bg-[#F7EBD8] text-[#1F2937]"
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-8">
          <ProductGrid products={paginatedProducts} columns={gridColumns} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#E8DFCF] text-xs font-semibold text-[#1F2937]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 border border-[#E8DFCF] rounded-md bg-[#FFFAF1] hover:bg-[#F7EBD8] disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md border text-xs font-bold transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#14532D] text-white border-[#14532D]"
                        : "border-[#E8DFCF] bg-[#FFFAF1] hover:bg-[#F7EBD8] text-[#1F2937]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 border border-[#E8DFCF] rounded-md bg-[#FFFAF1] hover:bg-[#F7EBD8] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
