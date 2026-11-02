# Asset Mapping — The Irish Grocer

## 1. Overview
All visual assets have been extracted from `Untitled.fig` and `Untitled.pdf` into `website/public/assets/`. No third-party placeholders, emojis, or generic stock photos are used. Every product and department displays its authentic photograph.

---

## 2. Directory Structure

```
website/public/assets/
├── logo/
│   └── the-irish-grocer-logo.png              # Official 4-leaf clover brand mark (2172x724)
├── banners/
│   ├── christmas-basket.png                   # Christmas treat basket (600x400)
│   └── christmas-banner-large.png             # Full festive promotional hero (2880x1620)
├── categories/
│   ├── christmas.png                          # Christmas Department (900x600)
│   ├── bread-bakery.png                       # Bread & Bakery Department (900x600)
│   ├── candies-sweets.png                     # Candies & Sweets Department (900x600)
│   ├── biscuits-cookies.png                   # Biscuits & Cookies Department (900x600)
│   ├── clothing.png                           # Clothing Department (900x600)
│   ├── crisps-snacks.png                      # Crisps & Snacks Department (900x600)
│   ├── drinks.png                             # Drinks Department (900x600)
│   ├── meats.png                              # Meats Department (900x600)
│   ├── gifts-merchandise.png                  # Gifts & Merchandise Department (900x600)
│   ├── grocery.png                            # Grocery Department (900x600)
│   ├── oats-cereals.png                       # Oats & Cereals Department (900x600)
│   ├── new-arrivals.png                       # New Arrivals Department (900x600)
│   ├── sauces-condiments.png                  # Sauces & Condiments Department (900x600)
│   ├── tea-coffee.png                         # Tea & Coffee Department (900x600)
│   └── bundles.png                            # Bundles Department (900x600)
├── products/
│   ├── tayto-cheese-onion-hero.png            # Tayto Cheese & Onion (Hero Showcase)
│   ├── barrys-gold-blend-hero.png             # Barry's Gold Blend (Hero Showcase)
│   ├── cadbury-dairy-milk-hero.png            # Cadbury Dairy Milk (Hero Showcase)
│   ├── hula-hoops-family-6pk.png              # Hula Hoops Family 6pk
│   ├── tayto-prawn-cocktail-37g.png           # Tayto Prawn Cocktail 37g
│   ├── walkers-cheese-onion-6pk.png           # Walker Cheese and Onion 6pk
│   ├── walkers-wotsits-cheese-6pk.png         # Walkers Wotsits Cheese 6pk
│   ├── sarsons-malt-vinegar-300ml.png         # Sarson's Malt Vinegar 300ml
│   ├── cadbury-freddo-18g.png                 # Cadbury Freddo 18g
│   ├── auntys-spotted-dick.png                # Aunty's Spotted Dick
│   ├── butchers-fancy-breakfast-pork-sausages.png # Butcher's Fancy Sausages
│   ├── aah-bisto-200g.png                     # Aah Bisto 200g
│   ├── aah-bisto-onion-gravy-granules.png     # Aah Bisto Onion Gravy
│   ├── abbey-farm-blackcurrant-jam.png        # Abbey Farm Blackcurrant
│   ├── abbey-farm-blackcurrant-jam-350g.png   # Abbey Farm 350g
│   ├── abbey-farm-gooseberry-jam.png          # Abbey Farm Gooseberry
│   ├── abbey-farm-raspberry-jam.png           # Abbey Farm Raspberry
│   ├── abbey-farm-rhubarb-ginger-jam.png      # Abbey Farm Rhubarb & Ginger
│   ├── abbey-farm-strawberry-jam.png          # Abbey Farm Strawberry
│   ├── adams-village-back-bacon-rashers-32oz.png # Adam's Village 32oz
│   ├── adams-village-bacon-rashers-454g.png   # Adam's Village 454g
│   ├── adams-village-breakfast-sausages.png   # Adam's Village Sausages
│   ├── adams-village-jumbo-sausages.png       # Adam's Village Jumbo
│   ├── adams-village-white-pudding-10oz.png   # Adam's Village White Pudding
│   ├── aero-chocolate-36g.png                 # Aero Milk Chocolate 36g
│   ├── aero-chocolate-90g.png                 # Aero Milk Chocolate 90g
│   ├── aero-peppermint-90g.png                # Aero Peppermint 90g
│   ├── alpen-original-550g.png                # Alpen Muesli 550g
│   ├── ambrosia-custard-400g.png              # Ambrosia Devon Custard 400g
│   ├── ambrosia-rice-pudding-400g.png         # Ambrosia Rice Pudding 400g
│   ├── ballygowan-sparkling-330ml.png         # Ballygowan Sparkling Water
│   ├── ballygowan-still-water-330ml.png       # Ballygowan Still Water
│   ├── barrys-gold-blend-loose-leaf-250g.png  # Barry's Loose Leaf Tea
│   ├── barrys-decaffeinated-tea-40ct.png      # Barry's Decaf Tea 40ct
│   ├── barrys-gold-blend-80ct.png             # Barry's Gold Blend 80ct
│   ├── barrys-master-blend-80ct.png           # Barry's Master Blend 80ct
│   ├── lyons-original-80ct.png                # Lyons Original 80ct
│   ├── barrys-gold-blend-40ct.png             # Barry's Gold Blend 40ct
│   ├── barrys-irish-breakfast-80ct.png        # Barry's Irish Breakfast 80ct
│   ├── barrys-irish-breakfast-40ct.png        # Barry's Irish Breakfast 40ct
│   ├── barrys-gold-blend-200ct.png            # Barry's Gold Blend 200ct
│   ├── barrys-tea-500ct.png                   # Barry's Tea 500ct
│   ├── scampi-fries-27g.png                   # Scampi Fries 27g
│   ├── walkers-monster-munch-pickled-onion-6pk.png # Monster Munch 6pk
│   ├── tayto-ni-assorted-crisps.png           # Tayto NI Assorted 6pk
│   ├── tayto-skips-17g.png                    # Tayto Skips 17g
│   ├── pipers-cheese-onion.png                # Pipers Cheese & Onion
│   ├── tayto-ni-prawn-cocktail-32g.png        # Tayto NI Prawn Cocktail
│   ├── snax-6pk-102g.png                      # Snax 6pk
│   ├── odonnells-irish-sea-salt-vinegar.png   # O'Donnells Sea Salt & Vinegar
│   ├── odonnells-cheese-onion-44g.png         # O'Donnells Cheese & Onion
│   ├── king-cheese-onion-26g.png              # King Cheese & Onion
│   ├── odonells-chz-n-onion.png               # O'Donnells Chz & Onion
│   ├── odonnells-tipperary-relish-cheddar.png # O'Donnells Tipperary Relish
│   ├── kelkin-dark-choc-ricecake.png          # Kelkin Dark Choc Rice Cake
│   ├── kelkin-chocolate-rice-cake-100g.png    # Kelkin Choc Rice Cake
│   ├── kelkin-yogurt-rice-cake.png            # Kelkin Yogurt Rice Cake
│   ├── walkers-cheese-onion-32g.png           # Walkers Cheese & Onion 32.5g
│   ├── walkers-wotsits.png                    # Walkers Wotsits Single
│   ├── walkers-salt-vinegar.png               # Walkers Salt & Vinegar
│   └── walkers-prawn-cocktail.png             # Walkers Prawn Cocktail
├── miscellaneous/
│   ├── product-card-spotlight.png             # Dark radial spotlight frame (616x828)
│   └── [original-figma-hashes].png            # Full archive of raw extracted Figma assets
└── icons/
    └── lucide-icons                           # Standardized Lucide React vector icons
```

