/**
 * Homepage content — source-of-truth: content/pages/homepage.md
 * The .md brief is the editorial document humans read. This module
 * exposes its sections as typed data for the page components.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * [CLAIMS REVIEW] flags are preserved as comments where the .md brief
 * carried one. Andrew Budish to confirm exact framing before launch.
 */

export const homepageMeta = {
  title: "dPlat: recovery management software for credit originators",
  titleAbsolute: true,
  description:
    "dPlat connects credit originators with their recovery vendor network. Configurable placement, real-time reporting, and compliance built in. Since 2003.",
  canonical: "https://debtnext.com/",
} as const;

// Legacy split-hero content. Superseded on the homepage by the
// cinematic HomepageHero (see src/content/homepage-hero.ts). Kept
// here only because other modules historically imported headline /
// body copy from it; safe to remove once nothing references it.
//
// [CLAIMS REVIEW] Andrew to confirm whether "9 of 10 largest US utility
// companies" can appear here, or stays as the softer category framing.
export const homepageTrust = {
  eyebrow: "Trusted across regulated industries",
  industries: [
    { label: "Major US utility providers", href: "/solutions/utilities" },
    {
      label: "Fortune 100 financial institutions",
      href: "/solutions/financial-services",
    },
    { label: "Telecom carriers", href: "/solutions/telecom" },
    { label: "Fintech lenders", href: "/solutions/fintech" },
    "Publicly traded debt purchasers",
  ],
} as const;

// Recovery OS positioning. Introduces the category concept additively;
// dPlat stays the product name everywhere. Stated positively per
// CLAUDE.md §5 (no "not X, it's Y" construction).
export const homepagePositioning = {
  eyebrow: "What dPlat is",
  heading: "The operating system for enterprise recovery management.",
  body:
    "DebtNext runs the whole recovery operation in one system: placement, vendor performance, disputes, promises, media, and compliance. dPlat is the platform underneath it, configured to your portfolio and your vendor network.",
} as const;

export const homepageFeatureAccordion = {
  eyebrow: "How it works",
  heading: "One platform across the recovery lifecycle.",
  intro:
    "dPlat replaces the patchwork of spreadsheets, vendor portals, and one-off integrations that credit originators stitch together to manage recovery. Each module below is configurable to your portfolio and vendor mix.",
  items: [
    {
      id: "placement",
      title: "Placement Management",
      body:
        "Move accounts to the right vendor at the right time. The decision engine applies your placement rules across treatment tiers, vendor pools, and account attributes. Recalls, reallocations, and bonus structures run automatically.",
      visualLabel: "Placement matrix with vendor allocation bars",
    },
    {
      id: "optimization",
      title: "Optimization Engine",
      body:
        "Reward high-performing vendors with more volume. The optimization engine evaluates closed pool performance and adjusts future placement share based on your configured parameters.",
      visualLabel: "Performance comparison across vendor pools",
    },
    {
      id: "issues",
      title: "Issues Management",
      body:
        "Resolve disputes, complaints, and exceptions in one place. Every interaction is logged. SLA timers enforce response windows. Outcomes route accounts back to treatment or to permanent recall.",
      visualLabel: "Issue worklist with SLA badges",
    },
    {
      id: "reporting",
      title: "Reporting and Dashboards",
      body:
        "Get the numbers without building them yourself. Pre-built reports cover liquidation, cost, net-back, and activity. Configurable dashboards feed your BI environment if you have one.",
      visualLabel: "Executive dashboard with multiple chart panels",
    },
    {
      id: "compliance",
      title: "Compliance and Audit",
      body:
        "Work standards measure vendor adherence to your SLAs. Exception conditions surface deceased, bankruptcy, SCRA, and other regulated states automatically. Every action has an audit trail.",
      visualLabel: "Work standards configuration screen",
    },
  ],
} as const;

// [CLAIMS REVIEW] Andrew to confirm exact framing on each metric.
export const homepageProof = {
  eyebrow: "At scale, in production",
  link: { label: "See how dPlat compares", href: "/compare" },
  stats: [
    {
      number: "116.8M",
      value: 116.8,
      suffix: "M",
      decimals: 1,
      label: "Accounts managed",
      caption: "Across client portfolios",
    },
    {
      number: "10B+",
      value: 10,
      suffix: "B+",
      label: "Transactions processed",
      caption: "In continuous production since 2003",
    },
    {
      number: "538",
      value: 538,
      label: "Agency and legal partners",
      caption: "Integrated across the recovery network",
    },
  ],
} as const;

export const homepageBenefitSplit = {
  heading: "Place every account where it's most likely to recover.",
  body:
    "The dPlat decision engine takes your placement strategy and runs it. Treatment tiers, vendor pools, allocation percentages, and recall rules execute against your live portfolio without manual intervention. When a pool closes, optimization data refreshes your future allocations.",
  bullets: [
    "Configurable business rules at the tier, pool, and account-attribute level",
    "Daily reconciliation with vendors keeps account balances accurate",
    "Allocation changes apply without a release cycle",
  ],
  link: { label: "Explore placement management", href: "/platform/placement" },
} as const;

export const homepageIntegration = {
  heading: "Plug into the systems you already use.",
  body:
    "dPlat connects to your billing system, your existing collection agencies, your law firms, and the data services you rely on for skip tracing, bankruptcy, deceased screening, and credit bureau enrichment. Integration patterns are SFTP, API, and direct file exchange.",
  link: { label: "Explore all 60+ integrations", href: "/platform/integrations" },
  cards: [
    {
      title: "Billing systems",
      body: "Real-time or scheduled account loads. Custom mapping per source.",
      iconKey: "billing" as const,
    },
    {
      title: "Recovery vendors",
      body: "Agencies, law firms, and debt purchasers on a single web portal.",
      iconKey: "vendors" as const,
    },
    {
      title: "Data enrichment",
      body: "Bankruptcy, decedent, SCRA, credit bureau, skip-tracing services.",
      iconKey: "data" as const,
    },
    {
      title: "BI platforms",
      body: "Direct extracts to your warehouse plus built-in dashboards.",
      iconKey: "bi" as const,
    },
  ],
} as const;

// Service + speed. Supporting narrative (Ryan's "we sell support and
// partnership"; Andy's "we move as fast as you need"). Kept compact and
// placed late so the platform story stays primary.
// [CLAIMS REVIEW] Andrew to confirm the "under a month" launch timing before launch.
export const homepageService = {
  eyebrow: "Software and the team behind it",
  heading: "Software, plus the team that runs recovery with you.",
  body:
    "dPlat is configured and supported by an onshore team that has spent careers in recovery operations. The platform does the heavy work; the people make sure it fits your portfolio and keeps fitting as the program changes.",
  cards: [
    {
      title: "Onshore platform and portfolio teams",
      body:
        "A dedicated project manager, a product specialist, and a performance analyst who knows your program. Same time zone, same language, same numbers.",
    },
    {
      title: "A named implementation method",
      body:
        "Define, Develop, Integrate, Deploy, Support. Each phase has deliverables and joint sign-off, so you always know where the work stands.",
    },
    {
      title: "As fast as you need to move",
      body:
        "When the integrations line up, programs go live in weeks. One recent multi-tenant launch went live in under a month. If you ever need to move off a platform fast, we can do that too.",
    },
  ],
} as const;

export const homepageFinalCta = {
  heading: "Build a clearer recovery operation.",
  body:
    "See how dPlat handles your portfolio. Demos are run by the people who configure the platform, not a generic sales rep.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
} as const;
