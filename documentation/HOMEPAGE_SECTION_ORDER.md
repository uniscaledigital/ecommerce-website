# Homepage Section Order — The Irish Grocer

## 1. Overview
This document specifies the verified sequence of sections for The Irish Grocer homepage (`src/app/page.tsx`). The layout places the 9-aisle category carousel immediately below the hero to provide instant category exploration, followed by high-demand snack showcases, new arrivals, and iconic Irish brand staples.

---

## 2. Mandatory Section Sequence

| # | Section Name | Component | Data / Props | Key Elements & Functionality |
|---|---|---|---|---|
| **1** | **Homepage Hero** | `HeroSection.tsx` | Static / Config | Editorial split hero featuring authentic grocery photography, headline (*"Taste of Home: Traditional Pantry & Farmhouse Essentials"*), supporting copy, `Explore Fresh Imports →` CTA, and 3 trust badges (*Direct Cork & Dublin Imports*, *2-Hour Quincy Pickup*, *Cold-Chain Guaranteed*). |
| **2** | **Shop by Category Carousel** | `CategoryCarousel.tsx` | `CATEGORIES` (9 items) | Heading: `Shop by Category`, `View All →` linking to `/shop`. Positioned immediately below the hero. Automatic infinite right-to-left loop of all 9 core departments (*All Products*, *Christmas Treats*, *Tea & Coffee*, *Crisps & Snacks*, *Chocolates & Sweets*, *Bread & Bakery*, *Meats & Refrigerated*, *Sauces & Merchandise*, *Exclusive Finds*). Pauses on hover and keyboard focus; supports manual scrolling/touch swiping. |
| **3** | **Crisps & Savory Snacks** | `CrispsSection.tsx` | `products` (4 items from `crisps-snacks`) | Eyebrow: `THE ORIGINAL CRUNCH • IMPORTED FROM DUBLIN`, Heading: `Crisps & Savory Snacks`, `View all →` linking to `/collections/crisps-snacks`. 4-column responsive grid featuring Tayto, Hula Hoops, and Walkers with prices, stock status, and Add to Cart. |
| **4** | **Fresh New Arrivals** | `NewArrivalsSection.tsx` | `products` (4 items from `new-arrivals`) | Eyebrow: `WEEKLY CONSIGNMENT • DIRECT OCEAN SHIPMENT`, Heading: `Fresh New Arrivals`, `View all →` linking to `/collections/new-arrivals`. 4-column responsive grid with product details, stock indicators, and Add to Cart. |
| **5** | **Ireland's Most Loved Pantry Staples** | `FamiliarBrandsSection.tsx` | Curated brands dataset | Eyebrow: `FAMILIAR BRANDS • TIMELESS FAVOURITES`, Heading: `Ireland's Most Loved Pantry Staples`, `Browse all brands →` linking to `/shop`. 3 spotlight cards: Tayto Cheese & Onion (*The Original Irish Crisp*), Barry's Gold Blend (*Ireland's Master Blend*), Cadbury Dairy Milk (*Classic Irish Recipe*). |
| **6** | **Quincy Store Information** | `StoreInfoSection.tsx` | `SITE_CONFIG` | Local store highlights: 132 East Howard Street, Quincy, MA 02169, 7:00 AM – 10:00 PM (365 days a year), phone `(857) 387-2065`, and in-store pickup details. |
| **7** | **Easy Gifting** | `GiftingSection.tsx` | Static / Link | Gifting promotional banner (*"Give a little taste of home"*) with `Shop Gifts` CTA linking to `/collections/gifts-merchandise`. |
| **8** | **Exclusive Finds** | `ExclusiveFindsSection.tsx` | `SITE_CONFIG` | Specialty shipments notice for artisanal puddings, perishables, and batch imports, with direct call-to-reserve action (`tel:8573872065`). |
| **9** | **Order with Confidence Workflow** | `OrderConfidenceSection.tsx` | Workflow steps | 4-step ordering guide (Browse & Build Basket -> Request Confirmation -> Store Review & Tax -> Secure Payment Link). |

---

## 3. Global Layout Elements
- **Top Announcement Bar**: Quincy MA store notice and motto (*"Enter as a Stranger • Leave as a Friend."*).
- **Header & Navigation**: Brand clover logo, universal search bar, quick actions (Call the store, Account, Cart), and 9-item aisle navigation bar.
- **Newsletter Subscription**: Pre-footer email newsletter capture.
- **Footer**: Store credentials, department directory, help links, and copyright.

---

## 4. Responsive Verification
- **1440px / 1280px Desktop**: ~6 visible category cards, 4 columns for product showcases, 3 columns for brand staples.
- **1024px / 768px Tablet**: ~4 visible category cards, 3 or 2 columns for product showcases, 2 columns for brand staples.
- **430px / 390px / 375px Mobile**: ~2 to 2.5 visible category cards with touch swipe, 2-column product grid, stacked brand cards.
