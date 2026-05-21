import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { generalSans } from "./fonts";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

import "./globals.css";

// Phase 5.2 follow-up: `display: "optional"` to keep Inter off the LCP
// path. With "swap" the H1 painted in the metrics-matched fallback at
// FCP (~1.6s) and then re-painted to Inter when the font arrived,
// triggering a second LCP candidate around 3.8s. "optional" gives the
// browser ~100ms to fetch Inter; if it does not arrive in that window
// the fallback is locked in for the session (no swap, no layout shift,
// no re-paint), so LCP fires at the first paint. Next/font's auto
// metrics-adjusted fallback means there is no visible size jump either
// way; the user only notices Inter on warm/cached loads.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
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
  // Pin the browser chrome to the dark canvas under both scheme preferences;
  // the site itself remains dark-first regardless of the user's OS setting.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171721" },
    { media: "(prefers-color-scheme: light)", color: "#171721" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${generalSans.variable}`}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
