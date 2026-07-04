/**
 * /resources content — source: content/pages/resources.md
 * v1 placeholder per docs/content-map.md:123-129.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { CaseStudy } from "@/components/sections/CaseStudyBand";

export const resourcesMeta = {
  title: "Resources",
  description:
    "Operational guides, regulatory updates, and platform documentation for recovery operations teams. Built by the people who run the platform.",
  canonical: "https://debtnext.com/resources",
};

export const resourcesHero = {
  eyebrow: "Resources",
  h1: "Built for the people running recovery operations.",
  body:
    "The content here is written by the team that builds and operates dPlat, for the people running recovery teams. No vendor pitches dressed up as thought leadership.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const resourcesCategories: {
  heading: string;
  cards: GridCard[];
} = {
  heading: "Where to start.",
  cards: [
    {
      title: "Operations playbooks",
      body:
        "Guides on placement strategy, vendor performance management, SLA design, and reconciliation patterns. Written by people who've run the operations.",
    },
    {
      title: "Regulatory updates",
      body:
        "Plain-language summaries of changes affecting recovery operations: Regulation F updates, state-level rule changes, FCRA developments, and the operational implications.",
    },
    {
      title: "Platform documentation",
      body:
        "Public-facing platform overviews, integration guides, and configuration references for technical evaluators.",
    },
  ],
};

// [CLAIMS REVIEW] Anonymized case studies. Figures reflect documented DebtNext
// engagements and require Andrew Budish + Paul Goske sign-off plus written
// client approval before a client is named or a study is distributed
// externally. Keep PG&E and California out of headlines.
export const resourcesCaseStudies: {
  eyebrow: string;
  heading: string;
  body: string;
  studies: CaseStudy[];
  disclaimer: string;
} = {
  eyebrow: "Case studies",
  heading: "What changes when the network runs on one record.",
  body:
    "Two anonymized utility engagements. Same pattern: put the whole agency network on one system of record, then tune it.",
  studies: [
    {
      eyebrow: "Case study · Utilities",
      headline: "A national utility put its whole agency network on one record.",
      summary:
        "Five agencies, five formats, no shared view. After consolidating on dPlat, collections rose and recovery labor fell at the same time.",
      metrics: [
        { number: "+24%", label: "Increase in collections" },
        { number: "$8.7M", label: "Net-back gain" },
        { number: "5 to 1", label: "Agencies onto one system of record" },
        { number: "Lower", label: "Collections FTE load" },
      ],
      problem:
        "A multi-state utility placed charged-off accounts across five agencies, each reporting on its own schedule and format. Performance gaps stayed hidden, reconciliation ate analyst time, and oversight couldn't be proven on demand.",
      solution:
        "TSI moved the program onto dPlat: one system of record, Decision Engine placement on the utility's rules, daily agency reporting, and a dedicated performance analyst running monthly reviews and reallocation.",
      results:
        "Collections increased 24% with an $8.7M net-back gain. Recovery FTE load dropped as reconciliation and reporting automated. Audit prep became a one-click export.",
    },
    {
      eyebrow: "Case study · Utilities",
      headline: "A West Coast utility grew recoveries 45%, and spent less to do it.",
      summary:
        "One of the largest investor-owned electric and gas utilities on the West Coast turned its recovery program into a system it could see, govern, and tune. Over three years, recoveries climbed every year while cost-to-collect fell.",
      metrics: [
        { number: "+45%", label: "Total recoveries, 2023 to 2025" },
        { number: "$25.4M", label: "Recovered in 2025, up from $17.6M" },
        { number: "~23%", label: "Lower cost-to-collect from peak" },
        { number: "3 yrs", label: "Of sustained acceleration" },
      ],
      problem:
        "A sprawling recovery network with limited visibility into what was working. Inventory, internal collections, and multiple outside agencies, all hard to see, compare, or adjust as conditions changed.",
      solution:
        "dPlat became the single platform for the whole program: live visibility, governed agency oversight, and recovery strategies the team could reconfigure on its own as the business moved.",
      results:
        "Recoveries grew 45% over three years and kept accelerating, while cost-to-collect dropped roughly 23% from its peak. More money recovered, less spent getting it.",
    },
  ],
  disclaimer:
    "These case studies are shown in anonymized form. The figures reflect documented DebtNext engagements and require client approval before a client is named or a study is distributed externally.",
};

// [CLAIMS REVIEW] Andrew to confirm consent language for the newsletter form.
export const resourcesNewsletter = {
  heading: "Get the operational reads in your inbox.",
  body:
    "A monthly digest written for recovery operations leaders. Concrete, not promotional. Unsubscribe anytime.",
  inputLabel: "Work email",
  inputPlaceholder: "you@company.com",
  buttonLabel: "Subscribe",
};

export const resourcesFinalCta = {
  heading: "Want to see the platform itself?",
  body: "A 30-minute walkthrough scoped to your portfolio and operational pain points.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
