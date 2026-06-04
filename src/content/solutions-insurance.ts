/**
 * /solutions/insurance content - industry child page under /solutions.
 * Source copy: authored from the utilities template pattern for the
 * insurance vertical.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * No named clients, no specific recovery or liquidation metrics; the proof
 * section uses generic phrasing only.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";

export const insuranceMeta = {
  title: "Insurance recovery management software",
  description:
    "dPlat runs recovery for carriers and insurers. Subrogation balances, deductible recovery, salvage, premium receivables, and unpaid balances, with state-by-state compliance.",
  canonical: "https://debtnext.com/solutions/insurance",
};

export const insuranceHero = {
  eyebrow: "Insurance",
  h1: "Recovery built for the way carriers actually recover.",
  body:
    "Subrogation balances, deductible recovery, salvage proceeds, premium and policy receivables, and unpaid consumer balances. Insurance recovery spans both business obligors and consumers, and dPlat is configured for both. It manages placement, the vendor network, and reconciliation across every recovery type you run.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const insuranceChallenges: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "Why it's different",
  heading: "What makes insurance recovery different.",
  cards: [
    {
      title: "Each recovery type behaves on its own terms",
      body:
        "Subrogation against a third party recovers differently from a deductible owed by your own policyholder, and salvage moves differently again. dPlat segments these at load and routes each to the right treatment, with claim type, loss date, and obligor type available as placement attributes.",
    },
    {
      title: "Business and consumer obligors carry different rules",
      body:
        "A premium balance owed by a commercial account follows one set of rules; a balance owed by a consumer obligor brings FDCPA and Regulation F into scope. dPlat applies the right compliance treatment per obligor, so consumer and business books are worked correctly under one platform.",
    },
    {
      title: "State insurance environments vary by jurisdiction",
      body:
        "A carrier writing across state lines answers to multiple insurance regulatory environments, each with its own rules on contact, recovery, and salvage. dPlat's compliance layer configures per jurisdiction.",
    },
  ],
};

export const insuranceHowItRuns: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How dPlat runs it",
  heading: "How dPlat runs an insurance portfolio.",
  intro:
    "The platform takes recovery accounts from your claims and policy systems, applies your placement strategy, and manages the vendor network that works them.",
  items: [
    {
      id: "placement",
      title: "Route by recovery type and obligor",
      body:
        "dPlat loads from the claims, policy, and billing systems you already run, then routes by recovery type, obligor type, loss date, and balance age. Subrogation, deductible, salvage, and premium receivables each follow their own path.",
      visualLabel:
        "Placement matrix routing insurance recovery accounts across vendor pools",
    },
    {
      id: "optimization",
      title: "Configure business and consumer books separately",
      body:
        "Commercial and consumer recovery get their own workflows, with vendor pools you can share or split. Each book is worked the way it should be, under one platform.",
      visualLabel:
        "Configuration model for separate business and consumer recovery workflows",
    },
    {
      id: "reporting",
      title: "Reconcile daily across the network",
      body:
        "dPlat reconciles daily with every agency and law firm, so balances and payments stay accurate across the network and reporting surfaces downstream vendor performance.",
      visualLabel:
        "Reporting dashboard reconciling balances across the vendor network",
    },
  ],
};

export const insuranceProof = {
  eyebrow: "Proof",
  heading: "An insurance recovery operation, centralized.",
  paragraphs: [
    "Recovery teams at carriers on dPlat replace fragmented agency and law-firm reporting with a single command center. The platform consolidates every vendor's activity into one view, so the team works from one source of truth instead of stitching together separate reports.",
    "As reporting surfaces downstream vendor performance, the team can see what's producing and reallocate accounts accordingly, without the manual handling that slows a multi-vendor operation down.",
  ],
};

export const insuranceRegulatory = {
  eyebrow: "Compliance",
  heading: "Regulatory infrastructure for insurance recovery.",
  bullets: [
    "State insurance regulatory rules, configured per jurisdiction",
    "FDCPA and Regulation F where the obligor is a consumer",
    "FCRA where credit reporting applies",
    "Subrogation, deductible, and salvage audit trails",
    "Full activity history on every account, available for regulatory review",
  ],
};

export const insuranceFinalCta = {
  heading: "See dPlat configured for your insurance portfolio.",
  body:
    "A 30-minute walkthrough scoped to your recovery types, your regulatory environment, and your vendor mix.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
