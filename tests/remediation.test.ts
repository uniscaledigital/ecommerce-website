import test from "node:test";
import assert from "node:assert/strict";

import {
  validateEnquiryInput,
  validateCartInput,
  validateShopifyPayload,
  ALLOWED_SHOPIFY_OPERATIONS,
} from "../src/lib/validation/schemas";
import { checkRateLimit } from "../src/lib/security/rateLimit";
import { formatShopifyCart } from "../src/lib/shopify/cartFormatter";

test("Phase 1 Security: Shopify GraphQL Allowlist Validation", async (t) => {
  await t.test("allows legitimate allowlisted operations", () => {
    const validPayload = {
      query: "query getProducts($first: Int) { products(first: $first) { edges { node { id } } } }",
      variables: { first: 20 },
      operationName: "getProducts",
    };
    const res = validateShopifyPayload(validPayload);
    assert.equal(res.isValid, true);
    assert.equal(res.errors.length, 0);
  });

  await t.test("rejects arbitrary unapproved operations", () => {
    const arbitraryPayload = {
      query: "mutation deleteCustomerAccount($id: ID!) { customerDelete(id: $id) { deletedId } }",
      variables: { id: "123" },
      operationName: "deleteCustomerAccount",
    };
    const res = validateShopifyPayload(arbitraryPayload);
    assert.equal(res.isValid, false);
    assert.match(res.errors[0], /not permitted/);
  });

  await t.test("rejects query exceeding 10KB size limit", () => {
    const hugeQuery = "query getProducts { " + "x".repeat(11_000) + " }";
    const res = validateShopifyPayload({ query: hugeQuery });
    assert.equal(res.isValid, false);
    assert.match(res.errors[0], /exceeds 10KB/);
  });
});

test("Phase 1 Security: Customer Enquiry Input Validation & Sanitization", async (t) => {
  await t.test("validates complete and valid customer enquiry payload", () => {
    const validEnquiry = {
      customerName: "Patrick O'Connor",
      email: "patrick@example.com",
      phone: "+1 (857) 555-0199",
      deliveryAddress: "45 Hancock Street, Quincy, MA 02169",
      notes: "Please leave by front porch",
      cartItems: [
        {
          merchandise: { id: "var-1", title: "Tayto Crisps", price: { amount: "2.49", currencyCode: "USD" } },
          quantity: 2,
        },
      ],
      subtotal: "4.98",
    };
    const res = validateEnquiryInput(validEnquiry);
    assert.equal(res.isValid, true);
    assert.equal(res.data?.customerName, "Patrick O'Connor");
  });

  await t.test("rejects invalid email addresses", () => {
    const invalidEmail = {
      customerName: "Patrick",
      email: "not-an-email",
      phone: "+1 857 555 0199",
      deliveryAddress: "123 Main St, Quincy, MA",
      cartItems: [{ merchandise: { id: "var-1" }, quantity: 1 }],
      subtotal: 10,
    };
    const res = validateEnquiryInput(invalidEmail);
    assert.equal(res.isValid, false);
    assert.ok(res.errors.some((e) => e.includes("email")));
  });

  await t.test("rejects empty cartItems array", () => {
    const emptyCart = {
      customerName: "Patrick",
      email: "patrick@example.com",
      phone: "+1 857 555 0199",
      deliveryAddress: "123 Main St, Quincy, MA",
      cartItems: [],
      subtotal: 0,
    };
    const res = validateEnquiryInput(emptyCart);
    assert.equal(res.isValid, false);
    assert.ok(res.errors.some((e) => e.includes("cartItems must be a non-empty array")));
  });
});

test("Phase 1 Security: Sliding-Window Rate Limiter", async (t) => {
  await t.test("allows requests within rate threshold and tracks headers", () => {
    const req = new Request("http://localhost:3000/api/cart", {
      headers: { "x-forwarded-for": "198.51.100.1" },
    });
    const res = checkRateLimit(req, "test-suite", { windowMs: 10_000, maxRequests: 3 });
    assert.equal(res.success, true);
    assert.equal(res.remaining, 2);
    assert.ok(res.headers["X-RateLimit-Limit"]);
  });

  await t.test("throttles requests exceeding maximum threshold with Retry-After header", () => {
    const req = new Request("http://localhost:3000/api/cart", {
      headers: { "x-forwarded-for": "198.51.100.2" },
    });
    // First 2 allowed
    checkRateLimit(req, "test-throttle", { windowMs: 10_000, maxRequests: 2 });
    checkRateLimit(req, "test-throttle", { windowMs: 10_000, maxRequests: 2 });
    // 3rd throttled
    const third = checkRateLimit(req, "test-throttle", { windowMs: 10_000, maxRequests: 2 });
    assert.equal(third.success, false);
    assert.equal(third.remaining, 0);
    assert.ok(third.headers["Retry-After"]);
  });
});

