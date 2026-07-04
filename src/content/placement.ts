/**
 * /platform/placement content — source: content/pages/placement.md
 */

import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";
import type { ProcessStep } from "@/components/sections/ProcessStrip";

export const placementMeta = {
  title: "Placement Management",
  description:
    "Automate vendor placement across treatment tiers with the dPlat decision engine. Configurable business rules, daily reconciliation, and recall logic.",
  canonical: "https://debtnext.com/platform/placement",
};

export const placementHero = {
  eyebrow: "Placement Management",
  h1: "Place every account where it should go.",
  body:
    "The dPlat decision engine takes your placement strategy and runs it. Treatment tiers, vendor pools, allocation percentages, and recall windows execute against your live portfolio without manual handling. Daily reconciliation keeps balances accurate across every vendor in your network.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "Explore the platform", href: "/platform" },
};

export const placementProcess: {
  heading: string;
  steps: ProcessStep[];
} = {
  heading: "From load to placement, automatically.",
  steps: [
    {
      title: "Define your rules",
      body:
        "Set treatment tiers, vendor pools, allocation percentages, commission rates, and recall windows. Update them inside the platform when strategy changes. No release cycle, no IT ticket.",
    },
    {
      title: "The engine runs",
      body:
        "Accounts load from your billing system. The decision engine evaluates each one against your rules and routes it to the right vendor pool. Reallocations happen on your defined cadence.",
    },
    {
      title: "Reconcile daily",
      body:
        "Every vendor in your network exchanges activity, payment, and inventory data with the platform daily. Balance differences surface as exceptions for review.",
    },
  ],
};

export const placementAccordion: {
  eyebrow: string;
  heading: string;
  items: FeatureAccordionItem[];
} = {
  eyebrow: "How placement works in dPlat",
  heading: "A configurable engine, not a black box.",
  items: [
    {
      id: "decision-engine",
      title: "Decision engine",
      body:
        "The placement engine evaluates each account against your tier definitions, vendor pool composition, and account-level attributes (balance, age, disconnect reason, prior placement history, jurisdiction, and any custom field you define). You see the logic. You change the logic. The engine runs it.",
      visualLabel: "Decision logic with rule evaluation",
    },
    {
      id: "vendor-pools",
      title: "Vendor pool management",
      body:
        "Group vendors into pools by treatment stage (pre-collect, primary, secondary, tertiary, specialty). Allocate placement share by percentage. Adjust allocation when performance shifts. dPlat tracks closed pools and feeds the data into the optimization module if you're using it.",
      visualLabel: "Vendor pool composition with allocation shares",
    },
    {
      id: "recall",
      title: "Recall and reallocation",
      body:
        "Recall windows are configurable per tier and per vendor. When a window closes, accounts route to the next tier automatically. Manual recall is also available with full audit trail.",
      visualLabel: "Recall window configuration",
    },
    {
      id: "business-rules",
      title: "Business rules at every level",
      body:
        "Commission percentages, allowable settlement thresholds, payment plan parameters, and placement length: all configurable in the platform by your team. Set defaults at the platform level, override at the tier level, override again at the vendor level.",
      visualLabel: "Rule hierarchy: platform / tier / vendor",
    },
    {
      id: "reconciliation",
      title: "Daily reconciliation",
      body:
        "Every vendor uploads activity and payment data on the schedule you define. The platform reconciles against your billing system and surfaces inconsistencies as exceptions. Reconciliation runs are auditable end to end.",
      visualLabel: "Reconciliation summary with exception worklist",
    },
  ],
};

export const placementBenefit = {
  heading: "Change your strategy without changing your platform.",
  body:
    "Most recovery platforms make you choose between configurability and operational stability. dPlat lets your team update placement rules directly inside the application. Add a vendor to a tier. Shift allocation percentages. Adjust a recall window. The engine picks up the change on the next run.",
  bullets: [
    "Configuration changes don't require code releases or implementation hours",
    "Audit history shows who changed what, when, and why",
    "Test rule changes against historical placement data before activating",
  ],
};

export const placementFinalCta = {
  heading: "See placement against your portfolio.",
  body:
    "Bring a sample placement scenario to the demo. We'll show you how dPlat would route it.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
