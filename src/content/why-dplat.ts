/**
 * /why-dplat content — source: content/pages/why-dplat.md
 * [COI REVIEW] / [CLAIMS REVIEW] preserved as comments.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { ProofStat } from "@/components/sections/ProofBand";
import type {
  ComparisonColumn,
  ComparisonRow,
} from "@/components/sections/ComparisonTable";

export const whyDplatMeta = {
  title: "Why choose dPlat: build vs buy for recovery management",
  titleAbsolute: true,
  description:
    "Why credit originators choose dPlat over spreadsheets, single-vendor systems, and custom builds. What buying recovery software gives you over building it.",
  canonical: "https://debtnext.com/why-dplat",
};

export const whyDplatHero = {
  eyebrow: "Why dPlat",
  h1: "Recovery software, built by people who only do recovery software.",
  body:
    "dPlat is the system credit originators reach for when their current setup stops scaling: when spreadsheets break under vendor volume, when single-vendor portals don't cover the network, when custom builds run over budget. Twenty years of operational learning are configured into the platform.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

// [COI REVIEW] Andrew to verify "connected to the full network" framing.
export const whyDplatDifferentiators: {
  heading: string;
  cards: GridCard[];
} = {
  heading: "Where dPlat is different.",
  cards: [
    {
      title: "Recovery-specific, not adjacent",
      body:
        "dPlat is purpose-built recovery management software. The platform's data model, workflow patterns, and configuration options were designed for the placement lifecycle. Generic CRM platforms or workflow tools require extensive custom build to handle vendor networks, daily reconciliation, regulatory exceptions, and the audit standards recovery operations need.",
    },
    {
      title: "Configurable without code",
      body:
        "Most enterprise platforms hide configuration behind a services engagement. dPlat lets your team change placement rules, allocation percentages, work standards, issue workflows, and report filters directly in the application. The audit trail records every change with attribution.",
    },
    {
      title: "Connected to the full network",
      body:
        "dPlat works with any collection agency, law firm, debt purchaser, or specialty vendor in your recovery ecosystem. Integration with billing systems, data enrichment services, and BI environments is standard. The platform is the system of record, not a vendor portal.",
    },
  ],
};

// [CLAIMS REVIEW] Andrew to verify competitive comparison and time-to-production ranges.
export const whyDplatComparison: {
  heading: string;
  body: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
} = {
  heading: "How dPlat compares to the alternatives.",
  body:
    "Recovery operations teams typically evaluate dPlat against two other options: building it in-house or extending an existing system (CRM, ERP, billing platform). Each option has a fit. Here's where dPlat lands.",
  columns: [
    { label: "Custom build" },
    { label: "Extended CRM/ERP" },
    { label: "dPlat", isPrimary: true },
  ],
  rows: [
    {
      capability: "Recovery-specific data model",
      values: ["Build it yourself", "Map and customize", "Configured"],
    },
    {
      capability: "Multi-vendor network",
      values: ["Build the integrations", "Build the integrations", "Standard"],
    },
    {
      capability: "Daily reconciliation",
      values: ["Build it", "Build it", "Standard"],
    },
    {
      capability: "Configurable placement rules",
      values: ["Build it", "Build it", "Standard"],
    },
    {
      capability: "Audit trail",
      values: ["Build it", "Build the patterns", "Standard"],
    },
    {
      capability: "Regulatory exception handling",
      values: ["Build it", "Build the patterns", "Standard"],
    },
    {
      capability: "Time to production",
      values: ["12-24 months", "6-18 months", "4-12 months"],
    },
  ],
};

// [CLAIMS REVIEW] Connor + Andrew to confirm exact framing on each metric.
export const whyDplatProof: { eyebrow: string; stats: ProofStat[] } = {
  eyebrow: "In production, at scale, for two decades",
  stats: [
    {
      number: "100M+",
      label: "Active accounts under management",
      caption: "Across client deployments",
    },
    {
      number: "$1B+",
      label: "Transactional dollars managed annually",
      caption: "Processed through the platform on behalf of clients",
    },
    {
      number: "Since 2003",
      label: "In continuous production",
      caption: "Building recovery software for credit originators",
    },
  ],
};

export const whyDplatFinalCta = {
  heading: "See whether dPlat fits.",
  body:
    "A 30-minute walkthrough against your portfolio, your vendor mix, and your current operational pain points. We'll tell you honestly whether dPlat is the right answer.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
