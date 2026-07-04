/**
 * /compare content — source: DebtNext_Comparison_Page_Copy (approved external copy).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * Production note: internal governance, MOCKUP banners, and the Phase-2
 * "one-on-one comparisons" roadmap (which would link to /compare/[competitor]
 * pages that do not exist yet) are intentionally omitted. Named-competitor
 * positioning reflects each vendor's own public scope.
 *
 * [CLAIMS REVIEW] Andrew Budish to confirm competitive comparison language
 * and the leadership / scale metrics before launch.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { ComparePlatform } from "@/components/sections/CompareMatrix";
import type { LeaderRow } from "@/components/sections/LeadershipTable";
import type { ProofStat } from "@/components/sections/ProofBand";

export const compareMeta = {
  title: "dPlat vs NeuAnalytics, Convoke, Imagine Cloud, Symend, HighRadius",
  titleAbsolute: true,
  description:
    "How dPlat compares to NeuAnalytics, Convoke, Imagine Cloud, Symend, and HighRadius. What each platform was built for, and where it stops.",
  canonical: "https://debtnext.com/compare",
};

export const compareHero = {
  eyebrow: "Compare",
  h1: "How dPlat compares to the alternatives.",
  body:
    "A working comparison of the recovery, vendor oversight, and ARM software platforms credit originators evaluate. Where each one was built for, where it's strong, and where it stops.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const compareMarket = {
  eyebrow: "The 2026 recovery software market",
  heading: "The recovery software market in 2026.",
  paragraphs: [
    "The category is sharded. No single platform covers the full enterprise recovery lifecycle (from charge-off through legal placement) with first-party engagement, third-party vendor oversight, and consumer-facing digital channels all in one architecture.",
    "Buyers usually pick a platform for the part of the problem that's burning hottest. A risk officer who's been told to fix vendor compliance buys NeuAnalytics, Convoke, or Imagine Cloud. A telecom that needs to keep subscribers from churning buys Symend. A CFO who's been told to fix DSO buys HighRadius.",
    "Each of those is a defensible choice in isolation. The structural problem shows up later, when the recovery operation needs a capability the chosen platform wasn't built for, and the integration cost back to a fragmented stack starts climbing.",
    "dPlat was built to be the platform underneath all of those operations: the system of record for the placement lifecycle, the vendor management layer, and the data substrate the rest of the recovery ecosystem plugs into.",
  ],
};

// [CLAIMS REVIEW] Competitive scope language. Reflects each vendor's own public positioning.
export const compareMatrix: {
  eyebrow: string;
  heading: string;
  body: string;
  platforms: ComparePlatform[];
} = {
  eyebrow: "The comparison matrix",
  heading: "How the platforms compare.",
  body:
    "Each platform's scope reflects its own public positioning and operational focus. The dPlat row is highlighted.",
  platforms: [
    {
      name: "dPlat",
      isPrimary: true,
      builtFor:
        "Enterprise recovery orchestration across the post-charge-off lifecycle. Open multi-vendor architecture.",
      chosen:
        "Credit originators managing external vendor networks. Utilities, telecom, financial services, and fintech with complex third-party recovery.",
      stops:
        "Built for post-charge-off recovery with multi-vendor networks. Sits alongside pre-delinquency engagement and B2B AR automation in the broader receivables stack.",
    },
    {
      name: "NeuAnalytics",
      builtFor:
        "Vendor oversight and risk management. Real-time vendor compliance and licensing monitoring.",
      chosen:
        "Risk officers fixing vendor performance and compliance across an existing third-party network.",
      stops:
        "Lighter coverage of the full operational lifecycle and execution capacity. Positioned as oversight rather than orchestration.",
    },
    {
      name: "Convoke",
      builtFor:
        "Vendor compliance and audit. Secure document sharing and oversight-grade audit trails.",
      chosen:
        "Top-tier US banks with strict risk and compliance reporting needs across their third-party network.",
      stops:
        "Heavily focused on banking debt sales. A reporting-and-oversight architecture rather than full lifecycle orchestration.",
    },
    {
      name: "Imagine Cloud",
      note: "OutSourcer",
      builtFor:
        "Vendor compliance automation. Runs your compliance rules against every vendor account event and flags violations as they surface.",
      chosen:
        "Banks and lenders that want automated compliance monitoring and visibility across their agency network.",
      stops:
        "Oriented to compliance oversight and visibility. The placement and orchestration layer still runs elsewhere.",
    },
    {
      name: "Symend",
      builtFor:
        "Consumer engagement and self-cure. Behavioral-science driven digital outreach flows.",
      chosen:
        "Telecom, utilities, and consumer lenders focused on pre-charge-off retention and churn reduction.",
      stops:
        "Doesn't address third-party vendor management or the legal recovery lifecycle.",
    },
    {
      name: "HighRadius",
      builtFor:
        "B2B autonomous finance (order-to-cash). AI agents for invoice-to-cash and credit-to-cash automation.",
      chosen:
        "Office of the CFO at large B2B enterprises focused on DSO reduction and AR automation.",
      stops:
        "Built for early-stage B2B receivables. Doesn't address post-charge-off consumer recovery.",
    },
  ],
};

export const compareDifferentiators: { heading: string; cards: GridCard[] } = {
  heading: "Where dPlat is different.",
  cards: [
    {
      title: "The full post-charge-off lifecycle in one platform",
      body:
        "dPlat handles first-party pre-collect, third-party agency placement, debt purchaser allocations, and legal network management inside a single command center. Most competitors are built strongly for one of those stages. dPlat covers all of them.",
    },
    {
      title: "Open multi-vendor architecture",
      body:
        "dPlat is the system of record for the placement lifecycle, not a vendor portal. It connects to any collection agency, law firm, debt purchaser, or specialty vendor in your network. NeuAnalytics and Convoke share this orientation.",
    },
    {
      title: "Twenty years against real enterprise data",
      body:
        "dPlat has been in continuous production since 2003. The data model, the configuration options, the exception handling, and the integration patterns reflect that operational history. Over 60 production integrations span SAP, Oracle CC&B, proprietary servicing systems, and the recovery-workflow platforms enterprise originators run.",
    },
  ],
};

export const compareTeamIntro = {
  eyebrow: "The team behind the platform",
  heading: "The team behind the platform.",
  body:
    "dPlat is the software. The service is part of why it works. Implementation, platform management, and portfolio strategy all run through teams whose careers have been inside recovery operations.",
};

// [CLAIMS REVIEW] Leadership tenure figures.
export const compareLeadership: {
  heading: string;
  body: string;
  leaders: LeaderRow[];
} = {
  heading: "More than 100 combined years inside recovery.",
  body:
    "The DebtNext leadership team has spent careers in collections and receivables management. The people who configure your platform are the same people who designed it.",
  leaders: [
    { name: "Paul Goske", role: "Co-founder & President", years: 25 },
    { name: "Rob Novosel", role: "Co-founder & CTO", years: 25 },
    { name: "Andrew Hannan", role: "Director of Product Innovation", years: 20 },
    { name: "Eric Port", role: "Operations Director", years: 17 },
    { name: "Frank Ellenberger", role: "Director of Strategic Initiatives", years: 15 },
  ],
};

export const comparePillars: { heading: string; cards: GridCard[] } = {
  heading: "Service that ships with the software.",
  cards: [
    {
      title: "Five-phase implementation with named ownership",
      body:
        "Implementation runs to a structured method: Define, Develop, Integrate, Deploy, Support. Each phase has named deliverables and joint sign-off. Every project has a dedicated project manager and a product specialist who documents your requirements into the plan. Typical timeline runs 6 to 9 months.",
    },
    {
      title: "Two ongoing teams: platform and portfolio",
      body:
        "After launch, two dedicated teams stay on. Platform Management runs the technical operation: data exchange validation, file transfers, allocation logic, media fulfillment, reconciliation. Portfolio Management runs vendor scorecards, segmentation strategy, and monthly business reviews. Account managers meet with you on a regular cadence.",
    },
    {
      title: "One product, built onshore",
      body:
        "DebtNext builds, supports, and operates one product: dPlat. The entire development and support organization is onshore in the United States. Dozens of clients run on dPlat today across utility, telecom, financial services, fintech, and healthcare. Two major releases a year, most new functionality driven by client feedback.",
    },
  ],
};

export const compareBestFit = {
  eyebrow: "Where dPlat works best",
  heading: "Where dPlat works best.",
  body: "dPlat is the strongest fit when several of these conditions are true:",
  bullets: [
    "Your portfolio runs through third-party collection agencies, law firms, debt purchasers, or specialty recovery vendors. Multi-vendor orchestration is dPlat's home turf.",
    "You manage recovery across multiple asset classes: utility, telecom, financial services, fintech, healthcare, or buyer-side debt purchase.",
    "Your operation has scale (high account volumes, multiple business units, complex compliance posture) that has outgrown spreadsheets, vendor portals, or extended CRM builds.",
    "Recovery sits inside a broader receivables stack. dPlat is the system of record for the third-party placement lifecycle and integrates with the rest.",
  ],
};

// [CLAIMS REVIEW] Connor + Andrew to confirm exact framing on each metric.
export const compareProof: {
  eyebrow: string;
  heading: string;
  stats: ProofStat[];
} = {
  eyebrow: "At scale, in production",
  heading: "In production, at scale, since 2003.",
  stats: [
    {
      number: "100M+",
      label: "Active accounts under management",
      caption: "Across client portfolios",
    },
    {
      number: "$1B+",
      label: "Transactional dollars managed annually",
      caption: "Processed through the platform on behalf of clients",
    },
    {
      number: "20+ yrs",
      label: "In continuous production",
      caption: "Building recovery software since 2003",
    },
  ],
};

export const compareFinalCta = {
  heading: "See whether dPlat fits.",
  body:
    "A 30-minute walkthrough against your portfolio, your vendor mix, and your current operational pain points. We'll tell you honestly whether dPlat is the right answer.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
