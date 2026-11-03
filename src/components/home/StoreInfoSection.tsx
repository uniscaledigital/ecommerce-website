import React from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, Store } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function StoreInfoSection() {
  return (
    <section id="store-info" aria-label="The Irish Grocer Quincy Store" className="w-full">
      <div className="w-full bg-[#EAF7E8] border border-[#DCE8D7] rounded-[20px] p-6 sm:p-8 lg:p-10 shadow-xs transition-shadow">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_minmax(300px,360px)] gap-8 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E3] border border-[#DCE8D7] text-[11px] font-bold text-[#10552F] uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-[#10552F]" />
              <span>A NEIGHBOURHOOD FAVOURITE • QUINCY, MA</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#10552F] tracking-tight leading-tight">
              The Irish Grocer
            </h2>

            <p className="text-xs sm:text-[13.5px] text-[#334155] leading-relaxed max-w-xl font-sans">
              Imported Irish and UK grocery favourites in Quincy, Massachusetts. Delivered straight from Dublin and Cork to New England weekly.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#10552F] hover:bg-[#0D4426] text-white font-semibold text-xs sm:text-[13.5px] px-6 py-2.5 sm:py-3 rounded-[10px] transition-all shadow-xs"
              >
                <span>Shop Catalog</span>
                <span className="text-[#22C55E] text-base leading-none">→</span>
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="inline-flex items-center gap-2.5 bg-[#FDF4E3] hover:bg-white text-[#10552F] border border-[#DCE8D7] font-semibold text-xs sm:text-[13.5px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-[10px] transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#10552F]" strokeWidth={1.8} />
                <span>Call (857) 387-2065</span>
              </a>
            </div>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block w-[1px] h-40 bg-[#D5E2D2] shrink-0 self-center" />

          {/* Right Store Details Column */}
          <div className="space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#D5E2D2]/60 font-sans">
            {/* 1. Visit Our Quincy Store */}
            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#10552F] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#10552F] leading-tight">
                  Visit Our Quincy Store
                </h3>
                <p className="text-xs sm:text-[12.5px] text-[#334155] mt-0.5">
                  132 East Howard Street, Quincy, MA 02169
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#D5E2D2]/60" />

            {/* 2. Operating Hours */}
            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-[#10552F] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#10552F] leading-tight">
                  Operating Hours
                </h3>
                <p className="text-xs sm:text-[12.5px] text-[#334155] mt-0.5">
                  7:00 AM – 10:00 PM (Open 365 days a year)
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#D5E2D2]/60" />

            {/* 3. Direct Telephone */}
            <div className="flex items-start gap-3.5">
              <Phone className="w-5 h-5 text-[#10552F] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <h3 className="text-xs sm:text-[13px] font-bold text-[#10552F] leading-tight">
                  Direct Telephone
                </h3>
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="text-base sm:text-lg font-bold text-[#10552F] hover:underline block leading-tight mt-0.5"
                >
                  (857) 387-2065
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
