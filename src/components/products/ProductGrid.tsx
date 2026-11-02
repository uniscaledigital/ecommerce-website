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
      <div className="py-16 text-center border border-dashed border-irishBorder rounded-lg bg-ivory p-8">
        <p className="text-base font-semibold text-ink">No products found</p>
        <p className="text-xs text-ink-muted mt-1">
          Try adjusting your search keywords or filter settings.
        </p>
      </div>
    );
  }

  const gridColsClass =
    columns === 4
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2";

  return (
    <>
      <div className={`grid ${gridColsClass} gap-3 sm:gap-4 lg:gap-6`}>
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

