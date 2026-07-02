import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://debtnext.com";

const STATIC_ROUTES = [
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
  "/resources",
  "/company",
  "/company/about",
  "/company/leadership",
  "/company/careers",
  "/company/contact",
  "/demo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : path === "/demo" ? 0.9 : 0.7,
  }));
}
