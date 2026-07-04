/**
 * /terms content - footer utility page (short bridge page, not invented
 * legal text).
 *
 * Per FOOTER-PAGES-AND-RESOURCES-PLAN addendum 2026-07-03: TSI legal covers
 * debtnext.com, so Terms proceeds as a bridge to TSI's published corporate
 * terms of use while site-specific wording is finalized with TSI legal.
 *
 * TSI terms of use URL verified 2026-07-03 via tsico.com footer:
 *   https://tsico.com/terms/  ("Terms of Use and Legal Disclosures")
 *
 * These are website terms, not the dPlat software or subscription agreement
 * (that's a separate contract handled in the enterprise sale).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * TSI ownership disclosure per CLAUDE.md §6 (legal pages carry it).
 * [LEGAL] wording review (non-blocking audit-trail flag).
 */

import type { ProseSectionProps } from "@/components/sections/ProseSection";

export const TSI_TERMS_URL = "https://tsico.com/terms/";

export const termsMeta = {
  title: "Terms",
  description:
    "The terms that govern use of debtnext.com, and where to read the Transworld Systems Inc. corporate terms of use.",
  canonical: "https://debtnext.com/terms",
};

export const termsHero = {
  eyebrow: "Terms",
  h1: "Terms of use",
  body:
    "The terms for using this website, and where to read the full text.",
};

export const termsBody: ProseSectionProps = {
  eyebrow: "Overview",
  heading: "Where we stand today",
  paragraphs: [
    "debtnext.com is operated by DebtNext, a Transworld Systems Inc. (TSI) company. Use of this website is governed by the Transworld Systems Inc. terms of use, which cover TSI and its web properties.",
    "These terms apply to the website itself. They're separate from the dPlat platform agreement, which is a distinct contract handled during the enterprise sale.",
    "Terms of use specific to debtnext.com are being finalized with TSI legal, and we'll publish them here when they're ready. In the meantime, the TSI corporate terms apply. For questions, reach us through our contact page.",
  ],
};

export const termsTsiLink = {
  label: "Read the TSI terms of use",
  href: TSI_TERMS_URL,
};

export const termsContactCta = {
  label: "Contact us",
  href: "/company/contact",
};
