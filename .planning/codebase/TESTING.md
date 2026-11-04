# Testing Patterns

**Analysis Date:** 2026-11-05

## Test Framework

**Runner:**
- Node.js built-in test runner (`node:test`) executed with `tsx` (`^4.23.15`) for native TypeScript compilation without bundling.
- Configuration: Defined in `website/package.json` under `scripts.test` and TypeScript compiler options in `website/tsconfig.json`.

**Assertion Library:**
- Node.js native strict assertions (`node:assert/strict`).

**Run Commands:**
```bash
# Run website test suite
cd website && npm test

# Direct tsx test execution
cd website && npx tsx --test tests/remediation.test.ts

# Watch mode for iterative test-driven development
cd website && npx tsx --test --watch tests/remediation.test.ts

# Run root-level GSD integrity and script validation
powershell -ExecutionPolicy Bypass -File scripts/validate-all.ps1
# or on POSIX:
bash scripts/validate-all.sh
```

## Test File Organization

**Location:**
- Dedicated `tests/` directory at the project root of the application package (`website/tests/`).
- Root level automated validation scripts live in `scripts/` (`scripts/validate-all.ps1`, `scripts/validate-encoding.ps1`, etc.).

**Naming:**
- Test files use kebab-case with `.test.ts` extension — `website/tests/remediation.test.ts`.

**Structure:**
```
irishweb/
├── scripts/
│   ├── validate-all.ps1            # Master GSD validator suite
│   ├── validate-workflows.ps1      # Workflow parser validation
│   └── validate-skills.ps1         # Skill structure validator
└── website/
    ├── package.json                # npm test script entry
    ├── tsconfig.json               # TypeScript path & compiler config
    └── tests/
        └── remediation.test.ts     # Core security, commerce, and UI regression suite
```

## Test Structure

**Suite Organization:**
Tests are structured hierarchically using Node.js subtests (`t.test`) under descriptive top-level test suites:

```typescript
// website/tests/remediation.test.ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  validateEnquiryInput,
  validateCartInput,
  validateShopifyPayload,
} from "../src/lib/validation/schemas";
import { checkRateLimit } from "../src/lib/security/rateLimit";

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
});
```

**Patterns:**
- Setup pattern: In-memory instantiation of request and payload objects directly inside test scopes to eliminate shared mutable state.
- Teardown pattern: Stateless function calls; time-based structures (such as `website/src/lib/security/rateLimit.ts`) isolate test buckets using unique prefixes (`checkRateLimit(req, "test-suite", ...)`).
- Assertion pattern: Use strict equality (`assert.equal`), truthy checks (`assert.ok`), and regular expression matching (`assert.match`).

## Mocking

**Framework:**
- Native Node.js request primitives (`Request`) and isolated in-memory objects. No heavy third-party mocking libraries (such as Jest mocks or Sinon) are required.

**Patterns:**
Mocking HTTP requests for middleware and security rate limiting:
```typescript
// website/tests/remediation.test.ts
const req = new Request("http://localhost:3000/api/cart", {
  headers: { "x-forwarded-for": "198.51.100.1" },
});
const res = checkRateLimit(req, "test-suite", { windowMs: 10_000, maxRequests: 3 });
assert.equal(res.success, true);
assert.equal(res.remaining, 2);
assert.ok(res.headers["X-RateLimit-Limit"]);
```

Simulating complex GraphQL responses:
```typescript
// website/tests/remediation.test.ts
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
assert.equal(formatted.id, "gid://shopify/Cart/abc123");
assert.equal(formatted.lines[0].merchandise.title, "Barry's Gold Blend 80s");
```

**What to Mock:**
- External network requests to Shopify Storefront API endpoints (`https://${DOMAIN}/api/.../graphql.json`).
- High-frequency client IP addresses using synthetic `x-forwarded-for` and `x-real-ip` headers.
- Transient browser storage environments (`localStorage`).

**What NOT to Mock:**
- Validation schemas (`website/src/lib/validation/schemas.ts`): Test against real regex patterns and size boundaries.
- Transformation utilities (`website/src/lib/shopify/cartFormatter.ts`): Verify exact structural transformations.
- Static product and department catalog data (`website/src/lib/data/products.ts`, `website/src/lib/config/site.ts`): Test actual static data integrity directly.

## Fixtures and Factories

**Test Data:**
- Real curated mock catalog in `website/src/lib/data/products.ts` provides complete product models containing realistic pricing, variants, and image nodes.
- Department lists and store configuration in `website/src/lib/config/site.ts`.

**Location:**
- Shared application datasets: `website/src/lib/data/products.ts`.
- Configuration and navigation metadata: `website/src/lib/config/site.ts`.
- Inline fixtures for GraphQL mutations and Cart responses within `website/tests/remediation.test.ts`.

## Coverage

**Requirements:**
- Automated validation passes 100% of defined tests (currently 29 assertions across 8 functional groups).
- All security boundaries (rate limiting, GraphQL allowlists, customer input sanitization) must have positive and negative test cases.
- Static data invariants must be checked (unique product IDs, unique handles, valid currency codes, department associations).

**View Coverage:**
```bash
# Optional coverage inspection with c8
cd website && npx c8 tsx --test tests/remediation.test.ts
```

## Test Types

**Unit Tests:**
- Input validation routines (`validateEnquiryInput`, `validateCartInput`, `validateShopifyPayload` in `website/src/lib/validation/schemas.ts`).
- Rate limiting window and header calculation (`checkRateLimit` in `website/src/lib/security/rateLimit.ts`).
- Cart formatting and edge unwrapping (`formatShopifyCart` in `website/src/lib/shopify/cartFormatter.ts`).
- Currency and text helpers (`formatMoney`, `slugify` in `website/src/lib/utils/index.ts`).

**Integration Tests:**
- In-memory cart calculations simulating multi-item additions, quantity increments/decrements, item removals, and subtotal arithmetic (`website/tests/remediation.test.ts:280`).
- Collection handle resolution and 404 fallback contracts (`getCollectionByHandle` in `website/src/lib/shopify/index.ts`).
- Header account display contract for anonymous vs authenticated member states.

**E2E Tests:**
- Not currently run in headless CI. Replaced by granular contract tests in `website/tests/remediation.test.ts` and automated pre-flight script validators (`scripts/validate-all.ps1`).

## Common Patterns

**Async Testing:**
Dynamic ESM imports are used within test suites to evaluate module resolution cleanly:
```typescript
// website/tests/remediation.test.ts
await t.test("gifts-merchandise department now contains curated products", async () => {
  const { getCollectionByHandle } = await import("../src/lib/shopify/index");
  const res = await getCollectionByHandle("gifts-merchandise");
  assert.ok(res.collection);
  assert.equal(res.collection.handle, "gifts-merchandise");
  assert.ok(res.products.length > 0);
});
```

**Error Testing:**
Asserting rejection results and matching validation messages without crashing:
```typescript
// website/tests/remediation.test.ts
await t.test("rejects query exceeding 10KB size limit", () => {
  const hugeQuery = "query getProducts { " + "x".repeat(11_000) + " }";
  const res = validateShopifyPayload({ query: hugeQuery });
  assert.equal(res.isValid, false);
  assert.match(res.errors[0], /exceeds 10KB/);
});
```

---

*Testing analysis: 2026-11-05*
