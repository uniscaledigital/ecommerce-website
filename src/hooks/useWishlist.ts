"use client";

import { useState, useEffect, useCallback } from "react";

const WISHLIST_STORAGE_KEY = "irish_grocer_wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load initial wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }

    const handleCustomEvent = () => {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          setWishlist(JSON.parse(stored));
        } else {
          setWishlist([]);
        }
      } catch {}
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
        try {
          setWishlist(JSON.parse(e.newValue));
        } catch {}
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
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("wishlist-updated"));
      } catch {}

      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return { wishlist, toggleWishlist, isWishlisted };
}

