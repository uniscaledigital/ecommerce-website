"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      {/* SECTION 3: VISUAL CATEGORY GRID                                */}
      {/* 2 rows x 4 categories + expandable "See All" 15 aisles         */}
      {/* ============================================================== */}
      <MobileCategoryGrid />

      {/* ============================================================== */}
      {/* SECTION 4: PRODUCT SPOTLIGHT SECTIONS                          */}
      {/* Compact horizontal carousels from authentic catalog items      */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-1">
        {/* Spotlight 4A: Morning Tea & Fresh Bakery */}
        <MobileProductSpotlight
          eyebrow="TRADITIONAL MORNINGS"
          title="Morning Tea & Fresh Bakery"
          viewAllHref="/collections/tea-coffee"
          products={teaAndBakeryProducts}
        />

        {/* Spotlight 4B: Irish Crisps & Pub Snacks */}
        <MobileProductSpotlight
          eyebrow="ORIGINAL IRISH CRUNCH"
          title="Irish Crisps & Pub Snacks"
          viewAllHref="/collections/crisps-snacks"
          products={crispsAndSnacksProducts}
        />
      </div>

      {/* ============================================================== */}
      {/* SECTION 5: FEATURED IRISH BRANDS                               */}
      {/* Compact horizontal carousel for famous Irish brands            */}
      {/* ============================================================== */}
      <MobileBrandsCarousel />

      {/* ============================================================== */}
      {/* SECTION 6: SHOP ALL GROCERIES CALL TO ACTION                   */}
      {/* Prominent link inviting mobile shoppers to explore full catalog */}
      {/* ============================================================== */}
      <section className="pt-2 pb-1">
        <Link
          href="/shop"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#14532D] text-[#FFFAF1] shadow-[0_4px_16px_rgba(20,83,45,0.18)] hover:bg-[#064E3B] transition-all min-h-[64px] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
          aria-label="Shop All Groceries — Browse our complete Irish grocery catalogue"
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D0E7C9]">
              FULL CATALOGUE
            </span>
            <h3 className="text-base font-bold font-serif-display leading-tight text-white">
              Browse All Groceries &amp; Aisles
            </h3>
            <p className="text-xs text-[#EDF8E9]/80">
              Explore 9 departments, authentic imports &amp; pantry staples
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </Link>
      </section>
    </div>
  );
}
