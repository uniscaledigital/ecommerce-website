"use client";

import React, { useEffect, useRef } from "react";
import { X, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

export function DemoCheckoutModal() {
  const { cart, isDemoCheckoutOpen, closeDemoCheckout, openEnquiry } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Initial focus management & focus restoration
  useEffect(() => {
    if (!isDemoCheckoutOpen) return;
    triggerElementRef.current = document.activeElement as HTMLElement;
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
    return () => {
      clearTimeout(timer);
      triggerElementRef.current?.focus();
      triggerElementRef.current = null;
    };
  }, [isDemoCheckoutOpen]);

  // Keyboard navigation: Escape key closes modal & focus trap
  useEffect(() => {
    if (!isDemoCheckoutOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDemoCheckout();
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDemoCheckoutOpen, closeDemoCheckout]);

  if (!isDemoCheckoutOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-checkout-title"
    >
      <div
        className="fixed inset-0 bg-[#1F2937]/70 backdrop-blur-xs transition-opacity"
        onClick={closeDemoCheckout}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-[#FFFAF1] rounded-2xl shadow-2xl border border-[#E8DFCF] overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header in Forest Green */}
          <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#22C55E]/20 flex items-center justify-center border border-[#22C55E]/40">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">
                  Storefront Presentation Preview
                </p>
                <h2 id="demo-checkout-title" className="text-lg font-bold font-serif-display">
                  Demo Mode
                </h2>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              onClick={closeDemoCheckout}
              className="text-white/80 hover:text-white w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 bg-[#FFFAF1]">
            {/* Primary Required Master Message */}
            <div className="bg-[#E8F5E9] border border-[#22C55E]/40 rounded-xl p-4 text-[#14532D]">
              <p className="text-sm sm:text-base font-bold leading-snug">
                Demo Mode — Live Shopify checkout will be available once the store integration is configured.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              You are viewing an interactive custom storefront demonstration for <strong>The Irish Grocer</strong>. In the upcoming phase, this button connects directly to your secure <strong>Shopify Hosted Checkout</strong> with real-time credit card processing, Apple Pay, Google Pay, and Massachusetts delivery tax calculation.
            </p>

            {/* Current Cart Summary */}
            <div className="bg-[#F7EBD8] rounded-xl p-4 border border-[#E8DFCF] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#1F2937] border-b border-[#E8DFCF] pb-2">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#14532D]" />
                  Active Demo Basket ({cart.totalQuantity} items)
                </span>
                <span className="text-[#14532D] text-sm font-bold">
                  {formatMoney(cart.cost.subtotalAmount)}
                </span>
              </div>
              <p className="text-[11px] text-[#52665B] leading-relaxed">
                No payment was charged, no order was placed, and no mock tokens were created. Your cart items remain saved locally.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={closeDemoCheckout}
                className="w-full bg-[#14532D] hover:bg-[#064E3B] text-white py-3 px-4 min-h-[44px] text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Understood &amp; Return to Store</span>
              </button>

              <button
                onClick={() => {
                  closeDemoCheckout();
                  openEnquiry();
                }}
                className="w-full bg-[#FDF4E3] hover:bg-[#F7EBD8] text-[#14532D] border border-[#14532D]/30 py-2.5 px-4 min-h-[44px] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Test Store Enquiry Concierge Instead</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

