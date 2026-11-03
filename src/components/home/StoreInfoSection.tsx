import React from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, ArrowRight, Store } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function StoreInfoSection() {
  return (
    <section id="store-info" className="my-12 md:my-16">
      <div className="bg-[#E8F5E9] border border-[#22C55E]/30 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF4E3] border border-[#22C55E]/40 text-xs font-bold text-[#14532D]">
              <Store className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>A NEIGHBOURHOOD FAVOURITE • QUINCY, MA</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14532D] leading-tight">
              The Irish Grocer Storefront
            </h2>
            <p className="text-sm sm:text-base text-[#1F2937]/80 leading-relaxed max-w-xl font-sans">
              {SITE_CONFIG.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="bg-[#14532D] hover:bg-[#064E3B] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#22C55E]" />
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="bg-[#FDF4E3] hover:bg-white text-[#14532D] border border-[#14532D]/30 font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors"
              >
                Call (857) 387-2065
              </a>
            </div>
          </div>

          {/* Right: Store Details Card in Warm Farmhouse Ivory */}
          <div className="lg:col-span-5 bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-6 sm:p-7 space-y-5 shadow-card">
            <div>
              <div className="flex items-center gap-2 text-[#14532D] text-xs font-bold uppercase tracking-wider mb-1.5">
                <MapPin className="w-4 h-4 text-[#22C55E]" />
                <span>Visit Our Quincy Store</span>
              </div>
              <p className="text-sm font-semibold text-[#1F2937]">
                {SITE_CONFIG.address.street}
              </p>
              <p className="text-xs text-[#4B5563]">
                {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}
              </p>
            </div>

            <div className="border-t border-[#E8DFCF] pt-4">
              <div className="flex items-center gap-2 text-[#14532D] text-xs font-bold uppercase tracking-wider mb-1.5">
                <Clock className="w-4 h-4 text-[#22C55E]" />
                <span>Operating Hours</span>
              </div>
              <p className="text-sm font-semibold text-[#1F2937]">7:00 AM – 10:00 PM</p>
              <p className="text-xs text-[#4B5563]">Open 365 days a year (including all holidays)</p>
            </div>

            <div className="border-t border-[#E8DFCF] pt-4">
              <div className="flex items-center gap-2 text-[#14532D] text-xs font-bold uppercase tracking-wider mb-1.5">
                <Phone className="w-4 h-4 text-[#22C55E]" />
                <span>Direct Telephone</span>
              </div>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="text-base font-bold text-[#14532D] hover:underline block"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
