"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "./ProductImage";

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
  variant?: "standard" | "compact" | "featured";
}

export function ProductCard({
  product,
  onQuickView,
  priority = false,
  variant = "standard",
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <article
      className={`group relative flex flex-col h-full rounded-[20px] sm:rounded-[24px] border border-[#D0E7C9] bg-[#EDF8E9] shadow-[0_6px_18px_rgba(20,83,45,0.09)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(20,83,45,0.13)] hover:border-[#14532D]/30 ${
        isFeatured ? "ring-1 ring-[#22C55E]/40" : ""
      }`}
    >
      {/* Upper Product Image Area */}
      <ProductImage
        product={product}
        onQuickView={onQuickView}
        priority={priority}
      />

      {/* Lower Product Content Area */}
      <div
        className={`flex flex-col flex-1 justify-between bg-[#EDF8E9] ${
          isCompact ? "p-2.5 sm:p-4" : "p-3 sm:p-4 md:p-5"
        }`}
      >
        <div>
          {/* Brand Name */}
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#42634A] mb-1 truncate">
            {product.vendor || "Irish Grocer"}
          </p>

          {/* Product Title */}
          <h3 className="min-h-[2.35rem] sm:min-h-[2.75rem]">
            <Link
              href={`/products/${product.handle}`}
              className={`block font-bold text-[#14532D] hover:text-[#064E3B] transition-colors line-clamp-2 leading-snug font-sans ${
                isCompact
                  ? "text-xs sm:text-sm"
                  : "text-[13px] sm:text-base md:text-[17px]"
              }`}
            >
              {product.title}
            </Link>
          </h3>

          {/* Rating (Rendered when available) */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-[#14532D]">
              <span className="text-[#22C55E] text-xs sm:text-sm" aria-hidden="true">
                ★
              </span>
              <span>{product.rating.value.toFixed(1)}</span>
              <span className="text-[#42634A] font-normal text-[11px]">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Stock Status Indicator with Dot */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                product.availableForSale ? "bg-[#22C55E]" : "bg-red-500"
              }`}
            />
            <span className="text-[11px] font-medium text-[#42634A]">
              {product.availableForSale ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* CTA Experience */}
        <div className="mt-3 sm:mt-4 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.availableForSale}
            className="w-full min-h-[44px] h-11 sm:h-11 md:h-12 px-2 rounded-full bg-[#14532D] hover:bg-[#0F3D21] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50 shadow-xs active:scale-[0.99]"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#22C55E]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
