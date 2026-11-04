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
    alternates: {
      canonical: `/products/${handle}`,
    },
    openGraph: {
      title: `${product.title} — The Irish Grocer`,
      description: product.description,
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              alt: product.featuredImage.altText || product.title,
            },
          ]
        : [],
      type: "website",
    },
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    sku: product.variants?.[0]?.sku || undefined,
    offers: {
      "@type": "Offer",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.handle}`,
    },
  };

  return (
    <div className="section-inner py-6 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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

