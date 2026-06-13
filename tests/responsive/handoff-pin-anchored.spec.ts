import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01 SC2 (pin-anchored half). Regression guard for the desktop
// GSAP cinematic: the handoff's sticky inner stays pinned at the viewport top
// through the 400vh scroll range. Asserts against CURRENT main (placement still
// bespoke), so it guards the Plan 02/03 Console repoint, not a migration state.
//
// Selector chain (VERIFIED HomepageHandoffSection.tsx:170, 188):
//   [data-handoff-section]                -> the 400vh outer
//     > div.sticky (sticky top-0 h-screen) -> the pinned inner (asserted here)
//
// Desktop cinematic path: reduced-motion is NOT set.

test.describe("Handoff desktop pin anchored", () => {
  test("sticky inner stays anchored at viewport top through the scroll range", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const section = page.locator("[data-handoff-section]");

    // The section starts at opacity:0 (HomepageHandoffSection.tsx:175) and GSAP
    // fades it in AND rewrites the cinematic scroll geometry (ScrollTrigger pin
    // spacers) AFTER networkidle. Measuring the sticky y before that settles
    // reads a transient layout (received varied 948 / 1466 across runs). Wait
    // until GSAP has made the section visible before taking any geometry.
    await page
      .locator("[data-handoff-section]")
      .evaluate((el) =>
        new Promise<void>((resolve) => {
          const settled = () =>
            parseFloat(getComputedStyle(el).opacity || "0") > 0.99;
          if (settled()) return resolve();
          const t = setInterval(() => {
            if (settled()) {
              clearInterval(t);
              resolve();
            }
          }, 50);
        }),
      );
    // Let ScrollTrigger finish its initial refresh after the fade-in.
    await page.waitForTimeout(250);

    const sectionHeight = await section.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    // The 400vh outer (matches platform-mobile.spec.ts:37).
    expect(sectionHeight).toBeGreaterThan(2400);

    // The pinned inner is the `sticky top-0 h-screen` div directly inside the
    // section. Selecting by the sticky utility class keeps the guard resilient
    // to content changes inside the frame.
    const stickyInner = page
      .locator("[data-handoff-section] > div.sticky")
      .first();
    await expect(stickyInner).toHaveCount(1);

    // Scroll roughly to the middle of the handoff scroll range.
    const sectionTop = await section.evaluate(
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      sectionTop + 900 * 2, // section offsetTop + viewportHeight * 2
    );
    await page.waitForTimeout(250);

    const midY = await stickyInner.evaluate(
      (el) => el.getBoundingClientRect().y,
    );
    // Pinned to the viewport top: y is at (or within a hair of) 0.
    expect(Math.abs(midY)).toBeLessThanOrEqual(2);

    // Scroll further into the range; it must STILL be pinned, not scrolled away.
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      sectionTop + 900 * 3,
    );
    await page.waitForTimeout(250);

    const laterY = await stickyInner.evaluate(
      (el) => el.getBoundingClientRect().y,
    );
    expect(Math.abs(laterY)).toBeLessThanOrEqual(2);
  });
});
