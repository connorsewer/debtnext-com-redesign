/**
 * /company/careers content - child page under /company.
 * Source copy: DebtNext_Company_Pages_Copy.docx (page 3 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * Production note: no ATS/jobs URL is confirmed yet, so the page does not ship
 * a dead "View openings" link. Both CTAs route to the Contact page, matching
 * the approved "reach out and we'll point you to current openings" copy. Swap
 * to the real careers destination once confirmed. No fabricated benefits,
 * salary, or perks are claimed.
 */

export const careersMeta = {
  title: "Careers at DebtNext",
  description:
    "Build recovery management software that runs at national scale. DebtNext is an onshore team focused on one product: dPlat.",
  canonical: "https://debtnext.com/company/careers",
};

export const careersHero = {
  eyebrow: "Careers",
  h1: "Build software that runs recovery at national scale.",
  body:
    "DebtNext is a small, onshore team focused on one product. The platform manages more than $1B in transactions a year on behalf of clients, so the work is real and the stakes are concrete. If you want ownership over software that does a hard job well, this is a place to do it.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const careersWork = {
  eyebrow: "What you'd work on",
  heading: "One platform, deep problems.",
  paragraphs: [
    "dPlat is a configurable system of record for the recovery placement lifecycle: decision-engine routing, daily reconciliation across vendor networks, regulatory exception handling, and audit-grade reporting.",
    "The problems are operational and the scale is significant. There's no busywork product to maintain on the side.",
  ],
};

export const careersHow = {
  eyebrow: "How we work",
  heading: "Onshore, focused, accountable.",
  bullets: [
    "Onshore team. All development is performed by badged employees in the United States.",
    "One product. Engineering attention goes to dPlat, not a portfolio of competing roadmaps.",
    "Real ownership. The people who design the platform stay close to how clients use it.",
    "A TSI company, backed by Clearlake Capital.",
  ],
};

export const careersOpenRoles = {
  eyebrow: "Open roles",
  heading: "See what's open.",
  paragraphs: [
    "Roles open across engineering, implementation, and client services as the platform grows. Reach out and we'll point you to current openings.",
  ],
};

export const careersFinalCta = {
  heading: "Find your fit.",
  body: "Tell us where you'd fit and we'll get you to the right opening.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
