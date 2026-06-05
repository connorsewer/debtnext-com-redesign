import { test, expect } from "@playwright/test";
import { VISUAL_ROUTES } from "../helpers/routes";

/**
 * Reveal fail-open regression net (10-VALIDATION.md Wave 0 gap).
 *
 * Phases 11-15 add Framer/CSS scroll-reveal motion (the `Reveal` primitive).
 * The fail-open contract: if a reveal's IntersectionObserver never fires (JS
 * error, hydration race, observer not mounted), the text MUST still be readable,
 * i.e. it must never be left stuck at opacity:0. A reveal that animates from
 * opacity:0 -> 1 is only safe if the resting state is opacity:1.
 *
 * This spec scrolls each visual route to surface every IO-gated element, opens
 * every accordion / tab control (so reveals behind collapsed UI also settle),
 * then asserts no in-viewport text-bearing element sits at computed opacity < 1.
 *
 * Runs under default (motion-on) dark color-scheme: this is the motion-ON path,
 * the complement to reduced-motion.spec.ts which checks the reduced-motion path.
 * Mirrors the scroll-to-surface + offender-collection structure of
 * reduced-motion.spec.ts.
 */
test.use({
  colorScheme: "dark",
});

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
});

for (const route of VISUAL_ROUTES) {
  test(`${route}: no in-viewport text stuck at opacity < 1 (reveal fails open)`, async ({
    page,
  }) => {
    // This test scrolls, opens every accordion/tab, and full-DOM-scans 23 routes
    // under 2 CI workers; it legitimately runs long. slow() triples the per-test
    // timeout (30s -> 90s) so CI load variance can't trip a false timeout.
    test.slow();
    await page.goto(route);
    // `load`, not `networkidle`: the homepage hero `<video preload="auto">`
    // keeps the network busy, so networkidle can stall near the test timeout.
    // The scroll + settle waits below are what actually surface IO reveals.
    await page.waitForLoadState("load");

    // Surface IntersectionObserver-driven entrances: scroll to the bottom and
    // back to the top, mirroring reduced-motion.spec.ts (200ms settle waits).
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Open every collapsed accordion trigger and every tab control so reveals
    // sitting behind collapsed UI also settle. Absence of these controls is not
    // a failure (most routes have none); each click is guarded.
    // Each click carries a short timeout: a `[data-state="closed"]` node that is
    // covered (sticky header) or mid-animation would otherwise hang the click for
    // the full test timeout. Bounding it keeps the guarded `.catch` meaningful.
    // Iterations are capped so a pathological page can't blow the time budget.
    const accordionTriggers = page.locator('[data-state="closed"]');
    const accordionCount = Math.min(await accordionTriggers.count(), 30);
    for (let i = 0; i < accordionCount; i++) {
      // Re-query each iteration: opening one can re-render siblings.
      const trigger = page.locator('[data-state="closed"]').first();
      if ((await trigger.count()) === 0) break;
      await trigger.click({ trial: false, timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(50);
    }

    const tabs = page.locator('[role="tab"]');
    const tabCount = Math.min(await tabs.count(), 30);
    for (let i = 0; i < tabCount; i++) {
      await tabs
        .nth(i)
        .click({ trial: false, timeout: 1000 })
        .catch(() => {});
      await page.waitForTimeout(50);
    }

    // Let any reveal transitions opened by the clicks above run to rest.
    await page.waitForTimeout(300);

    // Collect up to 5 in-viewport, text-bearing elements whose computed opacity
    // is below 1. A non-empty result means a reveal failed CLOSED (text hidden).
    const offenders = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
      const found: { tag: string; className: string; opacity: number }[] = [];

      for (const el of all) {
        if (found.length >= 5) break;

        // Must carry visible text directly or via descendants.
        const text = (el.textContent ?? "").trim();
        if (text.length === 0) continue;

        // Must intersect the viewport.
        const rect = el.getBoundingClientRect();
        const intersects =
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < vh &&
          rect.left < vw &&
          rect.width > 0 &&
          rect.height > 0;
        if (!intersects) continue;

        // Skip elements that are intentionally hidden, not reveal-gated:
        //  - visibility:hidden/collapse (e.g. the header's hover/focus nav
        //    flyouts) keep a layout box but are not perceivable. visibility
        //    inherits, so the element's own computed value already reflects a
        //    hidden ancestor.
        //  - aria-hidden subtrees (decorative crossfade layers like the hero's
        //    framed-dashboard finale) are not content a user reads.
        // The Reveal primitive (src/components/motion/Reveal.tsx) uses neither,
        // so excluding these cannot mask a genuine reveal-failed-closed.
        const style = getComputedStyle(el);
        if (style.visibility !== "visible") continue;
        if (el.closest('[aria-hidden="true"]')) continue;
        // Ignore third-party overlays injected only on deployed Vercel previews
        // (the Vercel Toolbar's geist skip-nav sits at opacity:0 until focused).
        // Not part of the app under test; CI's local server never renders them.
        if (
          el.closest(
            'a[href^="#geist"], [data-vercel-toolbar], [data-testid^="geist"]'
          )
        )
          continue;

        const opacity = parseFloat(style.opacity);
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
      `Text-bearing elements stuck below opacity:1 (reveal failed closed): ${JSON.stringify(
        offenders,
        null,
        2
      )}`
    ).toEqual([]);
  });
}
