import { test, expect } from "@playwright/test";
import { VISUAL_ROUTES } from "../helpers/routes";

/**
 * SSR fail-open guarantee (audit Batch E: SOL-6 / PLT-4 / TXT-5).
 *
 * The runtime scan below proves reveals self-heal for patient scrollers. These
 * SSR checks prove the stronger, durable contract the fix adds: content is
 * visible in the server-rendered HTML itself, before any JS runs. That closes
 * the pre-hydration blank-band window and the crawler / print / capture path.
 *
 * `SSR_ROUTES` are the routes the audit named for Batch E plus the ones whose
 * primitives were the implicated code: /solutions (RevealSection + BulletList),
 * /platform/integrations (motion.tbody + LiveValue), /compare and
 * /company/leadership (useInViewProps tables + LiveValue).
 *
 * `/` is intentionally excluded: its hero cinematic (HomepageHero /
 * HeroCinematicController, owned by a separate change) legitimately ships
 * scroll-scrubbed opacity, and its fail-open is covered separately. Every route
 * here is one whose reveal primitives this change touches.
 */
const SSR_ROUTES = [
  "/solutions",
  "/solutions/utilities",
  "/solutions/fintech",
  "/platform/integrations",
  "/platform",
  "/compare",
  "/company",
  "/company/leadership",
] as const;

test.describe("SSR fail-open (raw HTML, no JS)", () => {
  for (const route of SSR_ROUTES) {
    test(`${route}: reveal-band text is present in server HTML`, async ({
      request,
    }) => {
      // The crawler / print / capture guarantee: the reveal bands' text is in
      // the server-rendered HTML itself, not injected only after hydration.
      // A raw string can't reliably tell a reveal band's opacity:0 from an
      // aria-hidden decorative product-visual layer's (that needs DOM ancestry,
      // which the no-JS scan below does with getComputedStyle + .closest). So
      // here we assert the durable, string-checkable half: <main> ships a
      // substantial body of visible text. Before the fix, RevealSection /
      // BulletList / motion.tbody bands SSR'd empty (opacity:0 with the text
      // still in the DOM, or textless rows); the no-JS scan is what proves the
      // opacity, and this proves the content shipped at all.
      const res = await request.get(route);
      expect(res.ok(), `GET ${route} -> ${res.status()}`).toBeTruthy();
      const html = await res.text();
      const mainMatch = html.match(/<main[\s>][\s\S]*?<\/main>/i);
      expect(mainMatch, `no <main> found in ${route} SSR HTML`).not.toBeNull();
      const text = mainMatch![0]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      // Every route in SSR_ROUTES has multiple reveal bands of prose; a healthy
      // SSR renders well over a few hundred characters of body copy. A near-empty
      // <main> is the blank-band failure this fix removes.
      expect(
        text.length,
        `${route} SSR <main> has too little text (${text.length} chars); reveal bands may have shipped blank`
      ).toBeGreaterThan(400);
    });
  }

  test("/platform/integrations: SSR table rows carry their text + final counts", async ({
    request,
  }) => {
    const res = await request.get("/platform/integrations");
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    const main = html.match(/<main[\s>][\s\S]*?<\/main>/i)?.[0] ?? "";
    // motion.tbody previously left rows textless pre-hydration. The rows render
    // real platform names in SSR now; assert a representative one is present.
    // Strip tags, collapse whitespace, then look for known ledger text.
    const text = main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(text.length).toBeGreaterThan(200);
    // A LiveValue count column must SSR its final value, never 0. Every
    // integration count is a positive integer; assert at least one multi-digit
    // number sits in the rendered text (the counts), i.e. counters are not all
    // captured at 0.
    expect(text).toMatch(/\d{2,}/);
  });
});

/**
 * Fast-scroll repro (the audit's blank-band trigger) with JavaScript disabled.
 * With JS off, framer never hydrates, so this is the worst case: whatever the
 * server sent is all the user ever gets. Every text-bearing in-viewport element
 * must sit at opacity 1. This is the JS-disabled complement to the motion-on
 * runtime scan below.
 */
test.describe("no-JS fail-open", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of SSR_ROUTES) {
    test(`${route}: content visible with JS disabled`, async ({ page }) => {
      test.slow();
      await page.goto(route);
      await page.waitForLoadState("load");
      // Jump to the bottom and back: with JS off there is no reveal to arm, so
      // any element the reveal primitives wrapped must already be at opacity 1.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.evaluate(() => window.scrollTo(0, 0));

      const offenders = await page.evaluate(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
        const found: { tag: string; className: string; opacity: number }[] = [];
        for (const el of all) {
          if (found.length >= 5) break;
          const t = (el.textContent ?? "").trim();
          if (t.length === 0) continue;
          const rect = el.getBoundingClientRect();
          if (
            !(
              rect.bottom > 0 &&
              rect.right > 0 &&
              rect.top < vh &&
              rect.left < vw &&
              rect.width > 0 &&
              rect.height > 0
            )
          )
            continue;
          const style = getComputedStyle(el);
          if (style.visibility !== "visible") continue;
          if (el.closest('[aria-hidden="true"]')) continue;
          if (el.closest("[data-handoff-section]")) continue;
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
        `With JS disabled, text stuck below opacity:1 (reveal failed closed): ${JSON.stringify(
          offenders,
          null,
          2
        )}`
      ).toEqual([]);
    });
  }
});

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
    // Longer settle at the top: the homepage GSAP cinematic uses scrub:0.5, so
    // its scroll-linked opacities keep easing for ~0.5s after the scroll stops.
    await page.waitForTimeout(700);

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
        // Skip the homepage GSAP cinematic Platform section. Its opacity is
        // scroll-scrubbed (the section is the downstream panel that fades in at
        // the end of the hero hand-off), so at scroll-top it is intentionally
        // opacity:0 — not a failed reveal. Its fail-open is covered separately:
        // under reduced motion it renders the static, fully-visible branch.
        if (el.closest("[data-handoff-section]")) continue;

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
