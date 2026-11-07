import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Truck, ExternalLink, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export const metadata = {
  title: "Contact Us — The Irish Grocer Marshfield Store",
  description: "Get in touch with The Irish Grocer Marshfield Store at 1899 Ocean St, Marshfield, Massachusetts. Call (774) 699-0889 or email irishgrocer@gmail.com. Open daily 9am–9pm.",
};

export default function ContactPage() {
  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    SITE_CONFIG.address.full
  )}`;

  return (
    <div className="section-inner py-8 sm:py-12 max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#14532D] bg-[#E8F5E9] border border-[#22C55E]/30 rounded-full tracking-wider uppercase">
          <Truck className="w-3.5 h-3.5 text-[#14532D]" />
          {SITE_CONFIG.deliveryMessage} • Marshfield, Massachusetts
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937]">
          Contact Our Marshfield Store
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto">
          {SITE_CONFIG.brandMessaging}. Whether you have questions about our Dublin and Cork shipments, need wholesale pricing, or want delivery to your door, our Marshfield team is here for you.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1: Store Location & Directions */}
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-[#1F2937]">
                Storefront Address
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Visit our authentic South Shore market
              </p>
            </div>
            <div className="text-sm font-medium text-[#1F2937] leading-relaxed pt-1">
              <p className="font-bold text-[#14532D]">{SITE_CONFIG.storeName}</p>
              <p>{SITE_CONFIG.address.street}</p>
              <p>{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}</p>
            </div>
          </div>
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#14532D] hover:bg-[#064E3B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs min-h-[44px]"
          >
            <span>Get Google Maps Directions</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 2: Phone & Orders */}
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-[#1F2937]">
                Telephone &amp; Orders
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Direct storefront counter support
              </p>
            </div>
            <div className="text-sm text-[#1F2937] leading-relaxed pt-1">
              <a
                href={`tel:+1${SITE_CONFIG.phoneRaw}`}
                className="text-lg font-bold text-[#14532D] hover:underline block"
              >
                {SITE_CONFIG.phone}
              </a>
              <p className="text-xs text-[#4B5563] mt-1">
                Call for daily stock check, custom butchery inquiries, or telephone orders.
              </p>
            </div>
          </div>
          <a
            href={`tel:+1${SITE_CONFIG.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#14532D] hover:bg-[#064E3B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs min-h-[44px]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {SITE_CONFIG.phone}</span>
          </a>
        </div>

        {/* Card 3: Email Support */}
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-[#1F2937]">
                Email Us
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                General inquiries &amp; wholesale requests
              </p>
            </div>
            <div className="text-sm text-[#1F2937] leading-relaxed pt-1">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-bold text-[#14532D] hover:underline break-all block"
              >
                {SITE_CONFIG.email}
              </a>
              <p className="text-xs text-[#4B5563] mt-1">
                We review customer requests daily and send fast written replies.
              </p>
            </div>
          </div>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-[#14532D] text-[#14532D] hover:bg-[#14532D] hover:text-white text-xs font-semibold rounded-xl transition-colors min-h-[44px]"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </a>
        </div>

        {/* Card 4: Operating Hours */}
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#14532D] flex items-center justify-center border border-[#22C55E]/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-[#1F2937]">
                Storefront Hours
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Convenient South Shore opening times
              </p>
            </div>
            <div className="text-sm text-[#1F2937] leading-relaxed pt-1 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Monday – Sunday:</span>
                <span className="font-bold text-[#14532D]">9:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Status:</span>
                <span className="text-[#22C55E] font-bold">Open Daily</span>
              </div>
              <p className="text-[11px] text-[#4B5563] pt-1">
                Curbside pickup and delivery available during all store hours.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#14532D] hover:bg-[#064E3B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs min-h-[44px]"
          >
            <span>Browse Products for Pickup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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

