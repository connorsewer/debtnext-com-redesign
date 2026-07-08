import { test, expect } from "@playwright/test";

/**
 * Hero asset PR (2026-07-08) regression net: reduced-motion sessions never
 * fetch a hero video file — or the hero finale screenshot — at any viewport
 * width.
 *
 * Before this PR the <video>'s preload="auto" downloaded the full matching
 * ladder tier on reduced-motion sessions — measured on deployed main
 * (3834e74): 2.0 MB (360p, iPad-portrait), 4.8 MB (540p, laptop), 9.8 MB
 * (720p, desktop) — even though the element is motion-reduce:hidden and
 * HeroCinematicMount never loads the controller there. Every <source media>
 * is now additionally bounded with (prefers-reduced-motion: no-preference),
 * extending the D-04 phone zero-download guarantee (see
 * hero-mobile-video-free.spec.ts) to reduced motion. The dashboard-finale
 * layer got `motion-reduce:hidden` for the same reason: under reduced motion
 * the controller never mounts to fade it in, so its lazy next/image fetch
 * was a permanently-invisible download (display:none defers loading=lazy).
 *
 * Motion-safe sessions at ≥768px are intentionally NOT covered here: the
 * pre-scroll preload="auto" fetch is what makes the scroll-scrub smooth.
 */
test.describe("hero asset PR: reduced motion is video-free", () => {
  // `reducedMotion` is a context option, not a top-level Fixtures property
  // (same note as reduced-motion.spec.ts); emulateMedia BEFORE page.goto is
  // what makes the <source media> queries evaluate as reduced during the
  // HTML parse, which is when the browser runs source selection.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const viewport of [
    // One viewport per ladder tier: 360p, 540p, 720p.
    { name: "iPad-portrait (360p tier)", width: 820, height: 1180 },
    { name: "laptop (540p tier)", width: 1280, height: 800 },
    { name: "desktop (720p tier)", width: 1600, height: 900 },
  ]) {
    test(`${viewport.name} fires zero video network requests under prefers-reduced-motion`, async ({
      page,
    }) => {
      const videoUrlPattern = /\.(mp4|webm|m4v|mov)(\?|$)/i;
      // The finale ships through /_next/image?url=%2Fhero%2Fdashboard-finale.png,
      // so match the (URL-encoded) asset name, not the extension.
      const finalePattern = /dashboard-finale/i;
      const videoRequests: string[] = [];
      const finaleRequests: string[] = [];

      page.on("request", (req) => {
        const url = req.url();
        if (videoUrlPattern.test(url)) {
          videoRequests.push(url);
        }
        if (finalePattern.test(url)) {
          finaleRequests.push(url);
        }
      });

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // preload="auto" media fetches can lag networkidle; give the browser a
      // beat, then scroll (the static tree has no scroll-triggered media, so
      // this is belt-and-braces like the mobile spec).
      await page.waitForTimeout(1000);
      await page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight)
      );
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      expect(
        videoRequests,
        `expected zero video requests at ${viewport.width}x${viewport.height} under prefers-reduced-motion, got: ${JSON.stringify(videoRequests)}`
      ).toHaveLength(0);

      expect(
        finaleRequests,
        `expected zero dashboard-finale image requests at ${viewport.width}x${viewport.height} under prefers-reduced-motion (motion-reduce:hidden defers the lazy next/image), got: ${JSON.stringify(finaleRequests)}`
      ).toHaveLength(0);
    });
  }
});
