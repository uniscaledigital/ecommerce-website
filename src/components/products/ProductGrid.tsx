"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center border border-dashed border-[#D0E7C9] rounded-[24px] bg-[#EDF8E9]/60 p-6 sm:p-8 shadow-xs">
        <p className="text-base font-bold text-[#14532D]">No products found</p>
        <p className="text-xs text-[#42634A] mt-1">
          Try adjusting your search keywords or filter settings.
        </p>
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
      <div className={`grid ${gridColsClass} gap-3 sm:gap-4 md:gap-5 lg:gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
