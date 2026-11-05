"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductImageProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

export function ProductImage({
  product,
  onQuickView,
  priority = false,
}: ProductImageProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [imageError, setImageError] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="relative aspect-square w-full bg-[#DDF1D5] rounded-t-[19px] sm:rounded-t-[23px] overflow-hidden flex items-center justify-center">
      {/* Subtle Shamrock Watermark in the Pale Mint-Green Background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute -bottom-5 -left-5 w-28 sm:w-32 h-28 sm:h-32 text-[#22C55E] opacity-[0.14]"
          fill="currentColor"
        >
          <path d="M50 44 C41 33 24 35 24 48 C24 59 36 65 50 56 C64 65 76 59 76 48 C76 35 59 33 50 44 Z" />
          <path d="M50 44 C39 53 37 70 50 70 C63 70 61 53 50 44 Z" />
          <path d="M50 44 C39 35 39 18 50 18 C61 18 61 35 50 44 Z" />
          <path
            d="M50 55 Q48 76 40 88"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Product Photograph */}
      <Link
        href={`/products/${product.handle}`}
        className="relative w-full h-full flex items-center justify-center p-3.5 sm:p-5 z-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        {!imageError && product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 sm:p-5 transition-transform duration-300 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#EDF8E9] border border-[#D0E7C9] flex items-center justify-center text-[#14532D] text-[11px] sm:text-xs font-bold text-center px-2">
            Irish Grocer
          </div>
        )}
      </Link>

      {/* Floating Wishlist Button in Top-Right Corner (>= 44px touch target on mobile via padding/size) */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        aria-pressed={wishlisted}
        className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white shadow-[0_2px_8px_rgba(20,83,45,0.08)] border border-[#D0E7C9]/80 flex items-center justify-center text-[#14532D] hover:scale-110 hover:shadow-md hover:bg-[#FDF4E3] active:scale-95 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
      >
        <Heart
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
            wishlisted
              ? "fill-[#22C55E] text-[#22C55E]"
              : "text-[#14532D] hover:text-[#22C55E]"
          }`}
          strokeWidth={1.8}
        />
      </button>

      {/* Secondary Quick View Button (desktop hover only) */}
      {onQuickView && (
        <button
          type="button"
          onClick={handleQuickViewClick}
          aria-label={`Quick view ${product.title}`}
          className="hidden sm:flex absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#14532D] shadow-xs border border-[#D0E7C9] items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10 focus:opacity-100"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