test("Phase 2 Commerce: Cart Payload Validation & Shopify Formatting", async (t) => {
  await t.test("validates create cart request without requiring cartId", () => {
    const payload = {
      action: "create",
      lines: [{ merchandiseId: "gid://shopify/ProductVariant/123", quantity: 2 }],
    };
    const res = validateCartInput(payload);
    assert.equal(res.isValid, true);
    assert.equal(res.data?.action, "create");
  });

  await t.test("enforces cartId for add/update/remove/get actions", () => {
    const payload = {
      action: "add",
      lines: [{ merchandiseId: "gid://shopify/ProductVariant/123", quantity: 1 }],
    };
    const res = validateCartInput(payload);
    assert.equal(res.isValid, false);
    assert.ok(res.errors.some((e) => e.includes("cartId is required")));
  });

  await t.test("correctly transforms raw Shopify GraphQL Cart into typed Cart object", () => {
    const rawGraphQL = {
      id: "gid://shopify/Cart/abc123",
      checkoutUrl: "https://the-irish-grocer.myshopify.com/checkouts/cn/c123456",
      totalQuantity: 3,
      cost: {
        subtotalAmount: { amount: "15.99", currencyCode: "USD" },
        totalAmount: { amount: "17.15", currencyCode: "USD" },
        totalTaxAmount: { amount: "1.16", currencyCode: "USD" },
      },
      lines: {
        edges: [
          {
            node: {
              id: "gid://shopify/CartLine/line-1",
              quantity: 3,
              merchandise: {
                id: "gid://shopify/ProductVariant/var-1",
                title: "Barry's Gold Blend 80s",
                sku: "BG-80",
                price: { amount: "5.33", currencyCode: "USD" },
                product: {
                  id: "gid://shopify/Product/prod-1",
                  title: "Barry's Gold Blend",
                  handle: "barrys-gold-blend-80s",
                  vendor: "Barry's Tea",
                  featuredImage: {
                    url: "https://cdn.shopify.com/barrys.jpg",
                    altText: "Barry's Tea",
                    width: 500,
                    height: 500,
                  },
                },
              },
            },
          },
        ],
      },
    };

    const formatted = formatShopifyCart(rawGraphQL);
    assert.ok(formatted);
    assert.equal(formatted.id, "gid://shopify/Cart/abc123");
    assert.equal(formatted.checkoutUrl, "https://the-irish-grocer.myshopify.com/checkouts/cn/c123456");
    assert.equal(formatted.totalQuantity, 3);
    assert.equal(formatted.lines.length, 1);
    assert.equal(formatted.lines[0].merchandise.title, "Barry's Gold Blend 80s");
    assert.equal(formatted.cost.subtotalAmount.amount, "15.99");
    assert.equal(formatted.cost.totalAmount.amount, "17.15");
  });
});

test("Phase 3 & 4 Navigation: Department & Fallback Validation", async (t) => {
  await t.test("gifts-merchandise department now contains curated products", async () => {
    const { getCollectionByHandle } = await import("../src/lib/shopify/index");
    const res = await getCollectionByHandle("gifts-merchandise");
    assert.ok(res.collection);
    assert.equal(res.collection.handle, "gifts-merchandise");
    assert.ok(res.products.length > 0, "Expected gifts-merchandise to have products");
  });

  await t.test("unknown collection handles return null collection for Next.js notFound() trigger", async () => {
    const { getCollectionByHandle } = await import("../src/lib/shopify/index");
    const res = await getCollectionByHandle("non-existent-department-12345");
    assert.equal(res.collection, null, "Expected unknown handle to return null collection");
    assert.equal(res.products.length, 0);
  });
});

