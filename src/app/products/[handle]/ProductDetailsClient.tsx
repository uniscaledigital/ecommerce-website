"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Check, Share2, Pin, ShieldCheck } from "lucide-react";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";
import { ProductGrid } from "@/components/products/ProductGrid";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const images = product.images.length > 0 ? product.images : [product.featuredImage];

  const handleAddToCart = () => {
    addItem(product, currentVariant.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 2-Column Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Spotlight Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full bg-[#DDF1D5] rounded-2xl border border-[#D0E7C9] overflow-hidden p-5 sm:p-8 shadow-xs flex items-center justify-center">
            {/* Subtle Shamrock Watermark in Pale Mint Background */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden select-none"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute -bottom-6 -left-6 w-36 sm:w-44 h-36 sm:h-44 text-[#22C55E] opacity-[0.14]"
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
            <Image
              src={images[activeImageIndex]?.url || product.featuredImage.url}
              alt={images[activeImageIndex]?.altText || product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-4 sm:p-6 relative z-0"
            />
          </div>

          {/* Gallery Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded-xl overflow-hidden bg-[#DDF1D5] border-2 transition-all shrink-0 p-1 flex items-center justify-center ${
                    activeImageIndex === idx
                      ? "border-[#14532D] scale-105 shadow-sm"
                      : "border-[#D0E7C9] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.title} ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Metadata, Pricing, Actions */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Brand & Title */}
          <div>
            <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1">
              {product.vendor}
            </p>
            <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] leading-tight">
              {product.title}
            </h1>

            {/* SKU & Barcode */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#4B5563] mt-2 pt-1 border-t border-[#E8DFCF]/50">
              {product.sku && (
                <span>
                  <strong>SKU:</strong> {product.sku}
                </span>
              )}
              {product.sku && product.barcode && <span>|</span>}
              {product.barcode && (
                <span>
                  <strong>Barcode:</strong> {product.barcode}
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Cart Action Block */}
          <div className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  href="/account/login"
                  className="dashed-login-btn block w-full py-3.5 px-4 text-center text-sm font-semibold rounded-lg min-h-[44px]"
                >
                  <span className="underline font-bold">Log in</span> to view prices
                </Link>
                <p className="text-xs text-[#4B5563] text-center">
                  Wholesale and customer pricing is available upon signing in.
                </p>
              </div>
            ) : (
              <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-[#14532D]">
                      {formatMoney(currentVariant.price)}
                    </span>
                    <span className="text-xs text-[#4B5563] block mt-0.5">
                      Prices in USD • Quincy, MA Store
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        product.availableForSale
                          ? "text-[#14532D]"
                          : "text-red-600"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.availableForSale
                            ? "bg-[#22C55E]"
                            : "bg-red-500"
                        }`}
                      />
                      {product.availableForSale ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <div className="flex items-center justify-between sm:justify-start border border-[#E8DFCF] rounded-lg bg-[#FFFAF1] h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-[#1F2937] hover:text-[#14532D]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold text-[#1F2937] min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-[#1F2937] hover:text-[#14532D]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.availableForSale}
                    className="flex-1 bg-[#14532D] hover:bg-[#064E3B] text-white h-12 px-6 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#22C55E]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Variant Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase mb-1.5">
              Selection Option
            </label>
            <div className="inline-block border border-[#14532D]/40 rounded-lg px-4 py-2 text-xs font-bold text-[#14532D] bg-[#F7EBD8]">
              {currentVariant.title}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-[#E8DFCF] pt-5 sm:pt-6 space-y-3">
            <h3 className="text-sm font-bold text-[#14532D] uppercase tracking-wider font-sans">
              Product Information
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Social Share Icons with >= 44px touch targets */}
          <div className="border-t border-[#E8DFCF] pt-4 flex items-center gap-3 text-xs text-[#4B5563]">
            <span className="font-semibold text-[#1F2937]">Share:</span>
            <div className="flex items-center gap-1.5">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:text-[#14532D] hover:bg-[#14532D]/5 rounded-lg transition-colors"
                aria-label="Share on Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  product.title
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:text-[#14532D] hover:bg-[#14532D]/5 rounded-lg transition-colors"
                aria-label="Share on X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?description=${encodeURIComponent(
                  product.title
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:text-[#14532D] hover:bg-[#14532D]/5 rounded-lg transition-colors"
                aria-label="Share on Pinterest"
              >
                <Pin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 sm:pt-12 border-t border-[#E8DFCF] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1F2937]">
              Related Favourites
            </h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#14532D] hover:underline"
            >
              Browse all items →
            </Link>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      )}
    </div>
  );
}
