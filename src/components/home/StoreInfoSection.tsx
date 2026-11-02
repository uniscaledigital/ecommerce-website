import React from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export function StoreInfoSection() {
  return (
    <section id="store-info" className="my-12 md:my-16">
      <div className="bg-forest text-ivory rounded-xl p-8 sm:p-10 lg:p-12 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold uppercase">
              A NEIGHBOURHOOD FAVOURITE
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              The Irish Grocer
            </h2>
            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-xl">
              {SITE_CONFIG.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="bg-gold hover:bg-gold-hover text-forest font-bold text-xs sm:text-sm px-6 py-3 rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="border border-ivory/30 hover:border-ivory text-ivory font-semibold text-xs sm:text-sm px-6 py-3 rounded-md transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right: Store Details Card */}
          <div className="lg:col-span-5 bg-forest-dark/70 border border-ivory/15 rounded-lg p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>Visit the store</span>
              </div>
              <p className="text-sm font-medium text-ivory">
                {SITE_CONFIG.address.street}
              </p>
              <p className="text-xs text-ivory/70">
                {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}
              </p>
            </div>

            <div className="border-t border-ivory/10 pt-4">
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Hours</span>
              </div>
              <p className="text-sm font-medium text-ivory">7:00 AM – 10:00 PM</p>
              <p className="text-xs text-ivory/70">Open 365 days a year</p>
            </div>

            <div className="border-t border-ivory/10 pt-4">
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </div>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="text-sm font-bold text-gold hover:underline block"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

