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
  h1: "Subrogation, deductible, and salvage recovery in one system.",
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
    "The platform loads recovery accounts from your claims, policy, and billing systems, separates business obligors from consumers, and manages the agencies and law firms that work each recovery type.",
  items: [
    {
      id: "placement",
      title: "Route by recovery type and obligor",
      body:
        "dPlat loads from the claims, policy, and billing systems you already run, then routes by recovery type, obligor type, loss date, and balance age. Subrogation, deductible, salvage, and premium receivables each follow their own path.",
      visualLabel:
        "Routing schematic · policy admin feeds business and consumer obligor vendor pools",
    },
    {
      id: "optimization",
      title: "Configure business and consumer books separately",
      body:
        "Commercial and consumer recovery get their own workflows, with vendor pools you can share or split. Each book is worked the way it should be, under one platform.",
      visualLabel:
        "Config console · business and consumer recovery books configured separately",
    },
    {
      id: "reporting",
      title: "Reconcile daily across the network",
      body:
        "dPlat reconciles daily with every agency and law firm, so balances and payments stay accurate across the network and reporting surfaces downstream vendor performance.",
      visualLabel:
        "Data story · premium and subrogation balances reconciling daily by recovery type",
    },
  ],
};

export const insuranceProof = {
  eyebrow: "Proof",
  heading: "Every recovery type, worked on its own terms.",
  paragraphs: [
    "A subrogation balance against a third party, a deductible owed by a policyholder, and salvage proceeds each follow a different path. dPlat keeps them segmented from load through reconciliation, routing by claim type, loss date, and obligor type, so no recovery type gets forced into the wrong treatment.",
    "Business and consumer books carry different rules, and dPlat applies the right compliance treatment per obligor. Carriers see agency and law-firm performance across both books in one view, then reallocate to what's producing without stitching together separate reports.",
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

export const insuranceFaq: {
  heading: string;
  intro: string;
  items: { id: string; question: string; answer: string }[];
} = {
  heading: "Insurance recovery on dPlat, answered",
  intro: "How the platform handles recovery that spans business obligors and consumers.",
  items: [
    {
      id: "how-insurance-recovery",
      question: "How does dPlat handle insurance recovery specifically?",
      answer:
        "dPlat segments subrogation, deductible, salvage, and premium receivables at load, then routes each by claim type, loss date, obligor type, and balance age. Commercial and consumer recovery run their own workflows on vendor pools you can share or split. The platform reconciles daily with every agency and law firm, so balances and payments stay accurate across every recovery type you run.",
    },
    {
      id: "insurance-regulations",
      question: "Which regulations does the compliance layer support for insurance?",
      answer:
        "The compliance layer configures per jurisdiction to each state's insurance rules on contact, recovery, and salvage. It applies FDCPA and Regulation F where the obligor is a consumer, FCRA where credit reporting applies, and keeps subrogation, deductible, and salvage audit trails. Every account carries a full activity history available for regulatory review.",
    },
    {
      id: "insurance-obligor-types",
      question: "How does dPlat treat business versus consumer obligors?",
      answer:
        "A premium balance owed by a commercial account and a balance owed by a consumer follow different rules, so dPlat applies the right compliance treatment per obligor. Consumer accounts bring FDCPA and Regulation F into scope automatically; business accounts follow commercial terms. Both books run under one platform, loaded from your claims, policy, and billing systems with obligor type as a placement attribute.",
    },
  ],
};

export const insuranceFinalCta = {
  heading: "Walk dPlat through your recovery types.",
  body:
    "See subrogation, deductible, and salvage segmented, business and consumer books split, and each obligor's compliance treatment applied.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough scoped to your recovery types and vendor mix.",
};
