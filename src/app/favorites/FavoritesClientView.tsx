"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShoppingBag,
  Trash2,
  ChevronDown,
  Sparkles,
  Loader2,
  Check,
} from "lucide-react";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/data/products";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";

type SortOption =
  | "featured"
  | "alpha-asc"
  | "alpha-desc"
  | "price-asc"
  | "price-desc"
  | "rating";

export function FavoritesClientView() {
  const { wishlist, clearWishlist, isLoaded } = useWishlist();
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [addAllSuccess, setAddAllSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter products matching IDs in wishlist
  const savedProducts = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return [];
    return PRODUCTS.filter((product) => wishlist.includes(product.id));
  }, [wishlist]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const list = [...savedProducts];
    switch (sortOption) {
      case "alpha-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "alpha-desc":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "price-asc":
        return list.sort((a, b) => {
          const priceA = parseFloat(a.priceRange.minVariantPrice.amount) || 0;
          const priceB = parseFloat(b.priceRange.minVariantPrice.amount) || 0;
          return priceA - priceB;
        });
      case "price-desc":
        return list.sort((a, b) => {
          const priceA = parseFloat(a.priceRange.minVariantPrice.amount) || 0;
          const priceB = parseFloat(b.priceRange.minVariantPrice.amount) || 0;
          return priceB - priceA;
        });
      case "rating":
        return list.sort((a, b) => {
          const ratingA = a.rating?.value ?? 0;
          const ratingB = b.rating?.value ?? 0;
          return ratingB - ratingA;
        });
      case "featured":
      default:
        // Preserve wishlist insertion order
        return list.sort(
          (a, b) => wishlist.indexOf(a.id) - wishlist.indexOf(b.id)
        );
    }
  }, [savedProducts, sortOption, wishlist]);

  // Batch action: Add all available products to cart
  const handleAddAllToBasket = async () => {
    if (!isAuthenticated || isAddingAll || savedProducts.length === 0) return;
    setIsAddingAll(true);
    try {
      const availableItems = savedProducts.filter((p) => p.availableForSale);
      for (const item of availableItems) {
        await addItem(item);
      }
      setAddAllSuccess(true);
      setTimeout(() => {
        setAddAllSuccess(false);
        openCart();
      }, 600);
    } catch {
      // Keep UI functional on error
    } finally {
      setIsAddingAll(false);
    }
  };

  // Prevent flash of empty state during hydration
  if (!isMounted || !isLoaded) {
    return (
      <div className="section-inner py-8 sm:py-12 space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 sm:h-10 w-48 bg-[#D0E7C9]/40 rounded-xl" />
          <div className="h-4 w-72 bg-[#D0E7C9]/30 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-[24px] bg-[#EDF8E9]/60 border border-[#D0E7C9]/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-inner py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8 min-h-[60vh]">
      {/* Header & Meta Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DFCF]/70 pb-5 sm:pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#14532D] font-bold tracking-tight">
              My Favourites
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF8E9] text-[#14532D] border border-[#D0E7C9]">
              {savedProducts.length} {savedProducts.length === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#42634A]">
            Your saved Irish groceries, all in one place.
          </p>
        </div>

        {savedProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                aria-label="Sort favourites"
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-[#FFFAF1] border border-[#E8DFCF] rounded-xl text-xs sm:text-sm font-medium text-[#1F2937] pl-3 pr-8 py-2 min-h-[40px] focus:outline-none focus:ring-1 focus:ring-[#14532D] focus:border-[#14532D] cursor-pointer shadow-2xs"
              >
                <option value="featured">Default Order</option>
                <option value="alpha-asc">Name: A to Z</option>
                <option value="alpha-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#42634A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear All Wishlist */}
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#42634A] hover:text-[#991B1B] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FCA5A5]/40 px-3 py-2 rounded-xl min-h-[40px] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {savedProducts.length === 0 ? (
        /* Empty State: Farmhouse Warm Cream Card */
        <div className="py-12 sm:py-16">
          <div className="bg-[#FFFAF1] border border-[#E8DFCF] rounded-[24px] p-8 sm:p-12 text-center shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EDF8E9] border border-[#D0E7C9] flex items-center justify-center mx-auto text-[#14532D] shadow-2xs">
              <Heart className="w-8 h-8 fill-transparent text-[#14532D] stroke-[1.75]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#14532D] font-bold">
                No favourites yet
              </h2>
              <p className="text-xs sm:text-sm text-[#42634A] leading-relaxed max-w-sm mx-auto">
                Save the products you love by tapping the heart icon. They&apos;ll appear here for easy shopping.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#14532D] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold shadow-xs min-h-[44px] transition-all duration-150 hover:-translate-y-0.5"
              >
                <span>Discover Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Saved Products Grid & Actions */
        <div className="space-y-6 sm:space-y-8">
          {/* Batch CTA Bar */}
          <div className="bg-[#EDF8E9] border border-[#D0E7C9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-[#14532D]/10 flex items-center justify-center text-[#14532D] shrink-0 hidden sm:flex">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#14532D]">
                  Ready to order your saved favourites?
                </p>
                <p className="text-[11px] sm:text-xs text-[#42634A]">
                  {isAuthenticated
                    ? "Add all in-stock items directly to your shopping basket with one click."
                    : "Wholesale pricing and ordering are reserved for registered trade accounts."}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleAddAllToBasket}
                disabled={isAddingAll || addAllSuccess}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#14532D] hover:bg-[#064E3B] disabled:opacity-75 text-white text-xs sm:text-sm font-semibold shadow-xs min-h-[44px] transition-all duration-150 shrink-0"
              >
                {isAddingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding Items...</span>
                  </>
                ) : addAllSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add All to Basket</span>
                  </>
                )}
              </button>
            ) : (
              <Link
                href="/account/login?redirect=/favorites"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#14532D] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold shadow-xs min-h-[44px] transition-all duration-150 shrink-0"
              >
                <span>Log in to add saved items to basket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

