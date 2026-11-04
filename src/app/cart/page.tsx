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
    <div className="section-inner py-8 space-y-12">
      <div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F2937]">
          Shopping Basket
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-sans">
          Review your selected Irish grocery imports and festive holiday provisions.
        </p>
      </div>

      {cart.lines.length === 0 ? (
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#14532D]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-[#1F2937]">Your basket is empty</h2>
          <p className="text-sm text-[#4B5563] max-w-sm mx-auto">
            You haven&apos;t added any products to your basket yet. Discover our fresh imports, snacks, and festive holiday treats.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#064E3B] text-white px-6 py-3 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>Explore The Shop</span>
              <ArrowRight className="w-4 h-4 text-[#22C55E]" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 sm:p-6 border-b border-[#E8DFCF] flex items-center justify-between bg-[#F7EBD8]">
              <span className="font-serif-display text-base font-bold text-[#1F2937]">
                Basket Items ({cart.totalQuantity})
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-[#4B5563] hover:text-red-600 underline font-medium"
              >
                Clear basket
              </button>
            </div>

            <div className="divide-y divide-[#E8DFCF]/60 p-4 sm:p-6">
              {cart.lines.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-20 h-20 bg-[#DDF1D5] rounded-xl overflow-hidden shrink-0 border border-[#D0E7C9] flex items-center justify-center p-1">
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#4B5563] uppercase">
                        {item.merchandise.product.vendor}
                      </p>
                      <Link
                        href={`/products/${item.merchandise.product.handle}`}
                        className="text-sm font-semibold text-[#1F2937] hover:text-[#14532D] transition-colors line-clamp-1"
                      >
                        {item.merchandise.product.title}
                      </Link>
                      <p className="text-xs text-[#14532D] font-bold mt-1">
                        {formatMoney(item.merchandise.price)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stepper, Line Total, Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-[#E8DFCF]/40">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8DFCF] rounded-md bg-[#FFFAF1]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1F2937] hover:text-[#14532D]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1F2937] min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1F2937] hover:text-[#14532D]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-bold text-[#14532D]">
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
                      className="text-[#4B5563] hover:text-red-600 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md hover:bg-red-50 transition-colors"
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
          <div className="lg:col-span-4 bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="font-serif-display text-lg font-bold text-[#1F2937] border-b border-[#E8DFCF] pb-3">
              Farmhouse Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-[#4B5563]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#1F2937]">
                  {formatMoney(cart.cost.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Massachusetts Sales Tax</span>
                <span>Calculated on enquiry</span>
              </div>
              <div className="flex justify-between">
                <span>Quincy Store Pickup</span>
                <span className="text-[#14532D] font-bold">Free (2-Hour Ready)</span>
              </div>
            </div>

            <div className="border-t border-[#E8DFCF] pt-3 flex justify-between items-center text-sm">
              <span className="font-bold text-[#1F2937]">Estimated Total</span>
              <span className="text-xl font-bold text-[#14532D]">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={checkout}
                className="w-full bg-[#14532D] hover:bg-[#064E3B] text-white py-3 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>Proceed to Checkout</span>
              </button>

              <button
                onClick={openEnquiry}
                className="w-full bg-[#F7EBD8] hover:bg-[#EADFC9] text-[#14532D] border border-[#14532D]/30 py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Review Basket &amp; Request Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
              </button>

              <Link
                href="/shop"
                className="w-full block text-center text-xs text-[#4B5563] hover:text-[#14532D] pt-2"
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
