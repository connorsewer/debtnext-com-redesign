/**
 * /platform content — source: content/pages/platform.md
 * [CLAIMS REVIEW] preserved on encryption details.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { ProcessStep } from "@/components/sections/ProcessStrip";

export const platformMeta = {
  title: "dPlat platform: capabilities and modules for recovery teams",
  titleAbsolute: true,
  description:
    "The dPlat platform in one place: placement, optimization, issues, media, reporting, and compliance. Configurable modules for credit originators since 2003.",
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
  heading: "See dPlat against your portfolio.",
  body:
    "A 30-minute walkthrough with a platform specialist. We'll show you the modules that match your use case, not the full feature catalog.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
