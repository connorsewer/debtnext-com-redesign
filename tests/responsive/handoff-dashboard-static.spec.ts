import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01. Regression guard for the desktop cinematic crossfade:
// when the active tab changes, only the content inside the frame swaps; the
// FramedDashboard stays VISUALLY CENTERED in the viewport. Asserts against
// CURRENT main, so it guards the Plan 02/03 Console repoint (the swap must
// remain content-only).
//
// Selector (VERIFIED HomepageHandoffSection.tsx:204-206): [data-handoff-mockup-frame],
// which is `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` — i.e.
// CENTER-anchored at the viewport center, not top-anchored. Different tabs have
// different content heights, so the frame's TOP edge legitimately shifts when a
// taller/shorter tab becomes active (this was equally true with the pre-migration
// bespoke mockups). The D-07 intent is "the dashboard stays put / centered during
// the crossfade", NOT "every tab is the same height". So we assert the frame's
// CENTER (rect.x + w/2, rect.y + h/2) is stable across the tab advance, which is
// exactly what `left-1/2 top-1/2 -translate-*-1/2` guarantees regardless of the
// active tab's content height. (The old assertion on rect.y — the top edge —
// false-failed with ~488px of legitimate center-anchored height delta.)
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
      // Center point — invariant under the frame's -translate-*-1/2 anchoring,
      // regardless of the active tab's content height.
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
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
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });

    // Only the content swaps; the frame stays centered. The center point must
    // not drift on either axis when the active tab advances. (Sub-pixel rounding
    // from the 50% translate can produce <1px deltas, so allow a 1px tolerance.)
    expect(Math.abs(after.cx - before.cx)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.cy - before.cy)).toBeLessThanOrEqual(1);
  });
});
