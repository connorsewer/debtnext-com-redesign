import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // HERO-03: Next.js Image content-negotiates AVIF then WebP via the request
  // Accept header. Sharp (bundled with next@16.2.6) encodes AVIF on demand.
  // Order matters: first match in the array wins. AVIF first, WebP second.
  // See .planning/phases/05-hero-performance/05-RESEARCH.md Pattern 2.
  images: {
    formats: ["image/avif", "image/webp"],
    // 31 days. Hero asset is stable; the optimizer runs at most monthly
    // per request. See Pitfall 4 in 05-RESEARCH.md.
    minimumCacheTTL: 2678400,
  },
  // Legacy WordPress site (debtnext.com on Flywheel) -> rebuilt site.
  // Source of truth: .planning/LEGACY-SITE-MAPPING-2026-07-04.md §6.
  // Every legacy URL gets a permanent (301) target. No redirect below may
  // shadow a real new-site route (verified against src/app/**/page.tsx).
  // Deviations from the mapping doc, cleared for this PR:
  //   - /implementation-2-2-2/ and /professional-services-2/ target /services
  //     (the doc's interim /platform is superseded now that /services ships).
  //   - /privacy-policy/ targets /privacy (shipped in PR #35).
  async redirects() {
    return [
      // --- Legacy pages (page-sitemap) ---
      { source: "/contact", destination: "/company/contact", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
      { source: "/blog/:slug*", destination: "/resources", permanent: true },
      { source: "/implementation-2-2-2", destination: "/services", permanent: true },
      { source: "/professional-services-2", destination: "/services", permanent: true },
      { source: "/success", destination: "/resources", permanent: true },
      { source: "/resources-3", destination: "/resources", permanent: true },
      { source: "/boost", destination: "/resources", permanent: true },
      { source: "/debtnext-boost", destination: "/resources", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/company-2-2", destination: "/company/about", permanent: true },
      { source: "/faq", destination: "/resources", permanent: true },
      { source: "/careers-2", destination: "/company/careers", permanent: true },

      // --- Category archives (category-sitemap, 11) ---
      { source: "/category/careers", destination: "/company/careers", permanent: true },
      { source: "/category/debtnext-boost", destination: "/resources", permanent: true },
      { source: "/category/distinction-spotlight", destination: "/company/about", permanent: true },
      { source: "/category/enhanced-onboarding-program", destination: "/company/careers", permanent: true },
      { source: "/category/events", destination: "/resources", permanent: true },
      { source: "/category/news/implementation", destination: "/resources", permanent: true },
      { source: "/category/news", destination: "/resources", permanent: true },
      { source: "/category/partner-accreditation", destination: "/platform/integrations", permanent: true },
      { source: "/category/partnerships", destination: "/platform/integrations", permanent: true },
      { source: "/category/team-outing", destination: "/company/about", permanent: true },
      { source: "/category/workshop", destination: "/resources", permanent: true },
      // Any remaining /category/* archive -> resources hub (safety net).
      { source: "/category/:slug*", destination: "/resources", permanent: true },

      // --- Notable blog posts (post-sitemap). Root-level WP slugs; enumerated
      //     because a root /:slug wildcard would shadow real routes. All other
      //     posts reach /resources via their category archive redirects above. ---
      { source: "/debtnext-software-receives-soc-2-type-ii-attestation", destination: "/resources", permanent: true },
      { source: "/debtnext-software-receives-soc-2-type-ii-attestation-2", destination: "/resources", permanent: true },
      { source: "/debtnext-software-achieves-soc-2-type-ii-certification", destination: "/resources", permanent: true },
      { source: "/dplat-software-release-1-0019-boost-session", destination: "/resources", permanent: true },

      // --- Author archives -> home ---
      { source: "/author/:slug*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
