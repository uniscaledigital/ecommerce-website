import { Product } from "@/types";

export type AvailabilityFilter = "all" | "in_stock" | "out_of_stock";

export type SortOption =
  | "relevance"
  | "alphabetical-az"
  | "alphabetical-za"
  | "price-low-high"
  | "price-high-low"
  | "rating-high-low";

export type ViewMode = "grid" | "list";

export interface FilterState {
  availability: AvailabilityFilter;
  categories: string[];      // collection handles or category names
  brands: string[];          // vendor names
  priceRange: [number, number]; // [min, max]
  productTypes: string[];    // productType strings
  dietary: string[];         // dietary & lifestyle tags
  minRating: number;         // 0 to 5
  sortBy: SortOption;
  viewMode: ViewMode;
  searchQuery?: string;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetCounts {
  availability: {
    inStock: number;
    outOfStock: number;
    all: number;
  };
  categories: Record<string, number>;
  brands: Record<string, number>;
  productTypes: Record<string, number>;
  dietary: Record<string, number>;
  ratings: {
    fourPlus: number;
    threePlus: number;
    twoPlus: number;
    onePlus: number;
  };
  priceBounds: {
    min: number;
    max: number;
  };
}

export interface ActiveChip {
  id: string;
  label: string;
  group: "availability" | "category" | "brand" | "price" | "productType" | "dietary" | "rating";
  value: string | number;
}

