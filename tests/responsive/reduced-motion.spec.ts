import { test, expect } from "@playwright/test";
import { ROUTES, VISUAL_ROUTES } from "../helpers/routes";

// `reducedMotion` is a context option, not a top-level Fixtures property, so it
// cannot sit beside `colorScheme` in `test.use` (TS2353). The page-level
// `emulateMedia` in beforeEach is what actually makes the media query match for
// this project's dev server, so the reduce flag lives there.
test.use({
  colorScheme: "dark",
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

// Reveals must fail OPEN under reduced motion, not merely "stop animating".
// "No running animations" (above) does not prove the text is visible: a reveal
// could be parked at opacity:0 with its animation neutralized to 0.01ms by the
// globals.css reduced-motion sweep, which would pass the loop above while
// leaving the text hidden. This sibling test asserts that every in-viewport
// text-bearing element rests at computed opacity === 1 under reduced motion,
// across the same VISUAL_ROUTES the motion-on reveal-fail-open spec covers.
for (const route of VISUAL_ROUTES) {
  test(`${route}: in-viewport text rests at opacity 1 under reduced motion`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    // Surface IO-driven entrances: scroll to the bottom and back to the top.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    // Collect up to 5 in-viewport, text-bearing elements whose computed opacity
    // is below 1 (i.e. NOT === 1). Same offender shape as reveal-fail-open.spec.
    const offenders = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
      const found: { tag: string; className: string; opacity: number }[] = [];

      for (const el of all) {
        if (found.length >= 5) break;

        const text = (el.textContent ?? "").trim();
        if (text.length === 0) continue;

        const rect = el.getBoundingClientRect();
        const intersects =
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < vh &&
          rect.left < vw &&
          rect.width > 0 &&
          rect.height > 0;
        if (!intersects) continue;

        const opacity = parseFloat(getComputedStyle(el).opacity);
        // Assert opacity === 1: anything below means the reveal failed closed.
        if (Number.isFinite(opacity) && opacity < 1) {
          found.push({
            tag: el.tagName,
            className: el.className.toString().slice(0, 80),
            opacity,
          });
        }
      }
      return found;
    });

    expect(
      offenders,
      `Reduced-motion text not at opacity 1 (reveal failed closed): ${JSON.stringify(
        offenders,
        null,
        2
      )}`
    ).toEqual([]);
  });
}
