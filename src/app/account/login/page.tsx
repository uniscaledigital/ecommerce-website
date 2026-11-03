"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [newsConsent, setNewsConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      {/* Top Center: Brand Logo & Title */}
      <div className="text-center pt-4">
        <Link href="/" className="inline-block relative w-[230px] h-[80px] mx-auto mb-2">
          <Image
            src="/assets/logo/irish-grocer-animated.svg"
            alt="The Irish Grocer"
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </Link>
        <p className="text-xs text-[#4B5563] mt-1">Farmhouse Grocery Customer Account</p>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-card border border-[#E8DFCF] space-y-6 my-auto">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#1F2937] tracking-tight font-serif-display">
            Sign In
          </h2>
          <p className="text-xs text-[#4B5563]">
            Sign in to unlock wholesale and direct customer prices
          </p>
        </div>

        {/* Shop Pay Button */}
        <div>
          <button
            type="button"
            onClick={handleShopPayLogin}
            disabled={isLoading}
            className="w-full bg-[#5A31F4] hover:bg-[#4A24DB] text-white py-3.5 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Continue with</span>
            <span className="font-bold tracking-tight text-base italic ml-0.5">shop</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E8DFCF] w-full" />
          <span className="bg-white px-3 text-xs text-[#4B5563] font-medium">
            or continue with email
          </span>
          <div className="border-t border-[#E8DFCF] w-full" />
        </div>

        {/* Email Input Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm text-[#1F2937] bg-white border border-[#E8DFCF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#14532D] focus:border-[#14532D] placeholder:text-[#1F2937]/50 pr-12"
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#14532D] hover:text-[#064E3B] disabled:opacity-40 transition-colors"
              aria-label="Submit email"
            >
              <ArrowRight className="w-5 h-5 text-[#22C55E]" />
            </button>
          </div>

          {/* Checkbox: Email me with news and offers */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#4B5563] select-none">
            <input
              type="checkbox"
              checked={newsConsent}
              onChange={(e) => setNewsConsent(e.target.checked)}
              className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
            />
            <span>Email me weekly Irish imports, fresh bangers &amp; crisp news</span>
          </label>
        </form>
      </div>

      {/* Bottom Center Link */}
      <div className="text-center pb-4">
        <Link
          href="/privacy"
          className="text-xs text-[#14532D] hover:underline font-medium"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