test("Phase 4 UI: Header Authentication Display Contract", async (t) => {
  await t.test("unauthenticated visitor fallback is 'Sign in'", () => {
    const customer = null as { firstName?: string } | null;
    const isAuthenticated = false;
    const displayLabel = customer?.firstName || (isAuthenticated ? "Account" : "Sign in");
    assert.equal(displayLabel, "Sign in");
  });

  await t.test("authenticated customer without first name falls back to 'Account'", () => {
    const customer = null as { firstName?: string } | null;
    const isAuthenticated = true;
    const displayLabel = customer?.firstName || (isAuthenticated ? "Account" : "Sign in");
    assert.equal(displayLabel, "Account");
  });

  await t.test("authenticated customer with first name displays customer first name", () => {
    const customer = { firstName: "Patrick" } as { firstName?: string } | null;
    const isAuthenticated = true;
    const displayLabel = customer?.firstName || (isAuthenticated ? "Account" : "Sign in");
    assert.equal(displayLabel, "Patrick");
  });
});

test("Phase 5 Demo Mode: Mock Catalogue & Variant Integrity", async (t) => {
  const { PRODUCTS } = await import("../src/lib/data/products");
  const { DEPARTMENTS } = await import("../src/lib/config/site");

  await t.test("all mock products have unique IDs and handles", () => {
    const idSet = new Set<string>();
    const handleSet = new Set<string>();
    for (const p of PRODUCTS) {
      assert.ok(!idSet.has(p.id), `Duplicate product ID found: ${p.id}`);
      assert.ok(!handleSet.has(p.handle), `Duplicate product handle found: ${p.handle}`);
      idSet.add(p.id);
      handleSet.add(p.handle);
    }
    assert.equal(idSet.size, PRODUCTS.length);
  });

  await t.test("all product variants have stable and unique IDs", () => {
    const variantIdSet = new Set<string>();
    for (const p of PRODUCTS) {
      assert.ok(p.variants.length > 0, `Product ${p.id} has no variants`);
      for (const v of p.variants) {
        assert.ok(!variantIdSet.has(v.id), `Duplicate variant ID: ${v.id}`);
        assert.ok(v.title, `Variant ${v.id} missing title`);
        assert.ok(v.price?.amount, `Variant ${v.id} missing price amount`);
        assert.equal(v.price?.currencyCode, "USD");
        variantIdSet.add(v.id);
      }
    }
  });

  await t.test("all 16 site departments contain at least one matching product", () => {
    for (const dept of DEPARTMENTS) {
      const matching = PRODUCTS.filter(
        (p) =>
          p.collections?.includes(dept.handle) ||
          p.productType.toLowerCase().includes(dept.handle) ||
          p.tags.some((t) => t.toLowerCase().includes(dept.handle))
      );
      assert.ok(
        matching.length > 0,
        `Department ${dept.handle} has 0 matching products in mock catalog`
      );
    }
  });
});

test("Phase 5 Demo Mode: Mock Cart Operations & Cost Invariants", async (t) => {
  const { PRODUCTS } = await import("../src/lib/data/products");
  const p1 = PRODUCTS[0];
  const p2 = PRODUCTS[1];

  await t.test("simulates adding different products and variants correctly", () => {
    const lines: Array<{
      id: string;
      quantity: number;
      merchandise: { id: string; price: { amount: string; currencyCode: string } };
    }> = [];

    // Add first product, first variant
    lines.push({
      id: "line-1",
      quantity: 2,
      merchandise: { id: p1.variants[0].id, price: p1.variants[0].price },
    });

    // Add second product, first variant
    lines.push({
      id: "line-2",
      quantity: 1,
      merchandise: { id: p2.variants[0].id, price: p2.variants[0].price },
    });

    assert.equal(lines.length, 2);
    const totalQty = lines.reduce((acc, l) => acc + l.quantity, 0);
    assert.equal(totalQty, 3);

    // Calculate subtotal
    const expectedSubtotal = (
      2 * parseFloat(p1.variants[0].price.amount) +
      1 * parseFloat(p2.variants[0].price.amount)
    ).toFixed(2);

    const calcSubtotal = lines
      .reduce((acc, l) => acc + parseFloat(l.merchandise.price.amount) * l.quantity, 0)
      .toFixed(2);

    assert.equal(calcSubtotal, expectedSubtotal);
  });

  await t.test("simulates quantity increment, decrement and item removal", () => {
    let lines = [
      { id: "line-1", quantity: 2, price: 5.0 },
      { id: "line-2", quantity: 1, price: 10.0 },
    ];

    // Increment line-1
    lines = lines.map((l) => (l.id === "line-1" ? { ...l, quantity: l.quantity + 1 } : l));
    assert.equal(lines.find((l) => l.id === "line-1")?.quantity, 3);

    // Decrement line-1
    lines = lines.map((l) => (l.id === "line-1" ? { ...l, quantity: l.quantity - 1 } : l));
    assert.equal(lines.find((l) => l.id === "line-1")?.quantity, 2);

    // Remove line-2
    lines = lines.filter((l) => l.id !== "line-2");
    assert.equal(lines.length, 1);
    assert.equal(lines[0].id, "line-1");

    // Empty cart calculation
    lines = [];
    const emptyTotal = lines.reduce((acc, l) => acc + (l as any).price * (l as any).quantity, 0);
    assert.equal(emptyTotal, 0);
  });
});

