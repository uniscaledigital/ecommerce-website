"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="group relative bg-white border border-[#E8DFCF] rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-cardHover hover:border-[#14532D]/40">
      {/* Product Image Frame with Warm Light Background */}
      <Link
        href={`/products/${product.handle}`}
        className="block relative aspect-square w-full product-spotlight-frame p-4"
      >
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick View Floating Button */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#1F2937] shadow-md flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Quick view product"
          >
            <Eye className="w-4 h-4 text-[#14532D]" />
          </button>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Vendor */}
          <p className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wider mb-1 truncate">
            {product.vendor}
          </p>

          {/* Title in text #1F2937 */}
          <Link
            href={`/products/${product.handle}`}
            className="block text-xs sm:text-sm font-semibold text-[#1F2937] hover:text-[#14532D] transition-colors line-clamp-2 min-h-[2.5rem] leading-snug"
          >
            {product.title}
          </Link>

          {/* Stock Status Indicator with #22C55E Accent Dot */}
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                product.availableForSale ? "bg-[#22C55E]" : "bg-red-500"
              }`}
            />
            <span className="text-[11px] text-[#4B5563]">
              {product.availableForSale ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Pricing / Login Experience */}
        <div className="mt-3 pt-2">
          {!isAuthenticated ? (
            <Link
              href="/account/login"
              className="dashed-login-btn block w-full py-2 px-2 text-center text-xs font-semibold rounded-md transition-colors"
            >
              <span className="underline">Log in</span> to view prices
            </Link>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#14532D]">
                  {formatMoney(product.priceRange.minVariantPrice)}
                </span>
                <span className="text-[10px] text-[#4B5563]">
                  {product.variants[0]?.title || "Default Title"}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className="w-full bg-[#14532D] hover:bg-[#0F3D21] text-white py-2 px-3 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to cart</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


