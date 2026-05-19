/**
 * Homepage cinematic hero copy — Mercury-faithful pattern.
 * Source: content/pages/homepage.md (Hero section) compressed to fit
 * the scroll-scrub composition. Headline + short subhead + attached form,
 * over a dolly-zoom video.
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 */

export const heroCinematic = {
  headline: "Recovery operations, unified.",
  subhead:
    "Place accounts, manage agencies, track outcomes, and prove compliance from a single platform.",
  attachedForm: {
    label: "Work email",
    placeholder: "Work email",
    buttonLabel: "Request a demo",
  },
  // Bottom-pinned disclaimer pill — quiet trust signal that scrolls away
  // with the hero. Per CLAUDE.md §6, no TSI ownership disclosure here;
  // that lives in the footer only.
  disclaimer:
    "Recovery management software for credit originators. In production since 2003.",
  media: {
    video: "/hero/homepage-hero.mp4",
    // Extracted from the mp4 (first frame); used as the LCP target and
    // as the video element's poster while it loads.
    startFrame: "/hero/homepage-hero-start.png",
    // Extracted from the mp4 (last frame); fades in alongside the video
    // fade-out during the 90-100% handoff window.
    endFrame: "/hero/homepage-hero-end.png",
  },
} as const;

/**
 * The DOM accounts panel that fades in at the end of the scrub and
 * carries continuity into the handoff section. Vendor pools with
 * liquidation rates is the dPlat analog to Mercury's account list.
 *
 * [CLAIMS REVIEW] The specific liquidation rates and dollar amounts
 * here are illustrative placeholder values. Andrew Budish to clear
 * before any external use; values must read as plausible recovery
 * portfolio snapshots without misrepresenting platform performance.
 */
export const heroAccountsPanel = {
  workspaceLabel: "Recovery operations",
  workspaceSubLabel: "Portfolio · YTD",
  rows: [
    {
      label: "Pre-collect · Pool A",
      detail: "$4.2M placed",
      metric: "18.2% liquidation",
    },
    {
      label: "Primary · Pool B",
      detail: "$12.8M placed",
      metric: "14.7% liquidation",
    },
    {
      label: "Secondary · Pool C",
      detail: "$6.1M placed",
      metric: "9.3% liquidation",
    },
    {
      label: "Tertiary · Pool D",
      detail: "$3.1M placed",
      metric: "6.1% liquidation",
    },
    {
      label: "Specialty · Legal",
      detail: "$1.6M placed",
      metric: "9.4% liquidation",
    },
    {
      label: "Recall queue",
      detail: "84 accounts",
      metric: "Awaiting reassignment",
    },
  ],
  cta: { label: "Add vendor pool", href: "/demo" },
} as const;

/**
 * The handoff section ("section 2" in Mercury's pattern). The accounts
 * panel from the end of the scrub lands as the right column here.
 */
export const heroHandoff = {
  eyebrow: "The platform",
  heading: "Everything you do for recovery. One platform.",
  tabs: [
    { label: "Placement and routing", active: true },
    { label: "Vendor performance", active: false },
    { label: "Issues and disputes", active: false },
    { label: "Reporting and compliance", active: false },
  ],
  link: { label: "See how it works", href: "#how-it-works" },
} as const;
