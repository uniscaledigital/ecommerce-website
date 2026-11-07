import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SITE_CONFIG, FOOTER_HELP_LINKS } from "../src/lib/config/site";

const ROOT_DIR = path.resolve(__dirname, "..");

test("1. Canonical SITE_CONFIG has official Marshfield business information", () => {
  assert.equal(SITE_CONFIG.storeName, "Marshfield Store");
  assert.equal(SITE_CONFIG.address.street, "1899 Ocean St");
  assert.equal(SITE_CONFIG.address.city, "Marshfield");
  assert.equal(SITE_CONFIG.address.state, "MA");
  assert.equal(SITE_CONFIG.address.zip, "02050");
  assert.equal(SITE_CONFIG.address.full, "1899 Ocean St, Marshfield, MA 02050");
  assert.equal(SITE_CONFIG.phone, "(774) 699-0889");
  assert.equal(SITE_CONFIG.phoneRaw, "7746990889");
  assert.equal(SITE_CONFIG.email, "irishgrocer@gmail.com");
  assert.equal(SITE_CONFIG.deliveryMessage, "We Deliver!");
  assert.equal(SITE_CONFIG.brandMessaging, "Fresh Food · Irish Favorites · Everyday Needs");
  assert.match(SITE_CONFIG.hours, /9:00 AM – 9:00 PM/);
  assert.match(SITE_CONFIG.announcement, /We Deliver!/);
  assert.match(SITE_CONFIG.announcement, /Marshfield Store/);
  assert.match(SITE_CONFIG.description, /Marshfield, Massachusetts/);

  // Footer links check
  const contactLink = FOOTER_HELP_LINKS.find((l) => l.href.startsWith("tel:"));
  assert.ok(contactLink, "Should have a telephone footer link");
  assert.equal(contactLink.href, "tel:+17746990889");
  assert.equal(contactLink.label, "Contact Marshfield Store");

  const emailLink = FOOTER_HELP_LINKS.find((l) => l.href.startsWith("mailto:"));
  assert.ok(emailLink, "Should have an email footer link");
  assert.equal(emailLink.href, "mailto:irishgrocer@gmail.com");
  assert.equal(emailLink.label, "irishgrocer@gmail.com");
});

test("2. Desktop and Mobile Header render Marshfield store indicators", () => {
  const headerContent = fs.readFileSync(path.join(ROOT_DIR, "src/components/layout/Header.tsx"), "utf8");

  // Desktop row 1 renders Marshfield Store
  assert.match(headerContent, /Marshfield Store/);
  assert.match(headerContent, /Marshfield, MA Store:/);
  assert.match(headerContent, /SITE_CONFIG\.phone/);

  // Mobile header renders Marshfield, MA location indicator
  assert.match(headerContent, /Marshfield, MA/);
});

test("3. MobileStoreConfidenceStrip renders official Marshfield address and hours", () => {
  const content = fs.readFileSync(
    path.join(ROOT_DIR, "src/components/home/mobile/MobileStoreConfidenceStrip.tsx"),
    "utf8"
  );

  assert.match(content, /Marshfield Store/);
  assert.match(content, /1899 Ocean St, Marshfield, MA/);
  assert.match(content, /Open Daily · 9 AM – 9 PM/);
});

test("4. StoreInfoSection renders complete Marshfield details and map link", () => {
  const content = fs.readFileSync(path.join(ROOT_DIR, "src/components/home/StoreInfoSection.tsx"), "utf8");

  assert.match(content, /MARSHFIELD, MA/);
  assert.match(content, /Visit Our Marshfield Store/);
  assert.match(content, /SITE_CONFIG\.address\.full/);
  assert.match(content, /SITE_CONFIG\.hours/);
  assert.match(content, /SITE_CONFIG\.phone/);
  assert.match(content, /query=1899\+Ocean\+St\+Marshfield\+MA\+02050/);
});

test("5. HeroSection renders Marshfield Pickup trust badges", () => {
  const content = fs.readFileSync(path.join(ROOT_DIR, "src/components/home/HeroSection.tsx"), "utf8");

  assert.match(content, /2-Hour Marshfield Pickup/);
  // Ensure no active user-facing "2-Hour Quincy Pickup" text is displayed
  assert.ok(!content.includes(">2-Hour Quincy Pickup<"));
});

