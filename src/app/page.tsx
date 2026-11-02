import React from "react";
import { ChristmasSection } from "@/components/home/ChristmasSection";
import { HeroSection } from "@/components/home/HeroSection";
import { FamiliarBrandsSection } from "@/components/home/FamiliarBrandsSection";
import { DepartmentGridSection } from "@/components/home/DepartmentGridSection";
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
      {/* 1. Christmas Promotional Section & Group Buying */}
      <ChristmasSection />

      {/* 2. Main Hero Section — A little taste of home */}
      <HeroSection />

      {/* 3. Familiar Irish Brands Showcase */}
      <FamiliarBrandsSection />

      {/* 4. Department / Category Grid */}
      <DepartmentGridSection />

      {/* 5. Crisps & Snacks Curated Section */}
      <CrispsSection products={crispsProducts} />

      {/* 6. New Arrivals Curated Section */}
      <NewArrivalsSection products={newArrivalsProducts} />

      {/* 7. The Irish Grocer Quincy Store Information */}
      <StoreInfoSection />

      {/* 8. Easy Gifting Promotional Section */}
      <GiftingSection />

      {/* 9. Exclusive Finds Section */}
      <ExclusiveFindsSection />

      {/* 10. Order with Confidence Workflow */}
      <OrderConfidenceSection />
    </div>
  );
}

