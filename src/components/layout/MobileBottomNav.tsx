"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const { wishlist } = useWishlist();

  const isHomeActive = pathname === "/";
  const isShopActive = pathname === "/shop" || pathname.startsWith("/collections");
  const isSearchActive = pathname === "/search";
  const isFavoritesActive = pathname === "/favorites";
  const isAccountActive = pathname.startsWith("/account");

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[900] bg-[#FFFAF1]/95 backdrop-blur-md border-t border-[#E8DFCF] shadow-[0_-4px_20px_rgba(20,83,45,0.08)] pb-[calc(env(safe-area-inset-bottom,0px)+0.25rem)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-6 h-16 items-center px-0.5 sm:px-1">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
            isHomeActive
              ? "text-[#14532D] font-bold"
              : "text-[#4B5563] hover:text-[#14532D] font-medium"
          }`}
          aria-current={isHomeActive ? "page" : undefined}
          aria-label="Home"
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              isHomeActive ? "bg-[#14532D]/10" : ""
            }`}
          >
            <Home className="w-5 h-5 text-current" />
          </div>
          <span className="text-[9px] xs:text-[10px] mt-0.5 tracking-tight leading-none">Home</span>
        </Link>

        {/* 2. Shop / Browse */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
            isShopActive
              ? "text-[#14532D] font-bold"
              : "text-[#4B5563] hover:text-[#14532D] font-medium"
          }`}
          aria-current={isShopActive ? "page" : undefined}
          aria-label="Shop All Products"
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              isShopActive ? "bg-[#14532D]/10" : ""
            }`}
          >
            <Store className="w-5 h-5 text-current" />
          </div>
          <span className="text-[9px] xs:text-[10px] mt-0.5 tracking-tight leading-none">Shop</span>
        </Link>

        {/* 3. Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
            isSearchActive
              ? "text-[#14532D] font-bold"
              : "text-[#4B5563] hover:text-[#14532D] font-medium"
          }`}
          aria-current={isSearchActive ? "page" : undefined}
          aria-label="Search Catalogue"
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              isSearchActive ? "bg-[#14532D]/10" : ""
            }`}
          >
            <Search className="w-5 h-5 text-current" />
          </div>
          <span className="text-[9px] xs:text-[10px] mt-0.5 tracking-tight leading-none">Search</span>
        </Link>

        {/* 4. Favourites (Dedicated Destination with Live Badge) */}
        <Link
          href="/favorites"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
            isFavoritesActive
              ? "text-[#14532D] font-bold"
              : "text-[#4B5563] hover:text-[#14532D] font-medium"
          }`}
          aria-current={isFavoritesActive ? "page" : undefined}
          aria-label={`Favourites with ${wishlist.length} saved products`}
        >
          <div
            className={`relative p-1 rounded-xl transition-colors ${
              isFavoritesActive ? "bg-[#14532D]/10" : ""
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavoritesActive
                  ? "text-[#14532D] fill-[#14532D]"
                  : "text-current"
              }`}
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#22C55E] text-[#14532D] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[9px] xs:text-[10px] mt-0.5 tracking-tight leading-none truncate max-w-full">
            Favourites
          </span>
        </Link>

        {/* 5. Cart (Live Drawer Trigger with Dynamic Badge) */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl text-[#4B5563] hover:text-[#14532D] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
          aria-label={`Shopping Cart with ${cart.totalQuantity} items`}
        >
          <div className="relative p-1">
            <ShoppingBag className="w-5 h-5 text-current" />
            {cart.totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#22C55E] text-[#14532D] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                {cart.totalQuantity}
              </span>
            )}
          </div>
          <span className="text-[9px] xs:text-[10px] mt-0.5 tracking-tight leading-none">Cart</span>
        </button>

        {/* 6. Patrick / Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
            isAccountActive
              ? "text-[#14532D] font-bold"
              : "text-[#4B5563] hover:text-[#14532D] font-medium"
          }`}
          aria-current={isAccountActive ? "page" : undefined}
          aria-label={isAuthenticated ? "My Account" : "Sign In"}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              isAccountActive ? "bg-[#14532D]/10" : ""
            }`}
          >
            <User className="w-5 h-5 text-current" />
          </div>
          <span className="text-[9px] xs:text-[10px] mt-0.5 tracking-tight truncate max-w-[50px] xs:max-w-[54px] text-center leading-none">
            {isAuthenticated ? (customer?.firstName || "Account") : "Account"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
