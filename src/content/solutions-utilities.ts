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
  title: "Utility recovery management software",
  description:
    "dPlat runs recovery for regulated and deregulated utilities. Final-bill placement, deposit handling, write-off disputes, and PUC-ready compliance.",
  canonical: "https://debtnext.com/solutions/utilities",
};

export const utilitiesHero = {
  eyebrow: "Utilities",
  h1: "Final-bill and deposit recovery, run under one platform.",
  body:
    "Final-bill accounts, active-service delinquency, residential and commercial portfolios, deposit balances, and state-by-state rules. Utility recovery has its own shape, and dPlat is configured for it. It's in production at gas, electric, and water providers today.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See placement management", href: "/platform/placement" },
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
    "The platform loads residential and commercial accounts from SAP, Oracle CC&B, or your utility CIS, segments final-bill from active-service, and manages the vendor network that works them.",
  items: [
    {
      id: "placement",
      title: "Route by utility-specific attributes",
      body:
        "dPlat loads from SAP, Oracle CC&B, Oracle C2M, and the utility CIS platforms you already run, then routes by disconnect reason, service class, deposit balance, and account age.",
      visualLabel:
        "Routing diagram sending residential and commercial accounts from billing to vendor pools",
    },
    {
      id: "optimization",
      title: "Configure residential and commercial separately",
      body:
        "Residential and commercial portfolios get their own workflows, with vendor pools you can share or split. Each book is worked the way it should be, under one platform.",
      visualLabel:
        "Console configuring residential and commercial books on separate vendor pools and cycles",
    },
    {
      id: "reporting",
      title: "Reconcile daily across the network",
      body:
        "dPlat reconciles daily with every agency, so balances and payments stay accurate across the network and reporting surfaces downstream agency performance.",
      visualLabel:
        "Daily reconciliation spark matching arrears and deposit balances across the network",
    },
  ],
};

export const utilitiesProof = {
  eyebrow: "Proof",
  heading: "Deposits and disconnects, reconciled every day.",
  paragraphs: [
    "A utility book carries deposit balances that net against arrears and write-off disputes that follow a disconnect. dPlat applies deposit balances, records each adjustment, and reconciles daily with every agency, so the arrears a PUC examiner asks about tie out across the network.",
    "Final-bill and active-service accounts stay segmented from load through recovery. The team routes each by disconnect reason, service class, and deposit balance, and sees downstream agency performance in one view instead of stitching together vendor spreadsheets.",
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

export const utilitiesFaq: {
  heading: string;
  intro: string;
  items: { id: string; question: string; answer: string }[];
} = {
  heading: "Utility recovery on dPlat, answered",
  intro: "How the platform handles the parts of utility recovery that behave on their own terms.",
  items: [
    {
      id: "how-utility-recovery",
      question: "How does dPlat handle utility recovery specifically?",
      answer:
        "dPlat segments final-bill accounts from active-service delinquency at load, then routes each by disconnect reason, service class, deposit balance, and account age. Residential and commercial books run their own workflows on vendor pools you can share or split. The platform applies deposit balances against arrears, manages the write-off dispute workflow, and reconciles daily with every agency across the network.",
    },
    {
      id: "utility-regulations",
      question: "Which regulations does the compliance layer support for utilities?",
      answer:
        "The compliance layer configures per jurisdiction to each state public utility commission's rules on contact, disconnection, and recovery. It covers FDCPA and Regulation F for third-party recovery, FCRA where credit reporting applies, and the deposit-handling and write-off dispute audit trails utility regulators expect. Every account keeps a full activity history available for regulatory review.",
    },
    {
      id: "utility-source-systems",
      question: "Which utility billing systems does dPlat load from?",
      answer:
        "dPlat loads from SAP, Oracle CC&B, Oracle C2M, and the utility CIS platforms you already run. Residential and commercial accounts come across with disconnect reason, service address, and deposit balance as placement attributes, so the decision engine can route on utility-specific data. It reconciles daily with every connected agency to keep balances and payments accurate across the network.",
    },
  ],
};

export const utilitiesFinalCta = {
  heading: "Walk dPlat through your service territory.",
  body:
    "See final-bill and active-service accounts segmented, deposits reconciled, and your PUC rules applied per jurisdiction.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough scoped to your territory and vendor mix.",
};
