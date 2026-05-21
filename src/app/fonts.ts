/**
 * next/font/local registration for the General Sans wordmark font.
 *
 * Self-hosted under src/app/fonts/ per next/font/local's
 * relative-to-declaring-module path resolution (see Pitfall 5 in
 * .planning/phases/05-hero-performance/05-RESEARCH.md). Replaces the
 * Fontshare CDN @import previously in src/app/globals.css line 1
 * (HERO-02).
 *
 * Exposes `--font-general-sans` so Wordmark.tsx's inline style can
 * resolve via `fontFamily: 'var(--font-general-sans), Inter, ...'`,
 * defensive against next/font's family-name hashing.
 */
import localFont from "next/font/local";

export const generalSans = localFont({
  src: "./fonts/GeneralSans-Semibold.woff2",
  weight: "600",
  style: "normal",
  display: "swap",
  variable: "--font-general-sans",
  adjustFontFallback: "Arial",
});
