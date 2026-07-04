/**
 * /services content - Implementation and services.
 *
 * Base facts drawn from src/content/compare.ts (comparePillars, compareTeamIntro,
 * compareLeadership): five-phase method, two ongoing teams, dedicated PM +
 * product specialist, onshore, two releases a year. Timeline "6 to 9 months"
 * per compare.ts (NOT the retired legacy 90-120 days). The portfolio-guidance
 * service flavor is folded into Portfolio Management per owner decision; the
 * legacy service name is never used.
 *
 * [CLAIMS REVIEW] Release cadence detail (twice yearly, release notes 4 to 6
 * weeks ahead) and the "6 to 9 months" timeline. No performance metrics.
 *
 * No em dashes. No banned phrases. Primary CTA is "Request a demo".
 */

import type { ProcessStep } from "@/components/sections/ProcessStrip";

export const servicesMeta = {
  title: "Implementation and services",
  description:
    "How dPlat gets implemented and supported: a five-phase method with named ownership, a 6 to 9 month timeline, and two dedicated teams running platform and portfolio after launch.",
  canonical: "https://debtnext.com/services",
};

export const servicesHero = {
  eyebrow: "Implementation and services",
  h1: "The service that ships with the software.",
  body:
    "dPlat is the platform. The team behind it is part of why it works. Implementation runs to a structured method, and two dedicated teams stay on after launch. All of it onshore.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "Why dPlat", href: "/why-dplat" },
};

export const servicesMethodIntro = {
  eyebrow: "The implementation method",
  heading: "Five phases, named ownership, joint sign-off.",
  body:
    "Implementation follows a structured method with named deliverables at each phase. Every project has a dedicated project manager and a product specialist who documents your requirements into the plan. A typical implementation runs 6 to 9 months.",
};

export const servicesPhases: { steps: ProcessStep[] } = {
  steps: [
    {
      title: "Define",
      body:
        "We document how your recovery operation runs today: portfolios, vendor network, placement logic, and the outcomes you're measured on. The product specialist turns that into a written requirements plan you sign off on.",
    },
    {
      title: "Develop",
      body:
        "We configure dPlat to the plan: placement rules, treatment tiers, allocation logic, work standards, and reporting. You see the configuration take shape against your own operation, not a generic template.",
    },
    {
      title: "Integrate",
      body:
        "We connect dPlat to your servicing or billing system and to the agencies, law firms, and buyers in your network. Data exchange, file transfers, and reconciliation are built and validated against real files.",
    },
    {
      title: "Deploy",
      body:
        "We move the configured, integrated platform into production with joint sign-off. Go-live is a planned event with the same team that built the configuration standing behind it.",
    },
    {
      title: "Support",
      body:
        "After launch, ongoing support takes over. The dedicated teams that run the platform and your portfolio pick up from here, on a regular cadence with your account managers.",
    },
  ],
};

export const servicesPlatformTeam = {
  eyebrow: "Ongoing team one",
  heading: "Platform Management runs the technical operation.",
  paragraphs: [
    "After launch, a dedicated Platform Management team keeps the technical operation running. They own data exchange validation, file transfers, allocation logic, media fulfillment, and reconciliation.",
    "This is the team that makes sure the pipes stay clean: that placements, recalls, and payments move correctly between your systems and the vendor network, and that the numbers reconcile.",
  ],
};

export const servicesPortfolioTeam = {
  eyebrow: "Ongoing team two",
  heading: "Portfolio Management runs the strategy.",
  paragraphs: [
    "A dedicated Portfolio Management team runs the strategy side: vendor scorecards, segmentation, and monthly business reviews. Account managers meet with you on a regular cadence.",
    "This is where the guidance lives. The team helps you read agency performance, tune how inventory is segmented and allocated across the network, and decide where to test a new approach against your champion strategy.",
    "The people advising you on portfolio strategy have spent their careers in recovery operations. They're reading your scorecards with an operator's eye, not a support script.",
  ],
};

export const servicesOnshore = {
  eyebrow: "One product, built onshore",
  heading: "One product, one onshore team.",
  paragraphs: [
    "DebtNext builds, supports, and operates one product: dPlat. The entire development and support organization is onshore in the United States.",
    "Two major releases ship a year, with most new functionality driven by client feedback. Release notes go out ahead of each release, typically 4 to 6 weeks in advance, so you can plan around what's changing. The people who configure your platform are the same people who designed it.",
  ],
};

export const servicesFinalCta = {
  heading: "See how implementation would run for you.",
  body:
    "A 30-minute walkthrough of the method, the timeline, and the teams, mapped to your portfolio and vendor network.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
