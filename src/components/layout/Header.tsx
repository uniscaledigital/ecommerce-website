"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, Store, User, ShoppingBag, Menu, X } from "lucide-react";
import { SITE_CONFIG, CATEGORY_NAVIGATION_LINKS } from "@/lib/config/site";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/shop" && pathname === "/shop") return true;
    if (
      href.startsWith("/collections/") &&
      (pathname === href || pathname.startsWith(href + "/"))
    ) {
      return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* ============================================================== */}
      {/* UNIFIED FULL-WIDTH MINT-GREEN NAVIGATION (Edge-to-Edge)        */}
      {/* ============================================================== */}
      <div
        className={`w-full rounded-none border-x-0 border-t-0 border-b border-[#14532D]/12 transition-all duration-300 relative overflow-hidden ${
          isScrolled
            ? "shadow-[0_8px_24px_rgba(20,83,45,0.08)]"
            : "shadow-[0_2px_12px_rgba(20,83,45,0.04)]"
        }`}
      >
        {/* Subtle Top Glass Specular Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />

        {/* ------------------------------------------------------------ */}
        {/* ROW 1: MAIN NAVIGATION BAR (#ECF4E4 Pale Mint-Green)         */}
        {/* ------------------------------------------------------------ */}
        <div className="w-full bg-[#ECF4E4]/95 backdrop-blur-md">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 py-2 sm:py-2.5">
            <div className="flex lg:grid lg:grid-cols-[210px_minmax(360px,600px)_auto] items-center justify-between gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
              {/* LEFT: Official Irish Grocer Animated SVG Logo */}
              <div className="flex items-center shrink-0 w-auto lg:w-[210px] xl:w-[220px]">
                <Link
                  href="/"
                  className={`relative shrink-0 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] rounded-xl overflow-hidden transition-all duration-300 ${
                    isScrolled
                      ? "w-[135px] sm:w-[165px] lg:w-[200px] h-[48px] sm:h-[60px] lg:h-[68px] max-h-[68px]"
                      : "w-[135px] sm:w-[165px] lg:w-[215px] h-[48px] sm:h-[60px] lg:h-[72px] max-h-[72px]"
                  }`}
                  aria-label="The Irish Grocer Homepage"
                >
                  <Image
                    src="/assets/logo/irish-grocer-animated.svg"
                    alt="The Irish Grocer"
                    fill
                    priority
                    unoptimized
                    className="object-contain object-left transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* CENTER: Rounded Search Field (Desktop) */}
              <div className="hidden lg:block w-full">
                <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                  <div className="relative w-full flex items-center ios-glass-search rounded-full transition-all focus-within:border-[#14532D] focus-within:ring-2 focus-within:ring-[#14532D]/15 px-3.5 py-1">
                    <Search className="w-4 h-4 text-[#14532D]/60 shrink-0 mr-2" />
                    <input
                      type="text"
                      placeholder="Search products, brands, or essentials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#173B2A] placeholder-[#52665B]/65 focus:outline-none py-1.5"
                      aria-label="Search products"
                    />
                    <button
                      type="submit"
                      className="bg-[#14532D] hover:bg-[#166534] text-white px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs hover:shadow-md shrink-0 ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Action Controls (Store, Account, Cart) */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-4 lg:gap-6 xl:gap-7 text-sm font-medium text-[#173B2A] shrink-0 justify-self-end">
                {/* Store Contact Control */}
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 px-2.5 py-2 rounded-xl transition-all"
                  title="Quincy, MA Store: (857) 387-2065"
                >
                  <Store className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span className="hidden xl:inline">Quincy Store</span>
                </a>

                {/* Customer Account Control */}
                <Link
                  href={isAuthenticated ? "/account" : "/account/login"}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 px-2.5 py-2 rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>{isAuthenticated ? customer?.firstName || "Account" : "Account"}</span>
                </Link>

                {/* Shopping Cart Control */}
                <button
                  onClick={openCart}
                  className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-semibold text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 p-2 sm:px-2.5 sm:py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
                  aria-label="Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-[#14532D] shrink-0" />
                    {cart.totalQuantity > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-[#22C55E] text-[#14532D] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                        {cart.totalQuantity}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Cart</span>
                </button>

                {/* Mobile Search Toggle Icon */}
                <button
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className="lg:hidden p-2 text-[#14532D] hover:bg-[#14532D]/5 rounded-xl transition-colors focus:outline-none"
                  aria-label="Toggle search field"
                >
                  {isMobileSearchOpen ? (
                    <X className="w-5 h-5 text-[#14532D]" />
                  ) : (
                    <Search className="w-5 h-5 text-[#14532D]" />
                  )}
                </button>

                {/* Mobile Menu Hamburger */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 rounded-xl transition-colors focus:outline-none"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5 text-[#14532D]" />
                </button>
              </div>
            </div>

            {/* Mobile Search Bar Drawer */}
            {isMobileSearchOpen && (
              <div className="lg:hidden pt-2.5 mt-2.5 border-t border-[#14532D]/10 animate-in fade-in duration-200">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1 flex items-center bg-white/95 rounded-full border border-[#14532D]/20 px-3.5 py-1 shadow-xs">
                    <Search className="w-4 h-4 text-[#14532D]/60 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products or brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#173B2A] focus:outline-none py-1.5"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#14532D] hover:bg-[#166534] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xs shrink-0"
                  >
                    Search
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* SUBTLE DIVIDER LINE BETWEEN MAIN NAV AND CATEGORY NAV         */}
        {/* ------------------------------------------------------------ */}
        <div className="h-[1px] w-full bg-[#14532D]/[0.08]" />

        {/* ------------------------------------------------------------ */}
        {/* ROW 2: CATEGORY NAVIGATION ROW (#ECF8E4 Light Mint-Green)    */}
        {/* ------------------------------------------------------------ */}
        <div className="w-full py-1.5 bg-[#ECF8E4]/95 backdrop-blur-md hidden md:block">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
            <nav
              className="w-full flex items-center justify-between overflow-x-auto no-scrollbar text-xs lg:text-[12px] xl:text-[13px] 2xl:text-[13.5px] font-medium tracking-tight"
              aria-label="Aisle categories"
            >
              {CATEGORY_NAVIGATION_LINKS.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-1 sm:px-1.5 xl:px-2 py-1 rounded-[8px] transition-all whitespace-nowrap text-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
                      active
                        ? "bg-[#14532D]/15 text-[#14532D] font-bold shadow-2xs"
                        : "text-[#173B2A]/90 hover:text-[#14532D] hover:bg-[#14532D]/8 font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Slide-Out Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
