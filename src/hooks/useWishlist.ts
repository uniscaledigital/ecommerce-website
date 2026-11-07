"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const WISHLIST_STORAGE_KEY = "irish_grocer_wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const wishlistRef = useRef<string[]>([]);

  // Keep ref synchronized with current state
  useEffect(() => {
    wishlistRef.current = wishlist;
  }, [wishlist]);

  // Load initial wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlist(parsed);
        wishlistRef.current = parsed;
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }

    const handleCustomEvent = () => {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlist(parsed);
          wishlistRef.current = parsed;
        } else {
          setWishlist([]);
          wishlistRef.current = [];
        }
      } catch {}
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setWishlist(parsed);
            wishlistRef.current = parsed;
          } catch {}
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
    const prev = wishlistRef.current;
    const exists = prev.includes(productId);
    const next = exists
      ? prev.filter((id) => id !== productId)
      : [...prev, productId];

    wishlistRef.current = next;
    setWishlist(next);

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch {}
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return { wishlist, toggleWishlist, isWishlisted };
}

