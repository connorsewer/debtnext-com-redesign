import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01, updated 2026-07-02 for the finale-screenshot + density
// rework. Regression guard for the desktop cinematic seam: the hero's finale
// (now the real dashboard screenshot) and the handoff's framed dashboard share
// the same horizontal center, so the visual reads as one continuous element
// handing off from the hero to the Platform section.
//
// Selectors:
//   [data-hero-framed-dashboard]  -> hero finale wrapper (inset-0, centers its
//                                    max-w-6xl child)
//   [data-handoff-mockup-frame]   -> handoff frame wrapper (w-full, centers its
//                                    mx-auto max-w-6xl child)
// Both wrappers span the viewport width, so their center-x must coincide.
//
// Desktop cinematic path: reduced-motion is NOT set. Both frames are desktop-only.

test.describe("Handoff bezel seam", () => {
  test("hero and handoff framed dashboards share the same horizontal center", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The hero frame is aria-hidden and opacity-animated, but its layout box is
    // measurable from mount (it is absolutely positioned at the hero center).
    const heroFrame = page.locator("[data-hero-framed-dashboard]");
    await expect(heroFrame).toHaveCount(1);
    const heroBox = await heroFrame.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, width: r.width };
    });
    const heroCenterX = heroBox.x + heroBox.width / 2;

    // Scroll into the pinned handoff range so the handoff frame is laid out at
    // the viewport center.
    const section = page.locator("[data-handoff-section]");
    const sectionTop = await section.evaluate(
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );
    await page.evaluate((y) => window.scrollTo(0, y), sectionTop + 900);
    await page.waitForTimeout(250);

    const handoffFrame = page.locator("[data-handoff-mockup-frame]");
    await expect(handoffFrame).toHaveCount(1);
    const handoffBox = await handoffFrame.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, width: r.width };
    });
    const handoffCenterX = handoffBox.x + handoffBox.width / 2;

    // Both are left-1/2 -translate-x-1/2 centered: centers must coincide.
    expect(Math.abs(heroCenterX - handoffCenterX)).toBeLessThanOrEqual(2);
  });
});
