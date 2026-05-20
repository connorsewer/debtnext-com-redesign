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
