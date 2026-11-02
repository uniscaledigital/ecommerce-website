import React from "react";
import { SITE_CONFIG } from "@/lib/config/site";
import { MapPin, Phone, Clock } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-forest text-ivory text-xs py-2 px-4 border-b border-forest-dark">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <p className="font-medium tracking-wide">
          <span className="italic">{SITE_CONFIG.motto}</span>
        </p>
        <div className="hidden md:flex items-center space-x-6 text-ivory/80 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}
          </span>
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            {SITE_CONFIG.phone}
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold" />
            7AM – 10PM • 365 Days
          </span>
        </div>
      </div>
    </div>
  );
}

