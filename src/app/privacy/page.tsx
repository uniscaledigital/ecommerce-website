import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config/site";

export const metadata = {
  title: "Privacy Policy — The Irish Grocer",
  description: "Privacy policy and customer data practices for The Irish Grocer in Quincy, Massachusetts.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-ink">
          Privacy Policy
        </h1>
        <p className="text-xs text-ink-muted mt-2">
          Effective Date: January 1, 2026 • The Irish Grocer (Quincy, MA)
        </p>
      </div>

      <div className="bg-white border border-irishBorder rounded-xl p-8 space-y-6 text-sm text-ink-muted leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">1. Information We Collect</h2>
          <p>
            When you visit The Irish Grocer or submit an order enquiry, we collect essential contact information including your name, email address, phone number, and delivery address. This information is utilized solely to process your orders, calculate applicable tax and delivery rates, and send secure payment links.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">2. Customer Account API & Authentication</h2>
          <p>
            Our storefront integrates with Shopify Customer Account API. We do not store or process passwords directly on our servers. Authentication is handled using secure Shop Pay or one-time passcode verification directly through Shopify's secure headless authentication infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">3. Order Enquiries & Written Confirmations</h2>
          <p>
            For delivery and bulk orders, order requests submitted through our &quot;Order with Confidence&quot; workflow are reviewed directly by our Quincy grocery store staff. Payment links are delivered securely, eliminating any requirement to share credit card details verbally or insecurely.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">4. Contacting Our Quincy Store</h2>
          <p>
            For inquiries regarding our privacy policy, customer accounts, or order records, you can reach us at:
          </p>
          <div className="bg-ivory p-4 rounded-md border border-irishBorder text-xs text-ink space-y-1">
            <p><strong>The Irish Grocer</strong></p>
            <p>{SITE_CONFIG.address.full}</p>
            <p>Phone: {SITE_CONFIG.phone}</p>
            <p>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-commerce underline">{SITE_CONFIG.email}</a></p>
          </div>
        </section>
      </div>

      <div className="text-center pt-4">
        <Link href="/" className="text-xs font-semibold text-commerce hover:underline">
          ← Return to The Irish Grocer Homepage
        </Link>
      </div>
    </div>
  );
}

