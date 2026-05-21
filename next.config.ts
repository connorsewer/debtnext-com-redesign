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
};

export default nextConfig;
