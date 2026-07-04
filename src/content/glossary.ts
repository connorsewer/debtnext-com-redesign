/**
 * /resources/glossary content — recovery operations glossary.
 *
 * Definitions rewritten into CLAUDE.md §5 marketing voice from the authored
 * glossary corpus at
 * ~/Documents/Claude Cowork/TSI Marketing/SEO/Programmatic SEO/Content Library/glossary/<slug>.json
 * (definition + why-it-matters fields). Terms without an authored corpus entry
 * are drafted fresh and flagged in the PR body as coined:
 *   - recovery management software
 *   - treatment tier
 *   - work standards
 *   - credit originator
 *   - agency scorecard (grounded on collection-scorecard.json)
 *
 * No em dashes. No banned phrases. Regulatory references are definitional and
 * trace to the corpus. [CLAIMS REVIEW] regulatory summaries; [COI REVIEW] none
 * (vendor-network language stays agency-network-agnostic per §6).
 */

export interface GlossaryTerm {
  /** URL fragment anchor. */
  slug: string;
  term: string;
  /** 40 to 70 words, §5 voice. */
  definition: string;
  /** Optional capability link when the term maps to a dPlat module. */
  link?: { label: string; href: string };
}

export const glossaryMeta = {
  title: "Recovery operations glossary",
  description:
    "Plain-language definitions of the terms recovery operations teams use every day: placement, treatment tiers, liquidation rate, net-back, Regulation F, and more.",
  canonical: "https://debtnext.com/resources/glossary",
};

