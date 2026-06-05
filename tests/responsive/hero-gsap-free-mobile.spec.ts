import { test, expect } from "@playwright/test";

/**
 * HERO-04 regression net: phones (<768px) never fetch GSAP.
 *
 * GSAP, gsap/ScrollTrigger, and @gsap/react are loaded ONLY via dynamic
 * import() inside HeroCinematicController, which the homepage sections mount
 * via next/dynamic({ ssr: false }) behind the `!isMobile && !prefersReducedMotion`
 * gate. On a 412x823 phone the gate is false, so the controller chunk (and the
 * GSAP chunks it imports) is never requested.
 *
 * This keeps GSAP out of the `/` eager client chunk on mobile, which is the
 * LHCI Case C lever (docs/m5-phase-5-lhci-run.md). If any future change pulls
 * GSAP back into the mobile path (a top-level import, an un-gated controller
 * mount, a preload, etc.), this spec fails.
 *
 * Modeled on tests/responsive/hero-mobile-video-free.spec.ts (same 412x823
 * network-watcher + scroll-to-surface-lazy-fetch pattern).
 */
test.describe("HERO-04: mobile never fetches GSAP", () => {
  test("412x823 viewport fires zero /gsap/ network requests", async ({
    page,
  }) => {
    const gsapUrlPattern = /gsap/i;
    const gsapRequests: string[] = [];

    page.on("request", (req) => {
      const url = req.url();
      if (gsapUrlPattern.test(url)) {
        gsapRequests.push(url);
      }
    });

    // Match the LHCI mobile profile exactly: 412x823 (lighthouserc.json
    // screenEmulation block).
    await page.setViewportSize({ width: 412, height: 823 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll the full page and back to surface any scroll-triggered GSAP fetch.
    // The hero/handoff are GSAP-pinned on desktop but render static stacks on
    // mobile, so scrolling must not trigger any GSAP chunk download.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    expect(
      gsapRequests,
      `expected zero /gsap/ requests at 412x823 (HERO-04 mobile-GSAP-free guarantee), got: ${JSON.stringify(gsapRequests)}`
    ).toHaveLength(0);
  });
});
