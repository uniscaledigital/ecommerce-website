"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  customer: Customer | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isDemoMode: boolean;
}

const DEMO_CUSTOMER: Customer = {
  id: "cust-demo-101",
  firstName: "Patrick",
  lastName: "O'Connor",
  displayName: "Patrick O'Connor",
  email: "patrick.oconnor@example.com",
  phone: "+1 (857) 555-0199",
  defaultAddress: {
    address1: "45 Hancock Street, Apt 3B",
    city: "Quincy",
    province: "MA",
    zip: "02169",
    country: "United States",
  },
  orders: [
    {
      id: "order-1001",
      orderNumber: "#IG-1001",
      processedAt: "2026-10-18T14:32:00Z",
      financialStatus: "PAID",
      fulfillmentStatus: "FULFILLED",
      totalPrice: { amount: "48.75", currencyCode: "USD" },
      lineItems: [
        { title: "Tayto Cheese & Onion 35G (x6)", quantity: 6, price: { amount: "14.94", currencyCode: "USD" } },
        { title: "Barry's Gold Blend Tea 80 Count", quantity: 2, price: { amount: "18.98", currencyCode: "USD" } },
        { title: "Cadbury Dairy Milk", quantity: 4, price: { amount: "15.16", currencyCode: "USD" } },
      ],
    },
    {
      id: "order-1002",
      orderNumber: "#IG-1002",
      processedAt: "2026-11-01T09:15:00Z",
      financialStatus: "PAID",
      fulfillmentStatus: "PROCESSING",
      totalPrice: { amount: "79.99", currencyCode: "USD" },
      lineItems: [
        { title: "Buy 10, Get 1 Free - Cadbury Medium Santa Selection Box 125g", quantity: 1, price: { amount: "79.99", currencyCode: "USD" } },
      ],
    },
  ],
};

const IS_DEMO_MODE = process.env.NEXT_PUBLIC_COMMERCE_MODE !== "production";

function isValidCustomer(val: unknown): val is Customer {
  return (
    typeof val === "object" &&
    val !== null &&
    typeof (val as Customer).id === "string" &&
    typeof (val as Customer).email === "string" &&
    typeof (val as Customer).firstName === "string"
  );
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  customer: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
  isDemoMode: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDemoMode = IS_DEMO_MODE;

  useEffect(() => {
    try {
      if (IS_DEMO_MODE) {
        const stored = localStorage.getItem("irish_grocer_auth");
        if (stored === "true") {
          const storedCustomer = localStorage.getItem("irish_grocer_customer");
          if (storedCustomer) {
            try {
              const parsed = JSON.parse(storedCustomer);
              if (isValidCustomer(parsed)) {
                setCustomer(parsed);
                setIsAuthenticated(true);
              } else {
                setCustomer(DEMO_CUSTOMER);
                setIsAuthenticated(true);
              }
            } catch {
              setCustomer(DEMO_CUSTOMER);
              setIsAuthenticated(true);
            }
          } else {
            setCustomer(DEMO_CUSTOMER);
            setIsAuthenticated(true);
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    if (!isDemoMode) {
      // In production mode, customer authentication requires Shopify Customer Account API (OAuth PKCE)
      console.warn("Direct passwordless login is disabled in production. Use Shopify Customer Account API OAuth.");
      return false;
    }

    setIsLoading(true);
    // Simulate slight network delay
    await new Promise((res) => setTimeout(res, 400));
    const cust = { ...DEMO_CUSTOMER, email: email || DEMO_CUSTOMER.email };
    setIsAuthenticated(true);
    setCustomer(cust);
    try {
      localStorage.setItem("irish_grocer_auth", "true");
      localStorage.setItem("irish_grocer_customer", JSON.stringify(cust));
    } catch {
      // ignore
    }
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCustomer(null);
    try {
      localStorage.removeItem("irish_grocer_auth");
      localStorage.removeItem("irish_grocer_customer");
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        customer,
        login,
        logout,
        isLoading,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