export const glossaryHero = {
  eyebrow: "Glossary",
  h1: "Recovery operations glossary.",
  body:
    "The vocabulary of post-charge-off recovery, defined in plain language. Written by the team that builds and runs dPlat, for the people running recovery operations.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

/**
 * Ordered A-to-Z. Each definition is self-contained so a term can be linked
 * and read on its own.
 */
export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "recovery-management-software",
    term: "Recovery management software",
    definition:
      "The system a credit originator uses to run post-charge-off recovery across its vendor network. It holds the placement lifecycle as a system of record: which accounts go to which agency, law firm, or debt buyer, on what terms, and how each performs. dPlat is recovery management software built for multi-vendor operations.",
    link: { label: "Explore the platform", href: "/platform" },
  },
  {
    slug: "first-party-collections",
    term: "First-party vs third-party collections",
    definition:
      "First-party collections happen under the original creditor's name, usually in early delinquency before charge-off. Third-party collections happen when an outside agency, legally distinct from the creditor, works the account on the creditor's behalf and falls under the full FDCPA as a debt collector. Most third-party work runs on a contingency fee.",
  },
  {
    slug: "placement",
    term: "Placement",
    definition:
      "The act of transferring delinquent accounts to a collection agency, law firm, or other recovery vendor and authorizing them to work the account. Placement is the entry point of the third-party recovery lifecycle. dPlat's Placement Management module is the system of record for which accounts sit with which vendor, on what terms.",
    link: { label: "See Placement Management", href: "/platform/placement" },
  },
  {
    slug: "treatment-tier",
    term: "Treatment tier",
    definition:
      "A segment of accounts that share a recovery strategy: the channel mix, contact cadence, vendor assignment, and escalation path applied to them. Tiering lets an operation treat a high-balance recent account differently from an aged low-balance one. dPlat routes each tier to the right vendor and strategy through its placement logic.",
    link: { label: "See Placement Management", href: "/platform/placement" },
  },
  {
    slug: "recall",
    term: "Recall",
    definition:
      "Withdrawing a placed account from a vendor before the standard placement period ends. Common triggers are bankruptcy, a direct payment, a dispute, a deceased-debtor notice, or a compliance hold. Clean recall handling keeps the vendor network working the right inventory. dPlat automates recalls and reconciles them back to the system of record.",
  },
  {
    slug: "charge-off",
    term: "Charge-off",
    definition:
      "An accounting entry where a creditor declares a debt unlikely to be collected and moves it off the balance sheet as a loss. Charge-off does not forgive the debt or stop collection. It usually triggers the placement decision: work the account through a third-party vendor, or sell it to a debt buyer.",
  },
  {
    slug: "net-back",
    term: "Net-back",
    definition:
      "The net dollars a creditor keeps per dollar placed, after every agency fee and cost comes out. Net-back is the honest measure of what recovery outsourcing actually returns, since a high gross recovery at a high fee can lose to a lower gross at a lower fee. dPlat reporting surfaces net-back by vendor and segment.",
    link: { label: "See Reporting and Dashboards", href: "/platform/reporting" },
  },
  {
    slug: "liquidation-rate",
    term: "Liquidation rate",
    definition:
      "The share of a placed balance that a vendor actually recovers within a defined window. It is the headline performance number operations teams watch, tracked by vendor, vintage, and segment to compare who is working which inventory well. dPlat computes liquidation rate consistently across the network so scorecards stay comparable.",
    link: { label: "See Reporting and Dashboards", href: "/platform/reporting" },
  },
  {
    slug: "contingency-fee",
    term: "Contingency fee",
    definition:
      "The percentage of dollars collected, not dollars placed, that a vendor keeps as payment. Because the fee only applies to what comes in, it ties the vendor's incentive to recovery and puts no fixed cost on accounts that never pay. Contingency rates commonly run from 15% to 50% depending on portfolio and stage.",
  },
  {
    slug: "debt-sale",
    term: "Debt sale",
    definition:
      "Selling past-due accounts outright to a debt buyer for a lump sum. The buyer takes full ownership of the accounts and all collection rights, so the seller trades future recovery for cash today and a clean exit. Sale is one branch of the post-charge-off decision, alongside continued third-party placement.",
  },
  {
    slug: "vendor-panel",
    term: "Vendor panel",
    definition:
      "The set of collection agencies, law firms, and specialty vendors a creditor places accounts with, managed as a group rather than a single relationship. A panel lets an operation allocate inventory by performance and segment and test vendors against each other. dPlat is the command center for running a multi-vendor panel.",
    link: { label: "Explore the platform", href: "/platform" },
  },
  {
    slug: "work-standards",
    term: "Work standards",
    definition:
      "The rules a creditor sets for how vendors handle placed accounts: contact frequency, allowed channels, hold and dispute handling, documentation, and compliance behavior. Written standards turn expectations into something measurable and auditable across the panel. dPlat tracks vendor activity against these standards so gaps surface early.",
  },
  {
    slug: "agency-scorecard",
    term: "Agency scorecard",
    definition:
      "A structured way to grade each vendor across weighted dimensions: recovery effectiveness, compliance health, operational quality, and responsiveness. Scorecards make vendor comparison objective and drive allocation and offboarding decisions. dPlat generates scorecards from the same data that runs placements, so the numbers behind a grade are traceable.",
    link: { label: "See Reporting and Dashboards", href: "/platform/reporting" },
  },
  {
    slug: "credit-originator",
    term: "Credit originator",
    definition:
      "The company that extended the original credit or service and now owns the receivable: a lender, utility, telecom, healthcare provider, or fintech. Credit originators are dPlat's buyers. They run recovery across a network of outside vendors and need one system of record for the whole placement lifecycle.",
  },
  {
    slug: "regulation-f",
    term: "Regulation F",
    definition:
      "The CFPB's 2021 rule implementing the FDCPA, the first substantive update to its operational requirements since 1977. Regulation F set the 7-in-7 call frequency cap, rules for email and text contact, and a model validation notice. Vendors working placed accounts have to operate inside it. [CLAIMS REVIEW]",
  },
  {
    slug: "fdcpa",
    term: "FDCPA",
    definition:
      "The Fair Debt Collection Practices Act, 15 U.S.C. § 1692, the core federal law governing third-party debt collectors. It bars abusive, deceptive, and unfair practices, gives consumers the right to dispute and to demand contact stop, and creates a private right of action with statutory damages. It applies to the vendors in your network. [CLAIMS REVIEW]",
  },
  {
    slug: "fcra",
    term: "FCRA",
    definition:
      "The Fair Credit Reporting Act, 15 U.S.C. § 1681, which governs how consumer credit information is collected, kept accurate, and used. It sets obligations for credit bureaus, for furnishers like lenders and collectors, and for anyone using a credit report, plus consumer rights to access and dispute their data. [CLAIMS REVIEW]",
  },
  {
    slug: "scra",
    term: "SCRA",
    definition:
      "The Servicemembers Civil Relief Act, 50 U.S.C. §§ 3901 and following, which protects active-duty servicemembers from certain civil actions. It caps interest on pre-service debt at 6%, limits default judgments and property actions, and can stay civil proceedings during deployment. Recovery operations screen accounts for SCRA status before they act. [CLAIMS REVIEW]",
  },
  {
    slug: "champion-challenger",
    term: "Champion/challenger",
    definition:
      "A controlled test where the current best recovery strategy, the champion, runs against one or more alternatives, the challengers, on randomly allocated live accounts. Whichever wins on the metric that matters becomes the new champion. It turns strategy changes into measured decisions. dPlat's optimization tooling runs these tests inside the placement flow.",
    link: { label: "See Optimization Engine", href: "/platform/optimization" },
  },
  {
    slug: "compliance-management-system",
    term: "Compliance management system",
    definition:
      "The framework of policies, procedures, training, monitoring, testing, and complaint handling a collector or creditor keeps to stay compliant with consumer protection law. It is also the lens CFPB examiners use to judge a program. A strong CMS depends on traceable records of what each vendor did on each account. [CLAIMS REVIEW]",
  },
];

export const glossaryFinalCta = {
  heading: "See how dPlat runs the recovery lifecycle.",
  body:
    "A 30-minute walkthrough against your portfolio, your vendor mix, and the terms in this glossary as they show up in a live operation.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
