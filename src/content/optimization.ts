/**
 * /platform/optimization content — source: content/pages/optimization.md
 */

import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";
import type { ProcessStep } from "@/components/sections/ProcessStrip";

export const optimizationMeta = {
  title: "Optimization Engine",
  description:
    "The dPlat Optimization Engine rewards high-performing vendors with more placement volume based on closed-pool results and your configured parameters.",
  canonical: "https://debtnext.com/platform/optimization",
};

export const optimizationHero = {
  eyebrow: "Optimization Engine",
  h1: "Reward the vendors who recover more.",
  body:
    "The dPlat Optimization Engine evaluates liquidation performance across closed vendor pools and adjusts future placement volume accordingly. High performers get more share. The rules are yours. The math runs automatically.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See placement management", href: "/platform/placement" },
};

export const optimizationIntro = {
  heading:
    "Vendor performance isn't static. Your placement strategy shouldn't be either.",
  body:
    "Manual reallocation works for a few vendors and a few pools. It breaks at scale. dPlat's optimization module evaluates closed pool performance against the configured bands you set, then adjusts future placement allocation on your cadence. Performance data becomes a placement signal, not a quarterly review topic.",
};

export const optimizationProcess: {
  heading: string;
  steps: ProcessStep[];
} = {
  heading: "How it works.",
  steps: [
    {
      title: "Configure the bands",
      body:
        "Set performance bands by tier, product, or account attribute. Define what counts as a closed pool. Decide how much share moves per evaluation cycle.",
    },
    {
      title: "Pools close. Data flows in.",
      body:
        "As pools close, dPlat captures liquidation, net-back, activity, and account-characteristic data. Closed-pool performance is benchmarked against the bands you set.",
    },
    {
      title: "Share adjusts on the next cycle",
      body:
        "The next placement cycle uses the updated allocation. High performers get more volume. Underperformers get less. The engine logs every adjustment.",
    },
  ],
};

export const optimizationAccordion: {
  heading: string;
  items: FeatureAccordionItem[];
} = {
  heading: "Performance-driven, with caps and floors you control.",
  items: [
    {
      id: "bands",
      title: "Configurable performance bands",
      body:
        "Define what 'high performing' means for your portfolio. Liquidation percentage, net-back, payment count, activity volume, or any custom metric. Bands can vary by tier, product, or account attribute.",
      visualLabel: "Performance band thresholds",
    },
    {
      id: "share",
      title: "Market share adjustments",
      body:
        "The engine applies share adjustments inside the percentages you authorize. Cap how much a vendor's share can grow per cycle. Set floors and ceilings. Hold strategic vendors steady regardless of short-term performance if your strategy requires it.",
      visualLabel: "Share adjustment with caps and floors",
    },
    {
      id: "bonus",
      title: "Monthly bonus payouts",
      body:
        "Configure pool-level bonus structures that pay out when vendors hit liquidation targets. The bonus calculation runs automatically against the closed pool data.",
      visualLabel: "Bonus configuration with target thresholds",
    },
    {
      id: "history",
      title: "Optimization history",
      body:
        "Every adjustment is logged. See what changed, when it changed, and what performance triggered the change. Roll back if needed.",
      visualLabel: "Optimization audit trail",
    },
  ],
};

export const optimizationBenefit = {
  heading: "Performance-based placement, without the spreadsheets.",
  body:
    "Recovery teams lose hours each cycle pulling vendor performance into spreadsheets, modeling allocation changes, and pushing those changes back into a placement system. dPlat collapses that loop. The data lives in the platform. The rules live in the platform. The adjustments execute in the platform.",
  bullets: [
    "Closed pool data feeds optimization without manual export",
    "Adjustment cycles run on your defined cadence, not a quarterly review",
    "Caps and floors give your strategy team final control",
  ],
};

export const optimizationFinalCta = {
  heading: "See optimization against your vendor mix.",
  body:
    "Bring your current allocation percentages and recent pool performance to the demo. We'll show you what the engine would do with them.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
