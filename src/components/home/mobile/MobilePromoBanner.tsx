"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, Coffee } from "lucide-react";

interface PromoSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image?: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  icon: "sparkles" | "pin" | "coffee";
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "promo-direct-imports",
    eyebrow: "DIRECT FROM DUBLIN & CORK",
    title: "Authentic Irish Groceries",
    description: "Weekly shipments landed fresh at our Marshfield storefront",
    ctaText: "Shop All Favourites",
    ctaHref: "/shop",
    image: "/assets/banners/irish-grocer-hero-background.png",
    bgGradient: "from-[#14532D]/95 via-[#14532D]/90 to-[#0B3B20]/80",
    badgeBg: "bg-[#22C55E]/20",
    badgeText: "text-[#DDF1D5]",
    icon: "sparkles",
  },
  {
    id: "promo-taste-of-home",
    eyebrow: "TRADITIONAL PANTRY",
    title: "Barry's Tea & Tayto Crisps",
    description: "The quintessential taste of home in New England",
    ctaText: "Explore Staples",
    ctaHref: "/collections/tea-coffee",
    bgGradient: "from-[#1B4332] to-[#2D6A4F]",
    badgeBg: "bg-white/20",
    badgeText: "text-[#FFFAF1]",
    icon: "coffee",
  },
  {
    id: "promo-marshfield-pickup",
    eyebrow: "WE DELIVER! • MARSHFIELD STORE",
    title: "Free In-Store Pickup",
    description: "1899 Ocean St, Marshfield, MA • Open Daily 9am–9pm",
    ctaText: "Store Details",
    ctaHref: "/contact",
    bgGradient: "from-[#0F3D2E] via-[#14532D] to-[#1E6B43]",
    badgeBg: "bg-[#22C55E]/25",
    badgeText: "text-[#EDF8E9]",
    icon: "pin",
  },
];

export function MobilePromoBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const width = el.offsetWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(Math.min(Math.max(newIndex, 0), PROMO_SLIDES.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      left: index * el.offsetWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#D0E7C9] shadow-xs bg-[#14532D]">
      {/* Swipeable Carousel Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        role="region"
        aria-label="Promotional highlights"
      >
        {PROMO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="w-full shrink-0 snap-center relative min-h-[148px] sm:min-h-[156px] flex flex-col justify-between p-4 overflow-hidden"
          >
            {/* Background Image if available */}
            {slide.image && (
              <div className="absolute inset-0 pointer-events-none select-none">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-25 mix-blend-overlay"
                  priority={idx === 0}
                  sizes="100vw"
                />
              </div>
            )}

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} pointer-events-none`}
            />

            {/* Faint Decorative Shamrock SVG */}
            <div
              className="absolute -right-4 -bottom-4 w-28 h-28 text-white/5 pointer-events-none select-none"
              aria-hidden="true"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                <path d="M50 44 C41 33 24 35 24 48 C24 59 36 65 50 56 C64 65 76 59 76 48 C76 35 59 33 50 44 Z" />
                <path d="M50 44 C39 53 37 70 50 70 C63 70 61 53 50 44 Z" />
                <path d="M50 44 C39 35 39 18 50 18 C61 18 61 35 50 44 Z" />
              </svg>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${slide.badgeBg} ${slide.badgeText} mb-1`}
                >
                  {slide.icon === "sparkles" && <Sparkles className="w-3 h-3" />}
                  {slide.icon === "pin" && <MapPin className="w-3 h-3" />}
                  {slide.icon === "coffee" && <Coffee className="w-3 h-3" />}
                  <span>{slide.eyebrow}</span>
                </span>
                <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#FFFAF1] leading-tight">
                  {slide.title}
                </h3>
                <p className="text-xs text-[#DDF1D5] line-clamp-1 mt-0.5">
                  {slide.description}
                </p>
              </div>

              {/* CTA Link Button */}
              <div className="mt-2.5 flex items-center justify-between">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold shadow-xs transition-colors min-h-[44px] min-w-[44px]"
                  aria-label={`${slide.ctaText} - ${slide.title}`}
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#DDF1D5]/70 font-medium">
                  {idx + 1} / {PROMO_SLIDES.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Position Indicator Dots (>= 44x44px accessible touch bounds) */}
      <div className="absolute bottom-1 right-2 z-20 flex items-center pointer-events-auto">
        {PROMO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollToIndex(idx)}
            className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-opacity cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className={`h-1.5 rounded-full transition-all block pointer-events-none ${
                activeIndex === idx
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

