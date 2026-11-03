"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config/site";
import { MapPin, Phone, Clock, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#0E4A2B] via-[#14532D] to-[#0E4A2B] text-white text-xs py-2 border-b border-[#0A3820] select-none">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 flex items-center justify-between gap-4 text-left">
        {/* Left Content */}
        <div className="flex items-center gap-2 text-white/95 text-[11.5px] sm:text-xs font-medium min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[#8EDB63] min-w-0">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-white truncate">Free in-store pickup in Quincy, MA</span>
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/80 shrink-0">Open 365 days a year</span>
          <span className="hidden lg:inline text-white/40">•</span>
          <span className="hidden lg:inline italic text-white/80 font-serif-display truncate">
            {SITE_CONFIG.motto}
          </span>
        </div>

        {/* Right Content */}
        <div className="flex items-center space-x-3.5 sm:space-x-5 text-white/90 text-[11px] sm:text-xs font-medium shrink-0">
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="inline-flex items-center gap-1.5 hover:text-[#8EDB63] transition-colors"
            title="Call Quincy Store"
          >
            <Phone className="w-3 h-3 text-[#8EDB63]" />
            <span className="hidden sm:inline">(857) 387-2065</span>
            <span className="sm:hidden text-[11px] font-semibold">Call</span>
          </a>

          <span className="hidden md:inline-flex items-center gap-1 text-white/80">
            <Clock className="w-3 h-3 text-[#8EDB63]" />
            <span>7:00 AM – 10:00 PM</span>
          </span>

          <Link
            href="/#store-info"
            className="hidden sm:inline-flex items-center gap-1 hover:text-[#8EDB63] transition-colors"
          >
            <MapPin className="w-3 h-3 text-[#8EDB63]" />
            <span>Store Locator</span>
          </Link>

          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="hidden sm:inline hover:text-[#8EDB63] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
