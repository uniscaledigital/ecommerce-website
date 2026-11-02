import React from "react";
import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";

export function GiftingSection() {
  return (
    <section className="my-8 md:my-12">
      <div className="bg-ivory border border-irishBorder rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-commerce/10 text-commerce flex items-center justify-center shrink-0 hidden sm:flex">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-commerce uppercase">
              EASY GIFTING
            </p>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-ink mt-0.5">
              Give a little taste of home
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Explore gifts and treats to share a little taste of home.
            </p>
          </div>
        </div>

        <Link
          href="/collections/gifts-merchandise"
          className="inline-flex items-center gap-2 bg-commerce hover:bg-commerce-dark text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-md transition-colors shrink-0"
        >
          <span>Shop Gifts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

