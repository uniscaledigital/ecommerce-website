"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductListCard } from "./ProductListCard";
import { QuickViewModal } from "./QuickViewModal";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  viewMode?: "grid" | "list";
  onClearFilters?: () => void;
}

export function ProductGrid({
  products,
  columns = 4,
  viewMode = "grid",
  onClearFilters,
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center border border-dashed border-[#D0E7C9] rounded-[24px] bg-[#EDF8E9]/60 p-6 sm:p-8 shadow-xs space-y-3">
        <p className="text-base font-bold text-[#14532D]">No matching products found</p>
        <p className="text-xs text-[#42634A] max-w-md mx-auto">
          We couldn&apos;t find any products matching your selected filter criteria. Try adjusting your filters or price range.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#064E3B] text-white text-xs font-bold transition-all shadow-xs min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    );
  }

  const gridColsClass =
    columns === 4
      ? "grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3"
      : "grid-cols-1 min-[340px]:grid-cols-2";

  return (
    <>
      {viewMode === "list" ? (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductListCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4 md:gap-5 lg:gap-6`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