---

## 3. Product-to-Asset Mapping Table

| Product Title | Category | Extracted File | Dimensions | Source Ref |
| :--- | :--- | :--- | :--- | :--- |
| **Hula hoops Family 6pk** | Crisps & Snacks | `hula-hoops-family-6pk.png` | 700x700 | PDF Page 10, xref=3642 |
| **Tayto Prawn Cocktail 37gm** | Crisps & Snacks | `tayto-prawn-cocktail-37g.png` | 700x700 | PDF Page 10, xref=3638 |
| **Walker Cheese and Onion 6 pk** | Crisps & Snacks | `walkers-cheese-onion-6pk.png` | 700x700 | PDF Page 10, xref=3646 |
| **Walkers Wotsits Cheese 6 Pack**| Crisps & Snacks | `walkers-wotsits-cheese-6pk.png`| 700x700 | PDF Page 10, xref=3626 |
| **Sarson's Malt Vinegar 300ML** | Sauces / New Arrivals | `sarsons-malt-vinegar-300ml.png` | 700x700 | PDF Page 10, xref=3562 |
| **Cadbury Freddo 18g** | Sweets / New Arrivals | `cadbury-freddo-18g.png` | 700x700 | PDF Page 10, xref=3558 |
| **Aunty's Spotted Dick** | Bakery / New Arrivals | `auntys-spotted-dick.png` | 700x700 | PDF Page 10, xref=3566 |
| **Butcher's Fancy Breakfast Sausages** | Meats / New Arrivals | `butchers-fancy-breakfast-pork-sausages.png` | 700x700 | PDF Page 10, xref=3546 |
| **Scampi Fries 27G** | Crisps & Snacks | `scampi-fries-27g.png` | 300x300 | PDF Page 18, xref=21853 |
| **Walkers Monster Munch 6pk** | Crisps & Snacks | `walkers-monster-munch-pickled-onion-6pk.png` | 300x300 | PDF Page 18, xref=21747 |
| **Tayto NI Assorted Crisps** | Crisps & Snacks | `tayto-ni-assorted-crisps.png` | 300x300 | PDF Page 18, xref=21849 |
| **Tayto Skips 17G** | Crisps & Snacks | `tayto-skips-17g.png` | 300x300 | PDF Page 18, xref=21813 |
| **Barry's Gold Blend Tea 80ct** | Tea & Coffee | `barrys-gold-blend-80ct.png` | 480x480 | PDF Page 24, xref=27595 |
| **Lyons original 80 ct** | Tea & Coffee | `lyons-original-80ct.png` | 480x480 | PDF Page 24, xref=27573 |
| **Aah Bisto 200g** | Grocery / Catalog | `aah-bisto-200g.png` | 300x300 | PDF Page 14, xref=15615 |
| **Abbey Farm Blackcurrant Jam** | Grocery / Catalog | `abbey-farm-blackcurrant-jam.png`| 300x300 | PDF Page 14, xref=15669 |
| **Adam's Village Breakfast Sausages** | Meats / Catalog | `adams-village-breakfast-sausages.png` | 300x300 | PDF Page 14, xref=15581 |
| **Aero Peppermint 90g** | Chocolates / Catalog | `aero-peppermint-90g.png` | 300x300 | PDF Page 14, xref=15515 |
| **Ballygowan Sparkling 330ml** | Drinks / Catalog | `ballygowan-sparkling-330ml.png` | 300x300 | PDF Page 14, xref=15471 |

---

## 4. Fallback Strategy
If any dynamic product loaded from Shopify lacks an image or points to a non-existent CDN URL, the application provides an authentic fallback to the brand's relevant category banner (e.g. `tea-coffee.png` or `crisps-snacks.png`) layered over the dark spotlight background, ensuring a consistent visual presentation with zero broken images.

