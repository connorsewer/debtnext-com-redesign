import { test, expect } from "@playwright/test";

import { VISUAL_ROUTES } from "../helpers/routes";

/**
 * SEO-06: every route asserts exactly one canonical link that points at
 * the PRODUCTION origin (D1), regardless of the base URL the suite runs
 * against. The canonical is content-owned (each route's `*Meta.canonical`
 * hardcodes https://debtnext.com...) and wired to
 * `metadata.alternates.canonical`, so a Vercel preview URL must still
 * emit the production canonical. Expected value is derived from a single
 * origin constant + the route path.
 */

const EXPECTED_CANONICAL_ORIGIN = "https://debtnext.com";

function expectedCanonical(route: string): string {
  // Next normalizes the homepage canonical to the bare origin (no trailing
  // slash); every other route is the origin + path with no trailing slash.
  if (route === "/") {
    return EXPECTED_CANONICAL_ORIGIN;
  }
  return `${EXPECTED_CANONICAL_ORIGIN}${route}`;
}

test.describe("SEO-06: canonical URLs", () => {
  for (const route of VISUAL_ROUTES) {
    test(`${route} emits exactly one production canonical`, async ({ page }) => {
      await page.goto(route);

      const canonicals = page.locator('link[rel="canonical"]');
      await expect(canonicals).toHaveCount(1);

      const href = await canonicals.getAttribute("href");
      expect(href).toBe(expectedCanonical(route));
    });
  }
});
