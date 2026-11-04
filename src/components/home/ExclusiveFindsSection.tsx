import React from "react";
import { Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function ExclusiveFindsSection() {
  return (
    <section id="exclusive-finds" aria-label="Exclusive Seasonal & Limited Finds" className="w-full">
      <div className="w-full bg-[#FBF2E2] border border-[#DCE8D7] rounded-[20px] px-5 sm:px-6 md:px-7 py-[18px] sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 shadow-xs transition-shadow">
        {/* Left Icon + Divider + Text Content */}
        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
          {/* Clover Icon inside pale mint circular background */}
          <div className="w-12 h-12 rounded-full bg-[#EAF7E8] border border-[#DCE8D7] flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10552F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M12 12c-1.2-2.5-3.5-5.5-1.5-7.5 1.8-1.8 4.2.8 1.5 7.5z" />
              <path d="M12 12c1.2-2.5 3.5-5.5 1.5-7.5-1.8-1.8-4.2.8-1.5 7.5z" />
              <path d="M12 12c-2.5-1.2-5.5-3.5-7.5-1.5-1.8 1.8.8 4.2 7.5 1.5z" />
              <path d="M12 12c-2.5 1.2-5.5 3.5-7.5 1.5 1.8-1.8 4.2-.8 7.5-1.5z" />
              <path d="M12 12c2.5-1.2 5.5-3.5 7.5-1.5 1.8 1.8-.8 4.2-7.5 1.5z" />
              <path d="M12 12c2.5 1.2 5.5 3.5 7.5 1.5-1.8-1.8-4.2-.8-7.5-1.5z" />
              <path d="M12 12c-.5 3 .5 6.5 2 9" />
            </svg>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="hidden sm:block w-[1px] h-9 bg-[#D5E2D2] shrink-0" />

          {/* Text: Heading + Description */}
          <div className="min-w-0 flex-1">
            <h3 className="font-serif-display text-lg sm:text-[21px] font-bold text-[#10552F] tracking-tight leading-snug">
              Exclusive Seasonal &amp; Limited Finds
            </h3>
            <p className="text-xs sm:text-[13px] text-[#334155] leading-normal font-sans mt-0.5">
              Specialty European perishables, artisanal puddings, and seasonal batch imports reserved for direct enquiry.
            </p>
          </div>
        </div>

        {/* Right CTA: Bordered Telephone Call Card */}
        <a
          href={`tel:${SITE_CONFIG.phoneRaw}`}
          className="w-full md:w-auto inline-flex items-center justify-center sm:justify-start gap-3 bg-white/80 hover:bg-white border border-[#DCE8D7] hover:border-[#10552F]/40 rounded-[14px] px-[18px] py-2 sm:py-2.5 transition-all shrink-0 shadow-xs group self-stretch md:self-auto"
          title={`Call ${SITE_CONFIG.phone} to Reserve`}
        >
          <Phone
            className="w-5 h-5 text-[#10552F] shrink-0 group-hover:scale-105 transition-transform"
            strokeWidth={1.8}
          />
          <div className="text-left font-sans">
            <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#10552F]/85 leading-tight block">
              Call Direct to Reserve
            </span>
            <span className="text-sm sm:text-[15px] font-bold text-[#10552F] tracking-tight leading-tight block">
              {SITE_CONFIG.phone}
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
