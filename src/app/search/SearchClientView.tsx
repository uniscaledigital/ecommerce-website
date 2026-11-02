"use client";

import React, { useState } from "react";
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Search products or brands"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 text-sm text-ink bg-white border border-irishBorder rounded-l-md focus:outline-none focus:ring-1 focus:ring-commerce"
          />
          <button
            type="submit"
            className="bg-commerce hover:bg-commerce-dark text-white px-6 py-3 text-sm font-semibold rounded-r-md transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Query Title matching PDF Page 24 */}
      <div className="border-b border-irishBorder pb-4 space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-serif-display text-ink">
          Search results
        </h1>
        {query && (
          <p className="text-sm font-medium text-commerce italic">
            &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Result Category Tabs matching PDF Page 24 */}
      <div className="flex items-center space-x-6 border-b border-irishBorder text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "products"
              ? "border-commerce text-commerce font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "collections"
              ? "border-commerce text-commerce font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Collections (1)
        </button>
        <button
          onClick={() => setActiveTab("blog")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "blog"
              ? "border-commerce text-commerce font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Blog post (0)
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`pb-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === "pages"
              ? "border-commerce text-commerce font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Pages (2)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Sub-bar matching PDF Page 24 */}
          <div className="flex items-center justify-between text-xs text-ink-muted bg-white p-3 border border-irishBorder rounded-md">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-commerce" />
              <span>Filter</span>
              <span className="font-bold text-ink ml-2">
                {products.length} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-ivory border border-irishBorder rounded px-2.5 py-1 pr-6 text-xs font-semibold text-ink focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
                <ChevronDown className="w-3 h-3 text-ink-light absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <ProductGrid products={products} columns={4} />
        </div>
      )}

      {activeTab === "collections" && (
        <div className="bg-white border border-irishBorder rounded-lg p-6 space-y-2">
          <h3 className="text-base font-bold text-commerce">
            <a href="/collections/tea-coffee" className="hover:underline">
              Tea & Coffee Department
            </a>
          </h3>
          <p className="text-xs text-ink-muted">
            Explore Ireland&apos;s favourite teas including Barry&apos;s Gold Blend, Master Blend, and Lyons original.
          </p>
        </div>
      )}

      {activeTab === "blog" && (
        <div className="bg-white border border-irishBorder rounded-lg p-8 text-center text-xs text-ink-muted">
          No blog posts found matching your search.
        </div>
      )}

      {activeTab === "pages" && (
        <div className="space-y-4">
          <div className="bg-white border border-irishBorder rounded-lg p-4">
            <h3 className="text-sm font-bold text-commerce">
              <a href="/#store-info" className="hover:underline">
                About The Irish Grocer (Quincy, MA)
              </a>
            </h3>
            <p className="text-xs text-ink-muted mt-1">
              Store information, operating hours, and location at 132 East Howard Street, Quincy.
            </p>
          </div>
          <div className="bg-white border border-irishBorder rounded-lg p-4">
            <h3 className="text-sm font-bold text-commerce">
              <a href="/privacy" className="hover:underline">
                Privacy Policy & Store Terms
              </a>
            </h3>
            <p className="text-xs text-ink-muted mt-1">
              Privacy disclosures, customer data practices, and terms of service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

