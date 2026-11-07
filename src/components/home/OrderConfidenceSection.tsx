import React from "react";
import { ShieldCheck, Truck, Snowflake } from "lucide-react";

export function OrderConfidenceSection({ id = "order-confidence" }: { id?: string } = {}) {
  return (
    <section id={id} aria-label="Order with Confidence & Peace of Mind" className="w-full">
      <div className="w-full bg-[#EAF7E8] border border-[#DCE8D7] rounded-[20px] px-5 sm:px-6 md:px-7 py-[18px] sm:py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 shadow-xs transition-shadow">
        {/* Left Icon + Divider + Heading */}
        <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
          {/* Shield-Check Icon inside pale mint circular background */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/70 border border-[#DCE8D7] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#10552F]" strokeWidth={1.8} />
          </div>

          {/* Subtle Vertical Divider */}
          <div className="hidden sm:block w-[1px] h-9 bg-[#D5E2D2] shrink-0" />

          {/* Heading */}
          <h3 className="font-serif-display text-base sm:text-lg lg:text-[21px] font-bold text-[#10552F] tracking-tight whitespace-normal lg:whitespace-nowrap">
            Order with Confidence &amp; Peace of Mind
          </h3>
        </div>

        {/* Right: Three Benefits in a Responsive Row / Stack */}
        <div className="w-full lg:w-auto grid grid-cols-1 sm:flex items-start sm:items-center justify-start sm:justify-end gap-3 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#D5E2D2]/60">
          {/* Divider between heading and benefits on large screens */}
          <div className="hidden xl:block w-[1px] h-8 bg-[#D5E2D2] shrink-0" />

          {/* Benefit 1: Reliable UK & Irish Imports */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Truck className="w-5 h-5 text-[#10552F] shrink-0" strokeWidth={1.8} />
            <div className="text-left font-sans">
              <span className="block text-xs sm:text-[12.5px] font-medium text-[#10552F] leading-tight">
                Reliable
              </span>
              <span className="block text-xs sm:text-[12.5px] font-semibold text-[#10552F] leading-tight">
                UK &amp; Irish Imports
              </span>
            </div>
          </div>

          {/* Divider between Benefit 1 & 2 */}
          <div className="hidden sm:block w-[1px] h-7 bg-[#D5E2D2] shrink-0" />

          {/* Benefit 2: Temperature-Controlled Shipping */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Snowflake className="w-5 h-5 text-[#10552F] shrink-0" strokeWidth={1.8} />
            <div className="text-left font-sans">
              <span className="block text-xs sm:text-[12.5px] font-medium text-[#10552F] leading-tight">
                Temperature-
              </span>
              <span className="block text-xs sm:text-[12.5px] font-semibold text-[#10552F] leading-tight">
                Controlled Shipping
              </span>
            </div>
          </div>

          {/* Divider between Benefit 2 & 3 */}
          <div className="hidden sm:block w-[1px] h-7 bg-[#D5E2D2] shrink-0" />

          {/* Benefit 3: Freshness & Quality Guaranteed */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#10552F] shrink-0" strokeWidth={1.8} />
            <div className="text-left font-sans">
              <span className="block text-xs sm:text-[12.5px] font-medium text-[#10552F] leading-tight">
                Freshness &amp;
              </span>
              <span className="block text-xs sm:text-[12.5px] font-semibold text-[#10552F] leading-tight">
                Quality Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
