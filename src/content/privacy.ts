/**
 * /privacy content - footer utility page (short bridge page, not invented
 * legal text).
 *
 * Per FOOTER-PAGES-AND-RESOURCES-PLAN addendum 2026-07-03: TSI legal covers
 * debtnext.com, so Privacy proceeds as a bridge to TSI's published corporate
 * privacy policy while site-specific wording is finalized with TSI legal.
 *
 * TSI privacy policy URL verified 2026-07-03 via tsico.com footer:
 *   https://tsico.com/privacy-policy/
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * TSI ownership disclosure per CLAUDE.md §6 (legal pages carry it).
 * [LEGAL] wording review (non-blocking audit-trail flag).
 */

import type { ProseSectionProps } from "@/components/sections/ProseSection";

export const TSI_PRIVACY_URL = "https://tsico.com/privacy-policy/";

export const privacyMeta = {
  title: "Privacy",
  description:
    "How debtnext.com handles personal information, and where to read the Transworld Systems Inc. corporate privacy policy that governs this site.",
  canonical: "https://debtnext.com/privacy",
};

export const privacyHero = {
  eyebrow: "Privacy",
  h1: "Privacy",
  body:
    "How this site handles personal information, and where to read the full policy.",
};

export const privacyBody: ProseSectionProps = {
  eyebrow: "Overview",
  heading: "Where we stand today",
  paragraphs: [
    "debtnext.com is operated by DebtNext, a Transworld Systems Inc. (TSI) company. Your privacy is governed by the Transworld Systems Inc. corporate privacy policy, which covers TSI and its web properties.",
    "The main place this site collects personal information is the demo request form. What you enter there goes to our customer relationship system so our team can follow up. We record the request with basic technical details such as your IP address and browser. We don't sell your personal information.",
    "A privacy notice specific to debtnext.com is being finalized with TSI legal, and we'll publish it here when it's ready. In the meantime, the TSI corporate policy applies. For privacy questions, reach us through our contact page.",
  ],
};

export const privacyTsiLink = {
  label: "Read the TSI privacy policy",
  href: TSI_PRIVACY_URL,
};

export const privacyContactCta = {
  label: "Contact us",
  href: "/company/contact",
};
