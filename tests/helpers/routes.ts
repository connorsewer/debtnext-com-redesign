export const ROUTES = [
  "/",
  "/platform",
  "/platform/placement",
  "/platform/optimization",
  "/platform/issues",
  "/platform/reporting",
  "/solutions",
  "/why-dplat",
  "/company",
  "/resources",
  "/demo",
] as const;

// Routes that carry product visuals / archetypes (Phases 11-15 add the most here).
// The reveal-fail-open + reduced-motion + mobile-GSAP-free specs iterate this so the
// foundation's nets cover the pages later phases touch. See 10-RESEARCH.md §4 ROUTES drift.
export const VISUAL_ROUTES = [
  "/",
  "/platform",
  "/platform/placement",
  "/platform/optimization",
  "/platform/issues",
  "/platform/reporting",
  "/platform/integrations",
  "/solutions",
  "/solutions/utilities",
  "/solutions/financial-services",
  "/solutions/telecom",
  "/solutions/fintech",
  "/solutions/insurance",
  "/solutions/healthcare",
  "/why-dplat",
  "/compare",
  "/company",
  "/company/about",
  "/company/leadership",
  "/company/careers",
  "/company/contact",
  "/resources",
  "/demo",
] as const;

export const BREAKPOINTS = [
  { name: "iPhone SE", width: 320, height: 568 },
  { name: "iPhone 12 mini", width: 375, height: 812 },
  { name: "iPhone 14 Plus", width: 414, height: 896 },
  { name: "iPad portrait", width: 768, height: 1024 },
  { name: "iPad landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone landscape", width: 812, height: 375 },
  { name: "tablet landscape", width: 1180, height: 820 },
] as const;
