/**
 * Canonical platform scale + activity numbers. Single source of truth so the
 * figures stay reconciled wherever they appear (homepage, why-dplat, compare,
 * integrations, company pages).
 *
 * Source: DebtNext platform-activity sheet (Andy Hannan, 2026-06-04 alpha
 * review). The media-document volume is intentionally omitted; the team is
 * staying out of the media space.
 *
 * [CLAIMS REVIEW] Andrew Budish to confirm the figures before launch.
 */

export interface Stat {
  number: string;
  label: string;
}

/** Headline scale trio. Replaces the retired 60M / $1.5B figures. */
export const scaleHeadline: Stat[] = [
  { number: "116.8M", label: "Accounts managed" },
  { number: "10B+", label: "Transactions processed" },
  { number: "538", label: "Agency and legal partners" },
];

/** Annual platform activity. Drives the homepage marquee. */
export const annualActivity: Stat[] = [
  { number: "250,000+", label: "Consumer disputes managed" },
  { number: "300,000+", label: "Active promise plans managed" },
  { number: "80M+", label: "Agency interactions processed" },
  { number: "2M+", label: "Legal and collection documents delivered" },
  { number: "18M+", label: "Payment transactions processed" },
  { number: "$1.9B+", label: "Transactional dollars managed" },
];
