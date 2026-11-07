"use client";

import React, { useMemo } from "react";
import { Product, Collection } from "@/types";

// Mobile section subcomponents
import { MobilePromoBanner } from "./mobile/MobilePromoBanner";
import { MobileStoreConfidenceStrip } from "./mobile/MobileStoreConfidenceStrip";
import { MobileCategoryGrid } from "./mobile/MobileCategoryGrid";
import { MobileProductSpotlight } from "./mobile/MobileProductSpotlight";
import { MobileBrandsCarousel } from "./mobile/MobileBrandsCarousel";

interface MobileHomeShoppingViewProps {
  products: Product[];
  collections: Collection[];
}

export function MobileHomeShoppingView({
  products,
  collections: _collections,
}: MobileHomeShoppingViewProps) {
  // Curated spotlight subsets
  const teaAndBakeryProducts = useMemo(() => {
    return products.filter((p) =>
      p.collections?.includes("tea-coffee") ||
      p.collections?.includes("bread-bakery") ||
      p.productType === "Tea & Coffee" ||
      p.productType === "Bread & Bakery" ||
      p.tags.some((t) => {
        const lower = t.toLowerCase();
        return lower.includes("tea") || lower.includes("bakery") || lower.includes("soda bread");
      })
    );
  }, [products]);

  const crispsAndSnacksProducts = useMemo(() => {
    return products.filter((p) =>
      p.collections?.includes("crisps-snacks") ||
      p.productType === "Crisps & Snacks" ||
      p.tags.some((t) => {
        const lower = t.toLowerCase();
        return lower.includes("crisp") || lower.includes("snack");
      })
    );
  }, [products]);

  return (
    <div className="w-full space-y-6 px-3 sm:px-4 py-3">
      {/* ============================================================== */}
      {/* SECTION 1: PROMOTIONAL BANNER                                  */}
      {/* Compact swipeable promotional banner with Irish Grocer styling */}
      {/* ============================================================== */}
      <MobilePromoBanner />

      {/* ============================================================== */}
      {/* SECTION 2: STORE CONFIDENCE STRIP                              */}
      {/* Compact Quincy storefront and honest delivery/demo badge       */}
      {/* ============================================================== */}
      <MobileStoreConfidenceStrip />

      {/* ============================================================== */}
      {/* SECTION 3: PRODUCT SPOTLIGHT SECTIONS                          */}
      {/* Compact horizontal carousels from authentic catalog items      */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-1">
        {/* Spotlight 3A: Morning Tea & Fresh Bakery */}
        <MobileProductSpotlight
          eyebrow="TRADITIONAL MORNINGS"
          title="Morning Tea & Fresh Bakery"
          viewAllHref="/collections/tea-coffee"
          products={teaAndBakeryProducts}
        />

        {/* Spotlight 3B: Irish Crisps & Pub Snacks */}
        <MobileProductSpotlight
          eyebrow="ORIGINAL IRISH CRUNCH"
          title="Irish Crisps & Pub Snacks"
          viewAllHref="/collections/crisps-snacks"
          products={crispsAndSnacksProducts}
        />
      </div>

      {/* ============================================================== */}
      {/* SECTION 4: FEATURED IRISH BRANDS                               */}
      {/* Compact horizontal carousel for famous Irish brands            */}
      {/* ============================================================== */}
      <MobileBrandsCarousel products={products} />

      {/* ============================================================== */}
      {/* SECTION 5: VISUAL CATEGORY GRID                                */}
      {/* Relocated after brands carousel: exactly ONE category grid     */}
      {/* ============================================================== */}
      <MobileCategoryGrid />
    </div>
  );
}
