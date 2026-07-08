import { test, expect } from "@playwright/test";

// Since the hero RSC split (2026-07-08) BOTH handoff trees are always in the
// server HTML and CSS decides which one displays:
//   [data-handoff-section="cinematic"] — tall pinned tree, ≥768px + motion-safe
//   [data-handoff-section="static"]    — stacked fail-open tree, otherwise
// The selectors below are value-scoped so each assertion targets the tree that
// owns the contract at that viewport.
test.describe("Platform handoff mobile contract", () => {
  test("renders 4 stacked mockups, no GSAP pin at 375", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The cinematic tree must not display at mobile width (its 332vh scroll
    // range would otherwise leave a blank scrub region in the page).
    await expect(
      page.locator('[data-handoff-section="cinematic"]')
    ).toBeHidden();

    // The mobile branch should NOT have a pinned 400vh outer
    const sectionHeight = await page
      .locator('[data-handoff-section="static"]')
      .evaluate((el) => el.getBoundingClientRect().height);
    // Sanity: a normal-flow stacked section should be tall but not absurdly so.
    // 4 mockups stacked ≈ 2000-3500px. Reject anything > 5000px (pin spacer artifact).
    expect(sectionHeight).toBeLessThan(5000);

    // The 4 mockup titles should all be findable in the DOM
    const titles = await page.locator("h3").allTextContents();
    expect(titles.join(" ")).toContain("Placement");
    expect(titles.join(" ")).toContain("Vendor");
    expect(titles.join(" ")).toContain("Issues");
    expect(titles.join(" ")).toContain("Reporting");

    // No ScrollTrigger spacers present in the DOM
    const triggerSpacers = await page.locator(".pin-spacer").count();
    expect(triggerSpacers).toBe(0);
  });

  test("desktop still pins at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // At desktop, the handoff section uses CSS sticky inside a tall outer.
    const sectionHeight = await page
      .locator('[data-handoff-section="cinematic"]')
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(sectionHeight).toBeGreaterThan(2400); // 332vh-ish

    // And the static fail-open tree must not display alongside it.
    await expect(page.locator('[data-handoff-section="static"]')).toBeHidden();
  });
});
