/**
 * /pricing content — honest, quote-based answer for an enterprise SaaS sale.
 *
 * No numbers, no tiers, no price points (CLAUDE.md §15, §16). Quote drivers
 * are derived from how the platform is already described (portfolio size,
 * module scope, integration count, vendor-network size). No free trial.
 *
 * No em dashes. No banned phrases. Primary CTA is "Request a demo".
 */

import type { GridCard } from "@/components/sections/CardGrid";

export const pricingMeta = {
  title: "How dPlat pricing works",
  description:
    "dPlat is enterprise recovery software priced by quote. What drives a quote, what a proposal includes, and why every demo is scoped to your portfolio.",
  canonical: "https://debtnext.com/pricing",
};

export const pricingHero = {
  eyebrow: "Pricing",
  h1: "How dPlat pricing works.",
  body:
    "dPlat is enterprise software for running recovery across a vendor network. Pricing is quote-based, scoped to your portfolio and how you run. Here's how a quote comes together.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const pricingDrivers: { heading: string; body: string; cards: GridCard[] } = {
  heading: "What drives a quote.",
  body: "A dPlat quote reflects the shape of your operation. Four things move it most.",
  cards: [
    {
      title: "Portfolio size and placement volume",
      body:
        "The account volumes you manage and how much you place into your vendor network. A larger, higher-throughput operation carries more platform activity than a smaller one.",
    },
    {
      title: "Module scope",
      body:
        "Which capabilities you turn on: placement, optimization, issues management, reporting, and the rest. You scope dPlat to the parts of the lifecycle you're running today, with room to add later.",
    },
    {
      title: "Integration count",
      body:
        "How many systems dPlat connects to, from your servicing or billing platform to the agencies, law firms, and buyers in your network. More integrations mean more to build and maintain.",
    },
    {
      title: "Vendor-network size",
      body:
        "The number of collection agencies, law firms, debt buyers, and specialty vendors you orchestrate through the platform. A wider network is more for dPlat to manage as the system of record.",
    },
  ],
};

export const pricingProposal: { heading: string; paragraphs: string[] } = {
  heading: "What a proposal includes.",
  paragraphs: [
    "After a scoping conversation, you get a proposal built around your operation, not a menu. It sets out the modules in scope, the integrations we'll build, the implementation plan and timeline, and the ongoing platform and portfolio support that runs after launch.",
    "The proposal is specific enough to take to your finance team. It ties what you're paying for to the parts of your recovery operation dPlat is going to run.",
  ],
};

export const pricingNoTrial: { heading: string; paragraphs: string[] } = {
  heading: "No free trial. Demos scoped to your portfolio.",
  paragraphs: [
    "dPlat is an enterprise platform that becomes the system of record for your placement lifecycle. That isn't something you spin up on a trial account, so there isn't one.",
    "Instead, every demo is scoped to your portfolio: your account volumes, your vendor mix, and the operational pain you're trying to fix. You see dPlat against your reality before there's any commitment.",
  ],
};

export const pricingFinalCta = {
  heading: "Get a quote scoped to your operation.",
  body:
    "Start with a 30-minute walkthrough against your portfolio and vendor network. We'll scope what you'd actually run before we talk numbers.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
