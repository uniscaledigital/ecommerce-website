"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Clock, Truck, ShieldCheck } from "lucide-react";

export function MobileStoreConfidenceStrip() {
  return (
    <div className="bg-[#EDF8E9] border border-[#D0E7C9] rounded-2xl p-3 shadow-xs space-y-2">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Quincy Storefront indicator */}
        <Link
          href="/#store-info"
          className="flex items-center gap-2 group min-h-[44px] flex-1 py-1"
          aria-label="View Quincy storefront location and hours"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[#D0E7C9] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#14532D] transition-colors">
            <MapPin className="w-4 h-4 text-[#14532D] group-hover:text-white transition-colors" />
          </div>
          <div className="leading-tight text-left">
            <span className="block text-xs font-bold text-[#14532D] group-hover:text-[#064E3B]">
              Quincy, MA Storefront
            </span>
            <span className="block text-[11px] text-[#42634A]">
              132 E Howard St · Open 365 Days
            </span>
          </div>
        </Link>

        {/* Right: Demo delivery reassurance badge */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-[#D0E7C9]">
          <Truck className="w-3.5 h-3.5 text-[#14532D]" />
          <div className="text-right">
            <span className="block text-[11px] font-bold text-[#14532D]">
              Direct Imports
            </span>
            <span className="block text-[10px] text-[#42634A]">
              Demo Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

