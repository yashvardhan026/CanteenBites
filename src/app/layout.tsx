import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/common/Navbar";
import { ToastContainer } from "@/components/common/ToastContainer";
import { BitesAIAssistant } from "@/components/ai/BitesAIAssistant";

export const metadata: Metadata = {
  title: "CanteenBites — Smart Campus Food Ordering & Hostel Delivery",
  description: "Explore your college canteen menu, order your favourites, track preparation live, and get food delivered straight to your hostel.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CanteenBites — Smart Campus Food Ordering & Hostel Delivery",
    description: "Skip the physical queue! Order from your campus canteen, track kitchen prep in real time, and enjoy door-to-door hostel room delivery.",
    url: "https://canteen-bites-ufe9.vercel.app",
    siteName: "CanteenBites",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanteenBites — Smart Campus Food Ordering & Hostel Delivery",
    description: "Skip physical queues with real-time college canteen food ordering and hostel room delivery.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0B1220] text-[#F8FAFC] selection:bg-[#FFB454] selection:text-[#0B1220] font-sans">
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-[#0B1220]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <ToastContainer />
            <BitesAIAssistant />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