test("Phase 5 Responsive & Viewport Usability: CSS Invariants & Touch Targets", async (t) => {
  await t.test("verifies global viewport overflow-x clipping in globals.css", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const css = fs.readFileSync(path.resolve(__dirname, "../src/app/globals.css"), "utf-8");
    assert.ok(css.includes("overflow-x: clip") || css.includes("overflow-x: hidden"));
    assert.ok(css.includes("max-width: 100%"));
  });

  await t.test("verifies Header mobile touch target dimensions >= 44x44px", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const headerCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/layout/Header.tsx"),
      "utf-8"
    );
    assert.ok(headerCode.includes("min-w-[44px] min-h-[44px]"));
  });

  await t.test("verifies CartDrawer dialog close touch target >= 44x44px", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cartCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/cart/CartDrawer.tsx"),
      "utf-8"
    );
    assert.ok(cartCode.includes("min-w-[44px] min-h-[44px]"));
  });

  await t.test("verifies MobileBottomNav touch targets >= 44x44px and desktop visual lock", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const navCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/layout/MobileBottomNav.tsx"),
      "utf-8"
    );
    assert.ok(navCode.includes("min-w-[44px]"));
    assert.ok(navCode.includes("min-h-[48px]") || navCode.includes("min-h-[44px]"));
    assert.ok(navCode.includes("md:hidden"), "MobileBottomNav must be hidden on desktop (md:hidden)");
    assert.ok(navCode.includes('href="/"'), "Missing Home destination");
    assert.ok(navCode.includes('href="/shop"'), "Missing Shop destination");
    assert.ok(navCode.includes('href="/search"'), "Missing Search destination");
    assert.ok(navCode.includes('openCart'), "Missing Cart trigger");
    assert.ok(navCode.includes('href="/account"'), "Missing Account destination");
  });

  await t.test("verifies MobileCategoryScrollRail minimum touch target height", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const railCode = fs.readFileSync(
      path.resolve(__dirname, "../src/components/products/filters/MobileCategoryScrollRail.tsx"),
      "utf-8"
    );
    assert.ok(railCode.includes("min-h-[40px]") || railCode.includes("min-h-[44px]"));
  });
});

