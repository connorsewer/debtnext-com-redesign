/**
 * /solutions content — source: content/pages/solutions.md
 * [CLAIMS REVIEW] / [COI REVIEW] preserved as comments.
 */

import type { GridCard } from "@/components/sections/CardGrid";

export const solutionsMeta = {
  title: "Solutions: recovery management across regulated industries",
  description:
    "dPlat is in production with utilities, financial services, telecom, fintech, insurance, and healthcare recovery teams. If your business manages receivables, B2B or B2C, the platform fits. One configurable system.",
  canonical: "https://debtnext.com/solutions",
};

export const solutionsHero = {
  eyebrow: "Solutions",
  h1: "Built for any business that recovers at scale.",
  body:
    "dPlat runs across utilities, financial services, telecom, fintech, insurance, and healthcare. If your business manages receivables, B2B or B2C, you can place accounts, manage vendors, and prove compliance in one system. Each sector has its own rules, account characteristics, and vendor mix, and the configuration model handles all of them.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

// [CLAIMS REVIEW] Andrew to confirm utility/Fortune 100 framing before launch.
export const solutionsIndustries: {
  heading: string;
  body: string;
  cards: GridCard[];
} = {
  heading: "Where dPlat runs.",
  body:
    "The platform is industry-agnostic by design but tuned to the operational realities of each sector through configuration.",
  cards: [
    {
      title: "Utility providers",
      body:
        "Residential and commercial portfolios, final-bill recovery, write-off management, and dispute handling. Configurable for state-by-state regulatory requirements and the utility-specific account attributes (disconnect reason, service address, deposit balance) that drive placement strategy.",
      link: { label: "Explore utilities", href: "/solutions/utilities" },
    },
    {
      title: "Financial services",
      body:
        "Bank card, installment loan, line of credit, and overdraft recovery. Built to support FDCPA, Reg F, FCRA, and TCPA workflows. Decedent, bankruptcy, and SCRA conditions handled as platform-level exceptions.",
      link: {
        label: "Explore financial services",
        href: "/solutions/financial-services",
      },
    },
    {
      title: "Telecom",
      body:
        "Post-disconnect recovery for wireless, wireline, and broadband carriers. High-volume placement, short treatment windows, and aggressive write-off cycles. Configurable for industry-specific data exchange formats and the prepaid/postpaid distinction.",
      link: { label: "Explore telecom", href: "/solutions/telecom" },
    },
    {
      title: "Fintech",
      body:
        "Direct lender, BNPL, and digital banking portfolios. API-first integration with modern billing and origination systems. Configurable workflows for the rapid product iteration fintech operations require.",
      link: { label: "Explore fintech", href: "/solutions/fintech" },
    },
    {
      title: "Insurance",
      body:
        "Subrogation, deductible recovery, salvage, and premium or policy receivables for B2B and B2C carriers. Configurable for state insurance rules and for FDCPA where the obligor is a consumer.",
      link: { label: "Explore insurance", href: "/solutions/insurance" },
    },
    {
      title: "Healthcare and RCM",
      body:
        "Patient-responsibility balances and bad-debt recovery for hospital systems, physician groups, and revenue cycle management providers. The agency network, placement, and audit trail work the same as every other portfolio.",
      link: { label: "Explore healthcare", href: "/solutions/healthcare" },
    },
  ],
};

export const solutionsCrossIndustry = {
  heading: "One platform across every portfolio you run.",
  body:
    "Organizations with multi-line businesses (a financial institution with a consumer loan portfolio and a small business portfolio, a utility with residential and commercial accounts) use dPlat to manage every portfolio in the same system. Workflows configure per portfolio. Reporting rolls up across portfolios. Vendor networks can be shared or segmented.",
  bullets: [
    "Multi-portfolio configuration with shared or segmented vendor networks",
    "Cross-portfolio reporting with portfolio-level drill-downs",
    "Single audit trail across every portfolio and every vendor",
  ],
};

// [COI REVIEW] Andrew to verify framing on "regulatory infrastructure" claims.
export const solutionsCompliance = {
  heading: "Regulatory infrastructure across industries.",
  body:
    "Every industry dPlat serves carries its own regulatory framework. The platform's compliance layer is configurable to whichever frameworks apply to your portfolio.",
  bullets: [
    "FDCPA and Regulation F (consumer financial services)",
    "FCRA and FACT Act (credit reporting)",
    "TCPA (telecommunications consumer protection)",
    "SCRA (servicemembers credit relief)",
    "HIPAA (healthcare-adjacent portfolios where applicable)",
    "State-specific licensing and reporting requirements",
    "Industry-specific frameworks (e.g., utility PUC rules, telecom CPNI handling)",
  ],
};

export const solutionsFinalCta = {
  heading: "See dPlat configured for your industry.",
  body:
    "A demo walkthrough scoped to your portfolio type, vendor mix, and regulatory environment.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
