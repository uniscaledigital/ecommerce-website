import React from "react";
import { Phone, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function ExclusiveFindsSection() {
  return (
    <section id="exclusive-finds" className="my-8 md:my-12">
      <div className="bg-white border border-irishBorder rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <p className="text-xs font-bold tracking-[0.2em] text-commerce uppercase">
                DISCOVER SOMETHING SPECIAL
              </p>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-ink">
              Exclusive Finds
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Some of our special finds are available by enquiry. Call our Quincy store to ask about the current range, prices and availability.
            </p>
          </div>

          <div className="bg-ivory border border-irishBorder rounded-lg p-5 shrink-0 w-full sm:w-auto text-center sm:text-left">
            <span className="text-[11px] font-semibold text-ink-light uppercase tracking-wider block">
              Call the store
            </span>
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="text-xl sm:text-2xl font-bold text-commerce hover:underline block my-1"
            >
              857-387-2065
            </a>
            <p className="text-[11px] text-ink-muted">
              Our team will talk you through what is available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

