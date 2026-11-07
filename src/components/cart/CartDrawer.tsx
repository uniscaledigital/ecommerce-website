"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem, openEnquiry, checkout } = useCart();
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Initial focus management & focus restoration
  useEffect(() => {
    if (!isCartOpen) return;
    triggerElementRef.current = document.activeElement as HTMLElement;
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
    return () => {
      clearTimeout(timer);
      triggerElementRef.current?.focus();
      triggerElementRef.current = null;
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1150] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping basket drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FFFAF1] shadow-2xl flex flex-col z-10 border-l border-[#E8DFCF]">
        {/* Header */}
        <div className="p-4 border-b border-[#E8DFCF] flex items-center justify-between bg-[#FFFAF1]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#14532D]" />
            <h2 className="font-serif-display text-lg font-bold text-[#1F2937]">
              Your Farmhouse Basket ({cart.totalQuantity})
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#4B5563] hover:text-[#1F2937] hover:bg-[#14532D]/8 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#E8DFCF]/60">
          {cart.lines.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#14532D]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-[#1F2937]">Your basket is empty</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Explore our authentic Irish crisps, teas, and holiday provisions.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="inline-block bg-[#14532D] hover:bg-[#0F3D21] text-white px-5 py-2.5 text-xs font-semibold rounded-md transition-colors shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.lines.map((item) => (
              <div key={item.id} className="py-4 flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 bg-[#DDF1D5] rounded-xl overflow-hidden shrink-0 border border-[#D0E7C9] flex items-center justify-center p-1">
                  <Image
                    src={item.merchandise.product.featuredImage.url}
                    alt={item.merchandise.product.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-[#1F2937] line-clamp-2">
                      {item.merchandise.product.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#4B5563] hover:text-red-600 p-1 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-0.5">
                    {item.merchandise.product.vendor}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8DFCF] rounded-md bg-[#FFFAF1]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1F2937] hover:text-[#14532D]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#1F2937] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1F2937] hover:text-[#14532D]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#14532D]">
                        {formatMoney({
                          amount: (
                            parseFloat(item.merchandise.price.amount) * item.quantity
                          ).toFixed(2),
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.lines.length > 0 && (
          <div className="p-4 border-t border-[#E8DFCF] bg-[#F7EBD8] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#1F2937] font-medium">Estimated Subtotal</span>
              <span className="text-base font-bold text-[#14532D]">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>
            <p className="text-[11px] text-[#4B5563] leading-tight">
              Taxes and Quincy / shipping fees will be verified prior to payment link issuance.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  closeCart();
                  checkout();
                }}
                className="w-full bg-[#14532D] hover:bg-[#0F3D21] text-white py-2.5 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#22C55E]" />
              </button>

              <button
                onClick={() => {
                  closeCart();
                  openEnquiry();
                }}
                className="w-full border border-[#14532D]/30 bg-[#FDF4E3] hover:bg-white text-[#14532D] py-2 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Review Basket &amp; Request Confirmation</span>
              </button>

              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full block text-center text-[11px] text-[#4B5563] hover:text-[#14532D] pt-1"
              >
                View Full Basket Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
