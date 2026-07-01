import { test, expect, type Page } from "@playwright/test";

/**
 * Phase 14 page-elevation spec (PAGEVIS-01/02/03/04, Plan 14-01 Task 2).
 *
 * Ported from solutions-visuals.spec.ts, adapted to the D-01 restraint contract.
 * The 14-ARCHETYPE-MAP.md gate records that only TWO routes earn an archetype
 * this phase (/compare DataStory, /platform/integrations Schematic); the rest
 * are deliberate no-lift (Reveal/Ambient/nothing). This spec proves, per
 * archetype route:
 *   1. The page renders a REAL archetype in its ProductVisualBand slot: a
 *      role="img" node with a non-empty aria-label. "role=img exists" alone is
 *      insufficient (Pitfall 7) — a copy-pasted or decorative payload must fail,
 *      which is why every archetype route also asserts argument-unique strings.
 *   2. Each archetype route's DOM carries ALL of its uniqueStrings on load, no
 *      hover. Sourced verbatim from 14-ARCHETYPE-MAP.md "Per-route distinctness
 *      strings" (payload-only nouns, absent from the page's table/prose copy).
 *   3. REDUCED-MOTION DATA-PARITY (FND-01): each uniqueString visible on normal
 *      load is STILL present under prefers-reduced-motion.
 *   4. No in-viewport text-bearing element sits at opacity < 1 after load
 *      (reveal-fail-open shape, with the iterations === Infinity idle-guard so
 *      ambient pulses do not deadlock the wait).
 *   5. /demo is revealOnly: NO archetype requirement, and the form submit CTA
 *      ("Request a demo") is present (never displaced by motion, D-01d). Exempt
 *      from the uniqueStrings check.
 *
 * NO Explorable-toggle assertion: no flagships this phase (D-01/D-02), unlike
 * the platform deep-dive pages.
 *
 * This spec is RED at Wave 0 by design: the archetype pages are not wired until
 * plan 14-03. That is the correct Wave-0 state. The /company set + /resources +
 * /why-dplat are NOT rows here — their reduced-motion + fail-open coverage comes
 * from the existing reduced-motion.spec.ts / reveal-fail-open.spec.ts iterating
 * VISUAL_ROUTES (which already lists all 9 targets).
 *
 * Runs against a Vercel preview via PLAYWRIGHT_BASE_URL (next dev/start hang in
 * this sandbox per project memory).
 */

interface PageElevationConfig {
  /** Route under test, e.g. "/platform/integrations". */
  route: string;
  /** True if the page must render a real archetype (role="img") in its slot. */
  archetypeExpected: boolean;
  /** Payload-only unique substrings that MUST all be in the DOM on load AND must
   *  survive reduced motion. Sourced verbatim from 14-ARCHETYPE-MAP.md. Empty
   *  for revealOnly routes. */
  uniqueStrings: string[];
  /** True for Ambient/Reveal-only routes (e.g. /demo): no archetype required,
   *  no uniqueStrings, submit CTA asserted instead. */
  revealOnly?: boolean;
}

const PAGE_ELEVATION_PAGES: PageElevationConfig[] = [
  {
    route: "/platform/integrations",
    archetypeExpected: true,
    // Schematic node/edge labels absent from the IntegrationTable rows.
    uniqueStrings: ["system of record", "recovery vendors"],
  },
  {
    route: "/compare",
    archetypeExpected: true,
    // DataStory annotation/headline strings absent from the CompareMatrix copy.
    uniqueStrings: ["time to production", "already in production"],
  },
  {
    route: "/demo",
    archetypeExpected: false,
    revealOnly: true,
    uniqueStrings: [],
  },
];

/** Assert the page surfaces a real archetype (role="img" with a non-empty
 *  aria-label), never the text-on-dark "Visual" placeholder. */
async function assertArchetypePresent(page: Page, route: string) {
  // A real archetype is a role="img" node carrying a descriptive aria-label.
  // Exclude the empty-aria-label sub-bars inside an archetype; the archetype
  // root (Console/Schematic/DataStory) carries the descriptive ariaSummary.
  const archetype = page.locator('[role="img"]:not([aria-label=""])');
  await expect(
    archetype.first(),
    `archetype role=img present on ${route}`,
  ).toBeVisible();
  const label = await archetype.first().getAttribute("aria-label");
  expect(
    (label ?? "").trim().length,
    `non-empty archetype aria-label on ${route}`,
  ).toBeGreaterThan(0);
  // The placeholder shows an eyebrow span reading exactly "Visual"; it must NOT
  // be the rendered content for a wired archetype route.
  const placeholder = page.getByText("Visual", { exact: true });
  await expect(
    placeholder,
    `no text placeholder on ${route}`,
  ).toHaveCount(0);
}

