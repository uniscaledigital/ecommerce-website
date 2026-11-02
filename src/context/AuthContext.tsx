"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  customer: Customer | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  customer: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("irish_grocer_auth");
      if (stored === "true") {
        setIsAuthenticated(true);
        setCustomer(DEMO_CUSTOMER);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

