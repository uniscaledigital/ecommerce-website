import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-8 pb-12 text-center md:text-left">
      <div className="max-w-3xl space-y-4">
        {/* Subtitle tag */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-commerce uppercase">
          T H E &nbsp; I R I S H &nbsp; G R O C E R &nbsp;·&nbsp; Q U I N C Y, &nbsp; M A
        </p>

        {/* Headline */}
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.1]">
          A little taste of <br className="hidden sm:inline" />
          home.
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl">
          Your favourite Irish brands, from the first cup of tea to the last crisp in the bag.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-commerce hover:bg-commerce-dark text-white font-semibold text-sm px-6 py-3 rounded-md transition-colors"
          >
            <span>Shop Irish Favourites</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/collections/crisps-snacks"
            className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-ink hover:text-commerce underline-offset-4 hover:underline py-3 px-4"
          >
            Explore the shop
          </Link>
        </div>

        {/* Sub-label */}
        <p className="text-xs text-ink-light pt-2 italic">
          A little piece of Ireland in Quincy, Massachusetts.
        </p>
      </div>
    </section>
  );
}

