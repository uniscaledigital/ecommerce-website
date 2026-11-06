"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X, Phone, User, ShoppingBag, MapPin, Clock, ArrowRight, Store } from "lucide-react";
import { CATEGORY_NAVIGATION_LINKS, SITE_CONFIG } from "@/lib/config/site";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { isAuthenticated, customer } = useAuth();
  const { cart, openCart } = useCart();
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial focus management & focus restoration
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
    return () => {
      triggerElementRef.current?.focus();
    };
  }, [isOpen]);

  // Prevent background scrolling while the drawer is open & handle Escape key / breakpoint changes
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      const handleBreakpoint = (e: MediaQueryListEvent) => {
        if (e.matches) {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      mediaQuery.addEventListener("change", handleBreakpoint);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        mediaQuery.removeEventListener("change", handleBreakpoint);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1200] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop with fade-in transition */}
      <div
        className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel with slide-in transition */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FFFAF1] shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-[#E8DFCF] animate-in slide-in-from-left duration-250">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#E8DFCF] flex items-center justify-between bg-[#ECF4E4]">
            <Link
              href="/"
              onClick={onClose}
              className="block relative w-[160px] h-[54px] focus:outline-none focus:ring-2 focus:ring-[#14532D] rounded-lg"
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
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center text-[#173B2A] hover:text-[#14532D] hover:bg-[#14532D]/10 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Status Strip */}
          <div className="bg-[#E8F5E9] px-4 py-3.5 border-b border-[#E8DFCF] flex items-center justify-between text-sm">
            {isAuthenticated ? (
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-2 hover:underline min-h-[38px]"
              >
                <div className="w-7 h-7 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs">
                  {customer?.firstName ? customer.firstName[0] : "C"}
                </div>
                <span className="font-semibold text-[#14532D] text-xs sm:text-sm truncate max-w-[130px]">
                  Hi, {customer?.firstName || "Customer"}
                </span>
              </Link>
            ) : (
              <Link
                href="/account/login"
                onClick={onClose}
                className="text-[#14532D] font-semibold hover:underline inline-flex items-center gap-2 text-xs py-1 min-h-[38px]"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Sign in to account</span>
              </Link>
            )}

            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="relative min-h-[44px] px-2.5 py-1 text-[#14532D] hover:bg-[#14532D]/10 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Cart ({cart.totalQuantity})</span>
            </button>
          </div>

          {/* Quincy Store Quick Navigation */}
          <div className="px-4 py-2.5 bg-[#F7EBD8]/60 border-b border-[#E8DFCF]">
            <Link
              href="/#store-info"
              onClick={onClose}
              className="flex items-center justify-between text-xs font-bold text-[#14532D] hover:underline py-1.5"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#14532D]" />
                <span>Visit Our Quincy Store</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
            </Link>
          </div>

          {/* Navigation Links — All 9 Core Categories */}
          <div className="py-3">
            <p className="px-4 py-1.5 text-[11px] font-bold text-[#14532D] uppercase tracking-wider">
              Departments &amp; Aisles
            </p>
            <nav className="divide-y divide-[#E8DFCF]/50" aria-label="Mobile Navigation Aisles">
              {CATEGORY_NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 text-sm text-[#1F2937] hover:bg-[#E8F5E9] hover:text-[#14532D] font-medium transition-colors min-h-[44px]"
                >
                  <span>{link.label}</span>
                  <span className="text-[#22C55E] text-xs">→</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Store Info Footer */}
        <div className="p-4 bg-[#F7EBD8] border-t border-[#E8DFCF] space-y-3 text-xs text-[#1F2937]/85">
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-2.5 text-[#14532D] font-bold text-sm hover:underline min-h-[44px]"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#22C55E]/30 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-[#14532D]" />
            </div>
            <div>
              <span className="text-[10px] text-[#42634A] block leading-none font-semibold">
                Direct Telephone
              </span>
              <span className="text-sm font-bold text-[#14532D]">
                {SITE_CONFIG.phone}
              </span>
            </div>
          </a>

          <div className="flex items-start gap-2 pt-1 border-t border-[#E8DFCF]/60">
            <MapPin className="w-3.5 h-3.5 text-[#14532D] shrink-0 mt-0.5" />
            <span>{SITE_CONFIG.address.full}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
            <span>{SITE_CONFIG.hours}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
