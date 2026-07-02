import { test, expect } from "@playwright/test";

// Phase 15 / HOMEVIS-01. Regression guard for the hero-finale capstone swap: the
// held framed-dashboard finale renders the live Console archetype, NOT the retired
// /product/dashboard-dark.png raster. Asserts against CURRENT main so a refactor
// that reintroduces an <img> raster inside the finale (or drops the Console) fails
// here.
//
// Selectors:
//   [data-hero-framed-dashboard]  -> hero finale frame wrapper (HomepageHero.tsx)
//   [role="img"]                  -> the Console bare root (Console.tsx renders
//                                    role="img" + aria-label={data.ariaSummary} in
//                                    bare mode). Stable content marker for "a
//                                    Console is inside the finale".
//
// Desktop cinematic path: the finale wrapper is desktop-only (!isMobile gate), so
// use a desktop viewport. reduced-motion is NOT set. Structural, not live-pixel:
// the finale is opacity-animated by GSAP, but its DOM subtree is present from
// mount, so we assert the STABLE DOM CONTRACT (Console present, no raster) rather
// than any scrubbed pixel state (live cinematic parity is HUMAN-VERIFY).

test.describe("Hero finale renders a Console, not a raster", () => {
  test("the held framed-dashboard finale contains a Console and no <img>", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const finale = page.locator("[data-hero-framed-dashboard]");
    await expect(finale).toHaveCount(1);

    // The Console bare root exposes role="img" (its text-alternative contract).
    // Nested chart/flow parts self-label too (repo a11y convention), so assert
    // the OUTERMOST role="img" is the placement-payload Console root rather
    // than demanding a single labeled node.
    const console = finale.locator('[role="img"]').first();
    await expect(console).toHaveAttribute("aria-label", /Placement run console/);

    // The retired raster must be gone: no <img> anywhere inside the finale, and
    // in particular nothing pointing at the deleted dashboard-dark asset.
    const imgCount = await finale.locator("img").count();
    expect(imgCount).toBe(0);
    const rasterCount = await finale
      .locator('img[src*="dashboard-dark"]')
      .count();
    expect(rasterCount).toBe(0);
  });
});
