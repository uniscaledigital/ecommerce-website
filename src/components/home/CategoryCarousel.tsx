"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "./category-data";
import { CategoryCard } from "./CategoryCard";

export function CategoryCarousel() {
  // Duplicated sequence for seamless continuous right-to-left infinite loop
  const loopCategories = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className="my-10 md:my-14 overflow-hidden" aria-label="Shop by Category">
      <div className="space-y-5">
        {/* Section Header: "Shop by Category" and right-side "View All →" */}
        <div className="flex items-end justify-between border-b border-[#E8DFCF] pb-3 px-1">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-[#14532D] hover:underline flex items-center gap-1 group pb-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] rounded"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-[#22C55E] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Carousel Viewport with soft left/right edge fade */}
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-6 sm:before:w-12 before:z-10 before:bg-gradient-to-r before:from-[#FDF4E3] before:to-transparent before:pointer-events-none after:absolute after:right-0 after:top-0 after:bottom-0 after:w-6 sm:after:w-12 after:z-10 after:bg-gradient-to-l after:from-[#FDF4E3] after:to-transparent after:pointer-events-none">
          <div className="overflow-x-auto scrollbar-none py-2 px-1">
            <div className="animate-infinite-carousel flex items-center gap-4 sm:gap-5">
              {loopCategories.map((category, idx) => (
                <CategoryCard
                  key={`${category.id}-${idx}`}
                  category={category}
                  priority={idx < 6}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
