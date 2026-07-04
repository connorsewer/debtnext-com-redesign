import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://debtnext.com";

// AI crawlers we explicitly welcome, in addition to the wildcard allow.
// Explicit allow entries make the intent unambiguous to operators that check
// for their named agent (GEO/AI-search citability).
const AI_USER_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/dev/"];
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the API surface out of indexes
        disallow,
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
