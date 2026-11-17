import { Cart, CartLineItem } from "@/types";
import { SITE_CONFIG } from "@/lib/config/site";

/**
 * Builds a short, structured, non-monetary WhatsApp order message from cart items.
 * Strictly avoids prices, subtotals, and currency symbols.
 * Formats:
 *
 * Hi! I'd like to place an order from The Irish Grocer – Marshfield, MA.
 *
 * My Order:
 * 1. Tayto Prawn Cocktail 37gm × 1
 * 2. Walker Cheese and Onion 6 pk × 1
 *
 * Please confirm availability and delivery/collection options.
 *
 * Thank you!
 */
export function buildWhatsAppOrderMessage(input: Cart | CartLineItem[]): string {
  const lines: CartLineItem[] = Array.isArray(input) ? input : input?.lines || [];

  if (!lines || lines.length === 0) {
    return "";
  }

  const storeLocation = `${SITE_CONFIG.name} – ${SITE_CONFIG.address.city}, MA`;

  const itemsList = lines
    .map((line, index) => {
      const itemNumber = index + 1;
      const title = line.merchandise?.product?.title || "Product";
      const variantTitle = line.merchandise?.title;
      const hasVariant = variantTitle && variantTitle !== "Default Title";
      const displayTitle = hasVariant ? `${title} (${variantTitle})` : title;
      const qty = line.quantity || 1;

      return `${itemNumber}. ${displayTitle} × ${qty}`;
    })
    .join("\n");

  const message = [
    `Hi! I'd like to place an order from ${storeLocation}.`,
    "",
    "My Order:",
    itemsList,
    "",
    "Please confirm availability and delivery/collection options.",
    "",
    "Thank you!",
  ].join("\n");

  return message;
}

/**
 * Generates the complete wa.me link targeting the verified store number
 * with the prefilled, URL-encoded order message.
 */
export function generateWhatsAppOrderUrl(cart: Cart): string {
  if (!cart.lines || cart.lines.length === 0) {
    return "";
  }

  const phone = SITE_CONFIG.whatsappRaw || "17746990889";
  const message = buildWhatsAppOrderMessage(cart.lines);
  const encoded = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encoded}`;
}
