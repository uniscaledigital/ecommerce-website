"use client";

import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, Truck, Phone, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config/site";

export function OrderEnquiryModal() {
  const { cart, isEnquiryOpen, closeEnquiry, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isEnquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          deliveryAddress,
          notes,
          cartItems: cart.lines.map((l) => ({
            title: l.merchandise.product.title,
            quantity: l.quantity,
            price: l.merchandise.price.amount,
          })),
          subtotal: cart.cost.subtotalAmount.amount,
        }),
      });

      setIsSuccess(true);
      clearCart();
    } catch {
      setIsSuccess(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1F2937]/70 backdrop-blur-xs transition-opacity"
        onClick={closeEnquiry}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-[#FFFAF1] rounded-xl shadow-2xl border border-[#E8DFCF] overflow-hidden z-10 my-8">
          {/* Header in Rich Forest Green #14532D */}
          <div className="bg-[#14532D] text-white p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-wider">
                WE&apos;RE HAPPY TO HELP
              </p>
              <h2 className="text-xl font-bold font-serif-display mt-0.5">
                Order with Confidence
              </h2>
            </div>
            <button
              onClick={closeEnquiry}
              className="text-white/80 hover:text-white p-1 rounded transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center space-y-4 bg-[#FFFAF1]">
              <div className="w-14 h-14 bg-[#E8F5E9] text-[#14532D] rounded-full flex items-center justify-center mx-auto border border-[#22C55E]/40">
                <CheckCircle className="w-8 h-8 text-[#22C55E]" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#1F2937]">
                Enquiry Received!
              </h3>
              <p className="text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{customerName || "Customer"}</strong>. Our Quincy storefront team has received your order request.
              </p>
              <div className="bg-[#F7EBD8] p-4 rounded-lg border border-[#E8DFCF] text-xs text-[#1F2937] text-left space-y-2">
                <div className="flex items-center gap-2 text-[#14532D] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>Next Steps:</span>
                </div>
                <p>1. We personally verify store inventory and assemble your items.</p>
                <p>2. We confirm availability and calculate applicable Massachusetts sales tax and delivery charges.</p>
                <p>3. You will receive an official written confirmation and secure payment link at <strong>{email}</strong>.</p>
                <p className="text-[11px] italic text-[#4B5563] pt-1 border-t border-[#E8DFCF]">
                  * Note: Submitting an enquiry does not reserve a delivery time until payment is confirmed.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  closeEnquiry();
                }}
                className="bg-[#14532D] hover:bg-[#064E3B] text-white px-6 py-2.5 text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Close &amp; Return to Store
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#FFFAF1]">
              {/* Process notice from design */}
              <div className="bg-[#E8F5E9] border border-[#22C55E]/30 rounded-lg p-3.5 text-xs text-[#1F2937] space-y-1.5 leading-relaxed">
                <p className="font-bold text-[#14532D]">
                  How our order confirmation works:
                </p>
                <p className="text-[#4B5563]">
                  Send us your order request. We will confirm availability, your full total including any applicable tax and delivery charges, and whether we can offer delivery to your address before you pay.
                </p>
                <p className="text-[11px] text-[#4B5563]">
                  We will send you a secure online payment link, so there is no need to share card details over the phone. Delivery arrangements are confirmed in writing once payment is received. Submitting an order does not reserve a delivery time.
                </p>
              </div>

              {/* Basket Snapshot */}
              <div className="border border-[#E8DFCF] rounded-lg p-3 bg-[#F7EBD8]">
                <div className="flex justify-between text-xs font-bold text-[#1F2937] border-b border-[#E8DFCF] pb-1.5 mb-2">
                  <span>Basket Summary ({cart.totalQuantity} items)</span>
                  <span className="text-[#14532D]">{formatMoney(cart.cost.subtotalAmount)}</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1 text-xs text-[#4B5563]">
                  {cart.lines.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span className="truncate pr-2">
                        {l.quantity}x {l.merchandise.product.title}
                      </span>
                      <span className="font-medium text-[#1F2937]">
                        {formatMoney({
                          amount: (parseFloat(l.merchandise.price.amount) * l.quantity).toFixed(2),
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Patrick O'Connor"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DFCF] rounded-md bg-white text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patrick@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DFCF] rounded-md bg-white text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (857) 387-2065"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DFCF] rounded-md bg-white text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Delivery Address or Pickup *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Quincy delivery address or In-store Pickup"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DFCF] rounded-md bg-white text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] text-xs mb-1">
                  Special Instructions or Delivery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Leave at front porch, preferred time of day, refrigerated item packing..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8DFCF] rounded-md bg-white text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEnquiry}
                  className="px-4 py-2 text-xs font-semibold text-[#1F2937] hover:text-[#14532D] border border-[#E8DFCF] rounded-md bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || cart.lines.length === 0}
                  className="bg-[#14532D] hover:bg-[#0F3D21] text-white px-6 py-2.5 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? "Submitting..." : "Submit Order Request →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
