import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validateEnquiryInput } from "@/lib/validation/schemas";
import { persistOrderEnquiry } from "@/lib/enquiry/storage";

export async function POST(request: Request) {
  // 1. Rate limiting (15 enquiries per minute per IP to mitigate spam/abuse)
  const rateLimit = checkRateLimit(request, "enquiry", {
    windowMs: 60_000,
    maxRequests: 15,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, error: "Too many enquiries submitted. Please wait before retrying." },
      { status: 429, headers: rateLimit.headers }
    );
  }

  // 2. Content-Type check
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Invalid Content-Type; expected application/json" },
      { status: 415, headers: rateLimit.headers }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400, headers: rateLimit.headers }
    );
  }

  try {
    // 3. Schema & Input Validation
    const validation = validateEnquiryInput(rawBody);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const { cartItems, subtotal } = validation.data;
    const enquiryId = `ENQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // 4. Persist Enquiry Record to secure storage
    await persistOrderEnquiry({
      ...validation.data,
      enquiryId,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    // 5. Safe Operational Logging (GDPR/CCPA compliant: Zero Customer PII in logs)
    const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    console.info(
      `[Order Enquiry Queued] ID: ${enquiryId} | Lines: ${cartItems.length} | Units: ${totalUnits} | Subtotal: $${subtotal} | Timestamp: ${new Date().toISOString()}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Order enquiry received and queued for store verification.",
        enquiryId,
      },
      { headers: rateLimit.headers }
    );
  } catch (err) {
    console.error("Order enquiry processing failure:", err);
    return NextResponse.json(
      { success: false, error: "Failed to queue order enquiry. Please try again or contact our Marshfield store directly." },
      { status: 500, headers: rateLimit.headers }
    );
  }
}
