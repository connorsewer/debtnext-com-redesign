import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { VISUAL_ROUTES } from "../helpers/routes";

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  for (const route of VISUAL_ROUTES) {
    test(`axe ${route} @ ${vp.name}`, async ({ page }) => {
      // Evaluate the SETTLED, fail-open state (2026-07-08, hero RSC split).
      // axe-core scrolls the document during analysis, which fires the
      // IntersectionObserver scroll-reveals; on slow CI runners the contrast
      // check then samples text MID-FADE and reports alpha-blended colors
      // (e.g. white-ish on white at 1.01:1 for theme-light sections) — a
      // nondeterministic false failure. Emulating reduced motion makes every
      // reveal fail open at full opacity (the same rested state
      // reduced-motion.spec.ts asserts), so axe measures the real resting
      // colors of ALL content — including the server-rendered static handoff
      // mockups the old client-only tree used to hide from axe entirely.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        // The Vercel preview toolbar (only injected on deployed previews,
        // never on CI's local server) ships its own sub-AA links; exclude it
        // so this suite can also run against preview URLs. Same third-party
        // carve-out reveal-fail-open.spec.ts uses.
        .exclude('a[href^="#geist"]')
        .exclude("[data-vercel-toolbar]")
        .exclude("vercel-live-feedback")
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );
      expect(
        critical,
        `Critical/serious axe violations on ${route} @ ${vp.name}:\n${critical
          .map((v) => `  ${v.id}: ${v.description}`)
          .join("\n")}`
      ).toEqual([]);
    });
  }
}
