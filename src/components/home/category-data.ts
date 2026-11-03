export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  altText: string;
  collectionHandle: string;
  href: string;
}

/**
 * The 9 authentic Irish Grocer categories in exact specified order:
 * 1. All Products
 * 2. Christmas Treats
 * 3. Tea & Coffee
 * 4. Crisps & Snacks
 * 5. Chocolates & Sweets
 * 6. Bread & Bakery
 * 7. Meats & Refrigerated
 * 8. Sauces & Merchandise
 * 9. Exclusive Finds
 */
export const CATEGORIES: CategoryItem[] = [
  {
    id: "all-products",
    name: "All Products",
    image: "/assets/categories/grocery.png",
    altText: "Irish grocery assortment - All Products",
    collectionHandle: "all",
    href: "/shop",
  },
  {
    id: "christmas-treats",
    name: "Christmas Treats",
    image: "/assets/categories/christmas.png",
    altText: "Christmas gift basket - Christmas Treats",
    collectionHandle: "christmas",
    href: "/collections/christmas",
  },
  {
    id: "tea-coffee",
    name: "Tea & Coffee",
    image: "/assets/categories/tea-coffee.png",
    altText: "Barry's tea and coffee - Tea & Coffee",
    collectionHandle: "tea-coffee",
    href: "/collections/tea-coffee",
  },
  {
    id: "crisps-snacks",
    name: "Crisps & Snacks",
    image: "/assets/categories/crisps-snacks.png",
    altText: "Tayto and Irish crisps - Crisps & Snacks",
    collectionHandle: "crisps-snacks",
    href: "/collections/crisps-snacks",
  },
  {
    id: "candies-sweets",
    name: "Chocolates & Sweets",
    image: "/assets/categories/candies-sweets.png",
    altText: "Chocolates and Irish sweets - Chocolates & Sweets",
    collectionHandle: "candies-sweets",
    href: "/collections/candies-sweets",
  },
  {
    id: "bread-bakery",
    name: "Bread & Bakery",
    image: "/assets/categories/bread-bakery.png",
    altText: "Soda bread and bakery products - Bread & Bakery",
    collectionHandle: "bread-bakery",
    href: "/collections/bread-bakery",
  },
  {
    id: "meats",
    name: "Meats & Refrigerated",
    image: "/assets/categories/meats.png",
    altText: "Irish sausages and chilled products - Meats & Refrigerated",
    collectionHandle: "meats",
    href: "/collections/meats",
  },
  {
    id: "sauces-condiments",
    name: "Sauces & Merchandise",
    image: "/assets/categories/sauces-condiments.png",
    altText: "Sauces and condiment products - Sauces & Merchandise",
    collectionHandle: "sauces-condiments",
    href: "/collections/sauces-condiments",
  },
  {
    id: "exclusive-finds",
    name: "Exclusive Finds",
    image: "/assets/categories/gifts-merchandise.png",
    altText: "Special imported Irish products - Exclusive Finds",
    collectionHandle: "exclusive-finds",
    href: "/collections/exclusive-finds",
  },
];

