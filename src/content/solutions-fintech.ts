/**
 * /solutions/fintech content - industry child page under /solutions.
 * Source copy: DebtNext_Solutions_Pages_Copy.docx (page 4 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * Internal review callouts are excluded; the BNPL framing stays directional
 * (no hard delinquency figure cited).
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";

export const fintechMeta = {
  title: "Fintech recovery management software",
  description:
    "dPlat runs recovery for direct lenders, BNPL, and digital banking. API-first integration, configurable workflows, compliance across 50-state lending.",
  canonical: "https://debtnext.com/solutions/fintech",
};

export const fintechHero = {
  eyebrow: "Fintech",
  h1: "Recovery infrastructure that moves at fintech speed.",
  body:
    "Direct lending, BNPL, and digital banking portfolios run on modern systems and change fast. dPlat connects through API, configures without a release cycle, and handles the multi-state regulatory load that comes with lending at national scale.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const fintechChallenges: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "Why it's different",
  heading: "What fintech recovery demands.",
  cards: [
    {
      title: "API-first, because that's how you built everything else",
      body:
        "Fintech systems expose data through APIs. dPlat integrates through API for real-time exchange with your origination and servicing stack, so recovery data moves the way the rest of your infrastructure already does.",
    },
    {
      title: "Your product changes, your recovery platform shouldn't break",
      body:
        "Fintech lenders iterate fast. dPlat's configuration model lets your team adjust placement rules, settlement thresholds, and workflows inside the application, so a product change doesn't trigger a recovery-platform project.",
    },
    {
      title: "Lending nationally means answering to 50 states",
      body:
        "A multi-state lender faces NMLS licensing across jurisdictions plus the federal overlay: TILA and Regulation Z, FCRA, ECOA, SCRA, and the Military Lending Act. dPlat's compliance layer configures to the frameworks your portfolio touches.",
    },
  ],
};

export const fintechHowItRuns: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How dPlat runs it",
  heading: "How dPlat runs a fintech portfolio.",
  intro:
    "The platform connects through API, configures in-app, and consolidates your vendor network behind one standardized connection.",
  items: [
    {
      id: "placement",
      title: "API-first integration with your stack",
      body:
        "dPlat integrates through API with modern origination, billing, and servicing systems, for real-time exchange that moves recovery data the way the rest of your infrastructure already does.",
      visualLabel: "Routing schematic · lending stack API feeds early-stage and late-stage vendor pools",
    },
    {
      id: "optimization",
      title: "Configure in-app, with no release cycle",
      body:
        "Your team adjusts placement rules, settlement thresholds, payment plans, and recall windows inside the application. A product change doesn't trigger a recovery-platform project.",
      visualLabel: "Config console · BNPL and loan books tuned in-app with no release cycle",
    },
    {
      id: "reporting",
      title: "One connection across the vendor network",
      body:
        "One standardized connection consolidates updates across your entire vendor network, so a fast-moving fintech operation keeps a single, current view of recovery.",
      visualLabel: "Data story · one connection consolidating every vendor across the network",
    },
  ],
};

export const fintechProof = {
  eyebrow: "Proof",
  heading: "Built for the BNPL delinquency curve.",
  paragraphs: [
    "BNPL portfolios carry delinquency patterns that traditional models didn't plan for, with a meaningful share of users missing at least one payment. dPlat segments those accounts and routes them through the recovery lifecycle on the cadence the product requires.",
    "A fintech operation doesn't have to bend itself to a legacy platform's assumptions. The workflows configure to how your product actually behaves.",
  ],
};

export const fintechRegulatory = {
  eyebrow: "Compliance",
  heading: "Regulatory infrastructure for fintech.",
  bullets: [
    "NMLS multi-state licensing requirements, configured per jurisdiction",
    "TILA and Regulation Z (lending disclosure)",
    "FCRA and ECOA (reporting and fair lending)",
    "SCRA and the Military Lending Act",
    "CFPB larger-participant readiness as account volumes grow",
    "Full audit trail across every placement and vendor",
  ],
};

export const fintechFaq: {
  heading: string;
  intro: string;
  items: { id: string; question: string; answer: string }[];
} = {
  heading: "Fintech recovery on dPlat, answered",
  intro: "How the platform keeps up with fast-moving direct lending, BNPL, and digital banking.",
  items: [
    {
      id: "how-fintech-recovery",
      question: "How does dPlat handle fintech recovery specifically?",
      answer:
        "dPlat integrates through API for real-time exchange with your origination, billing, and servicing stack, so recovery data moves the way the rest of your infrastructure does. Your team adjusts placement rules, settlement thresholds, payment plans, and recall windows inside the application, so a product change doesn't trigger a recovery-platform project. One standardized connection consolidates updates across your entire vendor network.",
    },
    {
      id: "fintech-regulations",
      question: "Which regulations does the compliance layer support for fintech?",
      answer:
        "dPlat's compliance layer configures to NMLS multi-state licensing, TILA and Regulation Z lending disclosure, FCRA and ECOA for reporting and fair lending, and SCRA and the Military Lending Act. It supports CFPB larger-participant readiness as account volumes grow and keeps a full audit trail across every placement and vendor.",
    },
    {
      id: "fintech-integration",
      question: "How does dPlat integrate with a modern lending stack?",
      answer:
        "dPlat is API-first, integrating with modern origination, billing, and servicing systems for real-time data exchange. Configuration happens in-app with no release cycle, so a fast-moving fintech operation adjusts recovery without engineering work. One connection consolidates every vendor across the network, keeping a single current view of recovery as your product iterates.",
    },
  ],
};

export const fintechFinalCta = {
  heading: "Walk dPlat through your lending stack.",
  body:
    "See API integration in real time, placement rules configured in-app with no release cycle, and multi-state compliance applied.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough scoped to your products and integration stack.",
};
