import React from "react";
import Link from "next/link";
import { Heart, MapPin, Truck, ShieldCheck, Phone, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export const metadata = {
  title: "About Us — The Irish Grocer Marshfield Store",
  description: "Learn about The Irish Grocer Marshfield Store at 1899 Ocean St, Marshfield, MA. Bringing authentic Irish foods, teas, crisps, and bakery essentials to New England.",
};

export default function AboutPage() {
  return (
    <div className="section-inner py-8 sm:py-12 max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#14532D] bg-[#E8F5E9] border border-[#22C55E]/30 rounded-full tracking-wider uppercase">
          <Heart className="w-3.5 h-3.5 fill-[#14532D] text-[#14532D]" />
          Our Marshfield Heritage
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937]">
          About The Irish Grocer
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto italic">
          &ldquo;{SITE_CONFIG.motto}&rdquo;
        </p>
      </div>

      {/* Main Story Container */}
      <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#4B5563] leading-relaxed shadow-xs">
        <section className="space-y-3">
          <h2 className="font-serif-display text-lg sm:text-xl font-bold text-[#1F2937]">
            A Taste of Ireland on the Massachusetts South Shore
          </h2>
          <p>
            Located at <strong>1899 Ocean St in Marshfield, Massachusetts</strong>, The Irish Grocer is dedicated to keeping the comforting tastes and traditions of Ireland alive across New England. From Barry&apos;s and Lyons tea to Tayto crisps, Cadbury chocolates, soda bread flour, and traditional Irish meats, we bring authentic products straight across the Atlantic every week.
          </p>
          <p>
            Whether you grew up having Sunday roast with McDonnell&apos;s curry and Batchelors beans, or you&apos;re discovering the rich flavours of traditional Irish pantry essentials for the first time, our Marshfield market welcomes you with open arms.
          </p>
        </section>

        {/* 3 Pillar Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DFCF]">
          <div className="bg-[#FDF4E3] border border-[#E8DFCF] rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1F2937] text-xs font-serif-display">
              Marshfield Storefront
            </h3>
            <p className="text-[11px] text-[#4B5563]">
              1899 Ocean St, Marshfield, MA. Open daily from 9:00 AM to 9:00 PM for easy in-store shopping.
            </p>
          </div>

          <div className="bg-[#FDF4E3] border border-[#E8DFCF] rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1F2937] text-xs font-serif-display">
              We Deliver!
            </h3>
            <p className="text-[11px] text-[#4B5563]">
              Order online or request delivery to your door anywhere across the South Shore and Greater Boston.
            </p>
          </div>

          <div className="bg-[#FDF4E3] border border-[#E8DFCF] rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1F2937] text-xs font-serif-display">
              Authentic Direct Imports
            </h3>
            <p className="text-[11px] text-[#4B5563]">
              Genuine grocery brands imported directly from Dublin, Cork, and verified European partners.
            </p>
          </div>
        </div>

        {/* Location & Hours Summary */}
        <section className="bg-[#F7EBD8] p-5 rounded-xl border border-[#E8DFCF] space-y-3 pt-4">
          <h3 className="font-serif-display text-sm font-bold text-[#1F2937]">
            Visit Us in Marshfield
          </h3>
          <div className="text-xs text-[#1F2937] space-y-1">
            <p><strong>Store Address:</strong> {SITE_CONFIG.address.full}</p>
            <p><strong>Business Hours:</strong> {SITE_CONFIG.hours}</p>
            <p><strong>Telephone:</strong> <a href={`tel:+1${SITE_CONFIG.phoneRaw}`} className="text-[#14532D] font-bold hover:underline">{SITE_CONFIG.phone}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#14532D] font-bold hover:underline">{SITE_CONFIG.email}</a></p>
          </div>
        </section>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#14532D] hover:bg-[#064E3B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs w-full sm:w-auto min-h-[44px]"
        >
          <span>Explore Farmhouse Aisles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#14532D] text-[#14532D] hover:bg-[#14532D] hover:text-white text-xs font-semibold rounded-xl transition-colors w-full sm:w-auto min-h-[44px]"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact Storefront</span>
        </Link>
      </div>

      {/* Return Home Footer Link */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs font-semibold text-[#14532D] hover:underline inline-flex items-center gap-1 min-h-[44px] py-2"
        >
          ← Return to The Irish Grocer Homepage
        </Link>
      </div>
    </div>
  );
}

