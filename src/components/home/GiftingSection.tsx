import React from "react";
import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";

export function GiftingSection() {
  return (
    <section className="my-10 md:my-14">
      <div className="bg-[#F7EBD8] border border-[#E8DFCF] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#14532D] flex items-center justify-center shrink-0 hidden sm:flex border border-[#22C55E]/40">
            <Gift className="w-6 h-6 text-[#14532D]" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#14532D] uppercase">
              EASY GIFTING &amp; CARE PACKAGES
            </p>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1F2937] mt-0.5">
              Give a Little Taste of Home
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-sans">
              Curated hampers, festive selection boxes, and cherished Irish keepsakes for friends and family across the US.
            </p>
          </div>
        </div>

        <Link
          href="/collections/gifts-merchandise"
          className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#0F3D21] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors shrink-0 shadow-sm"
        >
          <span>Shop Gifts</span>
          <ArrowRight className="w-4 h-4 text-[#22C55E]" />
        </Link>
      </div>
    </section>
  );
}
