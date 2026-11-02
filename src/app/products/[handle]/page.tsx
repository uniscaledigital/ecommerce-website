import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import { ProductDetailsClient } from "./ProductDetailsClient";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product Not Found — The Irish Grocer" };

  return {
    title: `${product.title} — The Irish Grocer`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Related products
  const relatedProducts = (
    await getProducts({
      collectionHandle: product.collections?.[0] || "crisps-snacks",
      first: 5,
    })
  ).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-6 space-y-12">
      {/* Breadcrumbs matching PDF Page 6 */}
      <nav className="text-xs text-ink-muted flex items-center gap-2">
        <Link href="/" className="hover:text-commerce underline">
          Home
        </Link>
        <span>&gt;</span>
        <span className="text-commerce font-medium">{product.title}</span>
      </nav>

      {/* Main PDP Client View */}
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} />

      {/* Order with confidence workflow */}
      <OrderConfidenceSection />
    </div>
  );
}

