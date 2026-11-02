"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem, openEnquiry } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 border-b border-irishBorder flex items-center justify-between bg-ivory">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-commerce" />
            <h2 className="text-base font-bold text-ink">
              Your Basket ({cart.totalQuantity})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-ink-muted hover:text-ink rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-irishBorder/60">
          {cart.lines.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-ivory flex items-center justify-center text-commerce/40">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-semibold text-ink">Your basket is empty</p>
                <p className="text-xs text-ink-muted mt-1">
                  Explore our authentic Irish snacks, teas, and holiday favourites.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="inline-block bg-commerce hover:bg-commerce-dark text-white px-5 py-2 text-xs font-semibold rounded-md transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.lines.map((item) => (
              <div key={item.id} className="py-4 flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 bg-spotlight rounded-md overflow-hidden shrink-0 border border-irishBorder/40">
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
                    <h3 className="text-xs font-bold text-ink line-clamp-2">
                      {item.merchandise.product.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-ink-light hover:text-offer p-0.5 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {item.merchandise.product.vendor}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-irishBorder rounded bg-ivory">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-ink hover:text-commerce"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-ink min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-ink hover:text-commerce"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-commerce">
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
          <div className="p-4 border-t border-irishBorder bg-ivory space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink font-medium">Estimated Subtotal</span>
              <span className="text-base font-bold text-commerce">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>
            <p className="text-[11px] text-ink-muted leading-tight">
              Taxes and local Quincy / postal delivery charges are calculated and confirmed prior to payment.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  closeCart();
                  openEnquiry();
                }}
                className="w-full bg-commerce hover:bg-commerce-dark text-white py-2.5 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Review basket & request confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full block text-center border border-irishBorder bg-white hover:bg-ivory text-ink py-2 text-xs font-medium rounded-md transition-colors"
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

