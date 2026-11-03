"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";
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
  const { isAuthenticated } = useAuth();
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
      className={`group relative flex flex-col h-full rounded-[24px] border border-[#D0E7C9] bg-[#EDF8E9] shadow-[0_6px_18px_rgba(20,83,45,0.09)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(20,83,45,0.13)] hover:border-[#14532D]/30 ${
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
          isCompact ? "p-3 sm:p-4" : "p-4 sm:p-5"
        }`}
      >
        <div>
          {/* Brand Name */}
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#42634A] mb-1 truncate">
            {product.vendor || "Irish Grocer"}
          </p>

          {/* Product Title */}
          <h3 className="min-h-[2.5rem] sm:min-h-[2.75rem]">
            <Link
              href={`/products/${product.handle}`}
              className={`block font-bold text-[#14532D] hover:text-[#064E3B] transition-colors line-clamp-2 leading-snug font-sans ${
                isCompact
                  ? "text-xs sm:text-sm"
                  : "text-sm sm:text-[17px]"
              }`}
            >
              {product.title}
            </Link>
          </h3>

          {/* Rating (Rendered when available) */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-semibold text-[#14532D]">
              <span className="text-[#22C55E] text-sm" aria-hidden="true">
                ★
              </span>
              <span>{product.rating.value.toFixed(1)}</span>
              <span className="text-[#42634A] font-normal">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Stock Status Indicator with Dot */}
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                product.availableForSale ? "bg-[#22C55E]" : "bg-red-500"
              }`}
            />
            <span className="text-[11px] font-medium text-[#42634A]">
              {product.availableForSale ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Pricing / CTA Experience */}
        <div className="mt-4 pt-1">
          {!isAuthenticated ? (
            <Link
              href="/account/login"
              className="w-full h-11 sm:h-12 rounded-full border border-[#62A86A] bg-white/70 hover:bg-white text-[#14532D] font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors shadow-xs hover:border-[#14532D]"
            >
              Log in to view prices
            </Link>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm sm:text-base font-bold text-[#14532D]">
                  {formatMoney(product.priceRange.minVariantPrice)}
                </span>
                {product.variants[0]?.title &&
                  product.variants[0]?.title !== "Default Title" && (
                    <span className="text-[11px] text-[#42634A] font-medium truncate max-w-[120px]">
                      {product.variants[0].title}
                    </span>
                  )}
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className="w-full h-11 sm:h-12 rounded-full bg-[#14532D] hover:bg-[#0F3D21] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs active:scale-[0.99]"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
