"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  href: string;
  count?: number;
}

const PRIMARY_CATEGORIES: CategoryItem[] = [
  {
    id: "tea-coffee",
    name: "Tea & Coffee",
    image: "/assets/categories/tea-coffee.png",
    href: "/collections/tea-coffee",
    count: 46,
  },
  {
    id: "crisps-snacks",
    name: "Crisps & Snacks",
    image: "/assets/categories/crisps-snacks.png",
    href: "/collections/crisps-snacks",
    count: 91,
  },
  {
    id: "bread-bakery",
    name: "Bakery & Breads",
    image: "/assets/categories/bread-bakery.png",
    href: "/collections/bread-bakery",
    count: 36,
  },
  {
    id: "candies-sweets",
    name: "Chocolates",
    image: "/assets/categories/candies-sweets.png",
    href: "/collections/candies-sweets",
    count: 68,
  },
  {
    id: "biscuits-cookies",
    name: "Biscuits",
    image: "/assets/categories/biscuits-cookies.png",
    href: "/collections/biscuits-cookies",
    count: 42,
  },
  {
    id: "meats",
    name: "Irish Meats",
    image: "/assets/categories/meats.png",
    href: "/collections/meats",
    count: 28,
  },
  {
    id: "grocery",
    name: "Groceries",
    image: "/assets/categories/grocery.png",
    href: "/collections/grocery",
    count: 124,
  },
];

const REMAINING_CATEGORIES: CategoryItem[] = [
  {
    id: "drinks",
    name: "Irish Drinks",
    image: "/assets/categories/drinks.png",
    href: "/collections/drinks",
    count: 54,
  },
  {
    id: "sauces-condiments",
    name: "Sauces & Condiments",
    image: "/assets/categories/sauces-condiments.png",
    href: "/collections/sauces-condiments",
    count: 30,
  },
  {
    id: "oats-cereals",
    name: "Oats & Cereals",
    image: "/assets/categories/oats-cereals.png",
    href: "/collections/oats-cereals",
    count: 22,
  },
  {
    id: "gifts-merchandise",
    name: "Gifts & Hampers",
    image: "/assets/categories/gifts-merchandise.png",
    href: "/collections/gifts-merchandise",
    count: 32,
  },
  {
    id: "clothing",
    name: "Apparel",
    image: "/assets/categories/clothing.png",
    href: "/collections/clothing",
    count: 18,
  },
  {
    id: "new-arrivals",
    name: "New Arrivals",
    image: "/assets/categories/new-arrivals.png",
    href: "/collections/new-arrivals",
    count: 48,
  },
  {
    id: "christmas",
    name: "Holiday Treats",
    image: "/assets/categories/christmas.png",
    href: "/collections/christmas",
    count: 14,
  },
  {
    id: "all-shop",
    name: "Shop All Aisles",
    image: "/assets/categories/grocery.png",
    href: "/shop",
    count: 230,
  },
];

export function MobileCategoryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D]">
            SHOP BY AISLE
          </span>
          <h2 className="text-sm font-bold text-[#14532D] font-serif-display leading-tight">
            Explore Irish Grocery Aisles
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-[#14532D] hover:text-[#064E3B] flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
          aria-label="View all shopping aisles"
        >
          <span>All Aisles</span>
          <ArrowRight className="w-3 h-3 text-[#22C55E]" />
        </Link>
      </div>

      {/* 2 Rows x 4 Columns Primary Grid (7 Categories + 1 'See All' Toggle) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {PRIMARY_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-[#EDF8E9]/50 transition-colors min-h-[76px] justify-between"
            aria-label={`Browse ${cat.name}`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EDF8E9] border border-[#D0E7C9] p-1.5 flex items-center justify-center shadow-2xs group-hover:border-[#14532D]/40 group-hover:scale-105 transition-all relative overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                width={52}
                height={52}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-[11px] font-bold text-[#14532D] leading-tight line-clamp-1 mt-1 group-hover:text-[#064E3B]">
              {cat.name}
            </span>
          </Link>
        ))}

        {/* 8th Slot: See All Toggle / Expander Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-[#EDF8E9]/50 transition-colors min-h-[76px] justify-between"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse additional aisles" : "See all 15 aisles"}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#14532D] text-[#FFFAF1] border border-[#14532D] p-1.5 flex flex-col items-center justify-center shadow-xs group-hover:bg-[#064E3B] group-hover:scale-105 transition-all relative">
            <LayoutGrid className="w-5 h-5 text-[#22C55E]" />
            <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5 text-white">
              {isExpanded ? "Less" : "+8 More"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#14532D] leading-tight line-clamp-1 mt-1 flex items-center gap-0.5">
            <span>{isExpanded ? "Show Less" : "See All (15)"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-[#42634A]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#42634A]" />
            )}
          </span>
        </button>
      </div>

      {/* Expanded Remaining 8 Categories */}
      {isExpanded && (
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 pt-2 border-t border-[#D0E7C9]/60 animate-in fade-in duration-200">
          {REMAINING_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-[#EDF8E9]/50 transition-colors min-h-[76px] justify-between"
              aria-label={`Browse ${cat.name}`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EDF8E9] border border-[#D0E7C9] p-1.5 flex items-center justify-center shadow-2xs group-hover:border-[#14532D]/40 group-hover:scale-105 transition-all relative overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={52}
                  height={52}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-[11px] font-bold text-[#14532D] leading-tight line-clamp-1 mt-1 group-hover:text-[#064E3B]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

