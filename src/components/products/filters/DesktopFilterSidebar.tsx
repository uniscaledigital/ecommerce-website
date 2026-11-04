"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";
import { Collection } from "@/types";
import { FilterState, FacetCounts } from "@/lib/filtering/types";
import { CANONICAL_DIETARY_OPTIONS } from "@/lib/filtering/engine";
import { PriceRangeSlider } from "./PriceRangeSlider";

interface DesktopFilterSidebarProps {
  state: FilterState;
  facetCounts: FacetCounts;
  collections: Collection[];
  allBrands: string[];
  allProductTypes: string[];
  defaultBounds: [number, number];
  hasActiveFilters: boolean;
  onSetAvailability: (val: "all" | "in_stock" | "out_of_stock") => void;
  onToggleCategory: (cat: string) => void;
  onToggleBrand: (brand: string) => void;
  onSetPriceRange: (range: [number, number]) => void;
  onToggleProductType: (type: string) => void;
  onToggleDietary: (diet: string) => void;
  onSetMinRating: (rating: number) => void;
  onClearAll: () => void;
}

export function DesktopFilterSidebar({
  state,
  facetCounts,
  collections,
  allBrands,
  allProductTypes,
  defaultBounds,
  hasActiveFilters,
  onSetAvailability,
  onToggleCategory,
  onToggleBrand,
  onSetPriceRange,
  onToggleProductType,
  onToggleDietary,
  onSetMinRating,
  onClearAll,
}: DesktopFilterSidebarProps) {
  // Accordion collapsed state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    availability: true,
    categories: true,
    brands: true,
    price: true,
    types: true,
    dietary: true,
    rating: true,
  });

  // Search terms for multi-item sections
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Filtered categories for search
  const filteredCollections = useMemo(() => {
    if (!categorySearch.trim()) return collections;
    const q = categorySearch.toLowerCase();
    return collections.filter((c) => c.title.toLowerCase().includes(q));
  }, [collections, categorySearch]);

  // Filtered brands for search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return allBrands;
    const q = brandSearch.toLowerCase();
    return allBrands.filter((b) => b.toLowerCase().includes(q));
  }, [allBrands, brandSearch]);

  return (
    <aside className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-4 sm:p-5 shadow-xs space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DFCF]">
        <div className="flex items-center gap-2">
          <span className="font-serif-display text-base font-bold text-[#14532D]">
            Filter Products
          </span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] hover:text-[#064E3B] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. AVAILABILITY */}
      <div className="border-b border-[#E8DFCF] pb-5">
        <button
          onClick={() => toggleSection("availability")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Availability</span>
          {openSections.availability ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.availability && (
          <div className="mt-3 space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer py-1 text-[#1F2937] hover:text-[#14532D]">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="availability-desktop"
                  checked={state.availability === "all"}
                  onChange={() => onSetAvailability("all")}
                  className="w-4 h-4 text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                />
                <span className="font-medium">All items</span>
              </div>
              <span className="text-[11px] text-[#6B7280]">
                ({facetCounts.availability.all})
              </span>
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 text-[#1F2937] hover:text-[#14532D]">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="availability-desktop"
                  checked={state.availability === "in_stock"}
                  onChange={() => onSetAvailability("in_stock")}
                  className="w-4 h-4 text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                />
                <span className="font-medium">In stock only</span>
              </div>
              <span className="text-[11px] text-[#6B7280]">
                ({facetCounts.availability.inStock})
              </span>
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 text-[#1F2937] hover:text-[#14532D]">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="availability-desktop"
                  checked={state.availability === "out_of_stock"}
                  onChange={() => onSetAvailability("out_of_stock")}
                  className="w-4 h-4 text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                />
                <span className="font-medium">Out of stock</span>
              </div>
              <span className="text-[11px] text-[#6B7280]">
                ({facetCounts.availability.outOfStock})
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 2. CATEGORIES */}
      <div className="border-b border-[#E8DFCF] pb-5">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Categories ({collections.length})</span>
          {openSections.categories ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.categories && (
          <div className="mt-3 space-y-2.5">
            {/* Search within Categories */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#E8DFCF] rounded-md text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>

            <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 text-xs">
              {filteredCollections.map((col) => {
                const isSelected = state.categories.includes(col.handle);
                const count = facetCounts.categories[col.handle] || 0;
                return (
                  <label
                    key={col.handle}
                    className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7EBD8] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleCategory(col.handle)}
                        className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                      />
                      <span className={`text-xs ${isSelected ? "font-bold text-[#14532D]" : "text-[#1F2937]"}`}>
                        {col.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B7280]">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. BRAND / VENDOR */}
      <div className="border-b border-[#E8DFCF] pb-5">
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Brand ({allBrands.length})</span>
          {openSections.brands ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.brands && (
          <div className="mt-3 space-y-2.5">
            {/* Search within Brands */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#E8DFCF] rounded-md text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>

            <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 text-xs">
              {filteredBrands.map((brand) => {
                const isSelected = state.brands.includes(brand);
                const count = facetCounts.brands[brand] || 0;
                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7EBD8] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleBrand(brand)}
                        className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                      />
                      <span className={`text-xs ${isSelected ? "font-bold text-[#14532D]" : "text-[#1F2937]"}`}>
                        {brand}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B7280]">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. PRICE RANGE */}
      <div className="border-b border-[#E8DFCF] pb-5">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Price</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.price && (
          <PriceRangeSlider
            min={defaultBounds[0]}
            max={defaultBounds[1]}
            value={state.priceRange}
            onChange={onSetPriceRange}
          />
        )}
      </div>

      {/* 5. PRODUCT TYPE */}
      <div className="border-b border-[#E8DFCF] pb-5">
        <button
          onClick={() => toggleSection("types")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Product Type</span>
          {openSections.types ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.types && (
          <div className="mt-3 max-h-44 overflow-y-auto pr-1 space-y-1.5 text-xs">
            {allProductTypes.map((type) => {
              const isSelected = state.productTypes.includes(type);
              const count = facetCounts.productTypes[type] || 0;
              return (
                <label
                  key={type}
                  className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7EBD8] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleProductType(type)}
                      className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                    />
                    <span className={`text-xs ${isSelected ? "font-bold text-[#14532D]" : "text-[#1F2937]"}`}>
                      {type}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. DIETARY & LIFESTYLE */}
      <div className="border-b border-[#E8DFCF] pb-5">
        <button
          onClick={() => toggleSection("dietary")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Dietary & Lifestyle</span>
          {openSections.dietary ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.dietary && (
          <div className="mt-3 space-y-1.5 text-xs">
            {CANONICAL_DIETARY_OPTIONS.map((tag) => {
              const isSelected = state.dietary.includes(tag);
              const count = facetCounts.dietary[tag] || 0;
              return (
                <label
                  key={tag}
                  className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7EBD8] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleDietary(tag)}
                      className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                    />
                    <span className={`text-xs ${isSelected ? "font-bold text-[#14532D]" : "text-[#1F2937]"}`}>
                      {tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. CUSTOMER RATING */}
      <div>
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-[#14532D] uppercase tracking-wider"
        >
          <span>Customer Rating</span>
          {openSections.rating ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {openSections.rating && (
          <div className="mt-3 space-y-2 text-xs">
            {[
              { min: 4.0, label: "4★ & above", count: facetCounts.ratings.fourPlus },
              { min: 3.0, label: "3★ & above", count: facetCounts.ratings.threePlus },
              { min: 2.0, label: "2★ & above", count: facetCounts.ratings.twoPlus },
              { min: 1.0, label: "1★ & above", count: facetCounts.ratings.onePlus },
            ].map((tier) => {
              const isSelected = state.minRating === tier.min;
              return (
                <button
                  key={tier.min}
                  type="button"
                  onClick={() => onSetMinRating(tier.min)}
                  className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                    isSelected ? "bg-[#E8F5E9] text-[#14532D] font-bold" : "hover:bg-[#F7EBD8] text-[#1F2937]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < tier.min ? "fill-amber-400 text-amber-400" : "text-[#D1D5DB]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs">{tier.label}</span>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">({tier.count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

