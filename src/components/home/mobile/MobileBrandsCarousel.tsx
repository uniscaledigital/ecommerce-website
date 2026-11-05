"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BrandItem {
  id: string;
  name: string;
  tagline: string;
  location: string;
  image: string;
  href: string;
  count: number;
}

const FEATURED_BRANDS: BrandItem[] = [
  {
    id: "tayto",
    name: "Tayto",
    tagline: "The Original Irish Crisp",
    location: "Co. Meath",
    image: "/assets/products/tayto-cheese-onion-hero.png",
    href: "/collections/crisps-snacks",
    count: 5,
  },
  {
    id: "barrys-tea",
    name: "Barry's Tea",
    tagline: "Master Blenders 1901",
    location: "Cork",
    image: "/assets/products/barrys-gold-blend-hero.png",
    href: "/collections/tea-coffee",
    count: 2,
  },
  {
    id: "cadbury",
    name: "Cadbury",
    tagline: "Classic Irish Recipe",
    location: "Dublin",
    image: "/assets/products/cadbury-dairy-milk-hero.png",
    href: "/collections/candies-sweets",
    count: 6,
  },
  {
    id: "odonnells",
    name: "O'Donnells",
    tagline: "Hand Cooked Crisps",
    location: "Tipperary",
    image: "/assets/products/odonnells-cheese-onion-44g.png",
    href: "/collections/crisps-snacks",
    count: 2,
  },
  {
    id: "bisto",
    name: "Aah Bisto",
    tagline: "Traditional Gravy",
    location: "Pantry Favourite",
    image: "/assets/products/aah-bisto-200g.png",
    href: "/collections/grocery",
    count: 2,
  },
  {
    id: "abbey-farm",
    name: "Abbey Farm",
    tagline: "Handmade Preserves",
    location: "Co. Laois",
    image: "/assets/products/abbey-farm-strawberry-jam.png",
    href: "/collections/grocery",
    count: 2,
  },
];

export function MobileBrandsCarousel() {
  return (
    <section className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D]">
            PANTRY LEGENDS
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#14532D] font-serif-display leading-tight">
            Featured Irish Brands
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-[#14532D] hover:text-[#064E3B] flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
          aria-label="Browse all brands"
        >
          <span>All Brands</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
        </Link>
      </div>

      {/* Horizontal Swipeable Track */}
      <div className="w-full -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex gap-2.5 pb-1 snap-x snap-mandatory min-w-max">
          {FEATURED_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={brand.href}
              className="group w-[138px] shrink-0 snap-start bg-[#EDF8E9] border border-[#D0E7C9] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs hover:border-[#14532D]/40 hover:shadow-sm transition-all"
              aria-label={`Explore ${brand.name} groceries`}
            >
              {/* Product Image Frame */}
              <div className="w-14 h-14 rounded-xl bg-white border border-[#D0E7C9] p-1.5 flex items-center justify-center relative overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={50}
                  height={50}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Brand Info */}
              <h3 className="font-sans text-xs font-bold text-[#14532D] group-hover:text-[#064E3B] mt-2 truncate w-full">
                {brand.name}
              </h3>
              <p className="text-[10px] text-[#42634A] truncate w-full">
                {brand.location}
              </p>

              {/* Count Pill */}
              <span className="inline-block mt-1 text-[9px] font-bold text-[#14532D] bg-[#22C55E]/15 px-2 py-0.5 rounded-full">
                {brand.count} {brand.count === 1 ? "product" : "products"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

