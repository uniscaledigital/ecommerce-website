import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildWhatsAppOrderMessage, generateWhatsAppOrderUrl } from "../src/lib/whatsapp/orderMessage";
import { SITE_CONFIG } from "../src/lib/config/site";
import { Cart } from "../src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function mockCartWithItems(items: Array<{ title: string; vendor: string; quantity: number; variantTitle?: string }>): Cart {
  return {
    id: "cart-whatsapp-test",
    checkoutUrl: "",
    totalQuantity: items.reduce((acc, i) => acc + i.quantity, 0),
    lines: items.map((item, idx) => ({
      id: `line-${idx}`,
      quantity: item.quantity,
      merchandise: {
        id: `var-${idx}`,
        title: item.variantTitle || "Default Title",
        sku: `SKU-${idx}`,
        price: { amount: "9.99", currencyCode: "USD" },
        product: {
          id: `prod-${idx}`,
          title: item.title,
          handle: `handle-${idx}`,
          featuredImage: { url: "/test.jpg", altText: item.title, width: 100, height: 100 },
          vendor: item.vendor,
        },
      },
    })),
    cost: {
      subtotalAmount: { amount: "19.98", currencyCode: "USD" },
      totalAmount: { amount: "19.98", currencyCode: "USD" },
    },
  };
}

