import { test, expect } from "@playwright/test";

// Hero RSC split (2026-07-08) scroll-probe: drive the live desktop cinematic
// at fixed scroll offsets and assert the two behaviors the split must not
// break — the hero pin and the handoff tab progression. Structural cousins
// (handoff-pin-anchored, handoff-dashboard-static) assert the DOM contract;
// this spec actually scrolls, because the 2026-07-03 audit showed showcase
// visuals regress in ways load-state checks cannot catch.
//
// Wiring contract under test (HeroCinematicController, untouched by the
// split): ONE controller, hero pin created FIRST (after the video's
// loadedmetadata), handoff trigger SECOND, ScrollTrigger.refresh() LAST. The
// observable consequences probed here:
//   - a single .pin-spacer wraps the hero sticky (pin exists),
//   - the hero sticky sits at viewport top through the ~260vh pin range,
//   - data-active-tab on the cinematic handoff section steps placement →
//     performance → issues → reporting at the expected offsets (the handoff
//     trigger snapshotted its start AFTER the pin spacer shifted the
//     document — the exact regression the 2026-07-02 mechanics fix killed),
//   - aria-selected / panel visibility / the portaled mockup follow along.
//
// Timing: GSAP wires only after the hero video's `loadedmetadata`, which in
// headless Chromium depends on the mp4 fetch — hence the generous pin-spacer
// timeout before any probing starts.

// Mirrors heroHandoff.tabs order (src/content/homepage-hero.ts) and
// VH_PER_TAB (0.58). The handoff trigger allocates one VH_PER_TAB slice of
// scroll per tab from the section's top.
const TAB_IDS = ["placement", "performance", "issues", "reporting"] as const;
const VH_PER_TAB = 0.58;

test.describe("Hero RSC scroll probe (desktop cinematic)", () => {
  test("hero pin holds and tabs progress at fixed scroll offsets", async ({
    page,
  }) => {
    test.slow();
    const vh = 900;
    await page.setViewportSize({ width: 1440, height: vh });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // GSAP wired: the hero pin injects exactly one .pin-spacer around the
    // hero sticky. Everything below depends on the post-pin document layout.
    await expect(
      page.locator(".pin-spacer"),
      "hero pin never wired (loadedmetadata may not have fired)"
    ).toHaveCount(1, { timeout: 45_000 });

    // --- Hero pin probe: sticky stays at viewport top through the range ---
    const sticky = page.locator("[data-hero-sticky]");
    for (const offsetVh of [0.5, 1.5, 2.4]) {
      await page.evaluate((y) => window.scrollTo(0, y), offsetVh * vh);
      await expect
        .poll(
          async () => (await sticky.boundingBox())?.y ?? Number.NaN,
          {
            message: `hero sticky not pinned at ${offsetVh}vh`,
            timeout: 10_000,
          }
        )
        .toBeLessThanOrEqual(2);
    }

    // --- Tab progression probe ---
    const section = page.locator('[data-handoff-section="cinematic"]');
    const sectionTop = await section.evaluate(
      (el) => el.getBoundingClientRect().top + window.scrollY
    );

    for (let idx = 0; idx < TAB_IDS.length; idx++) {
      const id = TAB_IDS[idx];
      // Aim mid-slice so the probe is robust to sub-pixel start rounding.
      const y = Math.round(sectionTop + (idx + 0.5) * VH_PER_TAB * vh);
      await page.evaluate((top) => window.scrollTo(0, top), y);

      await expect
        .poll(async () => section.getAttribute("data-active-tab"), {
          message: `expected data-active-tab="${id}" at tab slice ${idx}`,
          timeout: 10_000,
        })
        .toBe(id);

      // aria state + panel visibility follow the attribute writes.
      await expect(page.locator(`#platform-tab-${id}`)).toHaveAttribute(
        "aria-selected",
        "true"
      );
      await expect(page.locator(`#platform-panel-${id}`)).not.toHaveAttribute(
        "hidden",
        ""
      );

      // The portaled mockup swaps with the tab: the slot holds a
      // FramedDashboard subtree (non-empty) for every active tab. Polled —
      // the keyed re-mount replaces the subtree asynchronously.
      await expect
        .poll(
          async () =>
            page
              .locator("[data-handoff-mockup-slot]")
              .evaluate((el) => el.childElementCount),
          { message: `mockup slot empty on tab "${id}"`, timeout: 10_000 }
        )
        .toBeGreaterThan(0);
    }
  });
});
