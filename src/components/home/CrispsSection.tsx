import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductGrid } from "@/components/products/ProductGrid";

interface CrispsSectionProps {
  products: Product[];
}

export function CrispsSection({ products }: CrispsSectionProps) {
  return (
    <section className="my-12 md:my-16">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-irishBorder pb-4">
          <div>
            <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-commerce uppercase">
              EXPLORE THE RANGE
            </p>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
              Crisps & Snacks
            </h2>
          </div>
          <Link
            href="/collections/crisps-snacks"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-commerce hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-pack Grid */}
        <ProductGrid products={products.slice(0, 4)} columns={4} />
      </div>
    </section>
  );
}

