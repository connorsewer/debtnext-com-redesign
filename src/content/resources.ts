/**
 * /resources content — source: content/pages/resources.md
 * v1 placeholder per docs/content-map.md:123-129.
 */

import type { GridCard } from "@/components/sections/CardGrid";

export const resourcesMeta = {
  title: "Resources",
  description:
    "Operational guides, regulatory updates, and platform documentation for recovery operations teams. Built by the people who run the platform.",
  canonical: "https://debtnext.com/resources",
};

export const resourcesHero = {
  eyebrow: "Resources",
  h1: "Built for the people running recovery operations.",
  body:
    "The content here is written by the team that builds and operates dPlat, for the people running recovery teams. No vendor pitches dressed up as thought leadership.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const resourcesCategories: {
  heading: string;
  cards: GridCard[];
} = {
  heading: "Where to start.",
  cards: [
    {
      title: "Operations playbooks",
      body:
        "Guides on placement strategy, vendor performance management, SLA design, and reconciliation patterns. Written by people who've run the operations.",
    },
    {
      title: "Regulatory updates",
      body:
        "Plain-language summaries of changes affecting recovery operations: Regulation F updates, state-level rule changes, FCRA developments, and the operational implications.",
    },
    {
      title: "Platform documentation",
      body:
        "Public-facing platform overviews, integration guides, and configuration references for technical evaluators.",
    },
  ],
};

// [CLAIMS REVIEW] Andrew to confirm consent language for the newsletter form.
export const resourcesNewsletter = {
  heading: "Get the operational reads in your inbox.",
  body:
    "A monthly digest written for recovery operations leaders. Concrete, not promotional. Unsubscribe anytime.",
  inputLabel: "Work email",
  inputPlaceholder: "you@company.com",
  buttonLabel: "Subscribe",
};

export const resourcesFinalCta = {
  heading: "Want to see the platform itself?",
  body: "A 30-minute walkthrough scoped to your portfolio and operational pain points.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
