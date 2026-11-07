import React from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, Store } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function StoreInfoSection() {
  return (
    <section id="store-info" aria-label="The Irish Grocer Marshfield Store" className="w-full">
      <div className="w-full bg-[#EAF7E8] border border-[#DCE8D7] rounded-[20px] p-5 sm:p-8 lg:p-10 shadow-xs transition-shadow">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_minmax(300px,360px)] gap-6 sm:gap-8 items-center">
          {/* Left Text Column */}
          <div className="space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E3] border border-[#DCE8D7] text-[10.5px] sm:text-[11px] font-bold text-[#10552F] uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-[#10552F]" />
              <span>A NEIGHBOURHOOD FAVOURITE • MARSHFIELD, MA</span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#10552F] tracking-tight leading-tight">
              The Irish Grocer
            </h2>

            <p className="text-xs sm:text-[13.5px] text-[#334155] leading-relaxed max-w-xl font-sans">
              Imported Irish and UK grocery favourites in Marshfield, Massachusetts. Delivered straight from Dublin and Cork to New England weekly.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#10552F] hover:bg-[#0D4426] text-white font-semibold text-xs sm:text-[13.5px] px-6 py-3 rounded-[10px] transition-all shadow-xs min-h-[44px]"
              >
                <span>Shop Catalog</span>
                <span className="text-[#22C55E] text-base leading-none">→</span>
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FDF4E3] hover:bg-white text-[#10552F] border border-[#DCE8D7] font-semibold text-xs sm:text-[13.5px] px-5 sm:px-6 py-3 rounded-[10px] transition-all shadow-xs min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#10552F]" strokeWidth={1.8} />
                <span>Call {SITE_CONFIG.phone}</span>
              </a>
            </div>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block w-[1px] h-40 bg-[#D5E2D2] shrink-0 self-center" />

          {/* Right Store Details Column */}
          <div className="space-y-3.5 sm:space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#D5E2D2]/60 font-sans">
            {/* 1. Visit Our Marshfield Store */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#10552F] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#10552F] leading-tight">
                  Visit Our Marshfield Store
                </h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1899+Ocean+St+Marshfield+MA+02050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-[12.5px] text-[#334155] hover:text-[#10552F] hover:underline mt-0.5 leading-snug block"
                >
                  {SITE_CONFIG.address.full}
                </a>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#D5E2D2]/60" />

            {/* 2. Operating Hours */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#10552F] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#10552F] leading-tight">
                  Operating Hours
                </h3>
                <p className="text-xs sm:text-[12.5px] text-[#334155] mt-0.5 leading-snug">
                  {SITE_CONFIG.hours}
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#D5E2D2]/60" />

            {/* 3. Direct Telephone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#10552F] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#10552F] leading-tight">
                  Direct Telephone
                </h3>
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="text-base sm:text-lg font-bold text-[#10552F] hover:underline block leading-tight mt-0.5"
                >
                  {SITE_CONFIG.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
