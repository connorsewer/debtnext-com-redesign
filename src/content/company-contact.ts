/**
 * /company/contact content - child page under /company.
 * Source copy: DebtNext_Company_Pages_Copy.docx (page 4 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * [CLAIMS] Contact channels (address, phone, sales@/info@/careers@ emails)
 * are sourced from the live debtnext.com contact, company, and careers pages.
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
        "Bring your portfolio, vendor mix, and the problems you're trying to solve. Request a demo to start, or email the sales team directly at sales@debtnext.com.",
      link: { label: "sales@debtnext.com", href: "mailto:sales@debtnext.com" },
    },
    {
      title: "General inquiries",
      body:
        "For partnerships, media, or general questions, email info@debtnext.com or call 330.665.0400 and we'll route it to the right team.",
      link: { label: "info@debtnext.com", href: "mailto:info@debtnext.com" },
    },
    {
      title: "Careers",
      body:
        "Interested in working at DebtNext? Send your background to careers@debtnext.com and we'll point you to the right opening.",
      link: { label: "careers@debtnext.com", href: "mailto:careers@debtnext.com" },
    },
  ],
};

export const contactLocation = {
  eyebrow: "Where we are",
  heading: "Onshore, in Ohio.",
  paragraphs: [
    "DebtNext, 175 Montrose West Avenue, Suite 170, Copley, Ohio 44321.",
    "Phone: 330.665.0400. The company serves clients across the United States and Canada from the Cleveland and Akron metropolitan area.",
  ],
};

export const contactFinalCta = {
  heading: "Ready when you are.",
  body: "Start with a platform walkthrough, or reach the team directly at sales@debtnext.com.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "We'll point you to the right person.",
};
