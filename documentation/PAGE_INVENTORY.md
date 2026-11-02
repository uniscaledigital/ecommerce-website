# Page Inventory — The Irish Grocer

## 1. Storefront Routes & Capabilities

| Route | Page / Feature | Primary Components | Dynamic Data Source | Responsive Layouts |
| :--- | :--- | :--- | :--- | :--- |
| `/` | **Homepage** | Announcement bar, Header, Christmas hero & bundles, Taste of Home hero, Familiar Brands, 15 Department Cards, Crisps & Snacks carousel/grid, New Arrivals, Quincy Store Info, Gifting promo, Exclusive Finds promo, Order with Confidence enquiry card, Newsletter, Footer | Shopify collections, featured products, bundle data | Desktop (1440px), Tablet (768px), Mobile (390px) |
| `/shop` | **Shop / All Products** | Breadcrumbs, Collection Header, Filter Sidebar (In-stock toggle, category checklist), 4-column Product Grid, Sort Dropdown, Pagination (1, 2, 3... 30) | Shopify Products query with pagination & filters | Desktop (4-col), Tablet (3-col), Mobile (2-col + filter drawer) |
| `/collections/[handle]` | **Category Collection Pages** | Collection banner, category description, count, stock filters, sort, product grid | Shopify Collection by handle query | Desktop (4-col), Tablet (3-col), Mobile (2-col) |
| `/products/[handle]` | **Product Detail Page (PDP)** | Breadcrumbs, Product spotlight image gallery, Title, SKU & Barcode, Price/Login message, Variant Selector, Quantity picker, Add to Cart / Order Enquiry CTA, Product details, Share links, Related products | Shopify Product by handle query | Desktop (2-col horizontal), Tablet/Mobile (stacked vertical) |
| `/cart` | **Shopping Cart Page** | Cart items table, image thumbnail, title, variant, unit price, quantity stepper, line total, remove button, subtotal, shipping notice, Checkout CTA | Shopify Cart API (Cart ID persisted in cookie/localStorage) | Desktop (table + sticky summary), Mobile (stacked cards) |
| Drawer | **Slide-Over Cart Drawer** | Header with count, scrollable item list, stepper, item remove, subtotal, checkout button, continue shopping link | Shopify Cart API mutations | Universal slide-out sheet (right side) |
| `/search` | **Search Results Page** | Search query input, Search result count, Tab filters (`Products`, `Collections`, `Blog post`, `Pages`), Product grid, Pagination | Shopify Predictive / Product search query | Responsive grid with active search tabs |
| `/account` | **Customer Account Dashboard** | Welcome greeting, customer profile info (Name, Email, Phone, Default Address), Order history table, Order status badges, Logout CTA | Shopify Customer Account API / Mock session | Desktop (2-col), Mobile (stacked sections) |
| `/account/login` | **Customer Sign-In** | Brand title ("The Irish Grocer"), "Sign in or create an account", Shop Pay button (`Continue with shop`), Email OTP input (`Email` + submit arrow), Marketing checkbox, Privacy policy link | Shopify Customer Account API OAuth / headless OTP | Centered card on clean ivory backdrop |
| Modal / `/enquiry` | **Order Enquiry Workflow** | Basket summary, Quincy delivery policy, Contact & Address form, total estimation notice, submission confirmation | Store enquiry handler / Email dispatch | Responsive modal dialog and standalone page |

---

## 2. Homepage Section Breakdown (21 Distinct Sections)
1. **Utility & Announcement Bar**: Store notice ("Enter as a Stranger • Leave as a Friend." / Quincy MA store info).
2. **Main Header**:
   - Brand Logo (Clover + The Irish Grocer).
   - Global Search input ("Search products or brands") + Dark Green Search button.
   - Quick Actions: "Call the store" (+1 857-387-2065), "Account", "Cart" with item badge.
3. **Primary Navigation Bar**: Full department links (`Exclusive Finds`, `Home`, `Shop`, `Christmas Treats`, `Drinks`, `Chocolates`, `Sweets`, `Crisps & Snacks`, `Tea & Coffee`, `Bread & Bakery`, `Two and a Half Irishmen`, `Frozen`, `Meats`, `Gift`).
4. **Mobile Navigation Drawer**: Slide-over drawer with full category tree, call link, account link, and store hours.
5. **Christmas Promotional Banner**: Festive treat basket visual + "Christmas favourites & festive offers" + "Shop all Christmas →".
6. **Group Buying & Bundle Offers**: "Buying for a group? Choose one bundle..." with 4 cards (Buy 10 Get 1 Free, Buy 10 Get 2 Free, Buy 26 Get 5 Free, Buy 10 Get 1 Free).
7. **Main Hero Section ("A little taste of home")**:
   - Subtitle: `T H E I R I S H G R O C E R · Q U I N CY, M A`
   - Headline: `A little taste of home.`
   - Body: `Your favourite Irish brands, from the first cup of tea to the last crisp in the bag.`
   - Actions: `Shop Irish Favourites →`, `Explore the shop`
   - Bottom note: `A little piece of Ireland in Quincy, Massachusetts.`
8. **Familiar Irish Brands Showcase**: Spotlight cards for `Tayto Cheese & Onion`, `Barry's Gold Blend`, and `Cadbury Dairy Milk`.
9. **Department Grid ("Find your favourites")**: 15 high-res image cards with hover elevation and directional arrows `↗`.
10. **Crisps & Snacks Showcase ("EXPLORE THE RANGE")**: Curated 4-pack grid (Hula Hoops, Tayto Prawn Cocktail, Walkers Cheese & Onion, Walkers Wotsits).
11. **New Arrivals Showcase ("FRESHLY ADDED")**: Sarson's Malt Vinegar, Cadbury Freddo, Aunty's Spotted Dick, Butcher's Fancy Breakfast Sausages.
12. **Quincy Store Information ("A NEIGHBOURHOOD FAVOURITE")**:
    - Descriptive copy on imported Irish & UK grocery favorites.
    - Buttons: `Shop Now`, `Contact Us`.
    - Detailed store card: Address (132 East Howard Street), Hours (7:00 AM – 10:00 PM, 365 days a year), Phone (+1 857-387-2065).
13. **Gifting Section ("EASY GIFTING")**: "Give a little taste of home" card + `Shop Gifts` button.
14. **Exclusive Finds Section ("DISCOVER SOMETHING SPECIAL")**: Enquiry-only delicacies notice, call store highlight (857-387-2065).
15. **Order with Confidence Workflow Banner ("WE'RE HAPPY TO HELP")**:
    - Explanation of order request confirmation, tax/delivery calculation, and secure payment link process.
    - Action CTA: `Review basket & request confirmation →`.
16. **Newsletter Subscription ("Stay in touch")**: "Get new product updates and store news." + Email input + `Join` button.
17. **Global Footer**:
    - Logo & Quincy address.
    - Shop navigation column.
    - Help & Policy navigation column.
    - Store motto banner: "Enter as a Stranger • Leave as a Friend."
    - Copyright: © 2026 The Irish Grocer.

