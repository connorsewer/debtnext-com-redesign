import { test, expect } from "@playwright/test";
import { ROUTES } from "../helpers/routes";

test.use({
  colorScheme: "dark",
  reducedMotion: "reduce",
});

// Belt-and-braces: re-emulate at the page level. The context-level `reducedMotion`
// in `test.use` above sets Playwright's own internal flags (trace viewer behavior,
// screenshot suppression for animated content), but it does not always propagate
// to `window.matchMedia("(prefers-reduced-motion: reduce)")` against this project's
// dev server. The `page.emulateMedia` call below is what makes the CSS media query
// actually match, which is what the assertion below depends on.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
});

for (const route of ROUTES) {
  test(`${route}: no running animations under prefers-reduced-motion`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    // Force IntersectionObserver-driven entrances (Task 19 mockups, any future IO-gated motion)
    // to actually trigger by scrolling to the bottom and back to the top.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    // Poll for ~250ms to catch animations that start late.
    const animating = await page.evaluate(async () => {
      const sample = () => {
        const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
        return all
          .filter((el) => {
            const animations = el.getAnimations?.() ?? [];
            return animations.some((a) => {
              if (a.playState !== "running") return false;
              const duration = a.effect?.getTiming().duration;
              // The reduced-motion sweep at globals.css collapses animation-duration to 0.01ms.
              // Anything at or below 1ms is the sweep neutralizing the animation, not a real leak.
              return typeof duration === "number" && duration > 1;
            });
          })
          .slice(0, 5)
          .map((el) => ({
            tag: el.tagName,
            className: el.className.toString().slice(0, 80),
          }));
      };

      // Sample 5 times over ~250ms. Return any sample that finds leaks (worst case).
      const samples: ReturnType<typeof sample>[] = [];
      for (let i = 0; i < 5; i++) {
        samples.push(sample());
        await new Promise((r) => setTimeout(r, 50));
      }
      return samples.find((s) => s.length > 0) ?? [];
    });

    expect(animating, `Animations still running: ${JSON.stringify(animating, null, 2)}`).toEqual([]);
  });
}
