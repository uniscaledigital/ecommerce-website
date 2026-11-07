import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Home } from "lucide-react";

export const metadata = {
  title: "Aisle Not Found (404) — The Irish Grocer",
  description: "The page or grocery aisle you are looking for cannot be found.",
};

export default function NotFound() {
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

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#A7D7A9] text-[#14532D] text-xs font-bold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>404 — Aisle Not Found</span>
        </div>

        {/* Heading & Description */}
        <div className="space-y-2">
          <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] tracking-tight">
            We Couldn&apos;t Find That Provision
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
            The collection, product, or pantry item you requested may have moved or is no longer in stock. Discover our full selection of imported Irish groceries below.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#14532D] hover:bg-[#064E3B] text-white px-6 py-3.5 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 min-h-[44px]"
          >
            <span>Explore The Shop</span>
            <ArrowRight className="w-4 h-4 text-[#22C55E]" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F7EBD8] hover:bg-[#EADFC9] text-[#14532D] border border-[#14532D]/30 px-6 py-3.5 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 min-h-[44px]"
          >
            <Home className="w-4 h-4 text-[#14532D]" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

