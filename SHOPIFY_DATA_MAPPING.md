# THE IRISH GROCER — SHOPIFY DATA MAPPING SPECIFICATION

**Project:** The Irish Grocer  
**Purpose:** Field-by-field schema mapping between local TypeScript mock models (`src/lib/data/products.ts`, `src/types/index.ts`) and Shopify Storefront API GraphQL (Version 2026-10).

---

## 1. Product Entity Mapping

The local application represents catalog items via the TypeScript `Product` interface. Below is the complete field mapping to the Shopify Storefront API `Product` GraphQL node:

| Local Field (`Product`) | Local Mock Type | Shopify Storefront API GraphQL Field | Shopify GraphQL Type | Transformation & Fallback Logic |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` (`"prod-1"`) | `id` | `ID!` (`gid://shopify/Product/123456789`) | Direct string pass-through. If local mock, strip prefix or use raw string. |
| `title` | `string` | `title` | `String!` | Direct 1:1 mapping. (e.g. "Barry's Tea Gold Blend"). |
| `handle` | `string` | `handle` | `String!` | Direct 1:1 URL slug. Used for dynamic route `/products/[handle]`. |
| `description` | `string` | `description` or `descriptionHtml` | `String!` | Local string maps to `description`. When HTML rich text is available, map to `descriptionHtml`. |
| `vendor` | `string` | `vendor` | `String!` | Direct 1:1 mapping (e.g. "Barry's Tea", "Tayto", "Cadbury"). Fallback: `"The Irish Grocer"`. |
| `productType` | `string` | `productType` | `String!` | Direct 1:1 mapping (e.g. "Tea & Hot Drinks", "Crisps & Snacks"). |
| `tags` | `string[]` | `tags` | `[String!]!` | Direct 1:1 array mapping. Used for badges ("New", "Bestseller", "Irish Classic"). |
| `availableForSale` | `boolean` | `availableForSale` | `Boolean!` | Direct boolean mapping. Governs "In stock" indicator and button enabled state. |
| `featuredImage` | `ImageNode` | `featuredImage { url altText width height }` | `Image` | Normalization helper transforms GraphQL node to `{ url, altText, width, height }`. Fallback placeholder image if null. |
| `images` | `ImageNode[]` | `images(first: 10) { edges { node { url altText width height } } }` | `ImageConnection!` | Flatten `edges.map(e => e.node)`. Fallback to array with `featuredImage`. |
| `priceRange` | `{ minVariantPrice, maxVariantPrice }` | `priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { ... } }` | `ProductPriceRange!` | Local numeric price normalized to `{ amount: price.toFixed(2), currencyCode: "USD" }`. |
| `variants` | `ProductVariant[]` | `variants(first: 20) { edges { node { ... } } }` | `ProductVariantConnection!` | Flatten `edges.map(e => e.node)`. See Variant Entity Mapping below. |
| `collections` | `string[]` | `collections(first: 5) { edges { node { handle } } }` | `CollectionConnection!` | Flatten `edges.map(e => e.node.handle)` to retain collection relationship strings. |
| `rating` | `{ value: number, count: number }` | `metafields(identifiers: [{ namespace: "reviews", key: "rating" }, ...])` | `[Metafield]` | Shopify does not have native product ratings; retrieved via product metafields (e.g. Judge.me or Okendo) or defaults to `{ value: 4.8, count: 24 }`. |
| `sku` | `string` | `variants.edges[0].node.sku` | `String` | Extracted from primary variant `sku`. |
| `barcode` | `string` | `variants.edges[0].node.barcode` | `String` | Extracted from primary variant `barcode`. |

---

## 2. Product Variant Entity Mapping

Each product contains one or more purchasable variants:

| Local Field (`ProductVariant`) | Local Type | Shopify Storefront API GraphQL Field | GraphQL Type | Transformation & Fallback Logic |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `ID!` | Global ID (e.g. `gid://shopify/ProductVariant/987654321`). Passed to cart line items. |
| `title` | `string` | `title` | `String!` | Variant title (e.g. "80 Bags", "Default Title"). |
| `sku` | `string` | `sku` | `String` | Product stock keeping unit code. Fallback: `""`. |
| `barcode` | `string` | `barcode` | `String` | European EAN or US UPC barcode. |
| `availableForSale` | `boolean` | `availableForSale` | `Boolean!` | Variant-level stock check. |
| `price` | `Money` | `price { amount currencyCode }` | `MoneyV2!` | Direct mapping to `{ amount: string, currencyCode: string }`. |
| `compareAtPrice` | `Money \| null` | `compareAtPrice { amount currencyCode }` | `MoneyV2` | Optional strikethrough price for discounted items. Null if no discount. |
| `selectedOptions` | `{ name, value }[]` | `selectedOptions { name value }` | `[SelectedOption!]!` | Array of variant option values (e.g. `[{ name: "Size", value: "250g" }]`). |

---

## 3. Collection Entity Mapping

The Irish Grocer features 16 curated department categories:

