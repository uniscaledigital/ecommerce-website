"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Clock, Snowflake } from "lucide-react";

export function HeroSection() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Skip initial 1.8s black fade intro on video
  const handleLoadedData = useCallback((video: HTMLVideoElement) => {
    if (video.currentTime < 1.8) {
      video.currentTime = 1.8;
    }
  }, []);

  const handleTimeUpdate = useCallback(
    (video: HTMLVideoElement, setReady: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (video.currentTime < 1.8) {
        video.currentTime = 1.8;
      } else {
        setReady(true);
      }
    },
    []
  );

  const handlePlaying = useCallback(
    (video: HTMLVideoElement, setReady: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (video.currentTime >= 1.8) {
        setReady(true);
      }
    },
    []
  );

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      if (v.readyState >= 2 && v.currentTime < 1.8) {
        v.currentTime = 1.8;
      }
      v.play().catch(() => {});
    }
    const mv = mobileVideoRef.current;
    if (mv) {
      if (mv.readyState >= 2 && mv.currentTime < 1.8) {
        mv.currentTime = 1.8;
      }
      mv.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#FDF4E3] border-b border-[#E8DFCF] isolate">
      {/* ============================================================== */}
      {/* 1. DESKTOP HERO VIEWPORT (>= 1024px / lg)                      */}
      {/* PRESERVES APPROVED DESKTOP DESIGN 100% UNCHANGED               */}
      {/* ============================================================== */}
      <div className="hidden lg:flex relative w-full min-h-[580px] xl:min-h-[680px] 2xl:min-h-[780px] items-center">
        {/* Full-Bleed Desktop Video & Poster Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden -z-10">
          <Image
            src="/assets/banners/irish-grocer-hero-background.png"
            alt="Traditional Irish Pantry &amp; Farmhouse Essentials"
            fill
            priority
            className="object-cover object-[center_65%] w-full h-full z-0"
            sizes="100vw"
          />

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/banners/irish-grocer-hero-background.png"
            onLoadedData={(e) => handleLoadedData(e.currentTarget)}
            onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget, setIsVideoReady)}
            onPlaying={(e) => handlePlaying(e.currentTarget, setIsVideoReady)}
            className={`absolute inset-0 w-full h-full object-cover object-[center_65%] z-1 transition-opacity duration-700 ease-out motion-reduce:hidden ${
              isVideoReady ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
          >
            <source src="/assets/videos/hero-background-h264.mp4" type="video/mp4" />
          </video>

          {/* Desktop Horizontal Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-2"
            style={{
              background:
                "linear-gradient(90deg, #FDF4E3 0%, rgba(253, 244, 227, 0.96) 32%, rgba(253, 244, 227, 0.85) 44%, rgba(253, 244, 227, 0.2) 52%, transparent 62%)",
            }}
          />

          {/* Organic Wave Contour Accent at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-3 h-8 xl:h-10 opacity-70">
            <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0 40H1440V36C1120 36 840 40 580 28C320 16 140 32 0 24V40Z" fill="#FDF4E3" />
            </svg>
          </div>
        </div>

        {/* Desktop Editorial Text Area */}
        <div className="relative z-10 w-full section-inner py-12 xl:py-16 2xl:py-20">
          <div className="w-full lg:max-w-[540px] xl:max-w-[680px] 2xl:max-w-[780px] space-y-5 text-left">
            {/* 1. Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-bold tracking-[0.2em] text-[#14532D] uppercase">
              <span className="w-8 h-[1.5px] bg-[#14532D]/40" />
              <span className="text-[#22C55E] text-base leading-none">☘</span>
              <span>DIRECT CORK &amp; DUBLIN IMPORTS</span>
              <span className="w-8 h-[1.5px] bg-[#14532D]/40" />
            </div>

            {/* 2. Headline */}
            <h1
              className="font-manrope font-[800] text-[#1F2937] tracking-[-0.025em] leading-[1.03] text-left"
              style={{ fontSize: "clamp(2.5rem, 3.8vw, 4.35rem)" }}
            >
              Taste of Home <br />
              Traditional Pantry &amp; <br />
              Farmhouse <span className="text-[#22C55E]">Essentials</span>
            </h1>

            {/* 3. Description */}
            <p
              className="font-sans text-[#475569] font-normal leading-[1.62] max-w-[460px] xl:max-w-[540px] 2xl:max-w-[580px]"
              style={{ fontSize: "clamp(1.0625rem, 1.2vw, 1.25rem)" }}
            >
              From crusty Irish soda bread and artisanal preserves to iconic Barry&apos;s gold tea, Tayto cheese &amp; onion crisps, and traditional breakfast pudding — delivered straight from Dublin and Cork to New England weekly.
            </p>

            {/* 4. Primary CTA Button */}
            <div className="pt-1.5 flex items-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 bg-[#14532D] hover:bg-[#064E3B] text-white font-semibold text-base lg:text-[18px] px-9 sm:px-10 h-[58px] lg:h-[62px] rounded-[16px] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Fresh Imports</span>
                <ArrowRight className="w-5 h-5 text-[#22C55E]" />
              </Link>
            </div>

            {/* 5. Trust Benefits */}
            <div className="pt-5 border-t border-[#E8DFCF]/80 flex items-center gap-5 lg:gap-7 text-xs sm:text-[13px] lg:text-[13.5px] text-[#1F2937]">
              <div className="flex items-center gap-2 font-medium">
                <Truck className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>Direct Cork &amp; Dublin Imports</span>
              </div>
              <span className="w-[1px] h-3.5 bg-[#E8DFCF]" />
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>2-Hour Marshfield Pickup</span>
              </div>
              <span className="w-[1px] h-3.5 bg-[#E8DFCF]" />
              <div className="flex items-center gap-2 font-medium">
                <Snowflake className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>Cold-Chain Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DEDICATED MOBILE & TABLET HERO (< 1024px / lg)              */}
      {/* Natural vertical layout: Eyebrow > Headline > Desc > CTA >     */}
      {/* Video Visual > Trust Benefits                                  */}
      {/* ============================================================== */}
      <div className="lg:hidden section-inner py-6 sm:py-8 space-y-4 sm:space-y-5">
        {/* 1. Eyebrow Label */}
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.16em] text-[#14532D] uppercase">
          <span className="w-5 sm:w-6 h-[1.5px] bg-[#14532D]/40" />
          <span className="text-[#22C55E] text-sm leading-none">☘</span>
          <span>DIRECT CORK &amp; DUBLIN IMPORTS</span>
          <span className="w-5 sm:w-6 h-[1.5px] bg-[#14532D]/40" />
        </div>

        {/* 2. Large Headline with responsive clamp font size */}
        <h1 className="font-manrope font-[800] text-[#1F2937] tracking-[-0.025em] leading-[1.08] text-left text-[28px] xs:text-[32px] sm:text-[40px]">
          Taste of Home <br />
          Traditional Pantry &amp; <br />
          Farmhouse <span className="text-[#22C55E]">Essentials</span>
        </h1>

        {/* 3. Supporting Description */}
        <p className="font-sans text-[#475569] font-normal leading-[1.6] text-xs xs:text-sm sm:text-base max-w-xl">
          From crusty Irish soda bread and artisanal preserves to iconic Barry&apos;s gold tea, Tayto cheese &amp; onion crisps, and traditional breakfast pudding — delivered straight from Dublin and Cork to New England weekly.
        </p>

        {/* 4. Primary CTA Button: Explore Fresh Imports */}
        <div className="pt-1">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#14532D] hover:bg-[#064E3B] text-white font-semibold text-sm sm:text-base px-7 sm:px-9 h-[52px] sm:h-[56px] rounded-[14px] transition-all shadow-md active:scale-[0.99] text-center"
          >
            <span>Explore Fresh Imports</span>
            <ArrowRight className="w-4 h-4 text-[#22C55E]" />
          </Link>
        </div>

        {/* 5. Dedicated Mobile Hero Video Visual Container */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[20px] overflow-hidden border border-[#E8DFCF] bg-[#FDF4E3] shadow-xs my-2 isolate">
          <Image
            src="/assets/banners/irish-grocer-hero-background.png"
            alt="Traditional Irish Pantry &amp; Farmhouse Essentials"
            fill
            priority
            className="object-cover object-[center_60%]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <video
            ref={mobileVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/banners/irish-grocer-hero-background.png"
            onLoadedData={(e) => handleLoadedData(e.currentTarget)}
            className="absolute inset-0 w-full h-full object-cover object-[center_60%] z-1 motion-reduce:hidden"
            aria-hidden="true"
          >
            <source src="/assets/videos/hero-background-h264.mp4" type="video/mp4" />
          </video>
          {/* Subtle perimeter border inside container */}
          <div className="absolute inset-0 pointer-events-none z-2 ring-1 ring-inset ring-black/5 rounded-[20px]" />
        </div>

        {/* 6. Three Trust Benefits (Adapts into mobile card row or wrap) */}
        <div className="pt-2 sm:pt-3 border-t border-[#E8DFCF]/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs text-[#1F2937]">
          <div className="flex items-center gap-2 bg-[#FFFAF1] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#E8DFCF]/60 font-medium">
            <Truck className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span>Direct Cork &amp; Dublin Imports</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FFFAF1] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#E8DFCF]/60 font-medium">
            <Clock className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span>2-Hour Marshfield Pickup</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FFFAF1] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#E8DFCF]/60 font-medium">
            <Snowflake className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span>Cold-Chain Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
