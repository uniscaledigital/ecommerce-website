import React, { Suspense } from "react";
import { getProducts, getCollections } from "@/lib/shopify";
import { ShopClientView } from "./ShopClientView";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";

export const metadata = {
  title: "Shop All Irish & UK Products — The Irish Grocer",
  description: "Browse 700+ authentic imported Irish & UK grocery items, snacks, sweets, teas, and meats in Quincy, MA.",
};

export default async function ShopPage() {
  const allProducts = await getProducts({ first: 100 });
  const collections = await getCollections();

  return (
    <div className="section-inner py-8 space-y-12">
      <Suspense fallback={<div className="py-12 text-center text-sm text-[#42634A]">Loading products...</div>}>
        <ShopClientView initialProducts={allProducts} collections={collections} />
      </Suspense>
      <OrderConfidenceSection />
    </div>
  );
}