| Local Field (`Collection`) | Local Type | Shopify Storefront API GraphQL Field | GraphQL Type | Transformation & Fallback Logic |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` (`"col-1"`) | `id` | `ID!` | Global ID (`gid://shopify/Collection/554433221`). |
| `title` | `string` | `title` | `String!` | Collection title (e.g. "Tea & Hot Drinks"). |
| `handle` | `string` | `handle` | `String!` | Slug handle matching route `/collections/[handle]`. |
| `description` | `string` | `description` | `String!` | Category summary text for hero banner. |
| `image` | `ImageNode` | `image { url altText width height }` | `Image` | Header banner image. Fallback to local category artwork. |
| `productCount` | `number` | `products.totalCount` or `products.edges.length` | `Int` | Count of active catalog items in department. |

---

## 4. Cart & CartLine Entity Mapping

Mapping between client-side cart items and Shopify's server-side Storefront API `Cart`:

### Cart Header Mapping

| Local Field (`Cart`) | Local Type | Shopify GraphQL Field | GraphQL Type | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `ID!` | Cart Global ID. Stored in client cookie for persistent checkout sessions. |
| `checkoutUrl` | `string` | `checkoutUrl` | `URL!` | Direct URL to Shopify Hosted Checkout. Customer is redirected here to pay. |
| `totalQuantity` | `number` | `totalQuantity` | `Int!` | Total unit count displayed in header cart badge. |
| `cost.subtotalAmount` | `Money` | `cost.subtotalAmount { amount currencyCode }` | `MoneyV2!` | Order subtotal before taxes and shipping. |
| `cost.totalAmount` | `Money` | `cost.totalAmount { amount currencyCode }` | `MoneyV2!` | Final total amount. |
| `cost.totalTaxAmount` | `Money \| null` | `cost.totalTaxAmount { amount currencyCode }` | `MoneyV2` | Estimated state sales tax (MA). |

### CartLine Item Mapping

| Local Field (`CartLineItem`) | Local Type | Shopify GraphQL Field | GraphQL Type | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `ID!` | Unique line item identifier for quantity update/remove mutations. |
| `quantity` | `number` | `quantity` | `Int!` | Line quantity. |
| `merchandise.id` | `string` | `merchandise.id` | `ID!` | Shopify Variant ID (`gid://shopify/ProductVariant/...`). |
| `merchandise.title` | `string` | `merchandise.title` | `String!` | Variant title. |
| `merchandise.sku` | `string` | `merchandise.sku` | `String` | Product SKU. |
| `merchandise.price` | `Money` | `merchandise.price { amount currencyCode }` | `MoneyV2!` | Unit price. |
| `merchandise.product.title`| `string` | `merchandise.product.title` | `String!` | Product display name. |
| `merchandise.product.handle`| `string` | `merchandise.product.handle` | `String!` | For linking back to product page. |
| `merchandise.product.featuredImage` | `ImageNode` | `merchandise.product.featuredImage` | `Image` | Product thumbnail for drawer with `#DDF1D5` background. |

---

## 5. Customer & Order Entity Mapping

Mapping for customer authentication and purchase history:

| Local Field (`Customer`) | Local Type | Shopify Customer Account API Field | GraphQL Type | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `ID!` | Customer Global ID. |
| `firstName` | `string` | `firstName` | `String` | Customer first name. |
| `lastName` | `string` | `lastName` | `String` | Customer last name. |
| `displayName` | `string` | `displayName` | `String!` | Greeting in account dashboard. |
| `email` | `string` | `emailAddress.emailAddress` | `String!` | Primary email. |
| `phone` | `string \| null` | `phoneNumber.phoneNumber` | `String` | Mobile phone for SMS notifications. |
| `defaultAddress` | `Address \| null` | `defaultAddress { address1 city province zip country }` | `CustomerAddress` | Saved delivery address. |
| `orders` | `CustomerOrder[]` | `orders(first: 20) { edges { node { ... } } }` | `OrderConnection!` | Order history with tracking numbers. |

---

## 6. Discrepancy & Gap Analysis

| Field / Attribute | Local Mock Behavior | Shopify Storefront API Behavior | Resolution Strategy |
| :--- | :--- | :--- | :--- |
| **Price Currency** | Hardcoded USD (`$`) numbers | Dynamic ISO currency object (`amount`, `currencyCode`) | Implemented `formatPrice(money)` helper to handle both numeric and `{ amount, currencyCode }` structures seamlessly. |
| **Product Badges** | Static tags in array (`tags: ["Bestseller"]`) | Shopify Admin product tags (`tags: ["bestseller", "tag_irish_classic"]`) | Case-insensitive tag matching in `ProductCard.tsx` (`tags.some(t => t.toLowerCase() === 'bestseller')`). |
| **Direct Reserve / Telephone Items** | Flagged in local data for direct phone call CTA | Products tagged with `enquiry-only` or `call-to-reserve` in Shopify Admin | Service layer maps `tag:call-to-reserve` to suppress the standard "Add to Cart" button and surface the Quincy phone CTA `(857) 387-2065`. |
| **Image Aspect Ratio** | Uniform pale mint `#DDF1D5` container with `object-fit: contain` | Varies depending on vendor image upload | Frontend CSS container maintains strict pale mint `#DDF1D5` bounding box regardless of uploaded image aspect ratio. |

