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
import { leaders } from "@/content/leadership";

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
    "Since 2003, dPlat has run in continuous production, and today manages 100M+ accounts across a network of 500+ agency and legal partners.",
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
        "dPlat connects to any collection agency, law firm, debt purchaser, or specialty vendor in your network, and holds the master record across all of them. Portal-first tools tie you to one vendor's workflow; dPlat stays neutral to the network. NeuAnalytics and Convoke share this orientation.",
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
    "The people who configure your platform are the people who built it, with careers spent inside recovery operations. That continuity is a real difference against vendors who hand implementation to a separate services arm.",
};

/**
 * Short services pointer. The full implementation and portfolio-services story
 * (formerly comparePillars + compareTeamIntro body) now lives on the dedicated
 * /services page. This keeps /compare focused on the named-competitor job.
 */
export const compareServicesPointer = {
  heading: "Service ships with the software.",
  body:
    "dPlat comes with a structured five-phase implementation and two ongoing teams: Platform Management for the technical operation and Portfolio Management for vendor scorecards and strategy. See the services page for how implementation and ongoing support work.",
  link: { label: "Explore services", href: "/services" },
};

// [CLAIMS REVIEW] Leadership tenure figures.
export const compareLeadership: {
  heading: string;
  body: string;
  leaders: LeaderRow[];
} = {
  heading: "More than 100 combined years in recovery operations.",
  body:
    "The DebtNext leadership team has spent careers in collections and receivables management. The people who configure your platform are the same people who designed it.",
  leaders: leaders.map((leader) => ({
    name: leader.name,
    role: leader.role,
    years: leader.years,
  })),
};

/**
 * FAQ band. Answers drawn from the existing compare content (compareMatrix,
 * differentiators, best-fit). Visible text matches faqPageSchema() verbatim.
 * [COI] the vendor-portal answer uses section 6 network-agnostic framing.
 */
export const compareFaq: {
  heading: string;
  intro: string;
  items: { id: string; question: string; answer: string }[];
} = {
  heading: "Choosing a recovery platform, answered",
  intro: "The questions buyers ask when they put dPlat next to the alternatives.",
  items: [
    {
      id: "portal-vs-record",
      question: "What's the difference between a vendor portal and a system of record?",
      answer:
        "A vendor portal is one collection agency's interface for the work you place with that agency. A system of record sits above the whole network: it holds the master account data, applies your placement rules across every vendor, and reconciles payments and disputes back to one place. dPlat is the system of record, so it stays neutral to the vendors and keeps your data even as your network changes.",
    },
    {
      id: "what-size",
      question: "What size operation is dPlat built for?",
      answer:
        "dPlat fits enterprise recovery operations that have outgrown spreadsheets, single-vendor portals, or extended CRM builds. It's strongest when you place accounts through multiple third-party agencies, law firms, or debt purchasers, run recovery across more than one asset class or business unit, and carry a compliance posture that needs audit-ready oversight across every vendor.",
    },
    {
      id: "coexist-tools",
      question: "How does dPlat coexist with our pre-delinquency and AR tools?",
      answer:
        "dPlat is the system of record for the post-charge-off placement lifecycle, and it integrates with the rest of your receivables stack rather than replacing it. Pre-delinquency engagement tools and broader AR platforms can sit upstream; dPlat takes accounts once they move into third-party recovery and feeds outcomes back to your data warehouse.",
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
  heading: "Put dPlat next to your shortlist.",
  body:
    "Bring the platforms you're weighing and the gaps you're trying to close. We'll show you where dPlat is strong, where it isn't, and whether it's the right answer for your operation.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "Straight answers, no commitment.",
};
