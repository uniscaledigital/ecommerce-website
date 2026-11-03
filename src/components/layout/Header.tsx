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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-4 xl:px-6 pt-2 sm:pt-2.5 pb-2">
        {/* ============================================================== */}
        {/* UNIFIED GLASS NAVIGATION SYSTEM (Two Connected Rows)          */}
        {/* ============================================================== */}
        <div
          className={`ios-glass-nav rounded-[24px] transition-all duration-300 relative overflow-hidden ${
            isScrolled
              ? "shadow-[0_12px_32px_rgba(20,83,45,0.14)]"
              : "shadow-[0_8px_28px_rgba(20,83,45,0.10)]"
          }`}
        >
          {/* Subtle Top Glass Specular Reflection Highlight */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />

          {/* ------------------------------------------------------------ */}
          {/* ROW 1: MAIN NAVIGATION BAR (Logo, Search, Action Controls)    */}
          {/* ------------------------------------------------------------ */}
          <div className="px-4 sm:px-6 py-2 sm:py-2.5">
            <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
              {/* LEFT: Official Irish Grocer Animated SVG Logo & Vertical Separator */}
              <div className="flex items-center shrink-0 w-auto lg:w-[240px]">
                <Link
                  href="/"
                  className={`relative shrink-0 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] rounded-xl overflow-hidden transition-all duration-300 ${
                    isScrolled
                      ? "w-[145px] sm:w-[165px] lg:w-[210px] h-[52px] sm:h-[60px] lg:h-[70px] max-h-[70px]"
                      : "w-[145px] sm:w-[165px] lg:w-[225px] h-[52px] sm:h-[60px] lg:h-[75px] max-h-[75px]"
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
                <span className="hidden xl:block w-[1px] h-6 bg-[#14532D]/15 ml-4 mr-1" />
              </div>

              {/* CENTER: Rounded Search Field (Desktop) */}
              <div className="hidden lg:block flex-1 max-w-xl mx-auto">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <div className="relative flex-1 flex items-center ios-glass-search rounded-full transition-all focus-within:border-[#14532D] focus-within:ring-2 focus-within:ring-[#14532D]/15 px-3.5 py-1">
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
              <div className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium text-[#173B2A] shrink-0">
                {/* Store Contact Control */}
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 px-3 py-2 rounded-xl transition-all"
                  title="Quincy, MA Store: (857) 387-2065"
                >
                  <Store className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span className="hidden xl:inline">Quincy Store</span>
                </a>

                {/* Customer Account Control */}
                <Link
                  href={isAuthenticated ? "/account" : "/account/login"}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 px-3 py-2 rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>{isAuthenticated ? customer?.firstName || "Account" : "Account"}</span>
                </Link>

                {/* Shopping Cart Control */}
                <button
                  onClick={openCart}
                  className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/5 px-3 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
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

          {/* ------------------------------------------------------------ */}
          {/* SUBTLE DIVIDER LINE BETWEEN MAIN NAV AND CATEGORY NAV         */}
          {/* ------------------------------------------------------------ */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#14532D]/10 to-transparent" />

          {/* ------------------------------------------------------------ */}
          {/* ROW 2: CATEGORY NAVIGATION ROW (All 9 Categories Visible)    */}
          {/* ------------------------------------------------------------ */}
          <div className="pl-3 sm:pl-4 lg:pl-5 pr-7 sm:pr-8 lg:pr-9 xl:pr-11 py-1.5 bg-[#14532D]/[0.02]">
            <nav
              className="w-full flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between text-xs sm:text-[12.5px] lg:text-[12px] xl:text-[13px] font-medium"
              aria-label="Aisle categories"
            >
              {CATEGORY_NAVIGATION_LINKS.map((link, idx) => {
                const active = isLinkActive(link.href);
                return (
                  <React.Fragment key={link.label}>
                    {idx > 0 && (
                      <span className="hidden xl:inline-block w-[1px] h-3 bg-[#14532D]/12 mx-0.5 select-none shrink-0" />
                    )}
                    <Link
                      href={link.href}
                      className={`px-2 sm:px-2 lg:px-1.5 xl:px-2.5 py-1 rounded-[12px] transition-all whitespace-nowrap text-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
                        active
                          ? "bg-[#22C55E]/20 text-[#14532D] font-bold shadow-2xs"
                          : "text-[#173B2A]/85 hover:text-[#14532D] hover:bg-[#14532D]/6 font-medium"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </React.Fragment>
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
