"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, ShoppingBag } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="section-inner py-12 sm:py-16 md:py-20">
      <div className="max-w-xl mx-auto bg-[#FFFAF1] border border-[#E8DFCF] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-card">
        {/* Brand Logo */}
        <div className="relative w-[160px] sm:w-[200px] h-[55px] sm:h-[70px] mx-auto">
          <Image
            src="/assets/logo/irish-grocer-animated.svg"
            alt="The Irish Grocer"
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
            We encountered a temporary issue while loading this page. You can retry loading or return to our shop catalog.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#14532D] hover:bg-[#064E3B] text-white px-6 py-3.5 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 min-h-[44px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#22C55E]" />
            <span>Try Again</span>
          </button>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F7EBD8] hover:bg-[#EADFC9] text-[#14532D] border border-[#14532D]/30 px-6 py-3.5 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4 text-[#14532D]" />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

