import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/common/Navbar";
import { ToastContainer } from "@/components/common/ToastContainer";
import { BitesAIAssistant } from "@/components/ai/BitesAIAssistant";

export const metadata: Metadata = {
  title: "Nimbus AI — Document Intelligence & Question Answering API",
  description: "The developer-first API that summarises, extracts, and answers questions about complex documents in milliseconds.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Nimbus AI — Document Intelligence & Question Answering API",
    description: "The developer-first API that summarises, extracts, and answers questions about complex documents in milliseconds.",
    url: "https://nimbus.ai",
    siteName: "Nimbus AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nimbus AI — Document Intelligence & Question Answering API",
    description: "The developer-first API that summarises, extracts, and answers questions about complex documents in milliseconds.",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#05060f] text-slate-100 selection:bg-violet-600 selection:text-white font-sans">
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-[#05060f]">
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
