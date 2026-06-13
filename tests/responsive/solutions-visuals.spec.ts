import { test, expect, type Page } from "@playwright/test";

/**
 * Solutions-visuals spec (SOLVIS-01/02/03/04/05, Plan 12-01 Task 2).
 *
 * Mirrors platform-visuals.spec.ts, adapted to the solutions distinctness
 * contract (D-08, D-14). Proves, per industry page + the /solutions hub:
 *   1. Each mapped FeatureAccordion item renders a REAL archetype visual (a
 *      role="img" node with a non-empty aria-label inside the active panel),
 *      not the registry-fallback homepage bespoke visual (which lacks
 *      role="img") and not the text-on-dark "Visual" placeholder. This is the
 *      SOLVIS-05 fix: today the solutions accordions silently render the
 *      homepage PlacementMatrix etc., identical across all 6 industries.
 *   2. Each industry route's DOM carries its industryUniqueStrings (e.g.
 *      /solutions/utilities contains "arrears" AND "deposit"). Sourced verbatim
 *      from 12-ARCHETYPE-MAP.md "Per-route distinctness strings".
 *   3. CROSS-ROUTE DISTINCTNESS (D-08 / SOLVIS-01): an industry's full
 *      uniqueStrings set must NOT all appear on a sibling industry route. A
 *      copy-pasted payload fails this.
 *   4. REDUCED-MOTION DATA-PARITY (D-05): each industryUniqueString visible on
 *      normal load is STILL present under prefers-reduced-motion.
 *   5. No in-viewport text-bearing element sits at opacity < 1 after accordion
 *      interaction (reveal-fail-open shape, with the iterations === Infinity
 *      idle-guard so ambient pulses do not deadlock the wait).
 *   6. Hub: the BenefitSplit DataStory renders role="img" and the 6 industry
 *      card names are present in the DOM.
 *
 * NO Explorable-toggle assertion: flagships are not required on solutions pages
 * (D-04), unlike the platform deep-dive pages.
 *
 * Runs against a Vercel preview via PLAYWRIGHT_BASE_URL (next dev/start hang in
 * this sandbox per project memory).
 */

interface SolutionsVisualConfig {
  /** Route under test, e.g. "/solutions/utilities". */
  route: string;
  /** Mapped FeatureAccordion item ids on the page (each must render an
   *  archetype). Empty for the hub, which has no accordion under test here. */
  accordionItemIds: string[];
  /** Industry-unique substrings that MUST all be in the DOM on load AND must
   *  survive reduced motion (D-05). Used for the cross-route distinctness test:
   *  this full set must be absent on a sibling industry route. */
  industryUniqueStrings: string[];
}

const SOLUTIONS_VISUAL_PAGES: SolutionsVisualConfig[] = [
  {
    route: "/solutions/utilities",
    accordionItemIds: ["placement", "optimization", "reporting"],
    industryUniqueStrings: ["arrears", "deposit"],
  },
  {
    route: "/solutions/financial-services",
    accordionItemIds: ["placement", "issues", "optimization"],
    industryUniqueStrings: ["charge-off"],
  },
  {
    route: "/solutions/telecom",
    accordionItemIds: ["placement", "optimization", "issues"],
    industryUniqueStrings: ["prepaid"],
  },
  {
    route: "/solutions/fintech",
    accordionItemIds: ["placement", "optimization", "reporting"],
    industryUniqueStrings: ["BNPL"],
  },
  {
    route: "/solutions/insurance",
    accordionItemIds: ["placement", "optimization", "reporting"],
    industryUniqueStrings: ["subrogation"],
  },
  {
    route: "/solutions/healthcare",
    accordionItemIds: ["placement", "optimization", "reporting"],
    industryUniqueStrings: ["self-pay"],
  },
];

/** Six industry card names the hub's cross-industry DataStory must surface. */
const HUB_CARD_NAMES = [
  "Utilities",
  "Financial services",
  "Telecom",
  "Fintech",
  "Insurance",
  "Healthcare",
];

/** Click each accordion trigger in turn and assert the active panel surfaces a
 *  real archetype (role="img" with a non-empty aria-label), never the
 *  registry-fallback visual (no role="img") or the text-on-dark "Visual"
 *  placeholder. */
