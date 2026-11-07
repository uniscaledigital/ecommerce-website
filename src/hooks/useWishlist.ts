"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const WISHLIST_STORAGE_KEY = "irish_grocer_wishlist";

function parseAndSanitizeWishlist(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(
        parsed.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
      )
    );
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const wishlistRef = useRef<string[]>([]);

  // Keep ref synchronized with current state
  useEffect(() => {
    wishlistRef.current = wishlist;
  }, [wishlist]);

  // Load initial wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const sanitized = parseAndSanitizeWishlist(stored);
      setWishlist(sanitized);
      wishlistRef.current = sanitized;
      setIsLoaded(true);
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
      setIsLoaded(true);
    }

    const handleCustomEvent = () => {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        const sanitized = parseAndSanitizeWishlist(stored);
        setWishlist(sanitized);
        wishlistRef.current = sanitized;
      } catch {}
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        if (e.newValue) {
          const sanitized = parseAndSanitizeWishlist(e.newValue);
          setWishlist(sanitized);
          wishlistRef.current = sanitized;
        } else {
          setWishlist([]);
          wishlistRef.current = [];
        }
      }
    };

    window.addEventListener("wishlist-updated", handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("wishlist-updated", handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    if (!productId || typeof productId !== "string") return;
    const cleanId = productId.trim();
    if (!cleanId) return;

    const prev = wishlistRef.current;
    const exists = prev.includes(cleanId);
    const next = exists
      ? prev.filter((id) => id !== cleanId)
      : Array.from(new Set([...prev, cleanId]));

    wishlistRef.current = next;
    setWishlist(next);

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch {}
  }, []);

  const clearWishlist = useCallback(() => {
    wishlistRef.current = [];
    setWishlist([]);

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch {}
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
    isLoaded,
  };
}
