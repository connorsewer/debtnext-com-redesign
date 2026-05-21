import { test, expect } from "@playwright/test";

/**
 * HERO-01 regression: the homepage hero <video> renders exactly 6 <source>
 * children (3 WebM VP9 + 3 MP4 H.264) with the correct codec and media-query
 * ordering. VP9 first so Chrome/Firefox/Edge pick WebM; narrowest viewport
 * first within each codec so first-match-wins lands on the smallest variant.
 *
 * Asserts the exact ordering documented in:
 *   .planning/phases/05-hero-performance/05-RESEARCH.md §"Code Examples" Example 3
 */
test.describe("HERO-01: hero video source ladder", () => {
  test("renders 6 source children in correct codec + media order at desktop", async ({ page }) => {
    // Desktop viewport so the !isMobile branch renders the <video>.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sources = page.locator("section[data-slot=homepage-hero] video source");
    await expect(sources, "expected 6 <source> children (3 WebM + 3 MP4)").toHaveCount(6);

    // The exact 6-entry ladder, in the exact order. WebM-VP9 first, MP4-H.264 second.
    // Within each codec: 360p (max-width: 1023px) → 540p (max-width: 1439px) → 720p (unbounded).
    const expected = [
      { src: "homepage-hero-360p.webm", type: 'video/webm; codecs="vp9"',         media: "(max-width: 1023px)" },
      { src: "homepage-hero-540p.webm", type: 'video/webm; codecs="vp9"',         media: "(max-width: 1439px)" },
      { src: "homepage-hero-720p.webm", type: 'video/webm; codecs="vp9"',         media: null },
      { src: "homepage-hero-360p.mp4",  type: 'video/mp4; codecs="avc1.640028"',  media: "(max-width: 1023px)" },
      { src: "homepage-hero-540p.mp4",  type: 'video/mp4; codecs="avc1.640028"',  media: "(max-width: 1439px)" },
      { src: "homepage-hero-720p.mp4",  type: 'video/mp4; codecs="avc1.640028"',  media: null },
    ];

    for (let i = 0; i < expected.length; i++) {
      const el = sources.nth(i);
      const src = await el.getAttribute("src");
      const type = await el.getAttribute("type");
      const media = await el.getAttribute("media");

      expect(src, `source[${i}].src`).toContain(expected[i].src);
      expect(type, `source[${i}].type`).toBe(expected[i].type);
      if (expected[i].media === null) {
        expect(media, `source[${i}].media (unbounded variant should have no media attribute)`).toBeNull();
      } else {
        expect(media, `source[${i}].media`).toBe(expected[i].media);
      }
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
