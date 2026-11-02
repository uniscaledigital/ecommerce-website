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
    <div className="space-y-16">
      {/* 2-Column Product Container matching PDF Page 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Spotlight Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full product-spotlight-frame rounded-xl border border-irishBorder overflow-hidden p-8 shadow-sm">
            <Image
              src={images[activeImageIndex]?.url || product.featuredImage.url}
              alt={images[activeImageIndex]?.altText || product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-4"
            />
          </div>

          {/* Gallery Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden product-spotlight-frame border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? "border-commerce scale-105"
                      : "border-irishBorder opacity-70 hover:opacity-100"
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
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Title */}
          <div>
            <p className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-1">
              {product.vendor}
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8D7017] leading-tight">
              {product.title}
            </h1>

            {/* SKU & Barcode */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted mt-2 pt-1 border-t border-irishBorder/40">
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
                  className="dashed-login-btn block w-full py-3.5 px-4 text-center text-sm font-medium rounded-md"
                >
                  <span className="underline font-bold">Log in</span> to view prices
                </Link>
                <p className="text-xs text-ink-light text-center">
                  Wholesale and customer pricing is available upon signing in.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-irishBorder rounded-lg p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-commerce">
                      {formatMoney(currentVariant.price)}
                    </span>
                    <span className="text-xs text-ink-muted block mt-0.5">
                      Prices in USD • Quincy, MA Store
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        product.availableForSale
                          ? "text-blue-600"
                          : "text-offer"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.availableForSale
                            ? "bg-blue-600"
                            : "bg-offer"
                        }`}
                      />
                      {product.availableForSale ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-irishBorder rounded-md bg-ivory">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-ink hover:text-commerce"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold text-ink min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-ink hover:text-commerce"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.availableForSale}
                    className="flex-1 bg-commerce hover:bg-commerce-dark text-white py-3 px-6 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-gold" />
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
            <label className="block text-xs font-semibold text-ink-light uppercase mb-1.5">
              Default Title: Default Title
            </label>
            <div className="inline-block border border-[#8D7017] rounded px-4 py-2 text-xs font-semibold text-ink bg-ivory">
              {currentVariant.title}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-irishBorder pt-6 space-y-3">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Product Information
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Social Share Icons matching PDF Page 6 */}
          <div className="border-t border-irishBorder pt-4 flex items-center gap-4 text-xs text-ink-muted">
            <span className="font-semibold text-ink">Share:</span>
            <div className="flex items-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-commerce transition-colors p-1"
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
                className="hover:text-commerce transition-colors p-1"
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
                className="hover:text-commerce transition-colors p-1"
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
        <div className="pt-12 border-t border-irishBorder space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-2xl font-bold text-ink">
              Related Favourites
            </h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-commerce hover:underline"
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
