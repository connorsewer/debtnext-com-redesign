import { test, expect } from "@playwright/test";

/**
 * D-04 + D-06 regression net: phones (<768px) never fetch a video file.
 * Even though the SSR HTML still contains the <video> element for a
 * hydration tick, every <source media> query starts with
 * "(min-width: 768px) and ...", so a 412px phone matches zero sources
 * and the browser starts zero downloads.
 *
 * If any future change re-opens a vector for mobile video fetch
 * (new <source> without bounded media, <link rel=preload as=video>,
 * service worker prefetch, etc.), this spec fails.
 */
test.describe("HERO-04: mobile is video-free", () => {
  test("412x823 viewport fires zero video network requests", async ({ page }) => {
    const videoUrlPattern = /\.(mp4|webm|m4v|mov)(\?|$)/i;
    const videoRequests: string[] = [];

    page.on("request", (req) => {
      const url = req.url();
      if (videoUrlPattern.test(url)) {
        videoRequests.push(url);
      }
    });

    // Match LHCI mobile profile exactly: 412x823 (lighthouserc.json
    // screenEmulation block, verified at HEAD).
    await page.setViewportSize({ width: 412, height: 823 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll the page to surface any lazy-loaded video. The hero is
    // GSAP-pinned on desktop but renders a static stack on mobile per
    // M4 Phase 3, so scrolling shouldn't trigger any video fetch. This
    // is belt-and-braces: future regressions where someone adds a
    // mobile-specific scroll-triggered video would also fail here.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    expect(
      videoRequests,
      `expected zero video requests at 412x823 (D-04 mobile-video-free guarantee), got: ${JSON.stringify(videoRequests)}`
    ).toHaveLength(0);
  });
});
