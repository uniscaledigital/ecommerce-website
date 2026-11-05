import React, { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FamiliarBrandsSection } from "@/components/home/FamiliarBrandsSection";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { CrispsSection } from "@/components/home/CrispsSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { StoreInfoSection } from "@/components/home/StoreInfoSection";
import { GiftingSection } from "@/components/home/GiftingSection";
import { ExclusiveFindsSection } from "@/components/home/ExclusiveFindsSection";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";
import { MobileHomeShoppingView } from "@/components/home/MobileHomeShoppingView";
import { getProducts, getCollections } from "@/lib/shopify";

export default async function HomePage() {
  const crispsProducts = await getProducts({ collectionHandle: "crisps-snacks", first: 4 });
  const newArrivalsProducts = await getProducts({ collectionHandle: "new-arrivals", first: 4 });
  const allProducts = await getProducts({ first: 100 });
  const collections = await getCollections();

  return (
    <div className="w-full pb-16">
      {/* ================================================================ */}
      {/* MOBILE SHOPPING-FIRST LAYOUT (< 768px / md:hidden)               */}
      {/* Pure CSS responsive entry: no redirects or user-agent detection */}
      {/* ================================================================ */}
      <div className="block md:hidden">
        <Suspense
          fallback={
            <div className="py-12 text-center text-xs text-[#42634A]">
              Loading groceries...
            </div>
          }
        >
          <MobileHomeShoppingView
            products={allProducts}
            collections={collections}
          />
        </Suspense>
        {/* Mobile Reassurance Banner */}
        <div className="px-3 sm:px-4 mt-6">
          <OrderConfidenceSection />
        </div>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP HOMEPAGE LAYOUT (>= 768px / hidden md:block)            */}
      {/* Exact preservation of approved v2.0 desktop visual baseline      */}
      {/* ================================================================ */}
      <div className="hidden md:block">
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
    </div>
  );
}
