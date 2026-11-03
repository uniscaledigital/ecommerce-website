import React from "react";
import { searchProducts } from "@/lib/shopify";
import { SearchClientView } from "./SearchClientView";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";

export const metadata = {
  title: "Search Results — The Irish Grocer",
  description: "Search products, collections, and Irish grocery favourites at The Irish Grocer.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="section-inner py-8 space-y-12">
      <SearchClientView query={query} products={products} />
      <OrderConfidenceSection />
    </div>
  );
}