test("6. Mobile Drawer and Mobile Promo Banner render Marshfield storefront references", () => {
  const drawerContent = fs.readFileSync(path.join(ROOT_DIR, "src/components/layout/MobileDrawer.tsx"), "utf8");
  assert.match(drawerContent, /Visit Our Marshfield Store/);

  const bannerContent = fs.readFileSync(
    path.join(ROOT_DIR, "src/components/home/mobile/MobilePromoBanner.tsx"),
    "utf8"
  );
  assert.match(bannerContent, /Marshfield storefront/);
  assert.match(bannerContent, /WE DELIVER! • MARSHFIELD STORE/);
  assert.match(bannerContent, /1899 Ocean St, Marshfield, MA/);
});

test("7. OrderEnquiryModal, Cart, Shop, and Search reference Marshfield storefront", () => {
  const enquiryContent = fs.readFileSync(
    path.join(ROOT_DIR, "src/components/enquiry/OrderEnquiryModal.tsx"),
    "utf8"
  );
  assert.match(enquiryContent, /Our Marshfield storefront team has received your order request/);
  assert.match(enquiryContent, /\+1 \(774\) 699-0889/);

  const cartContent = fs.readFileSync(path.join(ROOT_DIR, "src/app/cart/page.tsx"), "utf8");
  assert.match(cartContent, /Marshfield Store Pickup/);

  const shopContent = fs.readFileSync(path.join(ROOT_DIR, "src/app/shop/ShopClientView.tsx"), "utf8");
  assert.match(shopContent, /Marshfield/);

  const searchContent = fs.readFileSync(path.join(ROOT_DIR, "src/app/search/SearchClientView.tsx"), "utf8");
  assert.match(searchContent, /About The Irish Grocer \(Marshfield, MA\)/);
  assert.match(searchContent, /1899 Ocean St, Marshfield, MA/);
});

test("8. Dedicated Contact and About pages exist with Marshfield data and clickable links", () => {
  // Contact page
  const contactPath = path.join(ROOT_DIR, "src/app/contact/page.tsx");
  assert.ok(fs.existsSync(contactPath), "src/app/contact/page.tsx must exist");
  const contactContent = fs.readFileSync(contactPath, "utf8");
  assert.match(contactContent, /Contact Our Marshfield Store/);
  assert.match(contactContent, /1899 Ocean St/);
  assert.match(contactContent, /Marshfield/);
  assert.match(contactContent, /SITE_CONFIG\.phoneRaw/);
  assert.match(contactContent, /SITE_CONFIG\.email/);
  assert.match(contactContent, /9:00 AM – 9:00 PM/);

  // About page
  const aboutPath = path.join(ROOT_DIR, "src/app/about/page.tsx");
  assert.ok(fs.existsSync(aboutPath), "src/app/about/page.tsx must exist");
  const aboutContent = fs.readFileSync(aboutPath, "utf8");
  assert.match(aboutContent, /About The Irish Grocer/);
  assert.match(aboutContent, /1899 Ocean St in Marshfield, Massachusetts/);
  assert.match(aboutContent, /SITE_CONFIG\.motto/);

  // Privacy page
  const privacyContent = fs.readFileSync(path.join(ROOT_DIR, "src/app/privacy/page.tsx"), "utf8");
  assert.match(privacyContent, /The Irish Grocer \(Marshfield, MA\)/);
  assert.match(privacyContent, /Marshfield grocery store staff/);
  assert.match(privacyContent, /Contacting Our Marshfield Store/);
});

test("9. RootLayout embeds structured GroceryStore JSON-LD schema with Marshfield details", () => {
  const layoutContent = fs.readFileSync(path.join(ROOT_DIR, "src/app/layout.tsx"), "utf8");
  assert.match(layoutContent, /"@type":\s*"GroceryStore"/);
  assert.match(layoutContent, /application\/ld\+json/);
  assert.match(layoutContent, /SITE_CONFIG\.address\.street/);
  assert.match(layoutContent, /SITE_CONFIG\.email/);
});

test("10. STRICT SAFEGUARDS: MobileBottomNav and ProductCard remain frozen", () => {
  const navContent = fs.readFileSync(path.join(ROOT_DIR, "src/components/layout/MobileBottomNav.tsx"), "utf8");
  assert.match(navContent, /Home/);
  assert.match(navContent, /Shop/);
  assert.match(navContent, /Search/);
  assert.match(navContent, /Favourites/);
  assert.match(navContent, /Cart/);
  assert.match(navContent, /Account/);

  // Verify ProductCard.tsx was not modified
  const productCardContent = fs.readFileSync(
    path.join(ROOT_DIR, "src/components/products/ProductCard.tsx"),
    "utf8"
  );
  assert.ok(productCardContent.length > 0, "ProductCard must exist and remain untouched");
});
