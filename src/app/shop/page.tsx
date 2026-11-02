import React from "react";
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
    <div className="py-8 space-y-12">
      <ShopClientView initialProducts={allProducts} collections={collections} />
      <OrderConfidenceSection />
    </div>
  );
}

