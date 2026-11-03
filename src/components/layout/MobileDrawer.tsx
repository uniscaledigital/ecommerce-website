"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Phone, User, ShoppingBag, MapPin, Clock } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FFFAF1] shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-[#E8DFCF]">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#E8DFCF] flex items-center justify-between bg-[#FFFAF1]">
            <Link href="/" onClick={onClose} className="block relative w-[160px] h-[58px]">
              <Image
                src="/assets/logo/irish-grocer-animated.svg"
                alt="The Irish Grocer"
                fill
                unoptimized
                className="object-contain object-left"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-[#1F2937] hover:text-[#14532D] rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Status Strip */}
          <div className="bg-[#E8F5E9] px-4 py-3 border-b border-[#E8DFCF] flex items-center justify-between text-sm">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#14532D]" />
                <span className="font-semibold text-[#14532D]">
                  Hi, {customer?.firstName || "Customer"}
                </span>
              </div>
            ) : (
              <Link
                href="/account/login"
                onClick={onClose}
                className="text-[#14532D] font-semibold hover:underline inline-flex items-center gap-2 text-xs"
              >
                <User className="w-4 h-4" />
                Sign in to your account
              </Link>
            )}
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="relative p-1 text-[#14532D] flex items-center gap-1.5 font-semibold text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cart.totalQuantity})</span>
            </button>
          </div>

          {/* Navigation links */}
          <div className="py-3">
            <p className="px-4 py-1.5 text-[11px] font-bold text-[#1F2937]/60 uppercase tracking-wider">
              Departments & Aisles
            </p>
            <nav className="divide-y divide-[#E8DFCF]/50">
              {CATEGORY_NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm text-[#1F2937] hover:bg-[#E8F5E9] hover:text-[#14532D] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Store Info Footer */}
        <div className="p-4 bg-[#F7EBD8] border-t border-[#E8DFCF] space-y-3 text-xs text-[#1F2937]/80">
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-2.5 text-[#14532D] font-bold text-sm hover:underline"
          >
            <Phone className="w-4 h-4 text-[#14532D]" />
            Call: {SITE_CONFIG.phone}
          </a>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#14532D] shrink-0 mt-0.5" />
            <span>{SITE_CONFIG.address.full}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
            <span>{SITE_CONFIG.hours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


