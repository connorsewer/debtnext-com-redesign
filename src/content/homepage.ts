/**
 * Homepage content — source-of-truth: content/pages/homepage.md
 * The .md brief is the editorial document humans read. This module
 * exposes its sections as typed data for the page components.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 */

export const homepageMeta = {
  title: "dPlat: recovery management software for credit originators",
  description:
    "dPlat connects credit originators with their recovery vendor network. Configurable placement, real-time reporting, and compliance built in. Since 2003.",
  canonical: "https://debtnext.com/",
} as const;

export const homepageHero = {
  eyebrow: "Recovery management software",
  h1: "Recovery operations, unified.",
  body:
    "Place accounts, manage agencies, track outcomes, and prove compliance from a single platform. dPlat connects credit originators with their recovery vendor network, so portfolio activity stays in one place instead of stitched across spreadsheets and email threads.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  media: {
    video: "/hero/homepage-hero.mp4",
    poster: "/hero/homepage-hero-poster.png",
    alt:
      "dPlat operational dashboard showing portfolio activity, agency performance, and exception status on a dark surface.",
  },
} as const;
