"use client";

import React from "react";
import { ArrowRight, ShieldCheck, MailCheck, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function OrderConfidenceSection() {
  const { openEnquiry } = useCart();

  return (
    <section className="my-12 md:my-16">
      <div className="bg-ivory border border-irishBorder rounded-xl p-8 sm:p-10 lg:p-12 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-commerce uppercase">
            WE'RE HAPPY TO HELP
          </p>

          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
            Order with confidence
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-ink-muted leading-relaxed">
            <p>
              Send us your order request. We'll confirm availability, your full total including any applicable tax and delivery charges, and whether we can offer delivery to your address before you pay.
            </p>
            <p>
              We'll send you a secure online payment link, so there's no need to share card details over the phone. Delivery arrangements are confirmed in writing once payment is received. Submitting an order does not reserve a delivery time.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={openEnquiry}
              className="inline-flex items-center gap-2 bg-commerce hover:bg-commerce-dark text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-md transition-colors shadow-sm"
            >
              <span>Review basket & request confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 text-xs text-ink-light">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-commerce" />
                Secure Payment Links
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MailCheck className="w-3.5 h-3.5 text-commerce" />
                Written Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

