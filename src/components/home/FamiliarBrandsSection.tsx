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
              className="group relative bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl overflow-hidden shadow-xs hover:shadow-cardHover hover:border-[#14532D]/50 transition-all flex flex-col"
            >
              {/* Image Frame with warm spotlight */}
              <div className="relative aspect-[4/3] w-full product-spotlight-frame p-6 flex items-center justify-center">
                <Image
                  src={brand.image}
                  alt={brand.title}
                  fill
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Title & arrow */}
              <div className="p-4 sm:p-5 flex items-center justify-between bg-white border-t border-[#E8DFCF]">
                <div>
                  <span className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">
                    {brand.tag}
                  </span>
                  <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#1F2937] group-hover:text-[#14532D] transition-colors">
                    {brand.title}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] group-hover:bg-[#14532D] flex items-center justify-center transition-colors shadow-xs">
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
