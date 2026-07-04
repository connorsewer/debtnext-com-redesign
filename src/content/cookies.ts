/**
 * /cookies content - footer utility page.
 *
 * Accurate for the launch state (per FOOTER-PAGES-AND-RESOURCES-PLAN addendum
 * 2026-07-03: GA4/GTM launches with the real site):
 *  - GA4 via Google Tag Manager for analytics (loads at launch).
 *  - The demo form posts to Zoho CRM (src/lib/zoho.ts).
 *  - No advertising or retargeting cookies.
 * No consent banner is described here; that's separate scope.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * [LEGAL] wording review (non-blocking audit-trail flag).
 */

import type { ProseSectionProps } from "@/components/sections/ProseSection";

export const cookiesMeta = {
  title: "Cookie policy",
  description:
    "What cookies debtnext.com uses, why, and the choices you have. Analytics through Google Analytics, no advertising trackers.",
  canonical: "https://debtnext.com/cookies",
};

export const cookiesHero = {
  eyebrow: "Cookies",
  h1: "Cookie policy",
  body:
    "This page explains the cookies and similar technologies debtnext.com uses, what each one is for, and the choices you have.",
};

export const cookiesIntro: ProseSectionProps = {
  eyebrow: "The short version",
  heading: "What we use, in plain terms",
  paragraphs: [
    "Cookies are small text files a site stores in your browser. We use a small set: the ones that keep the site working, and Google Analytics to understand which pages people find useful.",
    "We don't run advertising or retargeting cookies, and we don't sell your data. If you fill out the demo form, the details you enter go to our customer relationship system (Zoho) so our team can follow up.",
  ],
};

export type CookieCategory = {
  category: string;
  purpose: string;
  examples: string;
  duration: string;
};

export const cookieTable: {
  caption: string;
  columns: string[];
  rows: CookieCategory[];
} = {
  caption: "Cookie categories used on debtnext.com",
  columns: ["Category", "What it's for", "Examples", "How long it lasts"],
  rows: [
    {
      category: "Strictly necessary",
      purpose:
        "Keeps the site working: page loading, security, and remembering choices you make as you browse. The site can't function without these.",
      examples: "Session and security cookies set by our hosting platform.",
      duration: "Session, or up to a few days.",
    },
    {
      category: "Analytics",
      purpose:
        "Helps us see which pages get used so we can improve them. We use Google Analytics 4, loaded through Google Tag Manager. The data is aggregated and used to measure page performance.",
      examples: "Google Analytics cookies (for example _ga).",
      duration: "Up to 2 years.",
    },
    {
      category: "Advertising",
      purpose:
        "We don't use these. debtnext.com runs no advertising or retargeting cookies.",
      examples: "None.",
      duration: "Not applicable.",
    },
  ],
};

export const cookiesChoices: ProseSectionProps = {
  eyebrow: "Your choices",
  heading: "How to control cookies",
  paragraphs: [
    "You can manage or delete cookies in your browser settings, and set your browser to warn you before a site stores one. Blocking the strictly necessary cookies may stop parts of the site from working.",
    "To opt out of Google Analytics across sites, Google publishes a browser add-on that turns it off. Most browsers also offer a Do Not Track or Global Privacy Control signal, and we watch this space as those standards develop.",
    "For how the demo form data is handled, see our privacy notice. If you have questions about cookies, reach us through our contact page.",
  ],
};

export const cookiesStatus: ProseSectionProps = {
  eyebrow: "Status",
  heading: "Reviewed",
  paragraphs: [
    "This policy was last reviewed in July 2026. We update it when the cookies we use change.",
  ],
};

export const cookiesContactCta = {
  label: "Contact us",
  href: "/company/contact",
};
