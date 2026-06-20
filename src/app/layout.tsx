import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ontario Health Navigator",
    template: "%s | Ontario Health Navigator"
  },
  description:
    "Plain-language placeholder healthcare navigation information for newcomers to Ontario."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-ink focus:ring-2 focus:ring-brand-blue"
        >
          Skip to main content
        </a>
        <EmergencyBanner />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
