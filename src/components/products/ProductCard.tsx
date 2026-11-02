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
    <div className="group relative bg-white border border-irishBorder rounded-md overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-card hover:border-commerce/30">
      {/* Product Image Frame with Spotlight Background */}
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
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-ink shadow-md flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Quick view product"
          >
            <Eye className="w-4 h-4 text-commerce" />
          </button>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Vendor */}
          <p className="text-[11px] font-medium text-ink-light uppercase tracking-wider mb-1 truncate">
            {product.vendor}
          </p>

          {/* Title */}
          <Link
            href={`/products/${product.handle}`}
            className="block text-xs sm:text-sm font-bold text-[#8D7017] hover:text-commerce transition-colors line-clamp-2 min-h-[2.5rem] leading-snug"
          >
            {product.title}
          </Link>

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                product.availableForSale ? "bg-blue-600" : "bg-offer"
              }`}
            />
            <span className="text-[11px] text-ink-muted">
              {product.availableForSale ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Pricing / Login Experience */}
        <div className="mt-3 pt-2">
          {!isAuthenticated ? (
            <Link
              href="/account/login"
              className="dashed-login-btn block w-full py-2 px-2 text-center text-xs font-medium rounded transition-colors"
            >
              <span className="underline">Log in</span> to view prices
            </Link>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-commerce">
                  {formatMoney(product.priceRange.minVariantPrice)}
                </span>
                <span className="text-[10px] text-ink-light">
                  {product.variants[0]?.title || "Default Title"}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className="w-full bg-commerce hover:bg-commerce-dark text-white py-1.5 px-3 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-gold" />
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

