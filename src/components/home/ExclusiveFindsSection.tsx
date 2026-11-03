import React from "react";
import { Phone, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function ExclusiveFindsSection() {
  return (
    <section id="exclusive-finds" className="my-10 md:my-14">
      <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-xs font-bold text-[#14532D]">
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>DISCOVER SPECIALTY SHIPMENTS</span>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Exclusive Seasonal &amp; Limited Finds
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Speciality European perishables, artisanal puddings, and seasonal batch imports are reserved for direct enquiry. Call our Quincy store to check current stock, pricing, and reservation.
            </p>
          </div>

          <div className="bg-[#F7EBD8] border border-[#E8DFCF] rounded-xl p-5 sm:p-6 shrink-0 w-full sm:w-auto text-center sm:text-left shadow-xs">
            <span className="text-[11px] font-bold text-[#14532D] uppercase tracking-wider block">
              Call Direct to Reserve
            </span>
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="text-xl sm:text-2xl font-bold text-[#14532D] hover:underline block my-1 font-serif-display"
            >
              (857) 387-2065
            </a>
            <p className="text-[11px] text-[#4B5563]">
              Our Quincy team will gladly confirm what&apos;s on today&apos;s shelves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
