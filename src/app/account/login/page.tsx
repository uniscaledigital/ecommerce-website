"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [newsConsent, setNewsConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to account dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/account");
    }
  }, [isAuthenticated, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    await login(email);
    setIsLoading(false);
    router.push("/account");
  };

  const handleShopPayLogin = async () => {
    setIsLoading(true);
    await login("patrick.oconnor@example.com");
    setIsLoading(false);
    router.push("/account");
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Center: Brand Title matching PDF Page 8 */}
      <div className="text-center pt-4">
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-black tracking-tight">
          The Irish Grocer
        </h1>
      </div>

      {/* Center Auth Card matching PDF Page 8 & 9 */}
      <div className="max-w-md w-full mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-irishBorder space-y-6 my-auto">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black tracking-tight font-heading">
            Sign in
          </h2>
          <p className="text-xs text-neutral-500">
            Sign in or create an account
          </p>
        </div>

        {/* Shop Pay Button (#5A31F4) */}
        <div>
          <button
            type="button"
            onClick={handleShopPayLogin}
            disabled={isLoading}
            className="w-full bg-[#5A31F4] hover:bg-[#4A24DB] text-white py-3.5 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Continue with</span>
            <span className="font-bold tracking-tight text-base italic ml-0.5">shop</span>
          </button>
        </div>

        {/* Divider: line or line */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-xs text-neutral-400 font-medium">
            or
          </span>
          <div className="border-t border-neutral-200 w-full" />
        </div>

        {/* Email Input Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm text-black border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black placeholder:text-neutral-400 pr-12"
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-600 hover:text-black disabled:opacity-40 transition-colors"
              aria-label="Submit email"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Checkbox: Email me with news and offers */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 select-none">
            <input
              type="checkbox"
              checked={newsConsent}
              onChange={(e) => setNewsConsent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300"
            />
            <span>Email me with news and offers</span>
          </label>
        </form>
      </div>

      {/* Bottom Center Link matching PDF Page 8 */}
      <div className="text-center pb-4">
        <Link
          href="/privacy"
          className="text-xs text-blue-600 hover:underline"
        >
          Privacy policy
        </Link>
      </div>
    </div>
  );
}

