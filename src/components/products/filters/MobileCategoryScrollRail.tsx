"use client";

import React from "react";
import { Collection } from "@/types";

interface MobileCategoryScrollRailProps {
  collections: Collection[];
  selectedCategory: string | null;
  onSelectCategory: (handle: string | null) => void;
  allLabel?: string;
}

export function MobileCategoryScrollRail({
  collections,
  selectedCategory,
  onSelectCategory,
  allLabel = "All Departments",
}: MobileCategoryScrollRailProps) {
  return (
    <div className="w-full -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 py-1 min-w-max">
        {/* All Departments Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 border ${
            !selectedCategory
              ? "bg-[#14532D] text-white border-[#14532D] shadow-xs"
              : "bg-[#FFFAF1] text-[#14532D] border-[#E8DFCF] hover:bg-[#F7EBD8]"
          }`}
          aria-pressed={!selectedCategory}
        >
          {allLabel}
        </button>

        {/* Individual Department Pills */}
        {collections.map((col) => {
          const isSelected = selectedCategory === col.handle;
          return (
            <button
              key={col.handle}
              type="button"
              onClick={() => onSelectCategory(isSelected ? null : col.handle)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 border ${
                isSelected
                  ? "bg-[#14532D] text-white border-[#14532D] shadow-xs"
                  : "bg-[#FFFAF1] text-[#1F2937] border-[#E8DFCF] hover:bg-[#F7EBD8]"
              }`}
              aria-pressed={isSelected}
            >
              {col.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

