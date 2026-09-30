import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/common/Navbar";
import { ToastContainer } from "@/components/common/ToastContainer";
import { BitesAIAssistant } from "@/components/ai/BitesAIAssistant";

export const metadata: Metadata = {
  title: "CanteenBites — Order. Track. Enjoy.",
  description: "Modern college canteen food-ordering platform for students, hostel room delivery, and live kitchen tracking.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CanteenBites — Order. Track. Enjoy.",
    description: "Skip the queue! Order from your college canteen, track kitchen prep in real time, and enjoy door-to-door hostel room delivery.",
    url: "https://canteenbites.sviet.ac.in",
    siteName: "CanteenBites",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanteenBites — Order. Track. Enjoy.",
    description: "Skip physical queues with real-time college canteen food ordering and hostel delivery.",
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
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
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pb-16">{children}</main>
            <ToastContainer />
            <BitesAIAssistant />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