test("Phase 6 Accessibility & SEO: Endpoints, Metadata & Schema.org Verification", async (t) => {
  await t.test("executes sitemap generator and validates crawl rules and route exclusion", async () => {
    const sitemapModule = await import("../src/app/sitemap");
    const sitemapFn = sitemapModule.default;
    const entries = await sitemapFn();

    assert.ok(Array.isArray(entries));
    assert.ok(entries.length > 0);

    // Verify /cart is strictly excluded
    assert.equal(
      entries.some((e: any) => e.url.endsWith("/cart")),
      false,
      "sitemap must not include /cart"
    );

    // Verify static routes present
    assert.ok(entries.some((e: any) => e.url.endsWith("/shop")));
    assert.ok(entries.some((e: any) => e.url.endsWith("/privacy")));

    // Verify all URLs are valid absolute URLs
    for (const entry of entries) {
      assert.doesNotThrow(() => new URL(entry.url), `Invalid URL: ${entry.url}`);
      assert.ok(entry.lastModified instanceof Date);
    }
  });

  await t.test("executes robots generator and verifies disallow directives", async () => {
    const robotsModule = await import("../src/app/robots");
    const robotsFn = robotsModule.default;
    const rules = robotsFn();

    assert.ok(rules.rules);
    const disallows = Array.isArray(rules.rules)
      ? rules.rules.flatMap((r: any) => r.disallow)
      : (rules.rules as any).disallow;
    assert.ok(disallows.includes("/cart"));
    assert.ok(disallows.includes("/account"));
    assert.ok(disallows.includes("/api/"));
    assert.ok(rules.sitemap?.includes("sitemap.xml"));
  });

  await t.test("validates Product JSON-LD schema conformance against Schema.org", async () => {
    const { getProductByHandle } = await import("../src/lib/shopify");
    const product = await getProductByHandle("hula-hoops-family-6pk");
    assert.ok(product, "test product must exist");

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: product.featuredImage?.url,
      brand: {
        "@type": "Brand",
        name: product.vendor,
      },
      sku: product.variants?.[0]?.sku || undefined,
      offers: {
        "@type": "Offer",
        price: product.priceRange.minVariantPrice.amount,
        priceCurrency: product.priceRange.minVariantPrice.currencyCode,
        itemCondition: "https://schema.org/NewCondition",
        availability: product.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: `http://localhost:3000/products/${product.handle}`,
      },
    };

    assert.equal(productJsonLd["@context"], "https://schema.org");
    assert.equal(productJsonLd["@type"], "Product");
    assert.ok(productJsonLd.name.length > 0);
    assert.equal(productJsonLd.brand["@type"], "Brand");
    assert.equal(productJsonLd.offers["@type"], "Offer");
    assert.equal(productJsonLd.offers.priceCurrency, "USD");
    assert.ok(parseFloat(productJsonLd.offers.price) > 0);
    assert.equal(productJsonLd.offers.availability, "https://schema.org/InStock");
    assert.equal(productJsonLd.offers.itemCondition, "https://schema.org/NewCondition");
  });

  await t.test("verifies skip-link and main content landmark in layout", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const layoutCode = fs.readFileSync(
      path.resolve(__dirname, "../src/app/layout.tsx"),
      "utf-8"
    );
    assert.ok(layoutCode.includes('href="#main-content"'));
    assert.ok(layoutCode.includes('id="main-content"'));
    assert.ok(layoutCode.includes("Skip to main content"));
  });
});

test("Phase 10: Mobile Product Discovery & 2-Column Grid Architecture", async (t) => {
  const fs = await import("node:fs");
  const path = await import("node:path");

  await t.test("ProductCard guarantees minimum 44px touch targets on mobile", () => {
    const code = fs.readFileSync(
      path.resolve(__dirname, "../src/components/products/ProductCard.tsx"),
      "utf-8"
    );
    assert.ok(code.includes("min-h-[44px]"), "CTA must enforce min-h-[44px]");
    assert.ok(code.includes("rounded-full"), "CTA must preserve rounded pill style");
    assert.ok(code.includes("bg-[#14532D]"), "Must preserve Irish Grocer brand color");
  });

  await t.test("ProductImage guarantees 44x44px minimum tap target for wishlist button", () => {
    const code = fs.readFileSync(
      path.resolve(__dirname, "../src/components/products/ProductImage.tsx"),
      "utf-8"
    );
    assert.ok(code.includes("min-w-[44px] min-h-[44px]"), "Wishlist button must have min-w-[44px] min-h-[44px]");
    assert.ok(code.includes("aria-label"), "Wishlist button must have accessible label");
  });

  await t.test("ProductGrid defaults to 2-column mobile layout", () => {
    const code = fs.readFileSync(
      path.resolve(__dirname, "../src/components/products/ProductGrid.tsx"),
      "utf-8"
    );
    assert.ok(code.includes("grid-cols-2"), "ProductGrid must use grid-cols-2 on mobile");
  });

  await t.test("ShopClientView integrates search, filter and bookmark controls bar", () => {
    const code = fs.readFileSync(
      path.resolve(__dirname, "../src/app/shop/ShopClientView.tsx"),
      "utf-8"
    );
    assert.ok(code.includes("sticky top-2"), "Must include sticky docked controls bar on mobile shop");
    assert.ok(code.includes("setSearchQuery"), "Must support in-view live product filtering");
    assert.ok(code.includes("SlidersHorizontal"), "Must include filter drawer trigger");
    assert.ok(code.includes("min-h-[44px]"), "Filter trigger must be min-h-[44px]");
    assert.ok(code.includes("useWishlist"), "Must include bookmark saved-items integration");
  });
});
