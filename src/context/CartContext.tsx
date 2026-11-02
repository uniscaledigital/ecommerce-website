"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartLineItem, Product } from "@/types";

interface CartContextType {
  cart: Cart;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variantId?: string, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  checkout: () => void;
  isEnquiryOpen: boolean;
  openEnquiry: () => void;
  closeEnquiry: () => void;
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
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  checkout: () => {},
  isEnquiryOpen: false,
  openEnquiry: () => {},
  closeEnquiry: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("irish_grocer_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    try {
      localStorage.setItem("irish_grocer_cart", JSON.stringify(newCart));
    } catch {
      // ignore
    }
  };

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

  const addItem = (product: Product, variantId?: string, quantity = 1) => {
    const variant = variantId
      ? product.variants.find((v) => v.id === variantId) || product.variants[0]
      : product.variants[0];

    const currentLines = [...cart.lines];
    const existingIndex = currentLines.findIndex(
      (line) => line.merchandise.id === variant.id
    );

    if (existingIndex > -1) {
      currentLines[existingIndex].quantity += quantity;
    } else {
      const newLine: CartLineItem = {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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
      ...cart,
      lines: currentLines,
      totalQuantity,
      cost,
    };

    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }

    const currentLines = cart.lines.map((l) =>
      l.id === lineId ? { ...l, quantity } : l
    );
    const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
    const cost = calculateCost(currentLines);

    const updatedCart: Cart = {
      ...cart,
      lines: currentLines,
      totalQuantity,
      cost,
    };

    saveCart(updatedCart);
  };

  const removeItem = (lineId: string) => {
    const currentLines = cart.lines.filter((l) => l.id !== lineId);
    const totalQuantity = currentLines.reduce((acc, l) => acc + l.quantity, 0);
    const cost = calculateCost(currentLines);

    const updatedCart: Cart = {
      ...cart,
      lines: currentLines,
      totalQuantity,
      cost,
    };

    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart(INITIAL_CART);
  };

  const checkout = () => {
    if (cart.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      // In demo mode or order enquiry mode, open order enquiry modal
      setIsEnquiryOpen(true);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

