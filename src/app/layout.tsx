import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DemoCheckoutModal } from "@/components/cart/DemoCheckoutModal";
import { OrderEnquiryModal } from "@/components/enquiry/OrderEnquiryModal";
import { SITE_CONFIG } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/banners/christmas-banner-large.png",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDF4E3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FDF4E3] text-[#1F2937] w-full max-w-full m-0 p-0 overflow-x-clip">
        <AuthProvider>
          <CartProvider>
            {/* Skip to Main Content Link (WCAG 2.4.1) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-[#14532D] focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            >
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1 w-full max-w-none m-0 p-0 focus:outline-none" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <DemoCheckoutModal />
            <OrderEnquiryModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

