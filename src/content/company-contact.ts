/**
 * /company/contact content - child page under /company.
 * Source copy: DebtNext_Company_Pages_Copy.docx (page 4 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * Production note: no general-inquiry email, phone number, or mailing address
 * is published until confirmed, so none is fabricated here. The demo path uses
 * the existing /demo form. [VERIFY] the Copley, Ohio office reference and the
 * client-support routing language before publish.
 */

import type { GridCard } from "@/components/sections/CardGrid";

export const contactMeta = {
  title: "Contact DebtNext",
  description:
    "Talk to the DebtNext team. Request a platform demo, reach client support, or send a general inquiry.",
  canonical: "https://debtnext.com/company/contact",
};

export const contactHero = {
  eyebrow: "Contact",
  h1: "Talk to the team that builds dPlat.",
  body:
    "Whether you're evaluating the platform, already running it, or just have a question, here's how to reach the right people.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

export const contactChannels: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "How to reach us",
  heading: "Reach the right people.",
  cards: [
    {
      title: "Evaluating dPlat",
      body:
        "A 30-minute walkthrough scoped to your portfolio, vendor mix, and operational pain points. The people running the demo are the people who configure the platform.",
      link: { label: "Request a demo", href: "/demo" },
    },
    {
      title: "Client support",
      body:
        "Current clients reach platform support through the channels established during implementation. Your account team and the support process set up for your deployment are the fastest path.",
    },
    {
      title: "General inquiries",
      body:
        "For partnerships, media, or general questions, send a note and we'll route it to the right team.",
    },
  ],
};

// [VERIFY] Confirm the Copley, Ohio office reference is current before publish.
export const contactLocation = {
  eyebrow: "Where we are",
  heading: "Onshore, in Ohio.",
  paragraphs: [
    "DebtNext's main business office is in Copley, Ohio, with platform infrastructure hosted in Cleveland and Columbus. The company operates within the United States and Canada.",
  ],
};

export const contactFinalCta = {
  heading: "Ready when you are.",
  body: "Start with a platform walkthrough and we'll take it from there.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
