"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, openEnquiry, checkout } = useCart();

  return (
    <div className="py-8 space-y-12">
      <div>
        <h1 className="font-serif-display text-3xl font-bold text-ink">
          Shopping Basket
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Review your selected Irish and UK grocery items.
        </p>
      </div>

      {cart.lines.length === 0 ? (
        <div className="bg-white border border-irishBorder rounded-xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-ivory flex items-center justify-center text-commerce/40">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-ink">Your basket is empty</h2>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            You haven't added any products to your basket yet. Discover our fresh imports, snacks, and festive holiday treats.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-commerce hover:bg-commerce-dark text-white px-6 py-2.5 text-xs font-semibold rounded-md transition-colors"
            >
              <span>Explore The Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-white border border-irishBorder rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 border-b border-irishBorder flex items-center justify-between bg-ivory">
              <span className="text-sm font-bold text-ink">
                Basket Items ({cart.totalQuantity})
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-ink-light hover:text-offer underline"
              >
                Clear basket
              </button>
            </div>

            <div className="divide-y divide-irishBorder/60 p-4 sm:p-6">
              {cart.lines.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-20 h-20 product-spotlight-frame rounded-md overflow-hidden shrink-0 border border-irishBorder">
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-ink-light uppercase">
                        {item.merchandise.product.vendor}
                      </p>
                      <Link
                        href={`/products/${item.merchandise.product.handle}`}
                        className="text-sm font-bold text-ink hover:text-commerce transition-colors line-clamp-1"
                      >
                        {item.merchandise.product.title}
                      </Link>
                      <p className="text-xs text-commerce font-bold mt-1">
                        {formatMoney(item.merchandise.price)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stepper, Line Total, Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-irishBorder/30">
                    {/* Stepper */}
                    <div className="flex items-center border border-irishBorder rounded bg-ivory">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-ink hover:text-commerce"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-ink min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-ink hover:text-commerce"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-bold text-ink">
                        {formatMoney({
                          amount: (
                            parseFloat(item.merchandise.price.amount) * item.quantity
                          ).toFixed(2),
                        })}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-ink-light hover:text-offer p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white border border-irishBorder rounded-xl p-6 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-ink border-b border-irishBorder pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-ink-muted">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-ink">
                  {formatMoney(cart.cost.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Massachusetts Sales Tax</span>
                <span>Calculated on enquiry</span>
              </div>
              <div className="flex justify-between">
                <span>Quincy / Postal Delivery</span>
                <span>Calculated on enquiry</span>
              </div>
            </div>

            <div className="border-t border-irishBorder pt-3 flex justify-between items-center text-sm">
              <span className="font-bold text-ink">Estimated Total</span>
              <span className="text-lg font-bold text-commerce">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={openEnquiry}
                className="w-full bg-commerce hover:bg-commerce-dark text-white py-3 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Review basket & request confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={checkout}
                className="w-full bg-forest-dark hover:bg-black text-white py-2.5 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Shopify Hosted Checkout</span>
              </button>

              <Link
                href="/shop"
                className="w-full block text-center text-xs text-ink-muted hover:text-commerce pt-2"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <OrderConfidenceSection />
    </div>
  );
}