test("Cart to WhatsApp Ordering Workflow Suite", async (t) => {
  await t.test("Contact config: store WhatsApp phone is configured as (774) 699-0889 / 17746990889", () => {
    assert.equal(SITE_CONFIG.whatsapp, "+1 (774) 699-0889");
    assert.equal(SITE_CONFIG.whatsappRaw, "17746990889");
    assert.equal(SITE_CONFIG.phoneRaw, "7746990889");
  });

  await t.test("WhatsApp message generator: single item order creates formatted non-monetary text", () => {
    const cart = mockCartWithItems([
      { title: "Tayto Prawn Cocktail 37gm", vendor: "Tayto", quantity: 1 },
      { title: "Walker Cheese and Onion 6 pk", vendor: "Walkers", quantity: 1 },
    ]);

    const message = buildWhatsAppOrderMessage(cart);

    assert.ok(message.includes("Hi! I'd like to place an order from The Irish Grocer – Marshfield, MA."));
    assert.ok(message.includes("My Order:"));
    assert.ok(message.includes("1. Tayto Prawn Cocktail 37gm × 1"));
    assert.ok(message.includes("2. Walker Cheese and Onion 6 pk × 1"));
    assert.ok(message.includes("Please confirm availability and delivery/collection options."));
    assert.ok(message.includes("Thank you!"));

    // Non-monetary guarantee: absolutely no prices, currency symbols or subtotals
    assert.ok(!message.includes("$"), "Message must not contain dollar signs");
    assert.ok(!message.includes("USD"), "Message must not contain currency code USD");
    assert.ok(!message.includes("Price"), "Message must not mention Price");
    assert.ok(!message.includes("Subtotal"), "Message must not mention Subtotal");
    assert.ok(!message.includes("9.99"), "Message must not contain underlying price amount");
  });

  await t.test("WhatsApp message generator: multi-item order with variants formatted correctly", () => {
    const cart = mockCartWithItems([
      { title: "Barry's Tea Gold Blend 80s", vendor: "Barry's Tea", quantity: 1 },
      { title: "The Irish Grocer Heritage Cap", vendor: "The Irish Grocer", quantity: 2, variantTitle: "Bottle Green / Adjustable" },
      { title: "Ballymaloe Original Relish 310g", vendor: "Ballymaloe", quantity: 3 },
    ]);

    const message = buildWhatsAppOrderMessage(cart);

    assert.ok(message.includes("1. Barry's Tea Gold Blend 80s × 1"), "Must list first item with quantity");
    assert.ok(message.includes("2. The Irish Grocer Heritage Cap (Bottle Green / Adjustable) × 2"), "Must include variant name when not Default Title");
    assert.ok(message.includes("3. Ballymaloe Original Relish 310g × 3"), "Must list third item with quantity");
    assert.ok(message.includes("Please confirm availability and delivery/collection options."));

    // Strict zero price enforcement
    assert.ok(!message.includes("$"), "Multi-item message must not contain $");
    assert.ok(!message.includes("19.98"), "Multi-item message must not contain cost subtotal");
  });

  await t.test("WhatsApp URL generator: generates valid wa.me URL targeting 17746990889", () => {
    const cart = mockCartWithItems([
      { title: "Cadbury Dairy Milk 8-Pack", vendor: "Cadbury Ireland", quantity: 1 },
    ]);

    const url = generateWhatsAppOrderUrl(cart);
    assert.ok(url.startsWith("https://wa.me/17746990889?text="), "URL must target 17746990889");

    const encodedText = url.split("?text=")[1];
    const decodedText = decodeURIComponent(encodedText);
    assert.ok(decodedText.includes("1. Cadbury Dairy Milk 8-Pack × 1"));
    assert.ok(!decodedText.includes("$"));
  });

  await t.test("CartDrawer UI source verification: zero price rendering and WhatsApp-only checkout", () => {
    const cartDrawerCode = fs.readFileSync(
      path.join(projectRoot, "src/components/cart/CartDrawer.tsx"),
      "utf-8"
    );

    // Verify removal of price rendering
    assert.ok(!cartDrawerCode.includes("formatMoney"), "CartDrawer must not call formatMoney");
    assert.ok(!cartDrawerCode.includes("Estimated Subtotal"), "CartDrawer must not display Estimated Subtotal");
    assert.ok(!cartDrawerCode.includes("subtotalAmount"), "CartDrawer must not read subtotalAmount");
    assert.ok(!cartDrawerCode.includes("line.merchandise.price"), "CartDrawer must not read line item price");

    // Verify WhatsApp order button
    assert.ok(cartDrawerCode.includes("Order via WhatsApp"), "CartDrawer must include Order via WhatsApp button");
    assert.ok(cartDrawerCode.includes("MessageCircle"), "CartDrawer must use MessageCircle icon");
    assert.ok(cartDrawerCode.includes("generateWhatsAppOrderUrl"), "CartDrawer must invoke generateWhatsAppOrderUrl");

    // Verify Continue Shopping and non-monetary summary
    assert.ok(cartDrawerCode.includes("Continue Shopping"), "CartDrawer must include Continue Shopping button");
    assert.ok(cartDrawerCode.includes("Basket Summary"), "CartDrawer must display non-monetary Basket Summary");

    // Verify DemoCheckoutModal elimination from UI actions
    assert.ok(!cartDrawerCode.includes("openDemoCheckout"), "CartDrawer must not open Demo Checkout");
    assert.ok(!cartDrawerCode.includes("DemoCheckoutModal"), "CartDrawer must not import DemoCheckoutModal");
  });

  await t.test("Cart Page UI source verification: zero price rendering and WhatsApp-only checkout", () => {
    const cartPageCode = fs.readFileSync(
      path.join(projectRoot, "src/app/cart/page.tsx"),
      "utf-8"
    );

    // Verify removal of price rendering
    assert.ok(!cartPageCode.includes("formatMoney"), "Cart page must not call formatMoney");
    assert.ok(!cartPageCode.includes("Estimated Subtotal"), "Cart page must not display Estimated Subtotal");
    assert.ok(!cartPageCode.includes("Sales Tax"), "Cart page must not display Sales Tax");
    assert.ok(!cartPageCode.includes("subtotalAmount"), "Cart page must not read subtotalAmount");
    assert.ok(!cartPageCode.includes("item.merchandise.price"), "Cart page must not read line item price");

    // Verify WhatsApp order button
    assert.ok(cartPageCode.includes("Order via WhatsApp"), "Cart page must include Order via WhatsApp button");
    assert.ok(cartPageCode.includes("generateWhatsAppOrderUrl"), "Cart page must invoke generateWhatsAppOrderUrl");

    // Verify Continue Shopping and Farmhouse Basket Summary
    assert.ok(cartPageCode.includes("Continue Shopping"), "Cart page must include Continue Shopping");
    assert.ok(cartPageCode.includes("Farmhouse Basket Summary"), "Cart page must display Farmhouse Basket Summary");

    // Verify DemoCheckoutModal elimination from UI actions
    assert.ok(!cartPageCode.includes("openDemoCheckout"), "Cart page must not open Demo Checkout");
    assert.ok(!cartPageCode.includes("DemoCheckoutModal"), "Cart page must not import DemoCheckoutModal");
  });
});
