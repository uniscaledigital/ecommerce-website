import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "..");

test("Phase 21 / Milestone v9.0 Desktop Favourites Navigation Integration Suite", async (t) => {
  const headerCode = fs.readFileSync(
    path.join(projectRoot, "src/components/layout/Header.tsx"),
    "utf-8"
  );
  const mobileNavCode = fs.readFileSync(
    path.join(projectRoot, "src/components/layout/MobileBottomNav.tsx"),
    "utf-8"
  );
  const cardCode = fs.readFileSync(
    path.join(projectRoot, "src/components/products/ProductCard.tsx"),
    "utf-8"
  );

  // --------------------------------------------------------------------------
  // 1. Desktop Header Action Placement & Attributes (REQ-901)
  // --------------------------------------------------------------------------
  await t.test("Desktop Header: Favourites link positioned between Account and Cart in exact order", () => {
    // Assert 6 destinations in desktop row 1 in strict order
    const logoIndex = headerCode.indexOf('aria-label="The Irish Grocer Homepage"');
    const searchIndex = headerCode.indexOf('aria-label="Search products"');
    const storeIndex = headerCode.indexOf('Quincy Store');
    const accountIndex = headerCode.indexOf('customer?.firstName || (isAuthenticated ? "Account" : "Sign in")');
    const favIndex = headerCode.indexOf('href="/favorites"');
    const cartIndex = headerCode.indexOf('aria-label="Shopping Cart"');

    assert.ok(logoIndex !== -1, "Logo must exist in desktop header");
    assert.ok(searchIndex !== -1, "Search capsule must exist in desktop header");
    assert.ok(storeIndex !== -1, "Quincy Store control must exist in desktop header");
    assert.ok(accountIndex !== -1, "Sign in / Account control must exist in desktop header");
    assert.ok(favIndex !== -1, "Favourites control must exist in desktop header");
    assert.ok(cartIndex !== -1, "Shopping Cart control must exist in desktop header");

    assert.ok(logoIndex < searchIndex, "Logo must precede Search");
    assert.ok(searchIndex < storeIndex, "Search must precede Quincy Store");
    assert.ok(storeIndex < accountIndex, "Quincy Store must precede Account");
    assert.ok(accountIndex < favIndex, "Account must precede Favourites");
    assert.ok(favIndex < cartIndex, "Favourites must precede Cart");
  });

  await t.test("Desktop Header: Favourites link has direct /favorites destination without modal/drawer", () => {
    assert.ok(
      headerCode.includes('<Link') && headerCode.includes('href="/favorites"'),
      "Desktop Favourites control must be a direct Next.js <Link href='/favorites'>"
    );
    assert.ok(
      !headerCode.includes('openFavoritesDrawer') && !headerCode.includes('isFavoritesModalOpen'),
      "Desktop Favourites must NOT trigger a drawer or modal"
    );
  });

  await t.test("Desktop Header: Heart icon styling, active filled state, and background highlight", () => {
    assert.ok(headerCode.includes("Heart"), "Header.tsx must import Heart icon from lucide-react");
    assert.ok(
      headerCode.includes("isFavoritesActive"),
      "Header.tsx must track isFavoritesActive state"
    );
    assert.ok(
      headerCode.includes('pathname === "/favorites"'),
      "isFavoritesActive must be derived from pathname === '/favorites'"
    );
    assert.ok(
      headerCode.includes('fill-[#14532D] text-[#14532D]'),
      "Heart icon must be filled Forest Green #14532D when active on /favorites"
    );
    assert.ok(
      headerCode.includes('bg-[#14532D]/10 font-bold'),
      "Favourites link must apply active background tint and bold font when active"
    );
  });

  // --------------------------------------------------------------------------
  // 2. Desktop Live Numeric Badge & State Sync (REQ-902)
  // --------------------------------------------------------------------------
  await t.test("Desktop Header: Live numeric badge displays wishlistCount and matches Cart badge styling", () => {
    assert.ok(
      headerCode.includes("useWishlist"),
      "Header.tsx must import and consume useWishlist hook"
    );
    assert.ok(
      headerCode.includes("wishlistCount"),
      "Header.tsx must consume wishlistCount from useWishlist"
    );
    assert.ok(
      headerCode.includes("isLoaded && wishlistCount > 0"),
      "Badge must render only when isLoaded and wishlistCount > 0 (omitted when 0)"
    );
    assert.ok(
      headerCode.includes("bg-[#22C55E]") && headerCode.includes("text-[#14532D]"),
      "Badge must use Emerald #22C55E background and Forest Green #14532D text"
    );
    assert.ok(
      headerCode.includes("-top-1.5 -right-2"),
      "Badge position must align to top-right of heart icon matching Cart badge"
    );
  });

  await t.test("Desktop Header: Accessibility attributes and responsive text label", () => {
    assert.ok(
      headerCode.includes('aria-label={`Favourites, ${wishlistCount} saved products`}') ||
      headerCode.includes('Favourites, ${wishlistCount}'),
      "Favourites link must have accessible aria-label with live item count"
    );
    assert.ok(
      headerCode.includes('aria-current={isFavoritesActive ? "page" : undefined}'),
      "Favourites link must declare aria-current='page' when active"
    );
    assert.ok(
      headerCode.includes('title="Favourites"'),
      "Favourites link must provide tooltip title"
    );
    assert.ok(
      headerCode.includes('className="hidden xl:inline">Favourites<'),
      "Favourites text label must be responsive (hidden xl:inline) to protect 1024px space"
    );
  });

  // --------------------------------------------------------------------------
  // 3. Strict Mobile Design Freeze & Breakpoint Fencing (REQ-903)
  // --------------------------------------------------------------------------
  await t.test("Mobile Design Freeze: Desktop Favourites link is strictly hidden below 1024px", () => {
    assert.ok(
      headerCode.includes('hidden lg:inline-flex'),
      "Desktop Favourites link must enforce hidden lg:inline-flex"
    );

    // Extract the complete mobile header region (<div className="lg:hidden flex flex-col gap-1.5"> up to header-categories)
    const mobileHeaderStart = headerCode.indexOf('<div className="lg:hidden flex flex-col gap-1.5">');
    const mobileHeaderEnd = headerCode.indexOf('header-categories', mobileHeaderStart);
    assert.ok(mobileHeaderStart !== -1, "Mobile header region start must exist");
    assert.ok(mobileHeaderEnd !== -1, "Mobile header region end (header-categories) must exist");
    const mobileHeaderBlock = headerCode.substring(mobileHeaderStart, mobileHeaderEnd);

    assert.ok(
      !mobileHeaderBlock.includes('href="/favorites"'),
      "Mobile header region must NOT contain any Favourites link (strictly desktop only)"
    );
  });

  await t.test("Mobile Design Freeze: MobileBottomNav.tsx remains completely frozen and protected", () => {
    // Assert 6 destinations in exact order preserved in MobileBottomNav
    assert.ok(mobileNavCode.includes("grid-cols-6"), "MobileBottomNav must remain grid-cols-6");
    assert.ok(mobileNavCode.includes('href="/"'), "MobileBottomNav destination 1: Home");
    assert.ok(mobileNavCode.includes('href="/shop"'), "MobileBottomNav destination 2: Shop");
    assert.ok(mobileNavCode.includes('href="/search"'), "MobileBottomNav destination 3: Search");
    assert.ok(mobileNavCode.includes('href="/favorites"'), "MobileBottomNav destination 4: Favourites");
    assert.ok(mobileNavCode.includes('onClick={openCart}'), "MobileBottomNav destination 5: Cart");
    assert.ok(mobileNavCode.includes('href="/account"'), "MobileBottomNav destination 6: Account");
  });

  await t.test("Safety Invariant: ProductCard.tsx design tokens and components remain untouched", () => {
    assert.ok(cardCode.includes("bg-[#EDF8E9]"), "ProductCard background token #EDF8E9 must remain");
    assert.ok(cardCode.includes("border-[#D0E7C9]"), "ProductCard border token #D0E7C9 must remain");
    assert.ok(cardCode.includes("ProductImage"), "ProductCard must delegate image and heart to ProductImage");
  });
});

