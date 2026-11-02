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
    <section className="my-8 md:my-12">
      <div className="space-y-4">
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-ink-light uppercase">
          FA M I L I A R &nbsp; B RA N D S . &nbsp; FAVO U R I T E &nbsp; F L AVO U RS .
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.title}
              href={brand.href}
              className="group relative bg-white border border-irishBorder rounded-xl overflow-hidden shadow-sm hover:shadow-card hover:border-commerce/40 transition-all flex flex-col"
            >
              {/* Image Frame with dark spotlight */}
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
              <div className="p-4 sm:p-5 flex items-center justify-between bg-white border-t border-irishBorder/40">
                <div>
                  <span className="text-[11px] font-semibold text-ink-light uppercase">
                    {brand.tag}
                  </span>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-ink group-hover:text-commerce transition-colors">
                    {brand.title}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-ivory group-hover:bg-commerce group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-commerce group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

