"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Clock, Snowflake } from "lucide-react";

export function HeroSection() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Skip the video file's initial 1.8s black fade intro immediately upon load
  const handleLoadedData = useCallback((video: HTMLVideoElement) => {
    if (video.currentTime < 1.8) {
      video.currentTime = 1.8;
    }
  }, []);

  // Guarantee loop protection & ready transition
  const handleTimeUpdate = useCallback(
    (video: HTMLVideoElement, setReady: React.Dispatch<React.SetStateAction<boolean>>) => {
      // Loop protection: if the video loops back to start (< 1.8s), skip the black frames
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
    // Attempt play on mount and verify currentTime
    const v = videoRef.current;
    if (v) {
      if (v.readyState >= 2 && v.currentTime < 1.8) {
        v.currentTime = 1.8;
      }
      v.play().catch(() => {
        // Autoplay blocked by browser policy; static poster stays gracefully visible
      });
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#FDF4E3] border-b border-[#E8DFCF] isolate min-h-[660px] sm:min-h-[680px] md:min-h-[640px] lg:min-h-[580px] xl:min-h-[680px] 2xl:min-h-[780px] flex items-center">
      {/* 1. FULL-WIDTH HERO BACKGROUND: BASE POSTER + SMOOTH LOOPING VIDEO (NO PLAY/PAUSE ICON, NO PLAYER UI) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden -z-10">
        {/* Layer 1: Base Static Photograph Poster (Visible immediately on SSR / page reload) */}
        <Image
          src="/assets/banners/irish-grocer-hero-background.png"
          alt="Traditional Irish Pantry &amp; Farmhouse Essentials"
          fill
          priority
          className="object-cover object-[center_bottom] md:object-[80%_65%] lg:object-[center_65%] w-full h-full z-0"
          sizes="100vw"
        />

        {/* Layer 2: Full-Bleed Video Background (Integrated ambient background video, NO player UI/controls) */}
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
          className={`absolute inset-0 w-full h-full object-cover object-[center_bottom] md:object-[80%_65%] lg:object-[center_65%] z-1 transition-opacity duration-700 ease-out motion-reduce:hidden ${
            isVideoReady ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        >
          <source
            src="/assets/videos/hero-background-h264.mp4"
            type="video/mp4"
          />
        </video>

        {/* Layer 3: Subtle Cream Blending Gradient for Expanded 48–52% Text Readability */}
        {/* Desktop Horizontal Gradient (>= 1024px): Seamless feathered feathering over cream wall; 100% transparent before products */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none z-2"
          style={{
            background:
              "linear-gradient(90deg, #FDF4E3 0%, rgba(253, 244, 227, 0.96) 32%, rgba(253, 244, 227, 0.85) 44%, rgba(253, 244, 227, 0.2) 52%, transparent 62%)",
          }}
        />

        {/* Mobile & Tablet Portrait Vertical Gradient (< 1024px): Clean cream over text stack, fading out to reveal products below */}
        <div
          className="lg:hidden absolute inset-0 pointer-events-none z-2"
          style={{
            background:
              "linear-gradient(180deg, #FDF4E3 0%, #FDF4E3 52%, rgba(253, 244, 227, 0.88) 64%, rgba(253, 244, 227, 0.2) 78%, transparent 92%)",
          }}
        />

        {/* Layer 4: Organic Wave Contour Accent at Bottom (Matching reference subtle sweep) */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-3 h-6 sm:h-10 opacity-70">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0 40H1440V36C1120 36 840 40 580 28C320 16 140 32 0 24V40Z"
              fill="#FDF4E3"
            />
          </svg>
        </div>
      </div>

      {/* 2. EXPANDED EDITORIAL TEXT AREA (APPROX 48–52% DESKTOP WIDTH, Z-INDEX 10) */}
      <div className="relative z-10 w-full section-inner py-8 sm:py-10 md:py-10 lg:py-12 xl:py-16 2xl:py-20">
        <div className="w-full lg:max-w-[540px] xl:max-w-[680px] 2xl:max-w-[780px] space-y-4 sm:space-y-5 text-left">
          {/* 1. EYEBROW LABEL */}
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-bold tracking-[0.2em] text-[#14532D] uppercase">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#14532D]/40" />
            <span className="text-[#22C55E] text-base leading-none">☘</span>
            <span>DIRECT CORK &amp; DUBLIN IMPORTS</span>
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#14532D]/40" />
          </div>

          {/* 2. LARGE EXPANSIVE EDITORIAL HEADLINE (64–76px TARGET, NATURAL 3-LINE WRAP) */}
          <h1
            className="font-manrope font-[800] text-[#1F2937] tracking-[-0.025em] leading-[1.03] text-left"
            style={{
              fontSize: "clamp(2.25rem, 3.8vw, 4.35rem)",
            }}
          >
            Taste of Home <br />
            Traditional Pantry &amp; <br />
            Farmhouse <span className="text-[#22C55E]">Essentials</span>
          </h1>

          {/* 3. WIDE EXPANSIVE DESCRIPTION (19–21px DESKTOP, NATURAL SPREAD, BALANCED GAP) */}
          <p
            className="font-sans text-[#475569] font-normal leading-[1.62] max-w-[460px] xl:max-w-[540px] 2xl:max-w-[580px]"
            style={{
              fontSize: "clamp(1.0625rem, 1.2vw, 1.25rem)",
            }}
          >
            From crusty Irish soda bread and artisanal preserves to iconic Barry&apos;s gold tea, Tayto cheese &amp; onion crisps, and traditional breakfast pudding — delivered straight from Dublin and Cork to New England weekly.
          </p>

          {/* 4. ONLY ONE PRIMARY CTA BUTTON: Explore Fresh Imports (NO secondary button) */}
          <div className="pt-1.5 flex items-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 bg-[#14532D] hover:bg-[#064E3B] text-white font-semibold text-base lg:text-[18px] px-9 sm:px-10 h-[58px] lg:h-[62px] rounded-[16px] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Fresh Imports</span>
              <ArrowRight className="w-5 h-5 text-[#22C55E]" />
            </Link>
          </div>

          {/* 5. SPACIOUS INTEGRATED TRUST BENEFITS ROW (GREEN OUTLINE ICONS, SUBTLE SEPARATORS) */}
          <div className="pt-4 sm:pt-5 border-t border-[#E8DFCF]/80 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 lg:gap-7 text-xs sm:text-[13px] lg:text-[13.5px] text-[#1F2937]">
            <div className="flex items-center gap-2 font-medium">
              <Truck className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>Direct Cork &amp; Dublin Imports</span>
            </div>
            <span className="hidden sm:inline-block w-[1px] h-3.5 bg-[#E8DFCF]" />
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>2-Hour Quincy Pickup</span>
            </div>
            <span className="hidden sm:inline-block w-[1px] h-3.5 bg-[#E8DFCF]" />
            <div className="flex items-center gap-2 font-medium">
              <Snowflake className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>Cold-Chain Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
