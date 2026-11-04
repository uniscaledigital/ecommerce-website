"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  RotateCcw,
  Search,
  Check,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { Collection } from "@/types";
import { FilterState, FacetCounts } from "@/lib/filtering/types";
import { CANONICAL_DIETARY_OPTIONS } from "@/lib/filtering/engine";
import { PriceRangeSlider } from "./PriceRangeSlider";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  state: FilterState;
  facetCounts: FacetCounts;
  collections: Collection[];
  allBrands: string[];
  allProductTypes: string[];
  defaultBounds: [number, number];
  matchingCount: number;
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

type FilterTab =
  | "availability"
  | "categories"
  | "brands"
  | "price"
  | "types"
  | "dietary"
  | "rating";

export function MobileFilterDrawer({
  isOpen,
  onClose,
  triggerRef,
  state,
  facetCounts,
  collections,
  allBrands,
  allProductTypes,
  defaultBounds,
  matchingCount,
  hasActiveFilters,
  onSetAvailability,
  onToggleCategory,
  onToggleBrand,
  onSetPriceRange,
  onToggleProductType,
  onToggleDietary,
  onSetMinRating,
  onClearAll,
}: MobileFilterDrawerProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("categories");
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock & focus management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      triggerRef?.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, triggerRef]);

  // Keyboard Escape & Focus Trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search filters
  const filteredCollections = useMemo(() => {
    if (!categorySearch.trim()) return collections;
    const q = categorySearch.toLowerCase();
    return collections.filter((c) => c.title.toLowerCase().includes(q));
  }, [collections, categorySearch]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return allBrands;
    const q = brandSearch.toLowerCase();
    return allBrands.filter((b) => b.toLowerCase().includes(q));
  }, [allBrands, brandSearch]);

  if (!isOpen) return null;

  const tabs: Array<{ id: FilterTab; label: string; activeCount: number }> = [
    {
      id: "categories",
      label: "Category",
      activeCount: state.categories.length,
    },
    {
      id: "brands",
      label: "Brand",
      activeCount: state.brands.length,
    },
    {
      id: "price",
      label: "Price",
      activeCount:
        state.priceRange[0] > defaultBounds[0] || state.priceRange[1] < defaultBounds[1] ? 1 : 0,
    },
    {
      id: "availability",
      label: "Availability",
      activeCount: state.availability !== "all" ? 1 : 0,
    },
    {
      id: "dietary",
      label: "Dietary",
      activeCount: state.dietary.length,
    },
    {
      id: "types",
      label: "Product Type",
      activeCount: state.productTypes.length,
    },
    {
      id: "rating",
      label: "Rating",
      activeCount: state.minRating > 0 ? 1 : 0,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filter-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md h-full bg-[#FFFAF1] shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DFCF] bg-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#14532D]" />
            <h2 id="mobile-filter-title" className="font-serif-display text-base font-bold text-[#14532D]">
              Filters
            </h2>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[11px] font-bold text-[#14532D]">
                Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-bold text-[#14532D] hover:text-[#064E3B] flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F7EBD8] transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flipkart-Style Dual-Pane Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Pane (~38% width) */}
          <div className="w-[38%] bg-[#F7EBD8]/70 border-r border-[#E8DFCF] overflow-y-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3.5 py-3.5 text-xs font-semibold flex items-center justify-between border-b border-[#E8DFCF]/60 transition-colors min-h-[48px] ${
                    isActive
                      ? "bg-white text-[#14532D] font-bold border-l-4 border-l-[#14532D]"
                      : "text-[#4B5563] hover:bg-[#EADFC9]/50"
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#14532D] text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-1">
                      {tab.activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Pane (~62% width) */}
          <div className="w-[62%] bg-white p-3.5 overflow-y-auto">
            {/* 1. CATEGORIES */}
            {activeTab === "categories" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-[#FFFAF1] border border-[#E8DFCF] rounded-md text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>

                <div className="space-y-1">
                  {filteredCollections.map((col) => {
                    const isSelected = state.categories.includes(col.handle);
                    const count = facetCounts.categories[col.handle] || 0;
                    return (
                      <label
                        key={col.handle}
                        className="flex items-center justify-between cursor-pointer py-2 px-1 rounded-md hover:bg-[#FFFAF1] text-xs min-h-[40px]"
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

            {/* 2. BRANDS */}
            {activeTab === "brands" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search brand..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-[#FFFAF1] border border-[#E8DFCF] rounded-md text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>

                <div className="space-y-1">
                  {filteredBrands.map((brand) => {
                    const isSelected = state.brands.includes(brand);
                    const count = facetCounts.brands[brand] || 0;
                    return (
                      <label
                        key={brand}
                        className="flex items-center justify-between cursor-pointer py-2 px-1 rounded-md hover:bg-[#FFFAF1] text-xs min-h-[40px]"
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

            {/* 3. PRICE */}
            {activeTab === "price" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  Select Price Range
                </h3>
                <PriceRangeSlider
                  min={defaultBounds[0]}
                  max={defaultBounds[1]}
                  value={state.priceRange}
                  onChange={onSetPriceRange}
                />
              </div>
            )}

            {/* 4. AVAILABILITY */}
            {activeTab === "availability" && (
              <div className="space-y-2">
                {[
                  { id: "all", label: "All Items", count: facetCounts.availability.all },
                  { id: "in_stock", label: "In Stock Only", count: facetCounts.availability.inStock },
                  { id: "out_of_stock", label: "Out of Stock", count: facetCounts.availability.outOfStock },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between cursor-pointer py-2.5 px-2 rounded-md hover:bg-[#FFFAF1] text-xs min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="availability-mobile"
                        checked={state.availability === opt.id}
                        onChange={() => onSetAvailability(opt.id as any)}
                        className="w-4 h-4 text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
                      />
                      <span className="font-medium text-[#1F2937]">{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-[#6B7280]">({opt.count})</span>
                  </label>
                ))}
              </div>
            )}

            {/* 5. DIETARY & LIFESTYLE */}
            {activeTab === "dietary" && (
              <div className="space-y-1">
                {CANONICAL_DIETARY_OPTIONS.map((tag) => {
                  const isSelected = state.dietary.includes(tag);
                  const count = facetCounts.dietary[tag] || 0;
                  return (
                    <label
                      key={tag}
                      className="flex items-center justify-between cursor-pointer py-2 px-1 rounded-md hover:bg-[#FFFAF1] text-xs min-h-[40px]"
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

            {/* 6. PRODUCT TYPES */}
            {activeTab === "types" && (
              <div className="space-y-1">
                {allProductTypes.map((type) => {
                  const isSelected = state.productTypes.includes(type);
                  const count = facetCounts.productTypes[type] || 0;
                  return (
                    <label
                      key={type}
                      className="flex items-center justify-between cursor-pointer py-2 px-1 rounded-md hover:bg-[#FFFAF1] text-xs min-h-[40px]"
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

            {/* 7. RATINGS */}
            {activeTab === "rating" && (
              <div className="space-y-2">
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
                      className={`flex items-center justify-between w-full text-left px-2 py-2.5 rounded-md transition-colors min-h-[44px] ${
                        isSelected ? "bg-[#E8F5E9] text-[#14532D] font-bold" : "hover:bg-[#FFFAF1] text-[#1F2937]"
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
        </div>

        {/* Sticky Bottom Bar */}
        <div className="p-3 border-t border-[#E8DFCF] bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={onClearAll}
            disabled={!hasActiveFilters}
            className="px-4 py-3 rounded-xl border border-[#E8DFCF] text-xs font-bold text-[#14532D] bg-[#F7EBD8] hover:bg-[#EADFC9] disabled:opacity-40 min-h-[48px]"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#064E3B] text-white text-xs font-bold transition-colors shadow-md min-h-[48px] flex items-center justify-center gap-2"
          >
            <span>Apply Filters</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px]">
              {matchingCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

