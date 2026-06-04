/**
 * /company content — source: content/pages/company.md
 * [COI REVIEW] required on the entire TSI ownership section.
 * [CLAIMS REVIEW] on encryption + compliance claims.
 */

import type { GridCard } from "@/components/sections/CardGrid";
import type { ProofStat } from "@/components/sections/ProofBand";

export const companyMeta = {
  title: "Company",
  description:
    "DebtNext has been building recovery management software for credit originators since 2003. A TSI company.",
  canonical: "https://debtnext.com/company",
};

export const companyHero = {
  eyebrow: "Company",
  h1: "We build recovery management software. That's it.",
  body:
    "DebtNext has been focused on recovery management software since 2003. Our flagship product is dPlat, the platform that credit originators use to manage their recovery vendor networks at scale.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const companyFoundingStory = {
  heading: "Why dPlat exists.",
  paragraphs: [
    "In 2003, recovery operations teams were stitching together spreadsheets, vendor portals, and one-off integrations to manage their placement strategy. The result was operational fragility: missed SLAs, broken audit trails, and vendor performance data that lived in someone's email.",
    "DebtNext was founded to fix that. dPlat is the platform we built and have continued to build for 20+ years. The architecture has evolved. The focus hasn't.",
  ],
};

// [COI REVIEW] Andrew, Joe, and Michael to review framing of this section.
export const companyTsi = {
  eyebrow: "Ownership",
  heading: "A TSI company.",
  paragraphs: [
    "DebtNext is wholly owned by Transworld Systems Inc. (TSI), a portfolio company of Clearlake Capital Group. TSI is a revenue recovery platform with operations across accounts receivable management, healthcare revenue cycle, customer experience operations, and loan servicing.",
    "dPlat operates as TSI's recovery management software business. The platform connects credit originators to their recovery vendor networks, which can include TSI's own collection operations or any third-party vendor the client chooses. Clients configure their own vendor network inside the platform.",
  ],
  link: { label: "Visit tsico.com", href: "https://www.tsico.com" },
};

// [CLAIMS REVIEW] Verify titles and tenure with Paul before publication.
export const companyLeadership: {
  heading: string;
  body: string;
  cards: GridCard[];
} = {
  heading: "Who runs dPlat.",
  body: "dPlat is led by a team with 100+ combined years of recovery operations experience.",
  cards: [
    {
      eyebrow: "Co-founder & President",
      title: "Paul Goske",
      body: "Co-founded dPlat in 2003. 25 years in recovery operations and platform leadership.",
    },
    {
      eyebrow: "Co-founder & CTO",
      title: "Rob Novosel",
      body: "Co-founded dPlat in 2003. Owns product, operations, and technology, from middleware and implementation to support.",
    },
    {
      eyebrow: "Director of Strategic Initiatives",
      title: "Frank Ellenberger",
      body: "15 years in client implementation and platform operations.",
    },
    {
      eyebrow: "Operations Director",
      title: "Eric Port",
      body: "17 years in recovery operations leadership.",
    },
    {
      eyebrow: "Director, Product Innovation",
      title: "Andrew Hannan",
      body: "20 years in recovery platform product management.",
    },
  ],
};

// [CLAIMS REVIEW] Andrew to confirm exact framing.
export const companyStats: { eyebrow: string; stats: ProofStat[] } = {
  eyebrow: "dPlat by the numbers",
  stats: [
    {
      number: "Since 2003",
      label: "Building recovery management software",
    },
    {
      number: "60M+",
      label: "Active accounts",
      caption: "Across client deployments",
    },
    {
      number: "$1.5B+",
      label: "In payments annually",
      caption: "Processed through the platform on behalf of clients",
    },
    {
      number: "20+ years",
      label: "In continuous production",
      caption: "With credit originators",
    },
  ],
};

// [CLAIMS REVIEW] Andrew to verify which compliance certs can be referenced.
export const companySecurity = {
  heading: "Security and compliance posture.",
  body:
    "dPlat is built for regulated industries. Security and compliance are part of the platform's architecture.",
  bullets: [
    "AES-256 encryption in transit and at rest",
    "Column-level AES-128 encryption for PII",
    "PGP file exchange for vendor data",
    "LUKS encryption at the OS level",
    "SOC 2 Type II (TSI-level)",
    "HITRUST (TSI-level, for healthcare-adjacent operations)",
    "Built to support FDCPA, Regulation F, FCRA, TCPA, and SCRA workflows",
  ],
};

export const companyFinalCta = {
  heading: "See what we've built.",
  body: "A walkthrough of the platform with a member of the team that builds it.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
