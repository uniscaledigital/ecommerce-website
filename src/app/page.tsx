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
    <div className="w-full pb-12">
      {/* 1. Homepage Hero — Main Irish Grocer Hero with Grocery Background */}
      <HeroSection />

      {/* 2. Shop by Category Carousel — 9 Aisle Infinite Horizontal Scroll */}
      <CategoryCarousel />

      {/* 3. Crisps & Savory Snacks — 4-Column Product Cards */}
      <CrispsSection products={crispsProducts} />

      {/* 4. Fresh New Arrivals — Recently Added Products */}
      <NewArrivalsSection products={newArrivalsProducts} />

      {/* 5. Ireland's Most Loved Pantry Staples — 3 Featured Brand Cards */}
      <FamiliarBrandsSection />

      {/* 6. The Irish Grocer Quincy Store Information */}
      <StoreInfoSection />

      {/* 7. Easy Gifting Promotional Section */}
      <GiftingSection />

      {/* 8. Exclusive Finds Section */}
      <ExclusiveFindsSection />

      {/* 9. Order with Confidence Workflow */}
      <OrderConfidenceSection />
    </div>
  );
}
