"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Phone, User, ShoppingBag, MapPin, Clock } from "lucide-react";
import { NAVIGATION_LINKS, SITE_CONFIG } from "@/lib/config/site";
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
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory shadow-xl z-10 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-irishBorder flex items-center justify-between bg-white">
            <Link href="/" onClick={onClose} className="block relative w-36 h-10">
              <Image
                src="/assets/logo/the-irish-grocer-logo.png"
                alt="The Irish Grocer"
                fill
                className="object-contain"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-ink hover:text-commerce rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Status Strip */}
          <div className="bg-ivory-muted px-4 py-3 border-b border-irishBorder flex items-center justify-between text-sm">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-commerce" />
                <span className="font-medium text-commerce">
                  Hi, {customer?.firstName || "Customer"}
                </span>
              </div>
            ) : (
              <Link
                href="/account/login"
                onClick={onClose}
                className="text-commerce font-semibold hover:underline inline-flex items-center gap-2"
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
              className="relative p-1 text-commerce flex items-center gap-1 font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cart.totalQuantity})</span>
            </button>
          </div>

          {/* Navigation links */}
          <div className="py-2">
            <p className="px-4 py-1 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
              Departments & Pages
            </p>
            <nav className="divide-y divide-irishBorder/40">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm text-ink hover:bg-commerce/5 hover:text-commerce font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Store Info Footer */}
        <div className="p-4 bg-white border-t border-irishBorder space-y-3 text-xs text-ink-muted">
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-2.5 text-commerce font-semibold text-sm hover:underline"
          >
            <Phone className="w-4 h-4" />
            Call: {SITE_CONFIG.phone}
          </a>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-commerce shrink-0 mt-0.5" />
            <span>{SITE_CONFIG.address.full}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-commerce shrink-0" />
            <span>{SITE_CONFIG.hours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

