import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://debtnext.com"
  ),
  title: {
    default: "dPlat: Recovery management software",
    template: "%s | dPlat",
  },
  description:
    "dPlat connects credit originators with their recovery vendor network. Configurable placement, real-time reporting, and compliance built in. Since 2003.",
  applicationName: "dPlat",
  authors: [{ name: "DebtNext" }],
  openGraph: {
    title: "dPlat: Recovery management software",
    description:
      "Recovery operations, unified. dPlat connects credit originators with their recovery vendor network.",
    type: "website",
    siteName: "dPlat",
  },
};

export const viewport: Viewport = {
  themeColor: "#171721",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
