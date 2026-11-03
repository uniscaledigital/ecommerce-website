"use client";

import React from "react";
import { ArrowRight, ShieldCheck, MailCheck, Lock, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function OrderConfidenceSection() {
  const { openEnquiry } = useCart();

  return (
    <section id="order-confidence" className="my-12 md:my-16">
      <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-xs font-bold text-[#14532D]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>TRANSPARENT SERVICE • WE&apos;RE HAPPY TO HELP</span>
          </div>

          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] leading-tight">
            Order with Confidence &amp; Peace of Mind
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-[#4B5563] leading-relaxed font-sans">
            <p>
              Send us your grocery order enquiry. We will personally verify batch availability in Quincy, calculate applicable sales taxes, and confirm cold-chain delivery eligibility before you make any payment.
            </p>
            <p>
              We issue official, secure Shopify payment links directly to your email or mobile — no need to ever read credit card numbers over the phone. Final delivery slots and store collection windows are confirmed in writing.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <button
              onClick={openEnquiry}
              className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#0F3D21] text-white font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-lg transition-colors shadow-sm"
            >
              <span>Review Basket &amp; Request Confirmation</span>
              <ArrowRight className="w-4 h-4 text-[#22C55E]" />
            </button>

            <div className="flex items-center gap-4 text-xs text-[#4B5563]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Lock className="w-4 h-4 text-[#22C55E]" />
                Secure Shopify Invoicing
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MailCheck className="w-4 h-4 text-[#22C55E]" />
                Written Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
