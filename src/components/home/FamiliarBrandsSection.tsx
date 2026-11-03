import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function FamiliarBrandsSection() {
  const brands = [
    {
      title: "Tayto Cheese & Onion",
      image: "/assets/products/tayto-cheese-onion-hero.png",
      href: "/products/tayto-cheese-onion-35g",
      tag: "The Original Irish Crisp",
    },
    {
      title: "Barry's Gold Blend",
      image: "/assets/products/barrys-gold-blend-hero.png",
      href: "/products/barrys-gold-blend-tea-80-count",
      tag: "Ireland's Master Blend",
    },
    {
      title: "Cadbury Dairy Milk",
      image: "/assets/products/cadbury-dairy-milk-hero.png",
      href: "/products/cadbury-dairy-milk",
      tag: "Classic Irish Recipe",
    },
  ];

  return (
    <section className="my-10 md:my-14">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8DFCF] pb-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#14532D] uppercase">
              FAMILIAR BRANDS • TIMELESS FAVOURITES
            </p>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F2937] mt-1">
              Ireland&apos;s Most Loved Pantry Staples
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#14532D] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse all brands</span>
            <span className="text-[#22C55E]">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.title}
              href={brand.href}
              className="group relative bg-[#EDF8E9] border border-[#D0E7C9] rounded-[24px] overflow-hidden shadow-[0_6px_18px_rgba(20,83,45,0.09)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(20,83,45,0.13)] hover:border-[#14532D]/30 transition-all duration-200 flex flex-col"
            >
              {/* Image Frame with pale mint surface & faint shamrock watermark */}
              <div className="relative aspect-[4/3] w-full bg-[#DDF1D5] rounded-t-[23px] p-6 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden select-none"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute -bottom-4 -left-4 w-28 h-28 text-[#22C55E] opacity-[0.14]"
                    fill="currentColor"
                  >
                    <path d="M50 44 C41 33 24 35 24 48 C24 59 36 65 50 56 C64 65 76 59 76 48 C76 35 59 33 50 44 Z" />
                    <path d="M50 44 C39 53 37 70 50 70 C63 70 61 53 50 44 Z" />
                    <path d="M50 44 C39 35 39 18 50 18 C61 18 61 35 50 44 Z" />
                  </svg>
                </div>
                <Image
                  src={brand.image}
                  alt={brand.title}
                  fill
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Title & arrow */}
              <div className="p-4 sm:p-5 flex items-center justify-between bg-[#EDF8E9]">
                <div>
                  <span className="text-[11px] font-semibold text-[#42634A] uppercase tracking-wider block">
                    {brand.tag}
                  </span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#14532D] group-hover:text-[#064E3B] transition-colors mt-0.5">
                    {brand.title}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-white border border-[#D0E7C9] group-hover:bg-[#14532D] flex items-center justify-center transition-colors shadow-xs shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-[#14532D] group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