async function assertAccordionArchetypes(page: Page, itemIds: string[]) {
  for (const itemId of itemIds) {
    const trigger = page.locator(`#feat-${itemId}-button`);
    await expect(trigger, `accordion trigger for ${itemId}`).toBeVisible();
    await trigger.click();
    // A real archetype is a role="img" node carrying a descriptive aria-label.
    // Exclude the empty-aria-label sub-bars inside an archetype; the archetype
    // root (Console/Schematic/DataStory) carries the descriptive ariaSummary.
    const archetype = page.locator('[role="img"]:not([aria-label=""])');
    await expect(
      archetype.first(),
      `archetype role=img for ${itemId}`,
    ).toBeVisible();
    const label = await archetype.first().getAttribute("aria-label");
    expect(
      (label ?? "").trim().length,
      `non-empty archetype aria-label for ${itemId}`,
    ).toBeGreaterThan(0);
    // The placeholder shows an eyebrow span reading exactly "Visual"; it must
    // NOT be the rendered content for a wired item.
    const placeholder = page.getByText("Visual", { exact: true });
    await expect(
      placeholder,
      `no text placeholder for ${itemId}`,
    ).toHaveCount(0);
  }
}

/** Assert each industry-unique substring is present in the DOM with no hover. */
async function assertIndustryUniqueStrings(page: Page, strings: string[]) {
  for (const value of strings) {
    await expect(
      page.getByText(value, { exact: false }).first(),
      `industry-unique string "${value}" present on load (no hover)`,
    ).toBeVisible();
  }
}

/** D-05 reduced-motion DATA-parity: the industry-unique strings visible on
 *  normal load are STILL in the DOM when prefers-reduced-motion is emulated. */
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
      `reduced-motion data-parity: "${value}" still present`,
    ).toBeVisible();
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
}

/** No in-viewport text-bearing element sits at opacity < 1 after interaction
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
    `text stuck below opacity:1 after interaction: ${JSON.stringify(offenders, null, 2)}`,
  ).toEqual([]);
}

async function assertSolutionsVisuals(page: Page, cfg: SolutionsVisualConfig) {
  await page.goto(cfg.route);
  await page.waitForLoadState("networkidle");

  await assertIndustryUniqueStrings(page, cfg.industryUniqueStrings);
  await assertAccordionArchetypes(page, cfg.accordionItemIds);
  await assertNoStuckOpacity(page);
  await assertReducedMotionDataParity(page, cfg.route, cfg.industryUniqueStrings);
}

test.use({ colorScheme: "dark" });

for (const cfg of SOLUTIONS_VISUAL_PAGES) {
  test(`${cfg.route}: archetype visuals, industry-unique strings, reduced-motion data-parity`, async ({
    page,
  }) => {
    test.slow();
    await assertSolutionsVisuals(page, cfg);
  });
}

/**
 * Cross-route distinctness (D-08 / SOLVIS-01): no industry's full uniqueStrings
 * set may appear on a sibling industry route. A copy-pasted payload that carried
 * another industry's nouns would fail this.
 */
test("cross-route distinctness: an industry's unique strings are absent on siblings", async ({
  page,
}) => {
  test.slow();
  for (const cfg of SOLUTIONS_VISUAL_PAGES) {
    const siblings = SOLUTIONS_VISUAL_PAGES.filter((s) => s.route !== cfg.route);
    for (const sibling of siblings) {
      await page.goto(sibling.route);
      await page.waitForLoadState("networkidle");
      const body = (await page.locator("body").textContent()) ?? "";
      const allPresent = cfg.industryUniqueStrings.every((s) =>
        body.toLowerCase().includes(s.toLowerCase()),
      );
      expect(
        allPresent,
        `${cfg.route} unique set ${JSON.stringify(
          cfg.industryUniqueStrings,
        )} must NOT all appear on sibling ${sibling.route}`,
      ).toBe(false);
    }
  }
});

/**
 * Hub: the /solutions BenefitSplit cross-industry overview renders a DataStory
 * (role="img") and surfaces all 6 industry card names (D-03). No accordion
 * archetype assertion here — the hub is not required to carry the triad.
 */
test("/solutions hub: cross-industry DataStory present + 6 industry cards", async ({
  page,
}) => {
  test.slow();
  await page.goto("/solutions");
  await page.waitForLoadState("networkidle");

  const archetype = page.locator('[role="img"]:not([aria-label=""])');
  await expect(archetype.first(), "hub DataStory role=img").toBeVisible();
  const label = await archetype.first().getAttribute("aria-label");
  expect(
    (label ?? "").trim().length,
    "non-empty hub DataStory aria-label",
  ).toBeGreaterThan(0);

  for (const name of HUB_CARD_NAMES) {
    // Scope to main: the nav's Solutions dropdown contains hidden menu items
    // with the same industry names, and getByText().first() resolves to those.
    await expect(
      page.locator("main").getByText(name, { exact: false }).first(),
      `hub card name "${name}" present`,
    ).toBeVisible();
  }
});
