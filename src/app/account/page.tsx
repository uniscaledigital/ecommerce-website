"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, LogOut, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, customer, logout, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !customer) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#14532D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#4B5563]">Loading your farmhouse account...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="section-inner py-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFCF] pb-6">
        <div>
          <h1 className="font-serif-display text-3xl font-bold text-[#1F2937]">
            My Farmhouse Account
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-sans">
            Welcome back, <strong>{customer.displayName}</strong>. You now have full access to verified grocery pricing.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 hover:text-white border border-red-300 hover:bg-red-700 rounded-lg transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#E8DFCF] pb-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#14532D] flex items-center justify-center font-bold text-base border border-[#22C55E]/40">
              {customer.firstName[0]}
              {customer.lastName[0]}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1F2937]">{customer.displayName}</h2>
              <span className="text-[11px] text-[#14532D] font-bold bg-[#E8F5E9] px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-[#22C55E]/30">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#4B5563]">
            <div>
              <span className="font-semibold text-[#1F2937] block mb-0.5">Email</span>
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div>
                <span className="font-semibold text-[#1F2937] block mb-0.5">Phone</span>
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.defaultAddress && (
              <div>
                <span className="font-semibold text-[#1F2937] block mb-0.5">
                  Default Delivery Address
                </span>
                <p>{customer.defaultAddress.address1}</p>
                <p>
                  {customer.defaultAddress.city}, {customer.defaultAddress.province}{" "}
                  {customer.defaultAddress.zip}
                </p>
                <p>{customer.defaultAddress.country}</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#E8DFCF]">
            <Link
              href="/shop"
              className="w-full bg-[#14532D] hover:bg-[#064E3B] text-white py-2.5 px-3 text-xs font-semibold rounded-lg block text-center transition-colors shadow-xs"
            >
              Shop with Customer Pricing
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 bg-[#FFFAF1] border border-[#E8DFCF] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#E8DFCF] pb-4">
            <Package className="w-5 h-5 text-[#14532D]" />
            <h2 className="font-serif-display text-lg font-bold text-[#1F2937]">Order History</h2>
          </div>

          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="border border-[#E8DFCF] rounded-xl p-4 space-y-3 bg-[#FFFAF1]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#1F2937] text-sm font-serif-display">
                      {order.orderNumber}
                    </span>
                    <span className="text-[#4B5563] ml-2">
                      {new Date(order.processedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E8F5E9] text-[#14532D] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#22C55E]/40">
                      <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                      {order.financialStatus}
                    </span>
                    <span className="bg-[#FDF4E3] text-[#1F2937] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#E8DFCF]">
                      <Clock className="w-3 h-3 text-[#14532D]" />
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-[#E8DFCF]/60 text-xs">
                  {order.lineItems.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span className="text-[#4B5563]">
                        {item.quantity}x {item.title}
                      </span>
                      <span className="font-semibold text-[#1F2937]">
                        {formatMoney(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8DFCF] pt-2 flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1F2937]">Total Paid</span>
                  <span className="text-sm font-bold text-[#14532D]">
                    {formatMoney(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
