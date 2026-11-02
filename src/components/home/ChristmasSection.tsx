"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHRISTMAS_BUNDLES } from "@/lib/config/site";
import { useCart } from "@/context/CartContext";

export function ChristmasSection() {
  const { openEnquiry } = useCart();

  return (
    <section className="my-8 md:my-12">
      <div className="bg-christmas-cream border border-irishBorder rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* TOP ROW: Banner & Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-irishBorder/60">
          {/* Basket image */}
          <div className="lg:col-span-5 relative aspect-[16/10] w-full rounded-lg overflow-hidden shadow-sm">
            <Image
              src="/assets/banners/christmas-basket.png"
              alt="Christmas favourites & festive offers"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute top-4 left-4 bg-forest/80 backdrop-blur-sm text-ivory px-3 py-1 rounded text-xs font-serif-display font-medium">
              Christmas
            </div>
          </div>

          {/* Heading copy & CTA */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-commerce leading-tight">
              Christmas favourites & festive offers
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Selection boxes, advent calendars and treats to share. Our full Christmas range, all in one place.
            </p>
            <div className="pt-2">
              <Link
                href="/collections/christmas"
                className="inline-flex items-center gap-2 bg-commerce hover:bg-commerce-dark text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-md transition-colors"
              >
                <span>Shop all Christmas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Group Buying & Bundles */}
        <div className="pt-8 space-y-6">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-commerce">
              Buying for a group?
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Choose one bundle to receive the full quantity shown on its product page.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHRISTMAS_BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white border-t-4 border-t-commerce border-x border-b border-irishBorder rounded-md p-5 flex flex-col justify-between shadow-sm hover:shadow transition-shadow"
              >
                <div className="space-y-2">
                  <h4 className="font-heading text-base font-bold text-ink">
                    {bundle.title}
                  </h4>
                  <p className="text-xs font-medium text-ink-muted min-h-[2.5rem]">
                    {bundle.productTitle}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-irishBorder/40 space-y-3">
                  <div>
                    <span className="text-xl font-bold text-commerce">
                      ${bundle.price.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-ink-light mt-0.5">
                      {bundle.individualCountText}
                    </p>
                  </div>

                  <button
                    onClick={() => openEnquiry()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-commerce hover:text-commerce-dark hover:underline"
                  >
                    <span>View bundle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

