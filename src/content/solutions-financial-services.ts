/**
 * /solutions/financial-services content - industry child page under /solutions.
 * Source copy: DebtNext_Solutions_Pages_Copy.docx (page 2 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * Internal review/governance callouts are excluded.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";

export const financialServicesMeta = {
  title: "Financial services recovery software",
  description:
    "dPlat runs recovery for bank card, installment, line of credit, and overdraft portfolios. FDCPA, Reg F, FCRA, and TCPA workflows built in.",
  canonical: "https://debtnext.com/solutions/financial-services",
};

export const financialServicesHero = {
  eyebrow: "Financial services",
  h1: "Recovery management for portfolios that answer to the CFPB.",
  body:
    "Bank card, installment loan, line of credit, and overdraft recovery, run across a network of agencies and law firms, under FDCPA, Regulation F, FCRA, and TCPA. dPlat is in production at some of the largest financial institutions in the US.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See issues and compliance workflows", href: "/platform/issues" },
};

export const financialServicesChallenges: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "Why it's different",
  heading: "What financial services recovery demands.",
  cards: [
    {
      title: "Regulatory exceptions can't be afterthoughts",
      body:
        "Bankruptcy, deceased, and SCRA conditions change how an account can be worked, and getting them wrong carries real liability. dPlat handles them as platform-level exceptions, applied automatically and recorded on the account.",
    },
    {
      title: "Regulation F changed the contact rules",
      body:
        "Regulation F set limits on contact frequency and channels. dPlat's work standards configure to those limits and flag vendor activity that falls outside them.",
    },
    {
      title: "Examiners want the audit trail",
      body:
        "A CFPB-supervised institution has to show its work. dPlat records every placement, every status change, and every dispute interaction, with attribution and timestamps, available for examination.",
    },
  ],
};

export const financialServicesHowItRuns: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How dPlat runs it",
  heading: "How dPlat runs a financial services portfolio.",
  intro:
    "The platform sits between your core systems and your recovery vendor network, standardizing data exchange and automating the workflows that carry the most regulatory weight.",
  items: [
    {
      id: "placement",
      title: "One standardized connection to every vendor",
      body:
        "One standardized connection to your systems replaces individual integrations with every collection vendor. dPlat consolidates updates across every connected vendor, formatted to your data-exchange standards.",
      visualLabel:
        "Routing schematic · core banking feeds the engine, splits to agency and law-firm pools",
    },
    {
      id: "issues",
      title: "Bankruptcy, deceased, and disputes as exceptions",
      body:
        "Bankruptcy, deceased, dispute, and documentation workflows are standardized and configurable. Regulatory exceptions apply automatically and stay recorded on the account.",
      visualLabel: "Exception volumes · bankruptcy, deceased, dispute, and documentation holds",
    },
    {
      id: "optimization",
      title: "Settlement floors and payment plans, enforced",
      body:
        "Settlement thresholds set at the vendor and tier level, so nothing settles below your floor. Payment plans track automatically, with delinquency flagged the moment a payment is missed.",
      visualLabel:
        "Settlement console · per-product floors and payment plans enforced",
    },
  ],
};

export const financialServicesProof = {
  eyebrow: "Proof",
  heading: "One connection, every vendor.",
  paragraphs: [
    "Financial institutions on dPlat have eliminated the need to integrate individually with each collection vendor. The platform manages one standardized connection to your internal systems and consolidates updates across every connected vendor, formatted to your data-exchange standards.",
    "Every placement, status change, and dispute interaction is recorded with attribution and timestamps, so the audit trail an examiner asks for is already there.",
  ],
};

export const financialServicesRegulatory = {
  eyebrow: "Compliance",
  heading: "Regulatory infrastructure for financial services.",
  bullets: [
    "FDCPA and Regulation F (contact frequency, channels, validation)",
    "FCRA and FACT Act (credit reporting accuracy)",
    "TCPA (consent and contact)",
    "SCRA (servicemember protections)",
    "Bankruptcy and deceased handling as automatic exceptions",
    "Full audit trail for CFPB and state examination",
  ],
};

export const financialServicesFaq: {
  heading: string;
  intro: string;
  items: { id: string; question: string; answer: string }[];
} = {
  heading: "Financial services recovery on dPlat, answered",
  intro: "The questions CFPB-supervised institutions ask about running recovery on dPlat.",
  items: [
    {
      id: "how-fs-recovery",
      question: "How does dPlat handle financial services recovery specifically?",
      answer:
        "dPlat runs bank card, installment loan, line of credit, and overdraft recovery across a network of agencies and law firms. One standardized connection to your core systems replaces individual vendor integrations. It enforces settlement floors at the vendor and tier level, tracks payment plans automatically, and flags delinquency the moment a payment is missed.",
    },
    {
      id: "fs-regulations",
      question: "Which regulations does the compliance layer support for financial services?",
      answer:
        "dPlat has FDCPA, Regulation F, FCRA, and TCPA workflows built in, with Regulation F contact-frequency and channel limits configured into work standards. It handles SCRA servicemember protections, applies bankruptcy and deceased conditions as automatic exceptions, and keeps a full audit trail for CFPB and state examination.",
    },
    {
      id: "fs-exceptions",
      question: "How does dPlat handle bankruptcy, deceased, and dispute conditions?",
      answer:
        "Bankruptcy, deceased, and SCRA conditions change how an account can be worked, and getting them wrong carries real liability. dPlat applies them as platform-level exceptions, automatically and recorded on the account. Dispute and documentation workflows are standardized and configurable, with every placement, status change, and dispute interaction attributed and timestamped for examination.",
    },
  ],
};

export const financialServicesFinalCta = {
  heading: "Walk dPlat through your regulatory environment.",
  body:
    "See settlement floors enforced, bankruptcy and SCRA applied as automatic exceptions, and the audit trail an examiner asks for already in place.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough scoped to your asset classes and vendor mix.",
};
