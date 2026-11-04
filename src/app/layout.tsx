import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
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
            <Header />
            <main className="flex-1 w-full max-w-none m-0 p-0">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <OrderEnquiryModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