/** Assert each argument-unique substring is present in the DOM with no hover. */
async function assertUniqueStrings(page: Page, strings: string[]) {
  for (const value of strings) {
    await expect(
      page.getByText(value, { exact: false }).first(),
      `argument-unique string "${value}" present on load (no hover)`,
    ).toBeVisible();
  }
}

/** Reduced-motion DATA-parity: the unique strings visible on normal load are
 *  STILL in the DOM when prefers-reduced-motion is emulated. */
async function assertReducedMotionDataParity(
  page: Page,
  route: string,
  strings: string[],
) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  for (const value of strings) {
    await expect(
      page.getByText(value, { exact: false }).first(),
      `reduced-motion data-parity: "${value}" still present on ${route}`,
    ).toBeVisible();
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
}

/** Assert the /demo submit CTA is present (never displaced by motion, D-01d). */
async function assertSubmitCtaPresent(page: Page, route: string) {
  const cta = page
    .getByRole("button", { name: /request a demo/i })
    .or(page.locator('button[type="submit"]'));
  await expect(
    cta.first(),
    `submit CTA present on ${route} (never displaced by motion)`,
  ).toBeVisible();
}

/** No in-viewport text-bearing element sits at opacity < 1 after load
 *  (reveal-fail-open shape, scoped to this route). */
async function assertNoStuckOpacity(page: Page) {
  // Wait until reveal/fade animations have settled instead of a fixed sleep.
  // getAnimations() returns every running Web Animation; once none finite are
  // running the opacity sweep is stable. Guard for engines without the API.
  await page.waitForFunction(() => {
    const getAnimations = (document as Document & {
      getAnimations?: () => Animation[];
    }).getAnimations;
    if (typeof getAnimations !== "function") return true;
    return getAnimations.call(document).every((anim) => {
      // Infinite ambient loops (status pulses, node pulses, marquees) never
      // reach "finished" — only wait on finite reveal/fade animations.
      const timing = anim.effect?.getTiming?.();
      if (timing && timing.iterations === Infinity) return true;
      return anim.playState === "finished" || anim.playState === "idle";
    });
  });
  const offenders = await page.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
    const found: { tag: string; opacity: number }[] = [];
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
      const style = getComputedStyle(el);
      if (style.visibility !== "visible") continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (
        el.closest('a[href^="#geist"], [data-vercel-toolbar], [data-testid^="geist"]')
      )
        continue;
      const opacity = parseFloat(style.opacity);
      if (Number.isFinite(opacity) && opacity < 1) {
        found.push({ tag: el.tagName, opacity });
      }
    }
    return found;
  });
  expect(
    offenders,
    `text stuck below opacity:1 after load: ${JSON.stringify(offenders, null, 2)}`,
  ).toEqual([]);
}

async function assertPageElevation(page: Page, cfg: PageElevationConfig) {
  await page.goto(cfg.route);
  await page.waitForLoadState("networkidle");

  if (cfg.revealOnly) {
    // Ambient/Reveal-only route: no archetype required; the submit CTA must be
    // present and unobstructed (D-01d). Exempt from the uniqueStrings check.
    await assertSubmitCtaPresent(page, cfg.route);
    await assertNoStuckOpacity(page);
    return;
  }

  if (cfg.archetypeExpected) {
    await assertArchetypePresent(page, cfg.route);
  }
  await assertUniqueStrings(page, cfg.uniqueStrings);
  await assertNoStuckOpacity(page);
  await assertReducedMotionDataParity(page, cfg.route, cfg.uniqueStrings);
}

test.use({ colorScheme: "dark" });

for (const cfg of PAGE_ELEVATION_PAGES) {
  test(`${cfg.route}: ${cfg.revealOnly ? "reveal-only, submit CTA intact" : "archetype visual, argument-unique strings, reduced-motion data-parity"}`, async ({
    page,
  }) => {
    test.slow();
    await assertPageElevation(page, cfg);
  });
}
