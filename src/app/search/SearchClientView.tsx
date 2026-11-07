"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Product } from "@/types";
import { ProductGrid } from "@/components/products/ProductGrid";

interface SearchClientViewProps {
  query: string;
  products: Product[];
}

export function SearchClientView({ query, products }: SearchClientViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState<"products" | "collections" | "blog" | "pages">("products");
  const [sortBy, setSortBy] = useState("relevance");

  React.useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box (Desktop only; on mobile, global header search capsule is the single search input) */}
      <div className="hidden lg:block max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex items-center shadow-xs">
          <input
            type="text"
            placeholder="Search products or brands"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 text-sm text-[#1F2937] bg-white border border-[#E8DFCF] rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
          />
          <button
            type="submit"
            className="bg-[#14532D] hover:bg-[#064E3B] text-white px-6 py-3 text-sm font-semibold rounded-r-lg transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-[#22C55E]" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Query Title */}
      <div className="border-b border-[#E8DFCF] pb-4 space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-serif-display text-[#1F2937]">
          Search Results
        </h1>
        {query && (
          <p className="text-sm font-medium text-[#14532D] italic">
            &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Result Category Tabs with #22C55E Active Accent */}
      <div className="flex items-center space-x-6 border-b border-[#E8DFCF] text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "products"
              ? "border-[#22C55E] text-[#14532D] font-bold"
              : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "collections"
              ? "border-[#22C55E] text-[#14532D] font-bold"
              : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
          }`}
        >
          Collections (1)
        </button>
        <button
          onClick={() => setActiveTab("blog")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "blog"
              ? "border-[#22C55E] text-[#14532D] font-bold"
              : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
          }`}
        >
          Blog Post (0)
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "pages"
              ? "border-[#22C55E] text-[#14532D] font-bold"
              : "border-transparent text-[#4B5563] hover:text-[#1F2937]"
          }`}
        >
          Pages (2)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Sub-bar */}
          <div className="flex items-center justify-between text-xs text-[#4B5563] bg-[#FFFAF1] p-3 border border-[#E8DFCF] rounded-xl shadow-xs">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#14532D]" />
              <span>Filter</span>
              <span className="font-bold text-[#1F2937] ml-2">
                {products.length} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#F7EBD8] border border-[#E8DFCF] rounded-md px-2.5 py-1 pr-6 text-xs font-semibold text-[#1F2937] focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#4B5563] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <ProductGrid products={products} columns={4} />
        </div>
      )}

      {activeTab === "collections" && (
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-6 space-y-2 shadow-xs">
          <h3 className="text-base font-bold text-[#14532D]">
            <Link href="/collections/tea-coffee" className="hover:underline">
              Tea &amp; Coffee Department
            </Link>
          </h3>
          <p className="text-xs text-[#4B5563]">
            Explore Ireland&apos;s favourite teas including Barry&apos;s Gold Blend, Master Blend, and Lyons original.
          </p>
        </div>
      )}

      {activeTab === "blog" && (
        <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-8 text-center text-xs text-[#4B5563]">
          No blog posts found matching your search query.
        </div>
      )}

      {activeTab === "pages" && (
        <div className="space-y-4">
          <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#14532D]">
              <Link href="/#store-info" className="hover:underline">
                About The Irish Grocer (Quincy, MA)
              </Link>
            </h3>
            <p className="text-xs text-[#4B5563] mt-1">
              Store information, operating hours, and location at 132 East Howard Street, Quincy.
            </p>
          </div>
          <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#14532D]">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy &amp; Store Terms
              </Link>
            </h3>
            <p className="text-xs text-[#4B5563] mt-1">
              Privacy disclosures, customer data practices, and terms of service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
