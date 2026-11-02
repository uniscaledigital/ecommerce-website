import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Money } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(money: Money | { amount: string | number; currencyCode?: string }): string {
  const amount = typeof money.amount === "string" ? parseFloat(money.amount) : money.amount;
  const currency = money.currencyCode || "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

