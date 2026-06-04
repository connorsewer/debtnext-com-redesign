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
    "The operating system for enterprise recovery management. In production since 2003.",
  media: {
    // HERO-01 (re-shaped in Phase 5.1 per D-01): MP4-only ladder.
    // WebM was dropped because VP9 with per-frame keyframes (D-05) cannot
    // hit bitrate targets, producing files 1.85x to 4.46x their MP4
    // counterparts. Every browser plays MP4 cleanly.
    //
    // Phase 5.1 D-04: every <source> is bounded with (min-width: 768px) so
    // phones match zero sources. The browser's source-selection algorithm
    // walks top-to-bottom: iPad-portrait (768-1023px) gets 360p,
    // narrow-laptop (1024-1439px) gets 540p, anything 1440px or wider gets
    // 720p. Phones below 768px match nothing and the browser starts zero
    // downloads, even during the SSR-to-hydration window where the <video>
    // element still exists in the DOM.
    //
    // NOTE: Plan 05.1-01 originally left 720p unbounded with a comment
    // claiming it "applies only above 1440px implicitly because narrower
    // viewports match the bounded sources first." Plan 02 verified at the
    // network layer that an unbounded source DOES match at 412px (the HTML
    // source-selection algorithm picks the first source whose media check
    // passes; no media attribute = passes). Bounding the 720p with
    // (min-width: 1440px) closes the gap.
    //
    // Source asset is 1280x720 (verified via ffprobe; see
    // .planning/phases/05-hero-performance/05-RESEARCH.md Key Finding #1).
    video: [
      { src: "/hero/homepage-hero-360p.mp4", type: 'video/mp4; codecs="avc1.640028"', media: "(min-width: 768px) and (max-width: 1023px)" },
      { src: "/hero/homepage-hero-540p.mp4", type: 'video/mp4; codecs="avc1.640028"', media: "(min-width: 768px) and (max-width: 1439px)" },
      { src: "/hero/homepage-hero-720p.mp4", type: 'video/mp4; codecs="avc1.640028"', media: "(min-width: 1440px)" },
    ] as Array<{ src: string; type: string; media?: string }>,
    // Hero LCP poster. AVIF since Phase 5.2: 2.55 MB PNG → 112 KB AVIF
    // (23x reduction at libsvtav1 CRF 30). Two consumers in HomepageHero.tsx:
    //   1. <Image src={startFrame} preload fetchPriority="high">  Next/Image
    //      transcodes per viewport (poster-avif-negotiation.spec.ts asserts
    //      <200 KB AVIF on Accept: image/avif).
    //   2. <video poster={startFrame}>  raw fetch on SSR; this is the path
    //      that the PNG was blocking on mobile.
    // The static .avif covers both. Regenerate with scripts/encode-hero-poster.sh
    // when the cinematic source MP4 changes.
    startFrame: "/hero/homepage-hero-start.avif",
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
 * The handoff section ("section 2" in Mercury's pattern). The hero's
 * end-frame dashboard finishes its shrink-and-slide animation in roughly
 * the right column position here, so the swap reads as continuous.
 */

export type PlatformTab = {
  id: "placement" | "performance" | "issues" | "reporting";
  label: string;
  body: string;
};

export const heroHandoff = {
  eyebrow: "The platform",
  heading: "Everything you do for recovery. One platform.",
  tabs: [
    {
      id: "placement" as const,
      label: "Placement and routing",
      body:
        "Move accounts to the right vendor at the right time. Treatment tiers, vendor pools, and recall windows execute against your live portfolio.",
    },
    {
      id: "performance" as const,
      label: "Vendor performance",
      body:
        "Compare vendors within or across pools. Liquidation, net-back, and SLA adherence in one view. Performance feeds the optimization engine if you're using it.",
    },
    {
      id: "issues" as const,
      label: "Issues and disputes",
      body:
        "Resolve disputes, complaints, and exceptions in one place. SLA timers and full audit trails come standard.",
    },
    {
      id: "reporting" as const,
      label: "Reporting and compliance",
      body:
        "Pre-built reports for inventory, liquidation, cost, and net-back. Configurable extracts feed your BI environment on the cadence you define.",
    },
  ] satisfies PlatformTab[],
  link: { label: "See how it works", href: "#how-it-works" },
} as const;
