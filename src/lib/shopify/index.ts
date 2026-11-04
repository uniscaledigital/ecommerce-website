import { PRODUCTS } from "@/lib/data/products";
import { DEPARTMENTS } from "@/lib/config/site";
import { Product, Collection } from "@/types";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from "./queries";

const IS_PRODUCTION = process.env.NEXT_PUBLIC_COMMERCE_MODE === "production";
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "the-irish-grocer.myshopify.com";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-10";

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  revalidate,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number;
}): Promise<T> {
  const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      ...(revalidate ? { next: { revalidate } } : { cache }),
    });

    const json = await res.json();
    if (json.errors) {
      throw new Error(json.errors[0]?.message || "Shopify GraphQL error");
    }
    return json.data as T;
  } catch (error) {
    console.warn("Shopify API fetch fallback:", error);
    throw error;
  }
}

// High-level API methods with automatic fallback to local demo data
export async function getProducts(options?: {
  first?: number;
  query?: string;
  collectionHandle?: string;
}): Promise<Product[]> {
  if (IS_PRODUCTION && STOREFRONT_TOKEN && STOREFRONT_TOKEN !== "demo_token") {
    try {
      const data = await shopifyFetch<{
        products: { edges: { node: Product }[] };
      }>({
        query: PRODUCTS_QUERY,
        variables: { first: options?.first || 50, query: options?.query },
      });
      return data.products.edges.map((e) => e.node);
    } catch (e) {
      console.warn("Shopify products query failed, using demo data fallback", e);
    }
  }

  // Demo mode
  let filtered = [...PRODUCTS];
  if (options?.collectionHandle) {
    const handle = options.collectionHandle.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.collections?.includes(handle) ||
        p.productType.toLowerCase().includes(handle) ||
        p.tags.some((t) => t.toLowerCase().includes(handle))
    );
  }
  if (options?.query) {
    const q = options.query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (options?.first) {
    filtered = filtered.slice(0, options.first);
  }
  return filtered;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (IS_PRODUCTION && STOREFRONT_TOKEN && STOREFRONT_TOKEN !== "demo_token") {
    try {
      const data = await shopifyFetch<{ product: Product | null }>({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
      });
      if (data.product) return data.product;
    } catch (e) {
      console.warn("Shopify getProductByHandle failed, using demo data", e);
    }
  }

  const found = PRODUCTS.find((p) => p.handle.toLowerCase() === handle.toLowerCase());
  return found || null;
}

export async function getCollections(): Promise<Collection[]> {
  if (IS_PRODUCTION && STOREFRONT_TOKEN && STOREFRONT_TOKEN !== "demo_token") {
    try {
      const data = await shopifyFetch<{
        collections: { edges: { node: Collection }[] };
      }>({
        query: COLLECTIONS_QUERY,
      });
      return data.collections.edges.map((e) => e.node);
    } catch (e) {
      console.warn("Shopify collections query failed, using demo data", e);
    }
  }

  return DEPARTMENTS.map((d, idx) => ({
    id: `col-${idx + 1}`,
    title: d.title,
    handle: d.handle,
    description: d.description,
    image: { url: d.image, altText: d.title },
    productCount: d.count,
  }));
}

export async function getCollectionByHandle(
  handle: string
): Promise<{ collection: Collection | null; products: Product[] }> {
  if (IS_PRODUCTION && STOREFRONT_TOKEN && STOREFRONT_TOKEN !== "demo_token") {
    try {
      const data = await shopifyFetch<{
        collection: {
          id: string;
          title: string;
          handle: string;
          description: string;
          products: { edges: { node: Product }[] };
        } | null;
      }>({
        query: COLLECTION_BY_HANDLE_QUERY,
        variables: { handle },
      });
      if (data.collection) {
        return {
          collection: {
            id: data.collection.id,
            title: data.collection.title,
            handle: data.collection.handle,
            description: data.collection.description,
            productCount: data.collection.products.edges.length,
          },
          products: data.collection.products.edges.map((e) => e.node),
        };
      }
    } catch (e) {
      console.warn("Shopify getCollectionByHandle failed, using demo fallback", e);
    }
  }

  const dept = DEPARTMENTS.find((d) => d.handle.toLowerCase() === handle.toLowerCase());
  if (!dept) {
    // If not found directly, create generic collection representation with empty state
    return {
      collection: {
        id: `col-${handle}`,
        title: handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        handle: handle,
        description: `Explore our selection of ${handle.replace(/-/g, " ")}.`,
        productCount: 0,
      },
      products: [],
    };
  }

  const prods = await getProducts({ collectionHandle: handle });
  return {
    collection: {
      id: `col-${dept.handle}`,
      title: dept.title,
      handle: dept.handle,
      description: dept.description,
      image: { url: dept.image, altText: dept.title },
      productCount: prods.length,
    },
    products: prods,
  };
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (IS_PRODUCTION && STOREFRONT_TOKEN && STOREFRONT_TOKEN !== "demo_token") {
    try {
      const data = await shopifyFetch<{
        search: { edges: { node: Product }[] };
      }>({
        query: SEARCH_PRODUCTS_QUERY,
        variables: { query },
      });
      return data.search.edges.map((e) => e.node);
    } catch (e) {
      console.warn("Shopify search failed, using demo data", e);
    }
  }

  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
  );
}

