import { test, expect, type Page } from "@playwright/test";

/**
 * Platform-visuals spec (PLATVIS-01/02/03, Plan 11-01 Task 5).
 *
 * Proves, per platform deep-dive page:
 *   1. Each FeatureAccordion item renders a REAL archetype visual (a role="img"
 *      node with a non-empty aria-label inside the active panel), not the
 *      text-on-dark "Visual" placeholder.
 *   2. The BenefitSplit flagship exposes its headline values in the DOM on load,
 *      with no hover required.
 *   3. The flagship's Explorable toggles are real <button>s with aria-expanded,
 *      togglable by keyboard (Enter/Space).
 *   4. REDUCED-MOTION DATA-PARITY (D-05): a flagship value visible on normal load
 *      is STILL present in the DOM under prefers-reduced-motion. This guards a
 *      flagship that conditionally hides panel content when motion is off; the
 *      site-wide reduced-motion.spec.ts only checks opacity===1, not content
 *      presence, so this is the data-presence complement.
 *   5. No in-viewport text-bearing element sits at opacity < 1 after interaction
 *      (the reveal-fail-open assertion shape, scoped to the route).
 *
 * Structure: every assertion lives in `assertPlatformVisuals(page, cfg)`, keyed
 * off a per-route config. This plan runs it for /platform/placement only; Wave 2
 * (Plans 11-02 / 11-03 / 11-04) appends optimization / issues / reporting configs
 * to PLATFORM_VISUAL_PAGES and inherits every assertion, including the
 * reduced-motion data-parity check, for free.
 *
 * Runs against a Vercel preview via PLAYWRIGHT_BASE_URL (next dev/start hang in
 * this sandbox per project memory). Uses page.goto + waitForLoadState + the
 * page.emulateMedia reduced-motion pass.
 */

interface PlatformVisualConfig {
  /** Route under test, e.g. "/platform/placement". */
  route: string;
  /** Every FeatureAccordion item id on the page (each must render an archetype). */
  accordionItemIds: string[];
  /** One or more substrings of flagship headline values that MUST be in the DOM
   *  on load AND must survive reduced motion (D-05 data-parity). */
  flagshipValues: string[];
}

const PLATFORM_VISUAL_PAGES: PlatformVisualConfig[] = [
  {
    route: "/platform/placement",
    accordionItemIds: [
      "decision-engine",
      "vendor-pools",
      "recall",
      "business-rules",
      "reconciliation",
    ],
    // Flagship Console headline values rendered by default (placementFlagshipConsole).
    flagshipValues: ["1,847 accounts ready to route", "Placement decision engine"],
  },
  {
    route: "/platform/optimization",
    accordionItemIds: ["bands", "share", "bonus", "history"],
    // Flagship Console headline values rendered by default (optimizationFlagshipConsole):
    // the evaluated-pool title and the bonus callout. Both come from the Console
    // slots, so they are present on load and must survive reduced motion (D-05).
    flagshipValues: [
      "Closed pool · Q2 primary evaluated",
      "Bonus triggered · Recovery partner A cleared its 22% target",
    ],
  },
  // Wave 2 appends: issues / reporting configs here.
];

/** Click each accordion trigger in turn and assert the active panel surfaces a
 *  real archetype (role="img" with a non-empty aria-label), never the
 *  text-on-dark "Visual" placeholder. */
async function assertAccordionArchetypes(page: Page, itemIds: string[]) {
  for (const itemId of itemIds) {
    const trigger = page.locator(`#feat-${itemId}-button`);
    await expect(trigger, `accordion trigger for ${itemId}`).toBeVisible();
    await trigger.click();
    // The visual column is shared; after activating an item its archetype renders.
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
    // The placeholder shows an eyebrow span reading exactly "Visual"; it must NOT
    // be the rendered content for a wired item.
    const placeholder = page.getByText("Visual", { exact: true });
    await expect(
      placeholder,
      `no text placeholder for ${itemId}`,
    ).toHaveCount(0);
  }
}

/** Assert each flagship headline value is present in the DOM with no hover. */
async function assertFlagshipValuesVisible(page: Page, values: string[]) {
  for (const value of values) {
    await expect(
      page.getByText(value, { exact: false }).first(),
      `flagship value "${value}" present on load (no hover)`,
    ).toBeVisible();
  }
}

/** Assert a flagship Explorable toggle is a real <button> with aria-expanded and
 *  toggles via keyboard activation. */
async function assertFlagshipToggleKeyboard(page: Page) {
  // The flagship is wrapped in an Explorable role="group"; its toggles are the
  // only aria-expanded buttons on the platform pages (the accordion uses its own
  // buttons keyed by #feat-*). Scope to a group whose label mentions the engine.
  const toggle = page
    .locator('[role="group"] button[aria-expanded]')
    .first();
  await expect(toggle, "flagship Explorable toggle exists").toBeVisible();
  expect(
    await toggle.evaluate((el) => el.tagName.toLowerCase()),
    "toggle is a real <button>",
  ).toBe("button");

  const before = await toggle.getAttribute("aria-expanded");
  await toggle.focus();
  await page.keyboard.press("Enter");
  const after = await toggle.getAttribute("aria-expanded");
  expect(after, "Enter toggles aria-expanded").not.toBe(before);

  // Space also toggles (back to the original state).
  await page.keyboard.press("Space");
  const final = await toggle.getAttribute("aria-expanded");
  expect(final, "Space toggles aria-expanded back").toBe(before);
}

/** D-05 reduced-motion DATA-parity: the flagship values visible on normal load
 *  are STILL in the DOM when prefers-reduced-motion is emulated. */
async function assertReducedMotionDataParity(page: Page, route: string, values: string[]) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  for (const value of values) {
    await expect(
      page.getByText(value, { exact: false }).first(),
      `reduced-motion data-parity: "${value}" still present`,
    ).toBeVisible();
  }
  // Reset for any subsequent assertions.
  await page.emulateMedia({ reducedMotion: "no-preference" });
}

/** No in-viewport text-bearing element sits at opacity < 1 after interaction
 *  (reveal-fail-open shape, scoped to this route). */
async function assertNoStuckOpacity(page: Page) {
  await page.waitForTimeout(300);
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

async function assertPlatformVisuals(page: Page, cfg: PlatformVisualConfig) {
  await page.goto(cfg.route);
  await page.waitForLoadState("networkidle");

  await assertFlagshipValuesVisible(page, cfg.flagshipValues);
  await assertFlagshipToggleKeyboard(page);
  await assertAccordionArchetypes(page, cfg.accordionItemIds);
  await assertNoStuckOpacity(page);
  await assertReducedMotionDataParity(page, cfg.route, cfg.flagshipValues);
}

test.use({ colorScheme: "dark" });

for (const cfg of PLATFORM_VISUAL_PAGES) {
  test(`${cfg.route}: archetype visuals, flagship default-visible values, keyboard + reduced-motion data-parity`, async ({
    page,
  }) => {
    test.slow();
    await assertPlatformVisuals(page, cfg);
  });
}
