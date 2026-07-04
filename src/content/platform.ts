/**
 * /platform content — source: content/pages/platform.md
 * [CLAIMS REVIEW] preserved on encryption details.
 */

import type { FAQItem } from "@/components/sections/FAQSection";
import type { GridCard } from "@/components/sections/CardGrid";
import type { ProcessStep } from "@/components/sections/ProcessStrip";

/**
 * Plain-English category definition (40-60 words), placed near the top of the
 * page for buyers and AI-search extraction. No em dash; §5 voice.
 */
export const platformDefinition = {
  heading: "What recovery management software is",
  body:
    "Recovery management software is the system credit originators use to route overdue and charged-off accounts to outside collection agencies and law firms, then track what those vendors collect. dPlat is that system of record: it holds account data, applies your placement rules, and reconciles every payment and dispute in one place.",
  /**
   * Stats-in-prose with a date. Numbers import from stats.ts (single source);
   * kept in sync by referencing scaleHeadline at render time.
   */
  proof:
    "Since 2003, dPlat has managed 100M+ accounts across a network of 500+ agency and legal partners, processing more than 10B transactions.",
};

export const platformMeta = {
  title: "The dPlat platform: recovery management software",
  description:
    "dPlat is a configurable recovery management platform: placement, optimization, issues, media, reporting, and compliance in one system. Built for credit originators since 2003.",
  canonical: "https://debtnext.com/platform",
};

export const platformHero = {
  eyebrow: "The platform",
  h1: "A single system for the recovery lifecycle.",
  body:
    "dPlat is a SaaS platform that runs your recovery operations. Place accounts with the right vendor, manage exceptions and disputes, track performance across every pool, and prove compliance, all from one configurable interface. Your portfolio, your rules, your vendor network.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const platformCapabilities: {
  heading: string;
  body: string;
  cards: GridCard[];
} = {
  heading: "Nine modules, one platform.",
  body:
    "Each module is configurable to your portfolio. Use what you need now. Add what you need later.",
  cards: [
    {
      title: "Placement Management",
      body:
        "Run your placement strategy automatically. The decision engine moves accounts across treatment tiers, vendor pools, and recall windows using your business rules.",
      link: { label: "Explore placement", href: "/platform/placement" },
    },
    {
      title: "Optimization Engine",
      body:
        "Reward high-performing vendors with more volume. Optimization adjusts future placements based on closed pool results and your configured parameters.",
      link: { label: "Explore optimization", href: "/platform/optimization" },
    },
    {
      title: "Issues Management",
      body:
        "Resolve disputes, complaints, and exceptions inside the platform. SLA timers and full audit trails come standard.",
      link: { label: "Explore issues", href: "/platform/issues" },
    },
    {
      title: "Media Management",
      body:
        "Centralize documentation. Fulfill agency requests in bulk. Persistent media follows the account through every placement.",
    },
    {
      title: "Operational Reporting",
      body:
        "Pre-built reports for inventory, liquidation, cost, net-back, and activity. Configurable filters. Scheduled delivery.",
      link: { label: "Explore reporting", href: "/platform/reporting" },
    },
    {
      title: "Dashboards",
      body:
        "Executive views that drill into the data. Connect dPlat to your BI environment, or use the built-in dashboards.",
    },
    {
      title: "Compliance and Work Standards",
      body:
        "Configurable rules measure vendor adherence to your SLAs. Exception conditions surface automatically across the portfolio.",
    },
    {
      title: "Integration Ecosystem",
      body:
        "Connect to billing systems, recovery vendors, law firms, and data enrichment services. SFTP, API, and file exchange supported.",
    },
    {
      title: "Debt Sales",
      body:
        "Manage sales end to end. Secure buyer invitations, due diligence access, bidding, and post-sale support inside the platform.",
    },
  ],
};

export const platformProcess: {
  heading: string;
  steps: ProcessStep[];
} = {
  heading: "How your portfolio flows through dPlat.",
  steps: [
    {
      title: "Load",
      body:
        "Accounts come in from your billing system. dPlat accepts virtually any format.",
    },
    {
      title: "Place",
      body:
        "The decision engine routes accounts to your vendor network based on your rules.",
    },
    {
      title: "Track",
      body:
        "Daily reconciliation keeps balances accurate. Activity, payments, and exceptions update in real time.",
    },
    {
      title: "Manage",
      body:
        "Issues, disputes, and media requests resolve inside the platform with full audit trails.",
    },
    {
      title: "Report",
      body:
        "Performance, cost, and compliance data flows into pre-built reports and your BI environment.",
    },
  ],
};

