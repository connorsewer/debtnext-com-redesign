import { test, expect } from "@playwright/test";
import { ROUTES } from "../helpers/routes";

test.use({
  colorScheme: "dark",
  reducedMotion: "reduce",
});

// Belt-and-braces: re-emulate at the page level. The context-level
// `reducedMotion` option in `test.use` does not always propagate to
// `window.matchMedia("(prefers-reduced-motion: reduce)")` against this
// project's dev server, leaving the CSS media query unmatched.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
});

for (const route of ROUTES) {
  test(`${route}: no running animations under prefers-reduced-motion`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const animating = await page.evaluate(() => {
      // Any element with a currently-running CSS animation or transition
      const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
      return all
        .filter((el) => {
          const animations = el.getAnimations?.() ?? [];
          return animations.some(
            (a) => a.playState === "running" && a.effect?.getTiming().duration !== 0
          );
        })
        .slice(0, 5)
        .map((el) => ({
          tag: el.tagName,
          className: el.className.toString().slice(0, 80),
        }));
    });

    expect(animating, `Animations still running: ${JSON.stringify(animating, null, 2)}`).toEqual([]);
  });
}
