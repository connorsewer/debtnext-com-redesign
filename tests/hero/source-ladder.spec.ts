import { test, expect } from "@playwright/test";

/**
 * HERO-01 regression: the homepage hero <video> renders exactly 6 <source>
 * children (3 WebM VP9 + 3 MP4 H.264) with the correct codec and media-query
 * ordering. VP9 first so Chrome/Firefox/Edge pick WebM; narrowest viewport
 * first within each codec so first-match-wins lands on the smallest variant.
 *
 * Filled by 05-02-PLAN.md (HERO-01 wiring). Until then, this stub keeps
 * the spec file discoverable by `npx playwright test tests/hero/` without
 * failing the suite.
 */
test.describe("HERO-01: hero video source ladder", () => {
  test.skip("renders 6 source children in correct codec + media order", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // TODO (Plan 02): assert the <video> element on the hero has 6 <source>
    // children with this exact order and attribute set:
    //   1. /hero/homepage-hero-360p.webm  | video/webm; codecs="vp9" | (max-width: 1023px)
    //   2. /hero/homepage-hero-540p.webm  | video/webm; codecs="vp9" | (max-width: 1439px)
    //   3. /hero/homepage-hero-720p.webm  | video/webm; codecs="vp9" | (no media)
    //   4. /hero/homepage-hero-360p.mp4   | video/mp4;  codecs="avc1.640028" | (max-width: 1023px)
    //   5. /hero/homepage-hero-540p.mp4   | video/mp4;  codecs="avc1.640028" | (max-width: 1439px)
    //   6. /hero/homepage-hero-720p.mp4   | video/mp4;  codecs="avc1.640028" | (no media)
    //
    // Implementation hint:
    //   const sources = await page.locator("section[data-slot=homepage-hero] video source").all();
    //   expect(sources).toHaveLength(6);
    //   expect(await sources[0].getAttribute("type")).toMatch(/webm.*vp9/);
    //   expect(await sources[0].getAttribute("src")).toContain("homepage-hero-360p.webm");
    //   ... etc per the order above.
    expect(true).toBe(true);
  });
});