export const platformIntegrations: {
  heading: string;
  body: string;
  cards: GridCard[];
} = {
  heading: "Built to connect.",
  body:
    "dPlat is the system of record for the placement lifecycle. It pulls account data from your billing system, exchanges work with your recovery vendors, and feeds outcomes back to your data warehouse. Integration patterns are SFTP with PGP encryption, REST API, and direct file exchange.",
  cards: [
    {
      title: "Billing systems",
      body:
        "Real-time or scheduled account loads. AES-256 encryption in transit and at rest. Custom mapping per source system.",
    },
    {
      title: "Recovery vendors",
      body:
        "First-party and third-party agencies, law firms, and debt purchasers. Each vendor uses a single web portal for placements, payments, media, and disputes.",
    },
    {
      title: "Data services",
      body:
        "Decedent, bankruptcy, SCRA, credit bureau, and skip-tracing services integrated to enrich accounts pre-placement or in-flight.",
    },
    {
      title: "BI platforms",
      body:
        "Direct data extracts to your warehouse. Tableau-style dashboards built into the platform. Custom report scheduling.",
    },
  ],
};

// [CLAIMS REVIEW] Andrew to verify encryption claims match current platform.
export const platformSecurity: {
  heading: string;
  body: string;
  bullets: string[];
} = {
  heading: "Compliance as infrastructure.",
  body:
    "dPlat is built for regulated industries. The platform applies your work standards across every vendor in your network, surfaces account-level exception conditions automatically, and maintains a full audit trail for every transaction.",
  bullets: [
    "AES-256 encryption in transit and at rest; column-level AES-128 for PII; PGP file exchange.",
    "Every transaction, every issue, every media exchange logged with user, timestamp, and content.",
    "Configurable exception rules surface deceased, bankruptcy, SCRA, and balance inconsistencies automatically.",
    "Built to support FDCPA, Regulation F, FCRA, TCPA, and SCRA workflows; vendor compliance measured against your work standards.",
  ],
};

export const platformFinalCta = {
  heading: "Walk the platform module by module.",
  body:
    "Bring your portfolio and vendor mix. We'll show you the modules that match your use case and how they fit together.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

/**
 * FAQ band. Visible answers must match the faqPageSchema() text verbatim.
 * [CLAIMS] compliance + security answers; [COI] the existing-vendors answer.
 */
export const platformFaq: {
  heading: string;
  intro: string;
  items: FAQItem[];
} = {
  heading: "Recovery management software, answered",
  intro:
    "The questions credit originators ask most when they evaluate dPlat.",
  items: [
    {
      id: "what-is-rms",
      question: "What is recovery management software?",
      answer:
        "Recovery management software is the system a credit originator uses to route overdue and charged-off accounts to outside collection agencies and law firms, then track what those vendors collect. It sits between your billing system and your vendor network as the system of record, applying your placement rules and reconciling payments, disputes, and balances in one place.",
    },
    {
      id: "placement-routing",
      question: "How does the placement engine route accounts?",
      answer:
        "The decision engine places and recalls accounts against rules you define. It segments accounts by tier, balance, collectability, and vendor performance, then moves them into treatment tiers and vendor pools automatically. You set allocation percentages, settlement authority, and recall windows; the engine enforces them and reconciles daily so balances stay accurate across every vendor.",
    },
    {
      id: "existing-vendors",
      question: "Does dPlat work with our existing agencies and law firms?",
      answer:
        "Yes. dPlat works with any collection agency, law firm, or recovery vendor in your network, first-party or third-party. Each vendor connects through a single web portal for placements, payments, media, and disputes, so you keep your current vendor relationships and configure dPlat around them rather than switching networks.",
    },
    {
      id: "compliance-support",
      question: "How does dPlat support FDCPA, Regulation F, FCRA, TCPA, and SCRA?",
      answer:
        "dPlat is a compliance enforcement layer between you and your vendors. A configurable rules engine applies your work standards to every vendor, flags exceptions automatically, and keeps an audit trail for every transaction. It integrates external validation for bankruptcy, SCRA, and licensing, and runs on the compliance infrastructure of its parent, Transworld Systems Inc. You configure the regulatory rules that apply to your program.",
    },
    {
      id: "integration-patterns",
      question: "What integration patterns does dPlat support?",
      answer:
        "Most integrations are flat-file exchanges over SFTP with PGP encryption, run on a configured schedule. REST API integration is available where you need more real-time updates, and direct file exchange is supported too. There is no standard format you have to conform to; each connection is mapped to your source systems. dPlat maintains one connection to your internal systems and consolidates updates across every vendor.",
    },
    {
      id: "data-security",
      question: "How is data secured in dPlat?",
      answer:
        "Data is encrypted with AES-256 in transit and at rest, with column-level AES-128 for PII and PGP for file exchange. Every transaction, issue, and media exchange is logged with user, timestamp, and content. Access controls and configurable exception rules govern who sees what, and security aligns with SSAE 18 SOC 2 standards at the Transworld Systems Inc. level.",
    },
  ],
};
