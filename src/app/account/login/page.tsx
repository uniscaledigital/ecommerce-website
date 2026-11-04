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
    <div className="min-h-[75vh] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Center: Brand Logo & Title */}
      <div className="text-center pt-2 sm:pt-4">
        <Link href="/" className="inline-block relative w-[180px] sm:w-[230px] h-[64px] sm:h-[80px] mx-auto mb-2">
          <Image
            src="/assets/logo/irish-grocer-animated.svg"
            alt="The Irish Grocer"
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </Link>
        <p className="text-xs text-[#4B5563] mt-1 font-sans">Farmhouse Grocery Customer Account</p>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto bg-white p-5 sm:p-8 md:p-10 rounded-2xl shadow-card border border-[#E8DFCF] space-y-5 sm:space-y-6 my-auto">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight font-serif-display">
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
            className="w-full bg-[#5A31F4] hover:bg-[#4A24DB] text-white py-3.5 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-xs min-h-[44px]"
          >
            <span>Continue with</span>
            <span className="font-bold tracking-tight text-base italic ml-0.5">shop</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E8DFCF] w-full" />
          <span className="bg-white px-3 text-[11px] sm:text-xs text-[#4B5563] font-medium whitespace-nowrap">
            or continue with email
          </span>
          <div className="border-t border-[#E8DFCF] w-full" />
        </div>

        {/* Email Input Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold text-[#1F2937] mb-1.5"
            >
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patrick@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E8DFCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D] placeholder-[#4B5563]/50 min-h-[44px]"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              id="newsletter-consent"
              type="checkbox"
              checked={newsConsent}
              onChange={(e) => setNewsConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-[#E8DFCF]"
            />
            <label
              htmlFor="newsletter-consent"
              className="text-[11px] text-[#4B5563] leading-snug cursor-pointer"
            >
              Send me weekly updates on direct Cork &amp; Dublin provisions and holiday treats.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-[#14532D] hover:bg-[#064E3B] text-white py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 min-h-[44px]"
          >
            <span>{isLoading ? "Signing in..." : "Continue"}</span>
            <ArrowRight className="w-4 h-4 text-[#22C55E]" />
          </button>
        </form>

        <p className="text-[11px] text-[#4B5563] text-center pt-2">
          Demo Customer Account • No password required
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="text-center pt-4 text-xs text-[#4B5563] space-x-4">
        <Link href="/privacy" className="hover:text-[#14532D] hover:underline">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/" className="hover:text-[#14532D] hover:underline">
          Return to Store
        </Link>
      </div>
    </div>
  );
}
