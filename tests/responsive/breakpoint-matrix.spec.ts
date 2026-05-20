import { test, expect } from "@playwright/test";
import { ROUTES, BREAKPOINTS } from "../helpers/routes";

for (const route of ROUTES) {
  for (const bp of BREAKPOINTS) {
    test(`${route} renders without overflow at ${bp.name} (${bp.width}×${bp.height})`, async ({ page }) => {
      // capture console errors to fail noisy regressions
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // No horizontal overflow on <html>
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow, `${route} @ ${bp.name} has horizontal overflow`).toBe(false);

      // No console errors during load
      expect(errors, `${route} @ ${bp.name} console errors:\n${errors.join("\n")}`).toEqual([]);
    });
  }
}
