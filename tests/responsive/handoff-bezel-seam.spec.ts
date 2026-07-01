import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01. Regression guard for the desktop cinematic seam: the
// hero's framed dashboard and the handoff's framed dashboard share the same
// horizontal center, so the bezel reads as one continuous element handing off
// from the hero to the Platform section. Asserts against CURRENT main, so it
// guards the Plan 02/03 Console repoint (the frame is supplied by FramedDashboard,
// which the migration must not move).
//
// Selectors (VERIFIED HomepageHero.tsx:178, HomepageHandoffSection.tsx:205):
//   [data-hero-framed-dashboard]  -> hero finale frame (left-1/2 -translate-x-1/2)
//   [data-handoff-mockup-frame]   -> handoff frame      (left-1/2 -translate-x-1/2)
// Both are viewport-centered, so their center-x must coincide.
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
