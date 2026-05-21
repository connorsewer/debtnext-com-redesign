import { test, expect } from "@playwright/test";

/**
 * HERO-02 regression: the DebtNext wordmark renders with General Sans 600
 * served from the site's own origin (next/font/local), not Fontshare's CDN.
 *
 * Three assertions in one test:
 *   1. No requests to api.fontshare.com or cdn.fontshare.com fire on /
 *   2. A next/font preload <link> for the local woff2 is present in <head>
 *   3. The wordmark's computed font-family chain includes a General Sans entry
 */
test.describe("HERO-02: wordmark self-host", () => {
  test("no Fontshare requests + preload link + computed font-family resolves", async ({ page }) => {
    const fontshareRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (url.includes("fontshare.com")) {
        fontshareRequests.push(url);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Assertion 1: no Fontshare network calls
    expect(
      fontshareRequests,
      `expected zero fontshare.com requests, got: ${JSON.stringify(fontshareRequests)}`
    ).toHaveLength(0);

    // Assertion 2: next/font preload link in <head>
    // next/font emits <link rel="preload" as="font" type="font/woff2"
    // href="/_next/static/media/GeneralSans-Semibold.<hash>.woff2" crossorigin>
    const preloadLink = page.locator(
      'head link[rel="preload"][as="font"][href*="GeneralSans"]'
    );
    await expect(
      preloadLink,
      "expected <head> to contain a next/font preload link for the local General Sans woff2"
    ).toHaveCount(1);

    // Assertion 3: computed font-family on the wordmark span (the
    // span inside the header that contains the .dn-node sibling)
    const wordmarkSpan = page
      .locator("header span")
      .filter({ has: page.locator(".dn-node") })
      .first();
    await expect(
      wordmarkSpan,
      "expected to find the wordmark span in the header"
    ).toBeVisible();

    const fontFamily = await wordmarkSpan.evaluate(
      (el) => getComputedStyle(el).fontFamily
    );
    // next/font hashes the family name; the computed value will contain
    // the hashed alias (e.g. __General_Sans_abc123) PLUS the safety-net
    // literal "General Sans" further down the chain. Accept either.
    expect(
      fontFamily,
      `computed font-family did not resolve to General Sans: ${fontFamily}`
    ).toMatch(/General Sans|__General_Sans/i);
  });
});
