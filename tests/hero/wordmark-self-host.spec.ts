import { test, expect } from "@playwright/test";

/**
 * HERO-02 regression: the DebtNext wordmark in nav chrome renders with
 * General Sans 600 served from the site's own origin (next/font/local
 * preload link in <head>), not Fontshare's CDN. No request to
 * cdn.fontshare.com or api.fontshare.com should fire on `/`.
 *
 * Filled by 05-03-PLAN.md (HERO-02 self-host). Stubbed for now to keep
 * the spec file discoverable without failing the suite.
 */
test.describe("HERO-02: wordmark self-host", () => {
  test.skip("no Fontshare network requests + computed font-family resolves to General Sans", async ({ page }) => {
    // TODO (Plan 03): wire the network-log assertion and computed-style check.
    //
    // Implementation hint:
    //   const fontshareRequests: string[] = [];
    //   page.on("request", (req) => {
    //     const url = req.url();
    //     if (url.includes("fontshare.com")) fontshareRequests.push(url);
    //   });
    //   await page.goto("/");
    //   await page.waitForLoadState("networkidle");
    //   expect(fontshareRequests, JSON.stringify(fontshareRequests)).toHaveLength(0);
    //
    //   const wordmark = page.locator("header [class*='dn-node']").locator("..");
    //   const fontFamily = await wordmark.evaluate((el) => getComputedStyle(el).fontFamily);
    //   expect(fontFamily).toMatch(/General Sans/i);
    //
    //   // And confirm the preload link for the local woff2 is in <head>:
    //   const preload = await page.locator("head link[rel=preload][as=font][href*='general-sans']").count();
    //   expect(preload).toBeGreaterThan(0);
    expect(true).toBe(true);
  });
});
