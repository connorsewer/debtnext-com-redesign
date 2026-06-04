/**
 * /solutions/utilities content - industry child page under /solutions.
 * Source copy: DebtNext_Solutions_Pages_Copy.docx (page 1 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * Internal review callouts, the named client (Philadelphia Gas Works), and
 * the unverified 250% paydown figure are intentionally excluded; the proof
 * section uses generic phrasing only.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";

export const utilitiesMeta = {
  title: "Utility recovery management software | dPlat",
  description:
    "dPlat runs recovery for regulated and deregulated utilities. Final-bill placement, deposit handling, write-off disputes, and PUC-ready compliance.",
  canonical: "https://debtnext.com/solutions/utilities",
};

export const utilitiesHero = {
  eyebrow: "Utilities",
  h1: "Recovery built for the way utilities actually bill.",
  body:
    "Final-bill accounts, active-service delinquency, residential and commercial portfolios, deposit balances, and state-by-state rules. Utility recovery has its own shape, and dPlat is configured for it. It's in production at gas, electric, and water providers today.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const utilitiesChallenges: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "Why it's different",
  heading: "What makes utility recovery different.",
  cards: [
    {
      title: "Final-bill and active-service accounts behave differently",
      body:
        "A final bill after a move-out recovers differently from an active-service delinquency where the customer still needs service kept on. dPlat segments them at load and routes each to the right treatment, with disconnect reason, service address, and deposit balance available as placement attributes.",
    },
    {
      title: "Deposits and write-off disputes have to reconcile",
      body:
        "Utility accounts carry deposit balances that net against what's owed. dPlat handles deposit application and the write-off dispute workflow that follows, with every adjustment recorded for the audit trail your regulators expect.",
    },
    {
      title: "Regulation changes by state and by commission",
      body:
        "A utility operating across state lines answers to multiple public utility commissions, each with its own rules on contact, disconnection, and recovery. dPlat's compliance layer configures per jurisdiction.",
    },
  ],
};

export const utilitiesHowItRuns: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How dPlat runs it",
  heading: "How dPlat runs a utility portfolio.",
  intro:
    "The platform takes residential and commercial accounts from your CIS or billing system, applies your placement strategy, and manages the vendor network that works them.",
  items: [
    {
      id: "placement",
      title: "Route by utility-specific attributes",
      body:
        "dPlat loads from SAP, Oracle CC&B, Oracle C2M, and the utility CIS platforms you already run, then routes by disconnect reason, service class, deposit balance, and account age.",
      visualLabel:
        "Placement matrix routing utility accounts across vendor pools",
    },
    {
      id: "optimization",
      title: "Configure residential and commercial separately",
      body:
        "Residential and commercial portfolios get their own workflows, with vendor pools you can share or split. Each book is worked the way it should be, under one platform.",
      visualLabel:
        "Configuration model for separate residential and commercial workflows",
    },
    {
      id: "reporting",
      title: "Reconcile daily across the network",
      body:
        "dPlat reconciles daily with every agency, so balances and payments stay accurate across the network and reporting surfaces downstream agency performance.",
      visualLabel:
        "Reporting dashboard reconciling balances across the vendor network",
    },
  ],
};

export const utilitiesProof = {
  eyebrow: "Proof",
  heading: "A utility recovery operation, centralized.",
  paragraphs: [
    "Utility recovery teams on dPlat replace fragmented agency reporting with a single command center. The platform consolidates every agency's activity into one view, so the team works from one source of truth instead of stitching together vendor spreadsheets.",
    "As reporting surfaces downstream agency performance, the team can see what's producing and reallocate accounts accordingly, without the manual handling that slows a multi-vendor operation down.",
  ],
};

export const utilitiesRegulatory = {
  eyebrow: "Compliance",
  heading: "Regulatory infrastructure for utilities.",
  bullets: [
    "State public utility commission (PUC) rules, configured per jurisdiction",
    "FDCPA and Regulation F for third-party recovery",
    "FCRA where credit reporting applies",
    "Deposit handling and write-off dispute audit trails",
    "Full activity history on every account, available for regulatory review",
  ],
};

export const utilitiesFinalCta = {
  heading: "See dPlat configured for your utility portfolio.",
  body:
    "A 30-minute walkthrough scoped to your service territory, your regulatory environment, and your vendor mix.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
