"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Store, User, ShoppingBag, Menu, MapPin, X } from "lucide-react";
import { SITE_CONFIG, CATEGORY_NAVIGATION_LINKS } from "@/lib/config/site";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MobileDrawer } from "./MobileDrawer";

function HeaderSearchSync({ setSearchQuery }: { setSearchQuery: (q: string) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/search") {
      setSearchQuery(searchParams.get("q") || "");
    }
  }, [pathname, searchParams, setSearchQuery]);

  return null;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleHash = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#menu") {
        setIsMobileMenuOpen(true);
      } else if (window.location.hash === "#order-confidence" && window.innerWidth < 768) {
        document.getElementById("order-confidence-mobile")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  const isHomepage = pathname === "/";
  const isAccountRoute = pathname.startsWith("/account");
  const isShopOrCollectionRoute = pathname === "/shop" || pathname.startsWith("/collections");

  return (
    <header
      className={`site-header ${
        isAccountRoute
          ? "account-header hidden lg:block"
          : isHomepage
          ? "home-header relative lg:sticky"
          : "sticky"
      } z-[1000] transition-all duration-200 ${
        isScrolled ? "is-scrolled" : ""
      }`}
    >
      <Suspense fallback={null}>
        <HeaderSearchSync setSearchQuery={setSearchQuery} />
      </Suspense>
      {/* ============================================================== */}
      {/* FLOATING ROUNDED STICKY NAVIGATION (Two Connected Rows)        */}
      {/* Unified container with 34px rounded corners and soft shadow    */}
      {/* ============================================================== */}
      <div className="w-full relative">
        {/* Subtle Top Glass Specular Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-[34px]" />

        {/* ------------------------------------------------------------ */}
        {/* ROW 1: MAIN NAVIGATION BAR                                    */}
        {/* Logo (left) | Search (center) | Store, Account, Cart (right)  */}
        {/* ------------------------------------------------------------ */}
        <div className="header-main w-full">
          <div className="w-full px-3 sm:px-6 lg:px-7 xl:px-8 py-1.5 sm:py-2.5 lg:py-3">
            {/* ======================================================== */}
            {/* DESKTOP ROW 1 (Screen width >= 1024px / lg)             */}
            {/* ======================================================== */}
            <div className="hidden lg:grid lg:grid-cols-[200px_minmax(340px,580px)_auto] items-center justify-between gap-5 xl:gap-7">
              {/* LEFT: Official Irish Grocer Animated SVG Logo */}
              <div className="flex items-center shrink-0 w-[190px] xl:w-[205px]">
                <Link
                  href="/"
                  className="relative shrink-0 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] rounded-xl overflow-hidden w-[185px] xl:w-[200px] h-[56px] lg:h-[60px]"
                  aria-label="The Irish Grocer Homepage"
                >
                  <Image
                    src="/assets/logo/irish-grocer-animated.svg"
                    alt="The Irish Grocer"
                    fill
                    priority
                    unoptimized
                    className="object-contain object-left transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                </Link>
              </div>

              {/* CENTER: Rounded Search Capsule (Desktop) */}
              <div className="w-full max-w-[540px] xl:max-w-[600px] mx-auto">
                <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                  <div className="relative w-full flex items-center bg-white rounded-full border border-[#14532D]/18 shadow-[0_1px_3px_rgba(20,83,45,0.06)] transition-all focus-within:border-[#14532D] focus-within:ring-2 focus-within:ring-[#14532D]/15 px-4 py-1">
                    <Search className="w-4 h-4 text-[#14532D]/60 shrink-0 mr-2.5" />
                    <input
                      type="text"
                      placeholder="Search products, brands, or essentials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-[13px] xl:text-sm text-[#173B2A] placeholder-[#52665B]/65 focus:outline-none py-1.5"
                      aria-label="Search products"
                    />
                    <button
                      type="submit"
                      className="bg-[#14532D] hover:bg-[#166534] text-white px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs shrink-0 ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Action Controls (Store, Account, Cart) */}
              <div className="flex items-center justify-end gap-3.5 lg:gap-4 xl:gap-5 text-sm font-semibold text-[#14532D] shrink-0 justify-self-end">
                {/* Subtle vertical separator before store */}
                <div className="hidden lg:block h-5 w-[1px] bg-[#14532D]/15 shrink-0 mr-0.5" />

                {/* Store Contact Control */}
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs xl:text-[13px] font-semibold text-[#14532D] hover:text-[#064E3B] hover:bg-[#14532D]/6 px-2.5 py-1.5 rounded-xl transition-all"
                  title="Quincy, MA Store: (857) 387-2065"
                >
                  <Store className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span className="hidden xl:inline">Quincy Store</span>
                </a>

                {/* Customer Account Control (Patrick / Account) */}
                <Link
                  href={isAuthenticated ? "/account" : "/account/login"}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs xl:text-[13px] font-semibold text-[#14532D] hover:text-[#064E3B] hover:bg-[#14532D]/6 px-2.5 py-1.5 rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>{customer?.firstName || (isAuthenticated ? "Account" : "Sign in")}</span>
                </Link>

                {/* Shopping Cart Control */}
                <button
                  onClick={openCart}
                  className="inline-flex items-center gap-1.5 text-xs xl:text-[13px] font-semibold text-[#14532D] hover:text-[#064E3B] hover:bg-[#14532D]/6 px-2.5 py-1.5 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
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
                  <span>Cart</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* MOBILE & TABLET ROW 1 (< 1024px / lg)                   */}
            {/* TOP ROW: Logo & Storefront Info | Account | Cart | Menu   */}
            {/* SECOND ROW: Compact Full-Width Search Capsule            */}
            {/* ======================================================== */}
            <div className="lg:hidden flex flex-col gap-1.5">
              {/* TOP ROW: Logo + Quincy Delivery Pill (Left) | Controls (Right) */}
              <div className="flex items-center justify-between gap-1.5">
                {/* Left: Irish Grocer Animated SVG Logo + Quincy Store Location */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <Link
                    href="/"
                    className="relative shrink-0 flex items-center w-[128px] sm:w-[150px] h-[34px] sm:h-[38px] focus:outline-none"
                    aria-label="The Irish Grocer Homepage"
                  >
                    <Image
                      src="/assets/logo/irish-grocer-animated.svg"
                      alt="The Irish Grocer"
                      fill
                      priority
                      unoptimized
                      className="object-contain object-left"
                    />
                  </Link>
                  <div className="hidden xs:flex items-center gap-1 text-[10px] text-[#42634A] font-semibold tracking-tight border-l border-[#14532D]/15 pl-1.5 py-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5 text-[#14532D] shrink-0" />
                    <span className="truncate">Quincy, MA</span>
                  </div>
                </div>

                {/* Right: Compact Account, Cart & Menu Controls (>= 44x44px touch targets) */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {/* Account Link */}
                  <Link
                    href={isAuthenticated ? "/account" : "/account/login"}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#14532D] hover:bg-[#14532D]/8 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
                    aria-label={isAuthenticated ? "Account" : "Sign in"}
                  >
                    <User className="w-4 h-4 text-[#14532D]" />
                  </Link>

                  {/* Cart Button */}
                  <button
                    onClick={openCart}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#14532D] hover:bg-[#14532D]/8 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] relative"
                    aria-label={`Shopping cart with ${cart.totalQuantity} items`}
                  >
                    <div className="relative">
                      <ShoppingBag className="w-4 h-4 text-[#14532D]" />
                      {cart.totalQuantity > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-[#22C55E] text-[#14532D] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                          {cart.totalQuantity}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Accessible Hamburger Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#14532D] hover:bg-[#14532D]/8 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="w-5 h-5 text-[#14532D]" />
                  </button>
                </div>
              </div>

              {/* SECOND ROW: Compact Full-Width Search Capsule (Hidden on Shop and Collections where dedicated toolbar is present) */}
              {!isShopOrCollectionRoute && (
                <div className="w-full">
                  <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                    <div className="relative w-full flex items-center bg-white rounded-full border border-[#14532D]/18 shadow-2xs px-3 py-1 focus-within:border-[#14532D] focus-within:ring-2 focus-within:ring-[#14532D]/15 transition-all">
                      <Search className="w-3.5 h-3.5 text-[#14532D]/60 shrink-0 mr-2" />
                      <input
                        type="text"
                        placeholder="Search imported teas, crisps, sweets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-xs text-[#173B2A] placeholder-[#52665B]/65 focus:outline-none py-0.5"
                        aria-label="Search products"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="p-1 text-[#42634A] hover:text-[#14532D] rounded-full mr-1"
                          aria-label="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-[#14532D] hover:bg-[#064E3B] text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all shadow-xs shrink-0"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* ROW 2: CATEGORY NAVIGATION ROW                               */}
        {/* Connected inside the same rounded outer container            */}
        {/* ------------------------------------------------------------ */}
        <div className="header-categories w-full px-5 sm:px-7 lg:px-8 xl:px-10 py-2 hidden md:block">
          <nav
            className="w-full flex items-center justify-between text-xs lg:text-[12.5px] xl:text-[13px] 2xl:text-[13.5px] font-semibold tracking-tight"
            aria-label="Aisle categories"
          >
            {CATEGORY_NAVIGATION_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-1.5 xl:px-2.5 py-1 rounded-[8px] transition-all whitespace-nowrap text-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
                    active
                      ? "bg-[#14532D]/14 text-[#14532D] font-bold"
                      : "text-[#14532D]/90 hover:text-[#064E3B] hover:bg-[#14532D]/6"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
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
