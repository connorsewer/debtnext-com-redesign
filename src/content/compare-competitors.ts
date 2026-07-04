/**
 * /compare/[competitor] content — per-competitor comparison pages.
 *
 * [CLAIMS REVIEW] Every competitor characterization traces to the approved
 * /compare matrix (src/content/compare.ts: compareMatrix, compareMarket). No
 * new competitive claims are introduced here. Each vendor's scope reflects its
 * own public positioning. Tone is fair and respectful; no trashing.
 *
 * No em dashes. No banned phrases. Primary CTA is "Request a demo".
 */

export interface CompetitorComparison {
  slug: string;
  /** Display name of the competitor. */
  name: string;
  meta: { title: string; description: string; canonical: string };
  hero: {
    eyebrow: string;
    h1: string;
    body: string;
    primaryCta: { label: string; href: string };
  };
  /** "What <Competitor> is built for" — from matrix builtFor/chosen. */
  builtFor: { heading: string; paragraphs: string[] };
  /** "Where <Competitor> stops" — from matrix "stops". */
  stops: { heading: string; paragraphs: string[] };
  /** "Where dPlat is different" — system-of-record / vendor-network angle. */
  differs: { heading: string; paragraphs: string[] };
  /** Honest "when to choose which". */
  chooseWhich: {
    heading: string;
    chooseThem: { title: string; body: string };
    chooseDplat: { title: string; body: string };
  };
  finalCta: {
    heading: string;
    body: string;
    primaryCta: { label: string; href: string };
    reassurance: string;
  };
}

const DEMO_CTA = { label: "Request a demo", href: "/demo" };
const CANON = (slug: string) => `https://debtnext.com/compare/${slug}`;

