"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Clock, Snowflake } from "lucide-react";

export function HeroSection() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobileVideoReady, setIsMobileVideoReady] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

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
    const dv = desktopVideoRef.current;
    if (dv) {
      if (dv.readyState >= 2 && dv.currentTime < 1.8) {
        dv.currentTime = 1.8;
      }
      dv.play().catch(() => {
        // Autoplay blocked by browser policy; static poster stays gracefully visible
      });
    }

    const mv = mobileVideoRef.current;
    if (mv) {
      if (mv.readyState >= 2 && mv.currentTime < 1.8) {
        mv.currentTime = 1.8;
      }
      mv.play().catch(() => {
        // Autoplay blocked; static poster stays visible
      });
    }
  }, []);

  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-[#FDF4E3] border border-[#E8DFCF] shadow-xs my-6 lg:min-h-[640px] lg:max-h-[720px] lg:flex lg:items-center">
      {/* DESKTOP RIGHT-SIDE VIDEO CONTAINER (STARTS AT 42%, PREVENTS ANY TEXT OVERLAP) */}
      <div className="hidden lg:block absolute inset-y-0 right-0 left-[42%] z-0 overflow-hidden select-none">
        {/* Layer 1: Base Static Photograph Poster (Visible immediately on page load, SSR and reload) */}
        <Image
          src="/assets/banners/irish-grocer-hero-background.png"
          alt="Traditional Irish Pantry &amp; Farmhouse Essentials"
          fill
          priority
          className="object-cover object-[68%_center] z-0"
          sizes="(max-width: 1440px) 60vw, 850px"
        />

        {/* Layer 2: Smooth Looping MP4 Video (Hidden until usable bright frames >= 1.8s decode) */}
        <video
          ref={desktopVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/banners/irish-grocer-hero-background.png"
          onLoadedData={(e) => handleLoadedData(e.currentTarget)}
          onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget, setIsVideoReady)}
          onPlaying={(e) => handlePlaying(e.currentTarget, setIsVideoReady)}
          className={`absolute inset-0 w-full h-full object-cover object-[68%_center] z-1 transition-opacity duration-700 ease-out motion-reduce:hidden ${
            isVideoReady ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        >
          <source
            src="/assets/videos/hero-background-h264.mp4"
            type="video/mp4"
          />
        </video>

        {/* Layer 3: Seamless Cream-to-Video Gradient on Left Edge */}
        <div
          className="absolute inset-y-0 left-0 w-[38%] pointer-events-none z-2"
          style={{
            background:
              "linear-gradient(90deg, #FDF4E3 0%, rgba(253, 244, 227, 0.95) 20%, rgba(253, 244, 227, 0.8) 40%, rgba(253, 244, 227, 0.3) 75%, transparent 100%)",
          }}
        />
      </div>

      {/* DEDICATED LEFT CONTENT AREA (Z-INDEX 10, GUARANTEED 100% LEGIBLE ON CLEAN CREAM BG) */}
      <div className="relative z-10 w-full px-6 py-8 sm:px-10 sm:py-12 lg:py-14 lg:pl-16 lg:pr-8 xl:pl-20">
        <div className="w-full lg:max-w-[560px] xl:max-w-[580px] space-y-6 text-left">
          {/* 1. EYEBROW */}
          <div className="inline-flex items-center gap-2.5 text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#14532D] uppercase">
            <span className="w-5 sm:w-7 h-[1.5px] bg-[#14532D]/40" />
            <span className="text-[#22C55E] text-sm">☘</span>
            <span>DIRECT CORK &amp; DUBLIN IMPORTS</span>
            <span className="w-5 sm:w-7 h-[1.5px] bg-[#14532D]/40" />
          </div>

          {/* 2. MAIN HEADLINE IN MANROPE (800 WEIGHT) */}
          <h1 className="font-manrope font-[800] text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] text-[#1F2937] leading-[1.05] tracking-tight">
            Taste of Home <br />
            Traditional Pantry &amp; <br />
            Farmhouse <span className="text-[#22C55E]">Essentials</span>
          </h1>

          {/* 3. SUPPORTING PARAGRAPH */}
          <p className="font-sans text-base sm:text-lg lg:text-[17.5px] text-[#64748B] leading-relaxed max-w-[540px]">
            From crusty Irish soda bread and artisanal preserves to iconic Barry&apos;s gold tea, Tayto cheese &amp; onion crisps, and traditional breakfast pudding — delivered straight from Dublin and Cork to New England weekly.
          </p>

          {/* 4. CTA BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-start gap-3.5">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2.5 bg-[#14532D] hover:bg-[#064E3B] text-white font-semibold text-sm sm:text-base px-8 h-14 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Explore Fresh Imports</span>
              <ArrowRight className="w-4 h-4 text-[#22C55E]" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#14532D] bg-transparent hover:bg-[#14532D]/5 text-[#14532D] font-semibold text-sm sm:text-base px-8 h-14 rounded-xl transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5"
            >
              <span>Shop All Aisles</span>
            </Link>
          </div>

          {/* 5. TRUST BENEFITS ROW */}
          <div className="pt-4 border-t border-[#E8DFCF] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 text-xs sm:text-[13px] text-[#1F2937]">
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

          {/* 6. DEDICATED RESPONSIVE VISUAL PANEL (MOBILE ONLY) */}
          <div className="lg:hidden pt-2">
            <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-xl overflow-hidden border border-[#E8DFCF] shadow-xs">
              {/* Mobile Base Layer: Static Photograph Poster */}
              <Image
                src="/assets/banners/irish-grocer-hero-background.png"
                alt="Traditional Irish Pantry &amp; Farmhouse Essentials"
                fill
                priority
                className="object-cover object-[68%_center] z-0"
                sizes="(max-width: 1024px) 100vw, 800px"
              />

              {/* Mobile Video Layer: Fades in smoothly once decoded >= 1.8s */}
              <video
                ref={mobileVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/assets/banners/irish-grocer-hero-background.png"
                onLoadedData={(e) => handleLoadedData(e.currentTarget)}
                onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget, setIsMobileVideoReady)}
                onPlaying={(e) => handlePlaying(e.currentTarget, setIsMobileVideoReady)}
                className={`absolute inset-0 w-full h-full object-cover object-[68%_center] z-1 transition-opacity duration-700 ease-out motion-reduce:hidden ${
                  isMobileVideoReady ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden="true"
              >
                <source
                  src="/assets/videos/hero-background-h264.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
