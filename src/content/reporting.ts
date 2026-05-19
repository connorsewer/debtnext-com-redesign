/**
 * /platform/reporting content — source: content/pages/reporting.md
 */

import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";
import type { GridCard } from "@/components/sections/CardGrid";

export const reportingMeta = {
  title: "Reporting and Dashboards",
  description:
    "Pre-built reports and configurable dashboards for liquidation, cost, net-back, vendor performance, and compliance. Connect dPlat to your BI environment.",
  canonical: "https://debtnext.com/platform/reporting",
};

export const reportingHero = {
  eyebrow: "Reporting and Dashboards",
  h1: "The numbers without the spreadsheet exercise.",
  body:
    "dPlat ships with the reports recovery teams actually use: inventory, liquidation, net-back, cost, vendor performance, SLA adherence, and exception trends. Pre-built dashboards visualize the data. Configurable extracts feed your warehouse. Custom filters save and reapply.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "Explore the platform", href: "/platform" },
};

export const reportingIntro = {
  heading: "Reporting that matches how recovery teams work.",
  body:
    "Most reporting tools sit outside the system of record, which means someone exports data, joins it to a spreadsheet, builds the view, and emails it. dPlat closes that loop. Reports run inside the platform against live data. Dashboards refresh on schedule. Extracts go straight to your BI environment.",
};

export const reportingLayers: {
  heading: string;
  cards: GridCard[];
} = {
  heading: "Three layers of reporting.",
  cards: [
    {
      title: "Pre-built reports",
      body:
        "Inventory, liquidation, net-back, cost, vendor performance, SLA, activity, and compliance reports come standard. Filter by tier, vendor, product, account attribute, or time period. Save filter combinations for reuse.",
    },
    {
      title: "Configurable dashboards",
      body:
        "Executive-level visualizations of the metrics that matter to your portfolio. Drill into any chart to see the underlying data. Refresh on schedule.",
    },
    {
      title: "BI extracts",
      body:
        "Direct data extracts to your warehouse on the cadence you define. If you have a Power BI, Tableau, or Looker environment, dPlat feeds it. Build custom visualizations against your own data layer.",
    },
  ],
};

export const reportingAccordion: {
  heading: string;
  items: FeatureAccordionItem[];
} = {
  heading: "Reports built around recovery workflows.",
  items: [
    {
      id: "inventory",
      title: "Inventory and liquidation reporting",
      body:
        "See open inventory by tier, vendor, and product. Track liquidation rates across closed pools. Compare against historical performance or peer benchmarks. Aging analysis shows how inventory moves through your treatment cycle.",
      visualLabel: "Inventory and liquidation dashboard",
    },
    {
      id: "vendor",
      title: "Vendor performance",
      body:
        "Compare vendors within a pool or across pools. Liquidation, net-back, activity volume, and compliance to your work standards. Performance feeds the optimization engine if you're using it.",
      visualLabel: "Vendor performance comparison",
    },
    {
      id: "cost",
      title: "Cost and net-back analysis",
      body:
        "Track commission cost and net-back at the tier, pool, and vendor level. Trend cost over time. Model the impact of commission changes against historical placement.",
      visualLabel: "Cost trend with commission modeling",
    },
    {
      id: "sla",
      title: "SLA and compliance reporting",
      body:
        "Vendor adherence to your work standards, issue resolution times, and regulatory exception handling. Export for audit. Schedule recurring delivery to compliance stakeholders.",
      visualLabel: "SLA adherence by vendor",
    },
    {
      id: "activity",
      title: "Activity analysis",
      body:
        "Breakdown of vendor activity: phones attempted, contacts established, letters sent, settlements offered. Groupings are configurable to match your activity taxonomy.",
      visualLabel: "Activity volume breakdown",
    },
  ],
};

export const reportingBenefit = {
  heading: "Your BI team gets clean data, not export files.",
  body:
    "dPlat exports data to your warehouse on the schedule you define. The export structure is documented. Schema changes get versioned and announced. Your BI team builds dashboards against a stable contract instead of an evolving file format.",
  bullets: [
    "Documented export schema with versioning",
    "Configurable extract cadence per data domain",
    "Tableau, Power BI, Looker, and Snowflake patterns supported",
  ],
  media: {
    src: "/product/dashboard-dark.png",
    alt:
      "A Power BI dashboard view sourced from a dPlat extract, showing portfolio-level liquidation and net-back trends.",
    width: 1600,
    height: 1000,
  },
};

export const reportingFinalCta = {
  heading: "See the reports against your portfolio.",
  body: "Bring your current reporting needs to the demo. We'll show you which reports cover them.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
