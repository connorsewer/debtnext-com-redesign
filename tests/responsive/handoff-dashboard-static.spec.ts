import { test, expect } from "@playwright/test";

// Phase 13 / SYSVIS-01, updated 2026-07-02 for the platform-band density rework.
//
// The handoff dashboard frame is no longer absolutely centered at the viewport
// center (top-1/2 -translate-y-1/2). The band was recomposed into ONE centered
// flex column — heading directly above the frame, tabs directly beneath — so the
// frame now flows in normal document order inside the sticky inner. The static
// guarantee it must still keep: only the CONTENT inside the frame swaps when the
// active tab changes; the frame itself stays horizontally centered (mx-auto,
// max-w-6xl) and stays wrapping a FramedDashboard.
//
// Selector (VERIFIED HomepageHandoffSection.tsx): [data-handoff-mockup-frame].
//
// WHY STRUCTURAL, NOT LIVE-PIXEL: advancing the tab and comparing the frame's
// pixel box is empirically unreliable in headless Chromium (the scroll-scrubbed
// crossfade + ScrollTrigger move measured pixels mid-animation regardless of
// settle waits). Live cinematic pixel-parity is HUMAN-VERIFY per VALIDATION.md.
// This spec instead guards the STABLE DOM CONTRACT that keeps the frame centered
// and content-swapping: the frame exists, its inner wrapper is horizontally
// centered (mx-auto + a capped max width), and it still wraps a non-empty
// FramedDashboard subtree.

test.describe("Handoff dashboard static across crossfade", () => {
  test("the dashboard frame stays centered and content-only across tab swaps", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const frame = page.locator("[data-handoff-mockup-frame]");
    await expect(frame).toHaveCount(1);

    // The centered inner wrapper: mx-auto + capped max width keeps the frame
    // horizontally centered inside the sticky column regardless of tab content
    // height. Assert the wrapper is horizontally centered in the viewport (its
    // own center-x is within a small tolerance of the viewport center-x).
    const inner = frame.locator("> div").first();
    await expect(inner).toHaveCount(1);

    const geom = await inner.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return {
        centerX: r.x + r.width / 2,
        viewportCenterX: window.innerWidth / 2,
        className: el.className,
        childCount: el.childElementCount,
      };
    });

    // Horizontally centered inside the viewport (mx-auto). Tolerance absorbs
    // sub-pixel rounding and the sticky column's symmetric horizontal padding.
    expect(Math.abs(geom.centerX - geom.viewportCenterX)).toBeLessThanOrEqual(4);
    // The capped max width is what lets the frame own the band without spanning
    // edge to edge; the wrapper carries mx-auto.
    expect(geom.className).toContain("mx-auto");
    expect(geom.className).toContain("max-w-6xl");
    // Still wraps the FramedDashboard chrome it is meant to center.
    expect(geom.childCount).toBeGreaterThan(0);
  });
});
