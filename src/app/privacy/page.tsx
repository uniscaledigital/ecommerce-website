import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config/site";

export const metadata = {
  title: "Privacy Policy — The Irish Grocer",
  description: "Privacy policy and customer data practices for The Irish Grocer in Quincy, Massachusetts.",
};

export default function PrivacyPage() {
  return (
    <div className="section-inner py-8 sm:py-12 max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#4B5563] mt-2">
          Effective Date: January 1, 2026 • The Irish Grocer (Quincy, MA)
        </p>
      </div>

      <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 text-xs sm:text-sm text-[#4B5563] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] font-serif-display">1. Information We Collect</h2>
          <p>
            When you visit The Irish Grocer or submit an order enquiry, we collect essential contact information including your name, email address, phone number, and delivery address. This information is utilized solely to process your orders, calculate applicable tax and delivery rates, and send secure payment links.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] font-serif-display">2. Customer Account API &amp; Authentication</h2>
          <p>
            Our storefront integrates with Shopify Customer Account API. We do not store or process passwords directly on our servers. Authentication is handled using secure Shop Pay or one-time passcode verification directly through Shopify&apos;s secure headless authentication infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] font-serif-display">3. Order Enquiries &amp; Written Confirmations</h2>
          <p>
            For delivery and bulk orders, order requests submitted through our &quot;Order with Confidence&quot; workflow are reviewed directly by our Quincy grocery store staff. Payment links are delivered securely, eliminating any requirement to share credit card details verbally or insecurely.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] font-serif-display">4. Contacting Our Quincy Store</h2>
          <p>
            For inquiries regarding our privacy policy, customer accounts, or order records, you can reach us at:
          </p>
          <div className="bg-[#F7EBD8] p-3.5 sm:p-4 rounded-xl border border-[#E8DFCF] text-xs text-[#1F2937] space-y-1">
            <p><strong>The Irish Grocer</strong></p>
            <p>{SITE_CONFIG.address.full}</p>
            <p>Phone: {SITE_CONFIG.phone}</p>
            <p>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#14532D] font-bold underline">{SITE_CONFIG.email}</a></p>
          </div>
        </section>
      </div>

      <div className="text-center pt-2 sm:pt-4">
        <Link href="/" className="text-xs font-semibold text-[#14532D] hover:underline inline-block min-h-[44px] py-2">
          ← Return to The Irish Grocer Homepage
        </Link>
      </div>
    </div>
  );
}
