"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Check, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const handleAddToCart = () => {
    addItem(product, currentVariant.id, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-irishBorder overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-ink shadow-sm z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Spotlight Image */}
          <div className="relative aspect-square w-full product-spotlight-frame p-6 flex items-center justify-center">
            <Image
              src={product.featuredImage.url}
              alt={product.title}
              fill
              className="object-contain p-4"
            />
          </div>

          {/* Right: Details & Commerce Controls */}
          <div className="p-6 flex flex-col justify-between bg-white">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-ink-light uppercase tracking-wider">
                {product.vendor}
              </p>
              <h2 className="text-lg font-bold text-commerce leading-snug">
                {product.title}
              </h2>

              {/* SKU & Barcode */}
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                {product.sku && <span>SKU: {product.sku}</span>}
                {product.barcode && <span>| Barcode: {product.barcode}</span>}
              </div>

              {/* Description */}
              <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Variant
                  </label>
                  <select
                    value={currentVariant.id}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full text-xs p-2 border border-irishBorder rounded bg-white"
                  >
                    {product.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Price / Add to cart */}
            <div className="pt-6 border-t border-irishBorder/60 space-y-4">
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/account/login"
                    onClick={onClose}
                    className="dashed-login-btn block w-full py-2.5 px-3 text-center text-xs font-medium rounded"
                  >
                    <span className="underline font-semibold">Log in</span> to view prices
                  </Link>
                  <p className="text-[11px] text-center text-ink-light">
                    Prices are reserved for registered customers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-commerce">
                      {formatMoney(currentVariant.price)}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      {product.availableForSale ? "• In stock" : "• Out of stock"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-irishBorder rounded bg-ivory">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1.5 text-ink hover:text-commerce"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-ink">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-1.5 text-ink hover:text-commerce"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!product.availableForSale}
                      className="flex-1 bg-commerce hover:bg-commerce-dark text-white py-2 px-4 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
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

              <Link
                href={`/products/${product.handle}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs text-commerce font-semibold hover:underline"
              >
                <span>View full product details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

