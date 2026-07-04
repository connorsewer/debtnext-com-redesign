/**
 * /solutions/healthcare content - industry child page under /solutions.
 * Source copy: authored from the utilities template pattern for the
 * healthcare / revenue cycle management vertical.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * No named clients, no specific recovery or liquidation metrics; the proof
 * section uses generic phrasing only.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";

export const healthcareMeta = {
  title: "Healthcare and RCM recovery management software",
  description:
    "dPlat runs recovery for healthcare and revenue cycle management providers. Patient-responsibility balances, bad-debt placement, and audit-ready compliance.",
  canonical: "https://debtnext.com/solutions/healthcare",
};

export const healthcareHero = {
  eyebrow: "Healthcare / RCM",
  h1: "Patient-responsibility and bad-debt recovery, after the billing cycle.",
  body:
    "Patient-responsibility balances, bad-debt after the billing cycle, and the extended business office work that follows. Healthcare recovery has its own shape, and dPlat is configured for it. It manages placement, the vendor network, reconciliation, and the audit trail across hospital systems, physician groups, and RCM providers.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See issues management", href: "/platform/issues" },
};

export const healthcareChallenges: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "Why it's different",
  heading: "What makes healthcare recovery different.",
  cards: [
    {
      title: "Patient-responsibility balances follow the billing cycle",
      body:
        "A balance reaches recovery only after insurance has adjudicated and the patient portion is set. dPlat segments accounts by where they sit in the cycle and routes each to the right treatment, with balance age, service date, and account status available as placement attributes.",
    },
    {
      title: "EBO and bad-debt work run on different tracks",
      body:
        "Extended business office work and post-write-off bad debt call for different treatment and often different vendors. dPlat handles both, with vendor pools you can share or split, so early-stage and bad-debt accounts are worked correctly under one platform.",
    },
    {
      title: "Patient data carries handling requirements",
      body:
        "Healthcare accounts carry patient data, so dPlat handles them with HIPAA-adjacent controls and records every action for the audit trail your compliance team expects. Recovery activity stays traceable end to end.",
    },
  ],
};

export const healthcareHowItRuns: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How dPlat runs it",
  heading: "How dPlat runs a healthcare portfolio.",
  intro:
    "The platform loads patient-responsibility and bad-debt accounts from your patient accounting or RCM system once insurance has adjudicated, separates EBO from bad-debt work, and manages the vendor network under HIPAA-adjacent controls.",
  items: [
    {
      id: "placement",
      title: "Route by balance stage and account attributes",
      body:
        "dPlat loads from the patient accounting and RCM systems you already run, then routes by balance age, service date, account status, and balance size. Early-stage and bad-debt accounts each follow their own path.",
      visualLabel:
        "Routing schematic · EHR and clearinghouse feed splits self-pay and balance-after-insurance across EBO and bad-debt vendor pools",
    },
    {
      id: "optimization",
      title: "Configure EBO and bad-debt work separately",
      body:
        "Extended business office and bad-debt portfolios get their own workflows, with vendor pools you can share or split. Each book is worked the way it should be, under one platform.",
      visualLabel:
        "Workflow console · EBO and bad-debt tracks configured separately with their own cycles and vendor pools",
    },
    {
      id: "reporting",
      title: "Reconcile daily across the network",
      body:
        "dPlat reconciles daily with every agency, so balances and payments stay accurate across the network and reporting surfaces downstream agency performance.",
      visualLabel:
        "Reconciliation area chart · self-pay and balance-after-insurance recoveries matched daily across the network",
    },
  ],
};

export const healthcareProof = {
  eyebrow: "Proof",
  heading: "Patient data handled, every action traced.",
  paragraphs: [
    "Healthcare accounts carry patient data, so dPlat works them under HIPAA-adjacent controls and records every action for the audit trail a compliance team expects. Recovery activity stays traceable end to end, from the moment insurance adjudicates the balance through final resolution.",
    "Extended business office and post-write-off bad debt run on separate tracks, often with different vendors. dPlat keeps them split, routes by balance age and account status, and surfaces downstream agency performance in one view so the team reallocates to what's producing.",
  ],
};

export const healthcareRegulatory = {
  eyebrow: "Compliance",
  heading: "Regulatory infrastructure for healthcare recovery.",
  bullets: [
    "HIPAA-adjacent handling of patient data across the recovery lifecycle",
    "FDCPA and Regulation F for third-party recovery",
    "FCRA where credit reporting applies",
    "Patient-responsibility and bad-debt audit trails",
    "Full activity history on every account, available for compliance review",
  ],
};

export const healthcareFaq: {
  heading: string;
  intro: string;
  items: { id: string; question: string; answer: string }[];
} = {
  heading: "Healthcare recovery on dPlat, answered",
  intro: "How the platform handles patient-responsibility and bad-debt work after the billing cycle.",
  items: [
    {
      id: "how-healthcare-recovery",
      question: "How does dPlat handle healthcare recovery specifically?",
      answer:
        "dPlat takes accounts once insurance has adjudicated and the patient portion is set, then segments them by where they sit in the cycle. Extended business office and post-write-off bad debt run on separate tracks with vendor pools you can share or split. The platform routes by balance age, service date, and account status, and reconciles daily with every agency across the network.",
    },
    {
      id: "healthcare-regulations",
      question: "Which regulations and controls does the compliance layer support for healthcare?",
      answer:
        "dPlat handles patient data under HIPAA-adjacent controls across the recovery lifecycle and records every action for the audit trail. It applies FDCPA and Regulation F for third-party recovery, FCRA where credit reporting applies, and keeps patient-responsibility and bad-debt audit trails. Every account carries a full activity history available for compliance review.",
    },
    {
      id: "healthcare-source-systems",
      question: "Which patient accounting systems does dPlat load from?",
      answer:
        "dPlat loads from the patient accounting and RCM systems you already run, bringing accounts across with balance age, service date, account status, and balance size as placement attributes. Early-stage EBO and bad-debt accounts each follow their own path, so the decision engine routes on the right data for hospital systems, physician groups, and RCM providers.",
    },
  ],
};

export const healthcareFinalCta = {
  heading: "Walk dPlat through your patient accounting flow.",
  body:
    "See balances taken after adjudication, EBO and bad-debt split, and patient data handled under HIPAA-adjacent controls.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough scoped to your compliance requirements and vendor mix.",
};
