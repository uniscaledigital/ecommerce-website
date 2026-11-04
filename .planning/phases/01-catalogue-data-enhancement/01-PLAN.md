---
phase: "01-catalogue-data-enhancement"
plan: "01"
title: "Catalogue Data Enhancement & Attribute Mapping"
wave: 1
dependencies: []
files_modified:
  - "src/lib/data/products.ts"
  - "tests/remediation.test.ts"
---

# Plan 01: Catalogue Data Enhancement & Attribute Mapping

## Objective
Normalize and enrich the mock product data in `src/lib/data/products.ts` so all 7 filter dimensions are fully backed by authentic, structured product fields. Ensure zero schema breakages and verify that all 38 existing remediation tests pass.

## Tasks
1. **Dietary & Lifestyle Tags Normalization**:
   - Standardize tags across `PRODUCTS` in `src/lib/data/products.ts` to include canonical attributes:
     - `Gluten-Free` (e.g., Kelkin Rice Cakes, Ballygowan Water, Barry's Tea, O'Donnells Crisps)
     - `Vegetarian` (e.g., Cadbury Dairy Milk, Barry's Gold Blend, Tayto Crisps, Abbey Farm Jam)
     - `Vegan` (e.g., Barry's Tea, Ballygowan Water, Sarson's Malt Vinegar, Alpen Original)
     - `Irish Made` / `Artisanal` (e.g., Abbey Farm, O'Donnells, Barry's Tea, Tayto)
     - `Multipack` (e.g., Hula Hoops 6pk, Tayto NI Assorted Crisps 6pk)

2. **Customer Rating Population**:
   - Add realistic `rating: { value: number, count: number }` objects to products matching the existing `ProductRating` interface in `src/types/index.ts`.
   - Examples:
     - Barry's Gold Blend: `rating: { value: 4.9, count: 184 }`
     - Tayto Cheese & Onion: `rating: { value: 4.8, count: 215 }`
     - Cadbury Dairy Milk: `rating: { value: 4.9, count: 142 }`
     - Abbey Farm Strawberry Jam: `rating: { value: 4.6, count: 58 }`
     - Bisto Gravy Granules: `rating: { value: 4.7, count: 89 }`
     - Adams Village Bacon Rashers: `rating: { value: 4.8, count: 76 }`
     - O'Donnells Sea Salt & Vinegar: `rating: { value: 4.7, count: 64 }`

3. **Stock Availability Variation**:
   - Set `availableForSale: false` on 2-3 specific seasonal/specialty items:
     - `Aunty's Spotted Dick` (`prod-auntys-spotted-dick`) -> `availableForSale: false`, variant `availableForSale: false`.
     - `Cadbury Freddo` (`prod-cadbury-freddo`) -> `availableForSale: false`, variant `availableForSale: false`.
   - Ensure the remaining 32 items remain `availableForSale: true`.

4. **Automated Verification**:
   - Run `npx tsc --noEmit`
   - Run `npm run lint`
   - Run `npm test` (verify all 38 tests pass)
   - Re-verify `sitemap.xml` dynamic test (which tests filtering products by `availableForSale`)

