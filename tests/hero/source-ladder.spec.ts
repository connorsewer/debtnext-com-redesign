import { test, expect } from "@playwright/test";

/**
 * HERO-01 (re-shaped in Phase 5.1 per D-01): the homepage hero <video>
 * renders exactly 3 <source> children, all MP4, with bounded media
 * queries that exclude viewports under 768px. WebM was dropped because
 * the VP9 ladder was structurally bloated.
 *
 * Phase 5.1 D-04: phones (412x823) match zero sources via the
 * (min-width: 768px) prefix on the 360p and 540p entries.
 *
 * Asserts the exact ordering documented in:
 *   .planning/phases/05.1-hero-04-gap-closure-webm-encoder-re-tune-and-mobile-video-ga/05.1-RESEARCH.md §B
 */
test.describe("HERO-01: hero video source ladder", () => {
  test("renders 3 source children in correct MP4 order at desktop", async ({ page }) => {
    // Desktop viewport so the !isMobile branch renders the <video>.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sources = page.locator("section[data-slot=homepage-hero] video source");
    await expect(sources, "expected 3 <source> children (all MP4, bounded media queries)").toHaveCount(3);

    // The exact 3-entry MP4-only ladder, in the exact order. Browser walks
    // top-to-bottom: 360p (768-1023px), 540p (768-1439px), 720p (≥1440px).
    // Every source is bounded so phones (<768px) match nothing; verified at
    // the network layer by tests/responsive/hero-mobile-video-free.spec.ts.
    const expected = [
      { src: "homepage-hero-360p.mp4", type: 'video/mp4; codecs="avc1.640028"', media: "(min-width: 768px) and (max-width: 1023px)" },
      { src: "homepage-hero-540p.mp4", type: 'video/mp4; codecs="avc1.640028"', media: "(min-width: 768px) and (max-width: 1439px)" },
      { src: "homepage-hero-720p.mp4", type: 'video/mp4; codecs="avc1.640028"', media: "(min-width: 1440px)" },
    ];

    for (let i = 0; i < expected.length; i++) {
      const el = sources.nth(i);
      const src = await el.getAttribute("src");
      const type = await el.getAttribute("type");
      const media = await el.getAttribute("media");

      expect(src, `source[${i}].src`).toContain(expected[i].src);
      expect(type, `source[${i}].type`).toBe(expected[i].type);
      expect(media, `source[${i}].media`).toBe(expected[i].media);
    }
  });

  test("mobile viewport (≤767px) renders no <video> element (D-04 mobile-video-free)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const video = page.locator("section[data-slot=homepage-hero] video");
    await expect(video, "mobile should not render the <video> element per D-04").toHaveCount(0);
  });
});
