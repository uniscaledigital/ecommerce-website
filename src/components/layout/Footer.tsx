"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, FOOTER_SHOP_LINKS, FOOTER_HELP_LINKS } from "@/lib/config/site";
import { MapPin, Phone, Clock, Mail, CheckCircle } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-white border-t border-irishBorder text-ink mt-16">
      {/* Upper Footer: 4 columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Store Identity & Location */}
          <div className="space-y-4">
            <Link href="/" className="inline-block relative w-48 h-12">
              <Image
                src="/assets/logo/the-irish-grocer-logo.png"
                alt="The Irish Grocer"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed">
              {SITE_CONFIG.tagline}.
            </p>
            <div className="space-y-2 text-xs text-ink-muted pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-commerce shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address.full}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-commerce shrink-0" />
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="hover:text-commerce hover:underline">
                  {SITE_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-commerce shrink-0" />
                <span>{SITE_CONFIG.hours}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Departments */}
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              {FOOTER_SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-commerce hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help & Store Inquiries */}
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">
              Help
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              {FOOTER_HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-commerce hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter "Stay in Touch" */}
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-2">
              Stay in touch
            </h3>
            <p className="text-sm text-ink-muted mb-4 leading-relaxed">
              Get new product updates and store news.
            </p>

            {isSubscribed ? (
              <div className="bg-commerce/10 border border-commerce/20 text-commerce p-3 rounded-md text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Thank you for joining our newsletter!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm text-ink bg-ivory border border-irishBorder rounded-md focus:outline-none focus:ring-1 focus:ring-commerce placeholder:text-ink-light"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-commerce hover:bg-commerce-dark text-white py-2.5 px-4 text-sm font-semibold rounded-md transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal & Motto Banner */}
      <div className="border-t border-irishBorder bg-ivory py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© 2026 {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="font-serif-display text-sm text-forest italic font-medium">
            &ldquo;{SITE_CONFIG.motto}&rdquo;
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-commerce underline">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-commerce underline">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

