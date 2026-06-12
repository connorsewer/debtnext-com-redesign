/**
 * /solutions/telecom content - industry child page under /solutions.
 * Source copy: DebtNext_Solutions_Pages_Copy.docx (page 3 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * Internal review/governance callouts are excluded.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";

export const telecomMeta = {
  title: "Telecom recovery management software",
  description:
    "dPlat runs high-volume post-disconnect recovery for wireless, wireline, and broadband carriers. Short treatment windows, configurable write-off cycles.",
  canonical: "https://debtnext.com/solutions/telecom",
};

export const telecomHero = {
  eyebrow: "Telecom",
  h1: "Recovery that keeps up with telecom volume.",
  body:
    "Post-disconnect recovery for wireless, wireline, and broadband carriers means high placement volume, short treatment windows, and aggressive write-off cycles. dPlat is built to move at that speed.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const telecomChallenges: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "Why it's different",
  heading: "What telecom recovery demands.",
  cards: [
    {
      title: "Volume is the baseline",
      body:
        "Telecom portfolios place large account volumes on tight cycles. dPlat's decision engine routes them automatically against your tiers and vendor pools, with no manual handling between load and placement.",
    },
    {
      title: "Treatment windows are short",
      body:
        "A telecom account moves through pre-collect, primary, and secondary placement faster than most asset classes. dPlat's recall and reallocation logic runs on the cadence you set, so accounts don't sit idle in a pool that isn't producing.",
    },
    {
      title: "Prepaid and postpaid need different strategies",
      body:
        "The distinction drives different recovery strategy. dPlat configures separate workflows for each, with the data-exchange formats telecom billing systems use.",
    },
  ],
};

export const telecomHowItRuns: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How dPlat runs it",
  heading: "How dPlat runs a telecom portfolio.",
  intro:
    "The platform ingests high daily placement volume, routes it automatically, and manages short-cycle recall across the vendor network.",
  items: [
    {
      id: "placement",
      title: "High-volume daily placement, routed automatically",
      body:
        "dPlat connects to telecom CIS and billing platforms including ICOMS, CSG, and the systems your carrier runs, then handles high-volume daily placement with automated routing across the vendor network.",
      visualLabel:
        "Routing schematic · OSS / BSS feeds the engine, splits to high-volume and device pools",
    },
    {
      id: "optimization",
      title: "Short-cycle recall and reallocation",
      body:
        "Configurable short-cycle recall and reallocation, tuned to telecom write-off timelines, so accounts don't sit idle in a pool that isn't producing.",
      visualLabel: "Recall console · per-tier windows with reallocated account counts",
    },
    {
      id: "issues",
      title: "Prepaid and postpaid, worked separately",
      body:
        "Separate prepaid and postpaid workflows run under one platform, each with the treatment path its account type calls for.",
      visualLabel: "Prepaid vs postpaid treatment-path split across the book",
    },
  ],
};

export const telecomProof = {
  eyebrow: "Proof",
  heading: "Built for the placement cadence telecom runs on.",
  paragraphs: [
    "Telecom recovery lives or dies on cycle speed. dPlat's decision engine and recall logic run on your schedule, moving accounts through treatment tiers without the manual handling that slows a high-volume operation down.",
    "Loads, placements, recalls, and reallocations run on the timeline you configure, so a portfolio that turns over fast never waits on a person to move it.",
  ],
};

export const telecomRegulatory = {
  eyebrow: "Compliance",
  heading: "Regulatory infrastructure for telecom.",
  bullets: [
    "TCPA (consent, contact frequency, autodialer rules)",
    "FDCPA and Regulation F for third-party recovery",
    "CPNI handling for customer proprietary network information",
    "FCRA where credit reporting applies",
    "Full audit trail across every placement and vendor",
  ],
};

export const telecomFinalCta = {
  heading: "See dPlat configured for your telecom portfolio.",
  body:
    "A 30-minute walkthrough scoped to your volume, your write-off cycle, and your vendor mix.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
