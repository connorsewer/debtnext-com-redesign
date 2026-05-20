import { test, expect } from "@playwright/test";
import { ROUTES } from "../helpers/routes";

test.describe("touch-target floor at 375", () => {
  for (const route of ROUTES) {
    test(`${route}: every interactive element is ≥44×44`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const fails = await page.evaluate(() => {
        const targets = Array.from(
          document.querySelectorAll<HTMLElement>(
            'a, button, [role="button"], input[type="checkbox"], input[type="radio"]'
          )
        );
        return targets
          .filter((el) => {
            const r = el.getBoundingClientRect();
            // skip hidden elements
            if (r.width === 0 || r.height === 0) return false;
            // 44px floor
            return r.height < 44 || r.width < 44;
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 60) ?? "",
            size: `${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`,
          }));
      });

      expect(fails, `Undersized targets on ${route}: ${JSON.stringify(fails, null, 2)}`).toEqual([]);
    });
  }
});
