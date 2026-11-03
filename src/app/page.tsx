import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FamiliarBrandsSection } from "@/components/home/FamiliarBrandsSection";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { CrispsSection } from "@/components/home/CrispsSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { StoreInfoSection } from "@/components/home/StoreInfoSection";
import { GiftingSection } from "@/components/home/GiftingSection";
import { ExclusiveFindsSection } from "@/components/home/ExclusiveFindsSection";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const crispsProducts = await getProducts({ collectionHandle: "crisps-snacks", first: 4 });
  const newArrivalsProducts = await getProducts({ collectionHandle: "new-arrivals", first: 4 });

  return (
    <div className="w-full pb-16">
      {/* 1. Homepage Hero — Main Irish Grocer Hero with Grocery Background */}
      <HeroSection />

      {/* 2. Shop by Category Carousel — 9 Aisle Infinite Horizontal Scroll */}
      <CategoryCarousel />

      {/* 3. Crisps & Savory Snacks — 4-Column Product Cards */}
      <div className="section-inner">
        <CrispsSection products={crispsProducts} />
      </div>

      {/* 4. Fresh New Arrivals — Recently Added Products */}
      <div className="section-inner">
        <NewArrivalsSection products={newArrivalsProducts} />
      </div>

      {/* 5. Ireland's Most Loved Pantry Staples — 3 Featured Brand Cards */}
      <div className="section-inner">
        <FamiliarBrandsSection />
      </div>

      {/* 6. Redesigned Information & Confidence Sections (24px vertical spacing) */}
      <div className="section-inner space-y-6 mt-12 sm:mt-14 md:mt-16">
        {/* Section 1 — The Irish Grocer Store Information (Pale Mint) */}
        <StoreInfoSection />

        {/* Section 2 — Gifting Banner (Warm Cream) */}
        <GiftingSection />

        {/* Section 3 — Exclusive Seasonal & Limited Finds (Warm Cream) */}
        <ExclusiveFindsSection />

        {/* Section 4 — Order with Confidence & Peace of Mind (Pale Mint) */}
        <OrderConfidenceSection />
      </div>
    </div>
  );
}
