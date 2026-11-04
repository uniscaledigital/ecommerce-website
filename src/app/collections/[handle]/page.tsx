import React from "react";
import { notFound } from "next/navigation";
import { getCollectionByHandle, getCollections } from "@/lib/shopify";
import { ShopClientView } from "@/app/shop/ShopClientView";
import { OrderConfidenceSection } from "@/components/home/OrderConfidenceSection";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((col) => ({
    handle: col.handle,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const { collection } = await getCollectionByHandle(handle);
  if (!collection) return { title: "Collection Not Found — The Irish Grocer" };

  return {
    title: `${collection.title} — The Irish Grocer`,
    description: collection.description,
    alternates: {
      canonical: `/collections/${handle}`,
    },
    openGraph: {
      title: `${collection.title} — The Irish Grocer`,
      description: collection.description,
      images: collection.image
        ? [
            {
              url: collection.image.url,
              alt: collection.image.altText || collection.title,
            },
          ]
        : [],
      type: "website",
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const { collection, products } = await getCollectionByHandle(handle);
  const collections = await getCollections();

  if (!collection) {
    notFound();
  }

  return (
    <div className="section-inner py-8 space-y-12">
      <ShopClientView
        initialProducts={products}
        collections={collections}
        title={collection.title}
        totalCountLabel={`${collection.productCount} products`}
      />
      <OrderConfidenceSection />
    </div>
  );
}

