import React from "react";
import Link from "next/link";
import { Gift } from "lucide-react";

export function GiftingSection() {
  return (
    <section aria-label="Gifting and Hampers" className="w-full">
      <div className="w-full bg-[#FBF2E2] border border-[#DCE8D7] rounded-[20px] px-5 sm:px-6 md:px-7 py-4.5 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 shadow-xs transition-shadow">
        {/* Left Icon + Divider + Text Content */}
        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
          {/* Gift Icon inside pale mint circular background */}
          <div className="w-12 h-12 rounded-full bg-[#EAF7E8] border border-[#DCE8D7] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-[#10552F]" strokeWidth={1.8} />
          </div>

          {/* Subtle Vertical Divider */}
          <div className="hidden sm:block w-[1px] h-9 bg-[#D5E2D2] shrink-0" />

          {/* Text: Heading + Description */}
          <div className="min-w-0 flex-1">
            <h3 className="font-serif-display text-lg sm:text-[21px] font-bold text-[#10552F] tracking-tight leading-snug">
              Give a Little Taste of Home
            </h3>
            <p className="text-xs sm:text-[13px] text-[#334155] leading-normal font-sans mt-0.5">
              Curated hampers, festive selection boxes, and cherished Irish keepsakes for friends and family across the US.
            </p>
          </div>
        </div>

        {/* Right CTA Button: Shop Gifts → */}
        <Link
          href="/collections/gifts-merchandise"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#10552F] hover:bg-[#0D4426] text-white font-semibold text-xs sm:text-[13.5px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-[10px] transition-all shadow-xs shrink-0 self-stretch md:self-auto text-center"
        >
          <span>Shop Gifts</span>
          <span className="text-[#22C55E] text-base leading-none">→</span>
        </Link>
      </div>
    </section>
  );
}
