import { test, expect } from "@playwright/test";

const TOKENS = [
  { name: "--text-h1", min: 36, max: 49 },
  { name: "--text-h2", min: 30, max: 42 },
  { name: "--text-h3", min: 24, max: 28 },
  { name: "--text-h4", min: 18, max: 21 },
  { name: "--text-body-lg", min: 18, max: 21 },
  { name: "--text-body-md", min: 15, max: 16 },
  { name: "--text-body-sm", min: 13, max: 14 },
  { name: "--text-display-lg", min: 36, max: 49 },
  { name: "--text-display-xl", min: 40, max: 64 },
];

/**
 * Reads the resolved px value of a fluid CSS-variable font-size at the
 * current viewport, by applying it to a synthetic element and reading
 * its computed font-size. Decoupled from page structure so the test
 * survives any layout changes during the responsive rebuild.
 */
async function resolveTokenPx(page: import("@playwright/test").Page, token: string): Promise<number> {
  return page.evaluate((t) => {
    const el = document.createElement("div");
    el.style.fontSize = `var(${t})`;
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    document.body.appendChild(el);
    const size = parseFloat(getComputedStyle(el).fontSize);
    el.remove();
    return size;
  }, token);
}

test.describe("fluid type scale anchored 360→1440", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  for (const { name, min, max } of TOKENS) {
    test(`${name} hits ${min}px at 360px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      const px = await resolveTokenPx(page, name);
      expect(px).toBeCloseTo(min, 0); // within 0.5px
    });

    test(`${name} hits ${max}px at 1440px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const px = await resolveTokenPx(page, name);
      expect(px).toBeCloseTo(max, 0);
    });
  }
});
