"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, FOOTER_SHOP_LINKS, FOOTER_HELP_LINKS } from "@/lib/config/site";
import { MapPin, Phone, Clock, CheckCircle } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full mt-16 sm:mt-20 site-footer border-t border-[rgba(20,83,45,0.14)]">
      {/* Subtle Top Inner Specular Highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* ============================================================== */}
      {/* 1. MAIN FOOTER CONTENT CONTAINER (Full Width BG, Centered Inner)*/}
      {/* ============================================================== */}
      <div className="w-full">
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0 items-start">
            {/* -------------------------------------------------------- */}
            {/* COLUMN 1: BRAND AND STORE INFORMATION (~30% width)       */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-4 lg:pr-8 xl:pr-12 space-y-4">
              <Link
                href="/"
                className="inline-block relative w-[200px] sm:w-[220px] h-[68px] sm:h-[74px]"
                aria-label="The Irish Grocer Homepage"
              >
                <Image
                  src="/assets/logo/irish-grocer-animated.svg"
                  alt="The Irish Grocer"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-left"
                />
              </Link>

              <p className="text-sm text-[#173B2A] leading-relaxed max-w-sm">
                {SITE_CONFIG.tagline}.
              </p>

              <div className="space-y-2.5 text-xs sm:text-[13px] text-[#173B2A] pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                  <span>{SITE_CONFIG.address.full}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#14532D] shrink-0" />
                  <a
                    href={`tel:${SITE_CONFIG.phoneRaw}`}
                    className="hover:text-[#14532D] hover:underline font-medium transition-colors"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>{SITE_CONFIG.hours}</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* COLUMN 2: SHOP AISLES (~20% width)                       */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-2 lg:px-6 xl:px-8 lg:border-l lg:border-[#14532D]/12">
              <h3 className="text-xs sm:text-[13px] font-bold text-[#14532D] uppercase tracking-wider mb-4 font-sans">
                Shop Aisles
              </h3>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#173B2A] font-medium">
                {FOOTER_SHOP_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-[#14532D] hover:underline transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* -------------------------------------------------------- */}
            {/* COLUMN 3: CUSTOMER CARE (~23% width)                     */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-3 lg:px-6 xl:px-8 lg:border-l lg:border-[#14532D]/12">
              <h3 className="text-xs sm:text-[13px] font-bold text-[#14532D] uppercase tracking-wider mb-4 font-sans">
                Customer Care
              </h3>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#173B2A] font-medium">
                {FOOTER_HELP_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-[#14532D] hover:underline transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* -------------------------------------------------------- */}
            {/* COLUMN 4: STAY IN TOUCH (~27% width, Clover Watermark BG)*/}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-3 lg:pl-6 xl:pl-8 lg:border-l lg:border-[#14532D]/12">
              <h3 className="text-xs sm:text-[13px] font-bold text-[#14532D] uppercase tracking-wider mb-2 font-sans">
                Stay in Touch
              </h3>
              <p className="text-xs sm:text-[13px] text-[#52665B] mb-4 leading-relaxed">
                Get weekly updates on direct Cork and Dublin shipments, holiday specials, and pantry provisions.
              </p>

              {isSubscribed ? (
                <div className="bg-[#E8F5E9] border border-[#22C55E]/40 text-[#14532D] p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span className="font-medium">Thank you for joining our farmhouse newsletter!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm text-[#173B2A] bg-white border border-[rgba(20,83,45,0.18)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D] placeholder:text-[#52665B]/60 shadow-2xs transition-all"
                      aria-label="Email address for newsletter"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#14532D] hover:bg-[#064E3B] text-white py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
                  >
                    Join Farmhouse Club
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FULL-WIDTH COPYRIGHT BAR (Separate Warm Cream Strip)        */}
      {/* ============================================================== */}
      <div className="w-full bg-[#FDF4E3] border-t border-[rgba(20,83,45,0.14)]">
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#52665B]">
          {/* Left: Copyright */}
          <p className="text-center md:text-left">
            © 2026 {SITE_CONFIG.name}. Authentic Irish Provisions.
          </p>

          {/* Center: Brand Motto in elegant italic font */}
          <p className="font-serif-display text-sm sm:text-[15px] text-[#14532D] italic font-semibold text-center">
            &ldquo;{SITE_CONFIG.motto}&rdquo;
          </p>

          {/* Right: Policy Links */}
          <div className="flex items-center space-x-3 text-center md:text-right">
            <Link
              href="/privacy"
              className="hover:text-[#14532D] hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#14532D]/30 select-none">|</span>
            <Link
              href="/#order-confidence"
              className="hover:text-[#14532D] hover:underline transition-colors"
            >
              Order Confidence
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
