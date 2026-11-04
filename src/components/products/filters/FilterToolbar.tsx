"use client";

import React from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Grid3X3,
  List,
  X,
  RotateCcw,
} from "lucide-react";
import { SortOption, ViewMode, ActiveChip } from "@/lib/filtering/types";

interface FilterToolbarProps {
  totalCount: number;
  matchingCount: number;
  sortBy: SortOption;
  viewMode: ViewMode;
  gridColumns: 3 | 4;
  activeChips: ActiveChip[];
  onOpenMobileFilter: () => void;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onGridColumnsChange: (cols: 3 | 4) => void;
  onRemoveChip: (chipId: string) => void;
  onClearAll: () => void;
}

export function FilterToolbar({
  totalCount,
  matchingCount,
  sortBy,
  viewMode,
  gridColumns,
  activeChips,
  onOpenMobileFilter,
  onSortChange,
  onViewModeChange,
  onGridColumnsChange,
  onRemoveChip,
  onClearAll,
}: FilterToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Upper Control Bar */}
      <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-xs">
        {/* Left: Mobile Filter Button & Product Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileFilter}
            className="md:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-[#E8DFCF] rounded-xl text-xs font-bold text-[#14532D] bg-[#F7EBD8] hover:bg-[#EADFC9] active:scale-95 transition-all min-h-[44px]"
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#14532D]" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#14532D] text-white text-[11px] font-bold flex items-center justify-center">
                {activeChips.length}
              </span>
            )}
          </button>

          <div className="text-xs text-[#4B5563] font-medium">
            Showing <strong className="text-[#14532D]">{matchingCount}</strong> of{" "}
            {totalCount} products
          </div>
        </div>

        {/* Right: Sort Dropdown & Layout Mode Toggles */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4B5563] hidden sm:inline font-medium">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none bg-white border border-[#E8DFCF] rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D] min-h-[40px] cursor-pointer shadow-xs"
              >
                <option value="alphabetical-az">Alphabetically, A-Z</option>
                <option value="alphabetical-za">Alphabetically, Z-A</option>
                <option value="price-low-high">Price, low to high</option>
                <option value="price-high-low">Price, high to low</option>
                <option value="rating-high-low">Customer Rating</option>
                <option value="relevance">Featured & Relevant</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4B5563] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Desktop View Switcher (Grid 4, Grid 3, List) */}
          <div className="hidden lg:flex items-center border border-[#E8DFCF] rounded-xl overflow-hidden bg-white shadow-xs p-0.5">
            <button
              onClick={() => {
                onViewModeChange("grid");
                onGridColumnsChange(4);
              }}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" && gridColumns === 4
                  ? "bg-[#14532D] text-white"
                  : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F7EBD8]"
              }`}
              aria-label="4 columns grid view"
              title="4 columns grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onViewModeChange("grid");
                onGridColumnsChange(3);
              }}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" && gridColumns === 3
                  ? "bg-[#14532D] text-white"
                  : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F7EBD8]"
              }`}
              aria-label="3 columns grid view"
              title="3 columns grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[#14532D] text-white"
                  : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F7EBD8]"
              }`}
              aria-label="List view"
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider mr-1">
            Active Filters:
          </span>

          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#A7D7A9] text-xs font-semibold text-[#14532D] shadow-xs"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => onRemoveChip(chip.id)}
                className="hover:bg-[#C8E6C9] rounded-full p-0.5 text-[#14532D] transition-colors"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F7EBD8] hover:bg-[#EADFC9] text-xs font-bold text-[#14532D] transition-colors ml-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
}

