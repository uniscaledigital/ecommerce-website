"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";

interface MobileProductSpotlightProps {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  products: Product[];
}

export function MobileProductSpotlight({
  eyebrow,
  title,
  viewAllHref,
  products,
}: MobileProductSpotlightProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D]">
            {eyebrow}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#14532D] font-serif-display leading-tight">
            {title}
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-bold text-[#14532D] hover:text-[#064E3B] flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
          aria-label={`View all in ${title}`}
        >
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
        </Link>
      </div>

      {/* Horizontal Swipeable Track */}
      <div className="w-full -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex gap-2.5 pb-1 snap-x snap-mandatory min-w-max">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[152px] sm:w-[168px] shrink-0 snap-start h-full"
            >
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