export const competitorComparisons: CompetitorComparison[] = [
  {
    slug: "neuanalytics",
    name: "NeuAnalytics",
    meta: {
      title: "dPlat vs NeuAnalytics: recovery orchestration vs vendor oversight",
      description:
        "How dPlat and NeuAnalytics compare. NeuAnalytics monitors vendor compliance and licensing; dPlat is the system of record that runs the whole placement lifecycle.",
      canonical: CANON("neuanalytics"),
    },
    hero: {
      eyebrow: "Compare",
      h1: "dPlat and NeuAnalytics: which fits your recovery operation.",
      body:
        "Both platforms take an open, multi-vendor view of recovery. They solve different parts of it. Here's an honest read on where each one is strong.",
      primaryCta: DEMO_CTA,
    },
    builtFor: {
      heading: "What NeuAnalytics is built for.",
      paragraphs: [
        "NeuAnalytics is built for vendor oversight and risk management. It watches an existing third-party network in real time for compliance and licensing gaps, and surfaces where vendor performance is drifting.",
        "Risk officers reach for it when the mandate is to fix vendor compliance across agencies that are already placed and already working accounts. On that mandate it does its job well.",
      ],
    },
    stops: {
      heading: "Where NeuAnalytics stops.",
      paragraphs: [
        "NeuAnalytics is positioned as oversight rather than orchestration. It has lighter coverage of the full operational lifecycle and the execution capacity underneath it.",
        "It tells you how your vendors are doing. It isn't the system that decides which accounts go to which vendor, on what terms, and moves them through placement, recall, and reconciliation.",
      ],
    },
    differs: {
      heading: "Where dPlat is different.",
      paragraphs: [
        "dPlat is the system of record for the placement lifecycle, not a monitoring layer on top of one. It holds the inventory: which accounts sit with which agency, law firm, or debt buyer, on what terms, at what fee.",
        "Vendor scorecards in dPlat come from the same data that runs the placements, so oversight and execution are the same system. The compliance view and the operational reality can't drift apart because they share one source.",
      ],
    },
    chooseWhich: {
      heading: "When to choose which.",
      chooseThem: {
        title: "Choose NeuAnalytics when",
        body:
          "Your placement system already works and the gap is oversight. You want a dedicated layer watching vendor compliance and licensing across a network you're happy with. That's NeuAnalytics' home turf.",
      },
      chooseDplat: {
        title: "Choose dPlat when",
        body:
          "You need the system underneath the network: one place to run placement, recalls, allocations, and reconciliation, with vendor scorecards built from the same operational data. dPlat is the system of record, oversight included.",
      },
    },
    finalCta: {
      heading: "See dPlat against your vendor network.",
      body:
        "A 30-minute walkthrough of how dPlat runs placement and vendor oversight from one system, against your real portfolio and vendor mix.",
      primaryCta: DEMO_CTA,
      reassurance: "30-minute walkthrough. No commitment.",
    },
  },
  {
    slug: "convoke",
    name: "Convoke",
    meta: {
      title: "dPlat vs Convoke: lifecycle orchestration vs compliance audit",
      description:
        "How dPlat and Convoke compare. Convoke is oversight-grade audit and secure document sharing for banking debt sales; dPlat runs the full post-charge-off placement lifecycle.",
      canonical: CANON("convoke"),
    },
    hero: {
      eyebrow: "Compare",
      h1: "dPlat and Convoke: which fits your recovery operation.",
      body:
        "Convoke is built for a specific, demanding job in bank recovery. dPlat is built to run the whole lifecycle. Here's where each one fits.",
      primaryCta: DEMO_CTA,
    },
    builtFor: {
      heading: "What Convoke is built for.",
      paragraphs: [
        "Convoke is built for vendor compliance and audit. It provides secure document sharing and oversight-grade audit trails across a third-party network, with a strong focus on banking debt sales.",
        "Top-tier US banks choose it when strict risk and compliance reporting is the priority and the audit trail has to hold up. For that requirement, Convoke is a serious, defensible choice.",
      ],
    },
    stops: {
      heading: "Where Convoke stops.",
      paragraphs: [
        "Convoke is a reporting-and-oversight architecture rather than full lifecycle orchestration, and it's heavily oriented to the debt-sales side of banking.",
        "It documents and audits what happens in the network. It isn't the platform that runs first-party pre-collect, third-party agency placement, and legal network management as one operation.",
      ],
    },
    differs: {
      heading: "Where dPlat is different.",
      paragraphs: [
        "dPlat handles the full post-charge-off lifecycle in one command center: first-party pre-collect, third-party placement, debt purchaser allocations, and legal network management. Audit trails are a byproduct of running the operation, not a separate system.",
        "Because dPlat is the system of record, the compliance record and the placement record are the same record. That covers debt sales as one branch of the lifecycle, alongside continued placement, rather than as the center of gravity.",
      ],
    },
    chooseWhich: {
      heading: "When to choose which.",
      chooseThem: {
        title: "Choose Convoke when",
        body:
          "You're a bank whose priority is oversight-grade audit and secure document sharing, especially around debt sales, and your placement execution already lives somewhere you're satisfied with. Convoke is built for exactly that.",
      },
      chooseDplat: {
        title: "Choose dPlat when",
        body:
          "You need one system to run the whole lifecycle, from pre-collect through legal, with the audit trail falling out of the operation itself. dPlat is the system of record for placement, with debt sales as one path within it.",
      },
    },
    finalCta: {
      heading: "See the full lifecycle in one system.",
      body:
        "A 30-minute walkthrough of how dPlat runs placement, legal, and debt sales from a single system of record, against your portfolio.",
      primaryCta: DEMO_CTA,
      reassurance: "30-minute walkthrough. No commitment.",
    },
  },
  {
    slug: "imagine-cloud",
    name: "Imagine Cloud",
    meta: {
      title: "dPlat vs Imagine Cloud (OutSourcer): orchestration vs compliance monitoring",
      description:
        "How dPlat and Imagine Cloud compare. Imagine Cloud automates compliance monitoring across your agency network; dPlat is the placement and orchestration layer underneath it.",
      canonical: CANON("imagine-cloud"),
    },
    hero: {
      eyebrow: "Compare",
      h1: "dPlat and Imagine Cloud: which fits your recovery operation.",
      body:
        "Imagine Cloud (OutSourcer) automates compliance monitoring. dPlat runs the placement operation underneath it. The two solve adjacent problems.",
      primaryCta: DEMO_CTA,
    },
    builtFor: {
      heading: "What Imagine Cloud is built for.",
      paragraphs: [
        "Imagine Cloud is built for vendor compliance automation. It runs your compliance rules against every vendor account event and flags violations as they surface, so nothing waits for a monthly review to be caught.",
        "Banks and lenders choose it when they want automated compliance monitoring and clear visibility across an agency network. As an always-on compliance watchdog, it's a strong fit.",
      ],
    },
    stops: {
      heading: "Where Imagine Cloud stops.",
      paragraphs: [
        "Imagine Cloud is oriented to compliance oversight and visibility. The placement and orchestration layer still runs elsewhere.",
        "It checks the events your operation generates against your rules. It isn't the system generating those events: assigning accounts, setting terms, handling recalls, and reconciling recovery back to the ledger.",
      ],
    },
    differs: {
      heading: "Where dPlat is different.",
      paragraphs: [
        "dPlat is the placement and orchestration layer Imagine Cloud sits next to. It's the system of record that assigns accounts to vendors, sets the terms, and moves inventory through the lifecycle.",
        "Compliance rules in dPlat run against the operation from inside it, on the same data that drives placement. One system produces the account events and measures them, so there's no gap between what happened and what got checked.",
      ],
    },
    chooseWhich: {
      heading: "When to choose which.",
      chooseThem: {
        title: "Choose Imagine Cloud when",
        body:
          "Your placement system is settled and you want a dedicated, automated compliance monitor watching every vendor event against your rules. Imagine Cloud is purpose-built for that visibility.",
      },
      chooseDplat: {
        title: "Choose dPlat when",
        body:
          "You need the orchestration layer itself: the system that assigns, prices, recalls, and reconciles across the vendor network, with compliance checks running on the same operational data. dPlat is that system of record.",
      },
    },
    finalCta: {
      heading: "See the orchestration layer in action.",
      body:
        "A 30-minute walkthrough of how dPlat runs placement and compliance from one system of record, against your agency network.",
      primaryCta: DEMO_CTA,
      reassurance: "30-minute walkthrough. No commitment.",
    },
  },
  {
    slug: "symend",
    name: "Symend",
    meta: {
      title: "dPlat vs Symend: post-charge-off recovery vs pre-charge-off engagement",
      description:
        "How dPlat and Symend compare. Symend drives pre-charge-off consumer engagement and self-cure; dPlat runs third-party vendor management and the post-charge-off legal lifecycle.",
      canonical: CANON("symend"),
    },
    hero: {
      eyebrow: "Compare",
      h1: "dPlat and Symend: which fits your recovery operation.",
      body:
        "Symend and dPlat work different ends of the delinquency timeline. Many operations end up wanting both. Here's how to think about where each fits.",
      primaryCta: DEMO_CTA,
    },
    builtFor: {
      heading: "What Symend is built for.",
      paragraphs: [
        "Symend is built for consumer engagement and self-cure. It runs behavioral-science driven digital outreach flows that nudge consumers to resolve accounts before they harden into charge-off.",
        "Telecom, utilities, and consumer lenders choose it for pre-charge-off retention and churn reduction. For keeping customers from going delinquent in the first place, that's the right tool.",
      ],
    },
    stops: {
      heading: "Where Symend stops.",
      paragraphs: [
        "Symend is a pre-charge-off engagement layer. It doesn't address third-party vendor management or the legal recovery lifecycle.",
        "Once an account passes charge-off and moves to an outside agency, law firm, or debt buyer, the problem changes from consumer engagement to vendor orchestration. That's outside what Symend is built to do.",
      ],
    },
    differs: {
      heading: "Where dPlat is different.",
      paragraphs: [
        "dPlat picks up where pre-charge-off engagement leaves off. It's the system of record for third-party placement: which accounts go to which agency or firm, on what terms, and how each vendor performs.",
        "It covers the part of the timeline Symend doesn't touch, the multi-vendor and legal recovery lifecycle, and integrates with the rest of the receivables stack around it. The two are complementary, not competing.",
      ],
    },
    chooseWhich: {
      heading: "When to choose which.",
      chooseThem: {
        title: "Choose Symend when",
        body:
          "Your priority is keeping consumers from reaching charge-off through digital self-cure and retention, especially in telecom, utilities, and consumer lending. Pre-delinquency engagement is Symend's home turf.",
      },
      chooseDplat: {
        title: "Choose dPlat when",
        body:
          "Your accounts have moved past charge-off into a third-party vendor network and you need to run agency placement, legal recovery, and vendor performance from one system. That's what dPlat is built for.",
      },
    },
    finalCta: {
      heading: "See the post-charge-off half of the timeline.",
      body:
        "A 30-minute walkthrough of how dPlat runs third-party placement and legal recovery, against your portfolio and vendor mix.",
      primaryCta: DEMO_CTA,
      reassurance: "30-minute walkthrough. No commitment.",
    },
  },
  {
    slug: "highradius",
    name: "HighRadius",
    meta: {
      title: "dPlat vs HighRadius: consumer recovery vs B2B order-to-cash",
      description:
        "How dPlat and HighRadius compare. HighRadius automates B2B order-to-cash and DSO reduction; dPlat runs post-charge-off consumer recovery across a third-party vendor network.",
      canonical: CANON("highradius"),
    },
    hero: {
      eyebrow: "Compare",
      h1: "dPlat and HighRadius: which fits your recovery operation.",
      body:
        "HighRadius and dPlat serve different receivables entirely. Knowing which problem you're solving makes the choice straightforward.",
      primaryCta: DEMO_CTA,
    },
    builtFor: {
      heading: "What HighRadius is built for.",
      paragraphs: [
        "HighRadius is built for B2B autonomous finance, the order-to-cash cycle. It applies AI agents to invoice-to-cash and credit-to-cash automation inside the office of the CFO.",
        "Large B2B enterprises choose it to reduce DSO and automate accounts receivable. For early-stage B2B receivables and cash application, it's a leading platform.",
      ],
    },
    stops: {
      heading: "Where HighRadius stops.",
      paragraphs: [
        "HighRadius is built for early-stage B2B receivables. It doesn't address post-charge-off consumer recovery.",
        "Its world is invoices, credit, and cash application before things go badly wrong. It isn't built for the consumer collections lifecycle, third-party agency placement, or legal recovery that starts after charge-off.",
      ],
    },
    differs: {
      heading: "Where dPlat is different.",
      paragraphs: [
        "dPlat is built for the opposite end of the receivables world: post-charge-off consumer recovery through a network of outside agencies, law firms, and debt buyers.",
        "It's the system of record for that placement lifecycle across utility, telecom, financial services, fintech, and healthcare portfolios. Where HighRadius automates B2B cash application, dPlat orchestrates consumer recovery vendors.",
      ],
    },
    chooseWhich: {
      heading: "When to choose which.",
      chooseThem: {
        title: "Choose HighRadius when",
        body:
          "Your problem is B2B order-to-cash: reducing DSO, automating invoice-to-cash and credit decisions inside the office of the CFO. That's squarely HighRadius' territory.",
      },
      chooseDplat: {
        title: "Choose dPlat when",
        body:
          "Your problem is post-charge-off consumer recovery run through third-party agencies, law firms, and debt buyers. dPlat is the system of record for that vendor-network lifecycle.",
      },
    },
    finalCta: {
      heading: "See consumer recovery orchestration.",
      body:
        "A 30-minute walkthrough of how dPlat runs post-charge-off recovery across a third-party vendor network, against your portfolio.",
      primaryCta: DEMO_CTA,
      reassurance: "30-minute walkthrough. No commitment.",
    },
  },
];

export function getCompetitorComparison(
  slug: string,
): CompetitorComparison | undefined {
  return competitorComparisons.find((c) => c.slug === slug);
}
