import { test, expect } from "@playwright/test";

test.describe("Platform handoff mobile contract", () => {
  test("renders 4 stacked mockups, no GSAP pin at 375", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The mobile branch should NOT have a pinned 400vh outer
    const sectionHeight = await page
      .locator("[data-handoff-section]")
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
    // At desktop, the handoff section uses CSS sticky inside a 400vh outer.
    const sectionHeight = await page
      .locator("[data-handoff-section]")
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(sectionHeight).toBeGreaterThan(2400); // 400vh-ish
  });
});
