"use client";

import React, { useState, useEffect, useRef } from "react";
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

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Store trigger element and manage focus
  useEffect(() => {
    if (product) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      // Focus modal close button
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      // Restore focus on close
      triggerElementRef.current?.focus();
    };
  }, [product]);

  // Handle Escape key and Tab focus trap
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

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
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div
        className="fixed inset-0 bg-[#14532D]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl bg-[#EDF8E9] rounded-[24px] shadow-2xl border border-[#D0E7C9] overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white shadow-xs border border-[#D0E7C9] hover:bg-[#DDF1D5] text-[#14532D] z-20 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Product Image with Pale Mint background & clover watermark */}
          <div className="relative aspect-square w-full bg-[#DDF1D5] p-6 flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden select-none"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute -bottom-4 -left-4 w-32 h-32 text-[#22C55E] opacity-[0.14]"
                fill="currentColor"
              >
                <path d="M50 44 C41 33 24 35 24 48 C24 59 36 65 50 56 C64 65 76 59 76 48 C76 35 59 33 50 44 Z" />
                <path d="M50 44 C39 53 37 70 50 70 C63 70 61 53 50 44 Z" />
                <path d="M50 44 C39 35 39 18 50 18 C61 18 61 35 50 44 Z" />
              </svg>
            </div>
            <Image
              src={product.featuredImage.url}
              alt={product.title}
              fill
              className="object-contain p-6"
            />
          </div>

          {/* Right: Details & Commerce Controls */}
          <div className="p-6 flex flex-col justify-between bg-[#EDF8E9]">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-[#42634A] uppercase tracking-wider">
                {product.vendor}
              </p>
              <h2
                id="quickview-title"
                className="text-xl font-bold font-sans text-[#14532D] leading-snug"
              >
                {product.title}
              </h2>

              {/* Rating if present */}
              {product.rating && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14532D]">
                  <span className="text-[#22C55E]">★</span>
                  <span>{product.rating.value.toFixed(1)}</span>
                  <span className="text-[#42634A] font-normal">
                    ({product.rating.count})
                  </span>
                </div>
              )}

              {/* SKU & Barcode */}
              <div className="flex items-center gap-3 text-xs text-[#42634A]">
                {product.sku && <span>SKU: {product.sku}</span>}
                {product.barcode && <span>| Barcode: {product.barcode}</span>}
              </div>

              {/* Description */}
              <p className="text-xs text-[#42634A] leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#14532D] mb-1">
                    Variant
                  </label>
                  <select
                    value={currentVariant.id}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D0E7C9] rounded-lg bg-white text-[#14532D] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
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

            {/* Bottom Commerce Controls */}
            <div className="pt-6 border-t border-[#D0E7C9] space-y-4">
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/account/login"
                    onClick={onClose}
                    className="w-full h-11 rounded-full border border-[#62A86A] bg-white/70 hover:bg-white text-[#14532D] font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors shadow-xs"
                  >
                    Log in to view prices
                  </Link>
                  <p className="text-[11px] text-center text-[#42634A]">
                    Prices are reserved for registered customers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#14532D]">
                      {formatMoney(currentVariant.price)}
                    </span>
                    <span className="text-xs text-[#22C55E] font-semibold flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.availableForSale ? "bg-[#22C55E]" : "bg-red-500"
                        }`}
                      />
                      {product.availableForSale ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#D0E7C9] rounded-full bg-white px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-[#14532D] hover:text-[#064E3B] rounded-full hover:bg-[#DDF1D5]/40 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#14532D]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#14532D] hover:text-[#064E3B] rounded-full hover:bg-[#DDF1D5]/40 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!product.availableForSale}
                      className="flex-1 h-11 rounded-full bg-[#14532D] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
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

              <Link
                href={`/products/${product.handle}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs text-[#14532D] font-semibold hover:underline"
              >
                <span>View full product details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
