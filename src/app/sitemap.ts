import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://debtnext.com";

// Per-route static lastModified dates. A meaningful freshness signal beats
// `new Date()` (which would mark every route as changed on every build).
// Baseline 2026-07-04; bump a route's date in the same commit that changes it.
const ROUTE_DATES: Record<string, string> = {
  "/": "2026-07-04",
  "/platform": "2026-07-04",
  "/platform/placement": "2026-07-04",
  "/platform/optimization": "2026-07-04",
  "/platform/issues": "2026-07-04",
  "/platform/reporting": "2026-07-04",
  "/platform/integrations": "2026-07-04",
  "/solutions": "2026-07-04",
  "/solutions/utilities": "2026-07-04",
  "/solutions/financial-services": "2026-07-04",
  "/solutions/telecom": "2026-07-04",
  "/solutions/fintech": "2026-07-04",
  "/solutions/insurance": "2026-07-04",
  "/solutions/healthcare": "2026-07-04",
  "/why-dplat": "2026-07-04",
  "/compare": "2026-07-04",
  "/resources": "2026-07-04",
  "/company": "2026-07-04",
  "/company/about": "2026-07-04",
  "/company/leadership": "2026-07-04",
  "/company/careers": "2026-07-04",
  "/company/contact": "2026-07-04",
  "/demo": "2026-07-04",
  "/resources/glossary": "2026-07-04",
  "/pricing": "2026-07-04",
  "/services": "2026-07-04",
  "/compare/neuanalytics": "2026-07-04",
  "/compare/convoke": "2026-07-04",
  "/compare/imagine-cloud": "2026-07-04",
  "/compare/symend": "2026-07-04",
  "/compare/highradius": "2026-07-04",
};

function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path === "/demo") return 0.9;
  if (path === "/platform" || path === "/solutions") return 0.8;
  // Per-competitor comparison pages sit just below the general routes.
  if (path.startsWith("/compare/")) return 0.6;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(ROUTE_DATES).map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(ROUTE_DATES[path]),
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: priorityFor(path),
  }));
}
