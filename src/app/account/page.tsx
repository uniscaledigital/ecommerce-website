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
        <div className="w-8 h-8 border-2 border-commerce border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-ink-muted">Loading your account...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="py-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-irishBorder pb-6">
        <div>
          <h1 className="font-serif-display text-3xl font-bold text-ink">
            My Account
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Welcome back, <strong>{customer.displayName}</strong>. You now have access to member and store pricing.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-offer hover:text-white border border-offer/30 hover:bg-offer rounded-md transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white border border-irishBorder rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-irishBorder/60 pb-4">
            <div className="w-12 h-12 rounded-full bg-commerce/10 text-commerce flex items-center justify-center font-bold text-base">
              {customer.firstName[0]}
              {customer.lastName[0]}
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink">{customer.displayName}</h2>
              <span className="text-[11px] text-commerce font-semibold bg-commerce/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-ink-muted">
            <div>
              <span className="font-semibold text-ink block mb-0.5">Email</span>
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div>
                <span className="font-semibold text-ink block mb-0.5">Phone</span>
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.defaultAddress && (
              <div>
                <span className="font-semibold text-ink block mb-0.5">
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

          <div className="pt-2 border-t border-irishBorder/60">
            <Link
              href="/shop"
              className="w-full bg-commerce hover:bg-commerce-dark text-white py-2 px-3 text-xs font-semibold rounded block text-center transition-colors"
            >
              Shop with Customer Pricing
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 bg-white border border-irishBorder rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-irishBorder/60 pb-4">
            <Package className="w-5 h-5 text-commerce" />
            <h2 className="text-base font-bold text-ink">Order History</h2>
          </div>

          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="border border-irishBorder rounded-lg p-4 space-y-3 bg-ivory"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-ink text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-ink-muted ml-2">
                      {new Date(order.processedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {order.financialStatus}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-irishBorder/40 text-xs">
                  {order.lineItems.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span className="text-ink-muted">
                        {item.quantity}x {item.title}
                      </span>
                      <span className="font-semibold text-ink">
                        {formatMoney(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-irishBorder/60 pt-2 flex justify-between items-center text-xs">
                  <span className="font-bold text-ink">Total Paid</span>
                  <span className="text-sm font-bold text-commerce">
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

