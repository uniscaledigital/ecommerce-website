import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, email, phone, deliveryAddress, notes, cartItems, subtotal } = body;

    console.log("=== NEW ORDER ENQUIRY RECEIVED ===");
    console.log(`Customer: ${customerName} (${email}, ${phone})`);
    console.log(`Address: ${deliveryAddress}`);
    console.log(`Subtotal: $${subtotal}`);
    console.log(`Items count: ${cartItems?.length}`);
    console.log("Items:", JSON.stringify(cartItems, null, 2));
    if (notes) console.log(`Notes: ${notes}`);

    // Here production stores can integrate with Resend, Sendgrid, or Shopify Draft Order API
    return NextResponse.json({
      success: true,
      message: "Order enquiry received and queued for store verification.",
      enquiryId: `ENQ-${Date.now()}`,
    });
  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process enquiry." },
      { status: 500 }
    );
  }
}

