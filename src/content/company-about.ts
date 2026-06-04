/**
 * /company/about content - child page under /company.
 * Source copy: DebtNext_Company_Pages_Copy.docx (page 1 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * [COI REVIEW] The ownership section describes the TSI relationship (TSI as
 * both a recovery vendor and the platform provider). Framing mirrors the
 * approved language already live on the /company parent page; do not alter the
 * "you choose your own vendor network" framing without Michael Orefice, Joe
 * Laughlin, and Andrew Budish sign-off.
 * [CLAIMS REVIEW] Andrew to confirm the by-the-numbers metrics.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { ProofStat } from "@/components/sections/ProofBand";

export const aboutMeta = {
  title: "About DebtNext: recovery software since 2003",
  description:
    "DebtNext builds one thing: recovery management software for credit originators. In production since 2003. A Transworld Systems Inc. company.",
  canonical: "https://debtnext.com/company/about",
};

export const aboutHero = {
  eyebrow: "About",
  h1: "We do one thing. Recovery software.",
  body:
    "DebtNext has built recovery management software since 2003. One product, dPlat, used by credit originators to run their recovery vendor networks at scale. The focus has never moved.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const aboutOrigin = {
  eyebrow: "Origin",
  heading: "Why dPlat exists.",
  paragraphs: [
    "In 2003, recovery operations teams were stitching together spreadsheets, vendor portals, and one-off integrations to run placement strategy. The result was operational fragility: missed SLAs, broken audit trails, and vendor performance data living in someone's inbox.",
    "DebtNext was founded to replace that patchwork with a system of record. dPlat is the platform we built then and have kept building for more than 20 years. The architecture has changed. The focus hasn't.",
  ],
};

export const aboutFocus = {
  eyebrow: "Focus",
  heading: "One product, on purpose.",
  paragraphs: [
    "DebtNext builds, supports, and operates dPlat. That's the whole company. There's no second product competing for the roadmap, no services arm pulling engineering attention, no platform built for an adjacent market and bent to fit recovery.",
    "Two major releases a year, with most of the new functionality coming from what clients ask for. When a regulation changes, the platform changes. The people who configure your deployment are the same people who designed the system.",
  ],
};

// [COI REVIEW] Mirror of the approved /company parent framing. Gate before edits.
export const aboutOwnership: {
  eyebrow: string;
  heading: string;
  intro: string;
  link: { label: string; href: string };
  cards: GridCard[];
} = {
  eyebrow: "Ownership",
  heading: "A Transworld Systems Inc. company.",
  intro:
    "DebtNext is wholly owned by Transworld Systems Inc. (TSI), a portfolio company of Clearlake Capital Group. TSI is a revenue recovery platform with operations across accounts receivable management, healthcare revenue cycle, customer experience operations, and loan servicing.",
  link: {
    label: "Visit transworldsystems.com",
    href: "https://www.transworldsystems.com",
  },
  cards: [
    {
      title: "What that means for the platform",
      body:
        "dPlat operates as TSI's recovery management software business. The platform connects credit originators to their recovery vendor networks.",
    },
    {
      title: "What that means for your vendor network",
      body:
        "Your network can include TSI's own collection operations or any third-party vendor you choose. You configure your own vendor network inside the platform. dPlat is the system of record either way.",
    },
  ],
};

// [CLAIMS REVIEW] Andrew to confirm exact framing on each metric.
export const aboutStats: {
  eyebrow: string;
  heading: string;
  stats: ProofStat[];
} = {
  eyebrow: "By the numbers",
  heading: "dPlat by the numbers.",
  stats: [
    { number: "Since 2003", label: "Building recovery management software" },
    {
      number: "74",
      label: "Clients on the platform",
      caption: "Across financial services, fintech, utilities, telecom, and more",
    },
    {
      number: "60M+",
      label: "Active accounts",
      caption: "Across client deployments",
    },
    {
      number: "$1.5B+",
      label: "In payments annually",
      caption: "Processed through the platform on behalf of clients",
    },
  ],
};

export const aboutFinalCta = {
  heading: "See what we've built.",
  body: "A walkthrough of the platform with a member of the team that builds it.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
