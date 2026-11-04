"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Cart, CartLineItem, Product } from "@/types";

interface CartContextType {
  cart: Cart;
  isCartOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  checkout: () => void;
  isEnquiryOpen: boolean;
  openEnquiry: () => void;
  closeEnquiry: () => void;
  isDemoCheckoutOpen: boolean;
  openDemoCheckout: () => void;
  closeDemoCheckout: () => void;
}

const INITIAL_CART: Cart = {
  id: "cart-initial",
  checkoutUrl: "",
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: "0.00", currencyCode: "USD" },
    totalAmount: { amount: "0.00", currencyCode: "USD" },
  },
};

const CartContext = createContext<CartContextType>({
  cart: INITIAL_CART,
  isCartOpen: false,
  isLoading: false,
  error: null,
  openCart: () => {},
  closeCart: () => {},
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: () => {},
  checkout: () => {},
  isEnquiryOpen: false,
  openEnquiry: () => {},
  closeEnquiry: () => {},
  isDemoCheckoutOpen: false,
  openDemoCheckout: () => {},
  closeDemoCheckout: () => {},
});

const IS_PRODUCTION = process.env.NEXT_PUBLIC_COMMERCE_MODE === "production";
const CART_STORAGE_KEY = "irish_grocer_cart";
const CART_ID_STORAGE_KEY = "irish_grocer_cart_id";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isDemoCheckoutOpen, setIsDemoCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Queue to serialize production Storefront Cart mutations
  const syncQueueRef = useRef<Promise<void>>(Promise.resolve());
  const enqueue = useCallback((task: () => Promise<void>) => {
    const next = syncQueueRef.current.catch(() => {}).then(task);
    syncQueueRef.current = next.catch((err) => {
      console.warn("Cart sync task failed:", err);
    });
    return syncQueueRef.current;
  }, []);
  const cartRef = useRef<Cart>(INITIAL_CART);
  const pendingRef = useRef<number>(0);

  const saveCartToStorage = useCallback((newCart: Cart) => {
    cartRef.current = newCart;
    setCart(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      if (newCart.id && !newCart.id.startsWith("cart-initial") && !newCart.id.startsWith("demo-")) {
        localStorage.setItem(CART_ID_STORAGE_KEY, newCart.id);
      }
    } catch {
      // Ignore localStorage quotas or private browsing errors
    }
  }, []);

  const resyncFromServer = useCallback(async (cartId: string | null) => {
    if (!cartId) return;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", cartId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cart) {
          saveCartToStorage(data.cart);
        }
      }
    } catch {
      // keep current state
    }
  }, [saveCartToStorage]);

  // Restore cart on mount
  useEffect(() => {
    async function restoreCart() {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const parsed = JSON.parse(storedCart) as Cart;
          cartRef.current = parsed;
          setCart(parsed);
        }

        // If in production mode and we have a persisted Shopify cart ID, synchronize with Shopify
        let storedCartId: string | null = null;
        try {
          storedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
        } catch {}

        if (IS_PRODUCTION && storedCartId) {
          pendingRef.current += 1;
          setIsLoading(true);
          await enqueue(async () => {
            try {
              const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "get", cartId: storedCartId }),
              });
              if (res.ok) {
                const data = await res.json();
                if (data.cart) {
                  saveCartToStorage(data.cart);
                }
              } else {
                // Cart might have expired or been deleted in Shopify
                if (res.status === 404) {
                  try {
                    localStorage.removeItem(CART_ID_STORAGE_KEY);
                    localStorage.removeItem(CART_STORAGE_KEY);
                  } catch {}
                  cartRef.current = INITIAL_CART;
                  setCart(INITIAL_CART);
                }
                const errData = await res.json().catch(() => ({}));
                setError(errData.error || "Unable to restore previous Shopify cart");
              }
            } catch {
              // Retain local cart if network sync fails
            } finally {
              pendingRef.current = Math.max(0, pendingRef.current - 1);
              if (pendingRef.current === 0) {
                setIsLoading(false);
              }
            }
          });
        }
      } catch {
        // Fall back to INITIAL_CART
      }
    }

    restoreCart();

    if (typeof window !== "undefined") {
      if (window.location.hash === "#cart") {
        setIsCartOpen(true);
      } else if (window.location.hash === "#enquiry") {
        setIsEnquiryOpen(true);
      } else if (window.location.hash === "#demo-checkout") {
        setIsDemoCheckoutOpen(true);
      }
    }
  }, [saveCartToStorage, enqueue]);

  const calculateCost = (lines: CartLineItem[]) => {
    const total = lines.reduce((acc, line) => {
      const price = parseFloat(line.merchandise.price.amount);
      return acc + price * line.quantity;
    }, 0);
    const amountStr = total.toFixed(2);
    return {
      subtotalAmount: { amount: amountStr, currencyCode: "USD" },
      totalAmount: { amount: amountStr, currencyCode: "USD" },
    };
  };

  const addItem = async (product: Product, variantId?: string, quantity = 1) => {
    setError(null);

    const variant = variantId
      ? product.variants?.find((v) => v.id === variantId) || product.variants?.[0]
      : product.variants?.[0];

    if (!variant) {
      console.warn("Cannot add item: product has no available variants.");
      return;
    }

    pendingRef.current += 1;
    setIsLoading(true);

    try {
      // Optimistic / Local update first
      const currentLines = [...cartRef.current.lines];
      const existingIndex = currentLines.findIndex(
        (line) => line.merchandise.id === variant.id
      );

      if (existingIndex > -1) {
        currentLines[existingIndex] = {
          ...currentLines[existingIndex],
          quantity: currentLines[existingIndex].quantity + quantity,
        };
      } else {
        const newLine: CartLineItem = {
          id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          quantity,
          merchandise: {
            id: variant.id,
            title: variant.title,
            sku: variant.sku,
            price: variant.price,
            product: {
              id: product.id,
              title: product.title,
              handle: product.handle,
              featuredImage: product.featuredImage,
              vendor: product.vendor,
            },
          },
        };
        currentLines.push(newLine);
      }

      const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
      const cost = calculateCost(currentLines);

      const updatedCart: Cart = {
        ...cartRef.current,
        lines: currentLines,
        totalQuantity,
        cost,
      };

      saveCartToStorage(updatedCart);
      setIsCartOpen(true);

      // If production mode, serialize mutation execution via syncQueueRef
      if (IS_PRODUCTION) {
        await enqueue(async () => {
          let storedCartId: string | null = null;
          try {
            storedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
          } catch {}

          try {
            let res: Response;

            if (!storedCartId) {
              // Create new Shopify cart with initial line
              res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "create",
                  lines: [{ merchandiseId: variant.id, quantity }],
                }),
              });
            } else {
              // Add to existing Shopify cart
              res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "add",
                  cartId: storedCartId,
                  lines: [{ merchandiseId: variant.id, quantity }],
                }),
              });
            }

            if (res.ok) {
              const data = await res.json();
              if (data.cart) {
                saveCartToStorage(data.cart);
              }
            } else {
              const errData = await res.json().catch(() => ({}));
              setError(errData.error || "Failed to add item to Shopify cart");
              if (res.status === 404) {
                // Expired or invalid cart ID - purge storage and attempt creating a fresh cart with requested line
                try {
                  localStorage.removeItem(CART_ID_STORAGE_KEY);
                  localStorage.removeItem(CART_STORAGE_KEY);
                } catch {}
                const retry = await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "create",
                    lines: [{ merchandiseId: variant.id, quantity }],
                  }),
                });
                const retryData = retry.ok ? await retry.json().catch(() => null) : null;
                if (retryData?.cart) {
                  setError(null);
                  saveCartToStorage(retryData.cart);
                } else {
                  saveCartToStorage(INITIAL_CART);
                }
                return;
              }
              if (!storedCartId) {
                saveCartToStorage(INITIAL_CART);
              } else {
                await resyncFromServer(storedCartId);
              }
            }
          } catch (err) {
            console.warn("Failed to synchronize cart item with Shopify:", err);
            setError("Network error syncing cart with Shopify.");
            if (!storedCartId) {
              saveCartToStorage(INITIAL_CART);
            } else {
              await resyncFromServer(storedCartId);
            }
          }
        });
      }
    } finally {
      pendingRef.current = Math.max(0, pendingRef.current - 1);
      if (pendingRef.current === 0) {
        setIsLoading(false);
      }
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(lineId);
      return;
    }

    setError(null);
    pendingRef.current += 1;
    setIsLoading(true);

    try {
      const targetLine = cartRef.current.lines.find((l) => l.id === lineId);
      const targetMerchandiseId = targetLine?.merchandise.id;

      const currentLines = cartRef.current.lines.map((l) =>
        l.id === lineId ? { ...l, quantity } : l
      );
      const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
      const cost = calculateCost(currentLines);

      const updatedCart: Cart = {
        ...cartRef.current,
        lines: currentLines,
        totalQuantity,
        cost,
      };

      saveCartToStorage(updatedCart);

      if (IS_PRODUCTION) {
        await enqueue(async () => {
          let effectiveCartId: string | null = null;
          try {
            effectiveCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
          } catch {}
          if (!effectiveCartId) return;

          // Resolve current server line ID dynamically
          const currentLine =
            cartRef.current.lines.find((l) => l.id === lineId) ||
            (targetMerchandiseId
              ? cartRef.current.lines.find((l) => l.merchandise.id === targetMerchandiseId)
              : null);
          const serverLineId = currentLine?.id;

          if (!serverLineId || !serverLineId.startsWith("gid://shopify/CartLine/")) {
            await resyncFromServer(effectiveCartId);
            return;
          }

          try {
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "update",
                cartId: effectiveCartId,
                lines: [{ id: serverLineId, quantity }],
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.cart) {
                saveCartToStorage(data.cart);
              }
            } else {
              const errData = await res.json().catch(() => ({}));
              setError(errData.error || "Failed to update quantity in Shopify");
              if (res.status === 404) {
                try {
                  localStorage.removeItem(CART_ID_STORAGE_KEY);
                  localStorage.removeItem(CART_STORAGE_KEY);
                } catch {}
                saveCartToStorage(INITIAL_CART);
                return;
              }
              await resyncFromServer(effectiveCartId);
            }
          } catch (err) {
            console.warn("Failed to synchronize quantity update with Shopify:", err);
            setError("Network error updating item quantity.");
            await resyncFromServer(effectiveCartId);
          }
        });
      }
    } finally {
      pendingRef.current = Math.max(0, pendingRef.current - 1);
      if (pendingRef.current === 0) {
        setIsLoading(false);
      }
    }
  };

  const removeItem = async (lineId: string) => {
    setError(null);
    pendingRef.current += 1;
    setIsLoading(true);

    try {
      const targetLine = cartRef.current.lines.filter((l) => l.id === lineId)[0];
      const targetMerchandiseId = targetLine?.merchandise.id;

      const currentLines = cartRef.current.lines.filter((l) => l.id !== lineId);
      const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
      const cost = calculateCost(currentLines);

      const updatedCart: Cart = {
        ...cartRef.current,
        lines: currentLines,
        totalQuantity,
        cost,
      };

      saveCartToStorage(updatedCart);

      if (IS_PRODUCTION) {
        await enqueue(async () => {
          let effectiveCartId: string | null = null;
          try {
            effectiveCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
          } catch {}
          if (!effectiveCartId) return;

          // Resolve current server line ID dynamically
          const currentLine =
            cartRef.current.lines.find((l) => l.id === lineId) ||
            (targetMerchandiseId
              ? cartRef.current.lines.find((l) => l.merchandise.id === targetMerchandiseId)
              : null);
          const serverLineId = currentLine?.id || (lineId.startsWith("gid://shopify/CartLine/") ? lineId : null);

          if (!serverLineId) {
            await resyncFromServer(effectiveCartId);
            return;
          }

          try {
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "remove",
                cartId: effectiveCartId,
                lineIds: [serverLineId],
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.cart) {
                saveCartToStorage(data.cart);
              }
            } else {
              const errData = await res.json().catch(() => ({}));
              setError(errData.error || "Failed to remove item from Shopify");
              if (res.status === 404) {
                try {
                  localStorage.removeItem(CART_ID_STORAGE_KEY);
                  localStorage.removeItem(CART_STORAGE_KEY);
                } catch {}
                saveCartToStorage(INITIAL_CART);
                return;
              }
              await resyncFromServer(effectiveCartId);
            }
          } catch (err) {
            console.warn("Failed to synchronize item removal with Shopify:", err);
            setError("Network error removing item from cart.");
            await resyncFromServer(effectiveCartId);
          }
        });
      }
    } finally {
      pendingRef.current = Math.max(0, pendingRef.current - 1);
      if (pendingRef.current === 0) {
        setIsLoading(false);
      }
    }
  };

  const clearCart = () => {
    const doClear = () => {
      saveCartToStorage(INITIAL_CART);
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(CART_ID_STORAGE_KEY);
      } catch {
        // ignore
      }
    };
    doClear();
    if (IS_PRODUCTION) void enqueue(async () => doClear());
  };

  const checkout = () => {
    const url = cartRef.current.checkoutUrl;
    if (!IS_PRODUCTION) {
      setIsDemoCheckoutOpen(true);
      return;
    }
    if (pendingRef.current > 0) {
      setError("Your basket is still syncing. Please try checkout again in a moment.");
      return;
    }
    if (url && url.startsWith("https://")) {
      window.location.href = url;
      return;
    }
    setError("Checkout is temporarily unavailable. Please request confirmation instead.");
    setIsEnquiryOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        error,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
        isEnquiryOpen,
        openEnquiry: () => setIsEnquiryOpen(true),
        closeEnquiry: () => setIsEnquiryOpen(false),
        isDemoCheckoutOpen,
        openDemoCheckout: () => setIsDemoCheckoutOpen(true),
        closeDemoCheckout: () => setIsDemoCheckoutOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
