"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryItem } from "./category-data";

interface CategoryCardProps {
  category: CategoryItem;
  priority?: boolean;
}

export function CategoryCard({ category, priority = false }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group block w-[150px] sm:w-[170px] lg:w-[190px] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`Shop ${category.name}`}
    >
      {/* Category Image with rounded corners and subtle shadow */}
      <div className="relative w-full aspect-[1.28/1] rounded-2xl overflow-hidden bg-[#FFFAF1] border border-[#E8DFCF] shadow-xs group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
        <Image
          src={category.image}
          alt={category.altText}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 170px, 190px"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      </div>

      {/* Category Label cleanly positioned beneath image card */}
      <div className="pt-2.5 pb-1 text-center">
        <span className="block text-xs sm:text-[13px] font-bold text-[#1F2937] group-hover:text-[#14532D] transition-colors truncate">
          {category.name}
        </span>
      </div>
    </Link>
  );
}

