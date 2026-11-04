"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, Eye, Star } from "lucide-react";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

interface ProductListCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

export function ProductListCard({
  product,
  onQuickView,
  priority = false,
}: ProductListCardProps) {
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

  const firstVariant = product.variants[0];

  return (
    <article className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl border border-[#D0E7C9] bg-[#EDF8E9] shadow-[0_4px_14px_rgba(20,83,45,0.07)] overflow-hidden transition-all duration-200 hover:shadow-[0_10px_20px_rgba(20,83,45,0.12)] hover:border-[#14532D]/30">
      {/* Product Image Area */}
      <div className="relative w-full sm:w-56 md:w-64 h-52 sm:h-auto bg-[#D8EED2]/50 shrink-0 flex items-center justify-center p-4 overflow-hidden">
        <Link href={`/products/${product.handle}`} className="block relative w-full h-full min-h-[140px]">
          <Image
            src={product.featuredImage?.url || "/placeholder.png"}
            alt={product.featuredImage?.altText || product.title}
            fill
            sizes="(max-width: 640px) 100vw, 250px"
            priority={priority}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white text-[#14532D] shadow-md transition-all active:scale-95"
            aria-label={`Quick view ${product.title}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Information Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#42634A]">
              {product.vendor || "Irish Grocer"}
            </span>

            <div className="flex items-center gap-1.5">
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

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#14532D] hover:text-[#064E3B] transition-colors leading-snug">
            <Link href={`/products/${product.handle}`}>{product.title}</Link>
          </h3>

          {/* Customer Rating */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#14532D]">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span>{product.rating.value.toFixed(1)}</span>
              <span className="text-[#42634A] font-normal text-[11px]">
                ({product.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Description Snippet */}
          <p className="text-xs text-[#374151] mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Tags Badges */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {product.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-[#D8EED2]/80 text-[#14532D] text-[10px] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-[#D0E7C9] flex flex-wrap items-center justify-between gap-3">
          {!isAuthenticated ? (
            <Link
              href="/account/login"
              className="h-10 px-4 rounded-xl border border-[#62A86A] bg-white hover:bg-[#F7EBD8] text-[#14532D] font-semibold text-xs flex items-center justify-center transition-colors shadow-xs"
            >
              Log in to view price
            </Link>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-[#14532D]">
                {formatMoney(product.priceRange.minVariantPrice)}
              </span>
              {firstVariant?.title && firstVariant.title !== "Default Title" && (
                <span className="text-xs text-[#42634A]">({firstVariant.title})</span>
              )}
            </div>
          )}

          <button
            type="button"
            disabled={!product.availableForSale}
            onClick={handleAddToCart}
            className={`h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm min-h-[44px] ${
              !product.availableForSale
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isAdded
                ? "bg-[#22C55E] text-white"
                : "bg-[#14532D] hover:bg-[#064E3B] text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Basket</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{product.availableForSale ? "Add to Basket" : "Out of Stock"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

