"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, ShoppingBag, User, Phone, Search } from "lucide-react";
import { SITE_CONFIG, NAVIGATION_LINKS } from "@/lib/config/site";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const router = useRouter();
  const { cart, openCart } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-irishBorder sticky top-0 z-40">
      {/* DESKTOP & TABLET TOP HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="relative w-44 sm:w-52 md:w-60 h-11 shrink-0 flex items-center">
          <Image
            src="/assets/logo/the-irish-grocer-logo.png"
            alt="The Irish Grocer"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="hidden lg:block flex-1 max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex w-full items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products or brands"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-ink bg-white border border-irishBorder rounded-l-md focus:outline-none focus:ring-1 focus:ring-commerce focus:border-commerce placeholder:text-ink-light"
              />
            </div>
            <button
              type="submit"
              className="bg-commerce hover:bg-commerce-dark text-white px-6 py-2.5 text-sm font-semibold rounded-r-md transition-colors flex items-center gap-1.5"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-sm font-medium text-ink shrink-0">
          {/* Call the Store (Desktop only) */}
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="hidden md:flex items-center gap-1.5 hover:text-commerce transition-colors text-ink"
          >
            <span>Call the store</span>
          </a>

          {/* Account */}
          <Link
            href={isAuthenticated ? "/account" : "/account/login"}
            className="hidden md:flex items-center gap-1.5 hover:text-commerce transition-colors text-ink"
          >
            <span>{isAuthenticated ? customer?.firstName || "Account" : "Account"}</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 hover:text-commerce transition-colors text-ink"
            aria-label="Shopping Cart"
          >
            <span className="font-medium">Cart</span>
            {cart.totalQuantity > 0 && (
              <span className="bg-commerce text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cart.totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-1 p-1 text-ink hover:text-commerce transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="text-sm font-medium">Menu</span>
            <Menu className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH STRIP (Visible below header on mobile and tablet) */}
      <div className="lg:hidden px-4 pb-3 pt-1 border-t border-irishBorder/40 bg-ivory-card">
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center">
          <input
            type="text"
            placeholder="Search products or brands"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 text-sm text-ink bg-white border border-irishBorder rounded-l-md focus:outline-none focus:ring-1 focus:ring-commerce placeholder:text-ink-light"
          />
          <button
            type="submit"
            className="bg-commerce hover:bg-commerce-dark text-white px-4 py-2 text-sm font-semibold rounded-r-md transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* DESKTOP NAVIGATION BAR (Pages 4, 10, 14, 18, 24) */}
      <nav className="hidden lg:block border-t border-irishBorder bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 text-xs font-semibold text-ink whitespace-nowrap space-x-6 tracking-normal">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-commerce hover:underline underline-offset-4 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

