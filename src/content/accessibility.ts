/**
 * /accessibility content - footer utility page.
 *
 * Written substantively from repo facts:
 *  - Conformance target: WCAG 2.2 AA (CLAUDE.md §11). We say "designed and
 *    tested against", never "certified" or "fully conformant" (no third-party
 *    audit exists).
 *  - Automated axe-core testing across routes and viewports in CI
 *    (tests/a11y/axe-routes.spec.ts: wcag2a + wcag2aa + wcag22aa tags,
 *    mobile 375px + desktop 1440px, fails on critical/serious violations).
 *  - Keyboard navigability, visible focus indicators (#9CB4E8, 2px outline,
 *    2px offset), reduced-motion support, 44px minimum touch targets (CLAUDE.md §11).
 *  - Feedback channel routes to the existing /company/contact page rather than
 *    an invented email address.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 * [CLAIMS REVIEW] conformance language: "designed and tested against" is
 * deliberate (audit-trail flag, non-blocking per Andrew's sign-off).
 */

import type { ProseSectionProps } from "@/components/sections/ProseSection";

export const accessibilityMeta = {
  title: "Accessibility",
  description:
    "How we design and test debtnext.com against WCAG 2.2 AA, and how to report an accessibility barrier.",
  canonical: "https://debtnext.com/accessibility",
};

export const accessibilityHero = {
  eyebrow: "Accessibility",
  h1: "Accessibility statement",
  body:
    "We want everyone to be able to use debtnext.com. This page describes the standard we build to, how we test, and how to tell us when something doesn't work for you.",
};

export const accessibilitySections: ProseSectionProps[] = [
  {
    eyebrow: "Our commitment",
    heading: "The standard we build to",
    paragraphs: [
      "We design and test this site against the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. That's the benchmark most regulators and enterprise procurement teams reference.",
      "We describe the site as designed and tested against WCAG 2.2 AA. We don't claim certification or full conformance, because no third party has audited the site. Accessibility is ongoing work, and some issues can still slip through.",
    ],
  },
  {
    eyebrow: "How we test",
    heading: "Automated checks on every change",
    paragraphs: [
      "Every code change runs automated accessibility checks in our build pipeline. We use axe-core to scan the site's pages at both mobile and desktop widths, and a build fails if it introduces a critical or serious violation against the WCAG 2.0 A, 2.0 AA, and 2.2 AA rule sets.",
      "Automated tools catch a meaningful share of common issues, though not all of them. We pair the automated checks with manual review of keyboard navigation, focus behavior, and screen-reader labeling.",
    ],
  },
  {
    eyebrow: "What we've built in",
    heading: "Design choices that support access",
    paragraphs: [
      "The site is navigable by keyboard from start to finish, and interactive elements show a visible focus outline so you always know where you are.",
      "Buttons and links use a minimum 44px touch target. Text and interface colors are chosen to meet WCAG AA contrast. Every form field has a label your assistive technology can read.",
      "If your device or browser is set to reduce motion, we honor that setting and turn off non-essential animation.",
    ],
  },
  {
    eyebrow: "Tell us",
    heading: "Report a barrier",
    paragraphs: [
      "If you run into a part of this site you can't use, we want to hear about it. Reach us through our contact page and describe what happened, the page you were on, and the browser or assistive technology you were using. We'll work to fix it.",
    ],
  },
  {
    eyebrow: "Status",
    heading: "Reviewed",
    paragraphs: [
      "This statement was last reviewed in July 2026. We update it as the site and our testing change.",
    ],
  },
];

export const accessibilityContactCta = {
  label: "Contact us",
  href: "/company/contact",
};
