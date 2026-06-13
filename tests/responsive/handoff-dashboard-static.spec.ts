import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01. Regression guard for the desktop cinematic crossfade:
// when the active tab changes, only the content inside the frame swaps; the
// FramedDashboard bezel does not move (its x/y bounding box is static). Asserts
// against CURRENT main, so it guards the Plan 02/03 Console repoint (the swap
// must remain content-only).
//
// Selector (VERIFIED HomepageHandoffSection.tsx:205): [data-handoff-mockup-frame].
//
// MECHANISM: on desktop the active tab is driven by GSAP scroll progress, not by
// clicking a tab button (VH_PER_TAB = 0.75 in HomepageHandoffSection.tsx:28 — each
// tab spans 0.75 * viewportHeight of scroll). So this spec ADVANCES THE TAB BY
// SCROLLING one VH_PER_TAB worth of pixels rather than clicking, then asserts the
// frame box is unchanged. (The [role="tablist"] buttons exist but desktop tab
// state follows scroll progress, so a click would not deterministically crossfade.)

const VH_PER_TAB = 0.75;

test.describe("Handoff dashboard static across crossfade", () => {
  test("the dashboard frame does not move when the active tab advances", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const section = page.locator("[data-handoff-section]");
    const sectionTop = await section.evaluate(
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );

    // Scroll into the pinned range so the first tab is active and the frame is
    // laid out at the viewport center.
    await page.evaluate((y) => window.scrollTo(0, y), sectionTop + 900);
    await page.waitForTimeout(300);

    const frame = page.locator("[data-handoff-mockup-frame]");
    await expect(frame).toHaveCount(1);
    const before = await frame.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y };
    });

    // Advance the active tab by scrolling one VH_PER_TAB worth of pixels. This
    // drives the GSAP-scrubbed tab change and triggers the content crossfade.
    const perTabPx = 900 * VH_PER_TAB;
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      sectionTop + 900 + perTabPx,
    );
    // Wait past the ~crossfade duration so any transient transform settles.
    await page.waitForTimeout(450);

    const after = await frame.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y };
    });

    // Only the content swaps; the frame box is static.
    expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
  });
});
