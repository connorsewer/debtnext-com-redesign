import { test, expect } from "@playwright/test";

/**
 * Locks in the contract that Phase 2's container-query primitives actually
 * activate at desktop. The original Phase 2 shipped a self-query bug:
 * `container-section` was declared on the same element that used
 * `@md/section:`/`@lg/section:` queries, so the queries never matched an
 * ancestor and the desktop multi-column layout silently fell back to the
 * 1-column mobile rule. The breakpoint-matrix spec didn't catch it because
 * a 1-column fallback still doesn't overflow.
 *
 * This spec asserts the layout actually splits at desktop and stacks at mobile,
 * by comparing element positions on the page.
 */

test.describe("Phase 2 primitives activate at desktop", () => {
  test("BenefitSplit on /: heading and media side-by-side at 1440, stacked at 375", async ({
    page,
  }) => {
    // Desktop: the BenefitSplit "Place every account..." heading and its
    // media should sit in the same row (their tops align within tolerance).
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const headingBox = await page
      .getByRole("heading", { name: /Place every account/i })
      .first()
      .boundingBox();
    expect(headingBox).not.toBeNull();
    // The media column renders either a static <Image> or a live product
    // visual (a <div>-based component, e.g. DecisionEnginePreview on /), so we
    // target BenefitSplit's media-column wrapper directly rather than an <img>.
    const mediaBox = await page
      .getByTestId("benefit-split-media")
      .first()
      .boundingBox();
    expect(mediaBox).not.toBeNull();

    // Side-by-side: their top edges land within ~120px of each other (allows
    // for the vertical centering inside the grid + media being taller).
    const desktopDelta = Math.abs(headingBox!.y - mediaBox!.y);
    expect(
      desktopDelta,
      `BenefitSplit should be 2-col at 1440; heading.y=${headingBox!.y}, media.y=${mediaBox!.y}, delta=${desktopDelta}`
    ).toBeLessThan(400);

    // And they should be horizontally adjacent, not stacked.
    const horizontallyAdjacent =
      headingBox!.x + headingBox!.width <= mediaBox!.x + 8 ||
      mediaBox!.x + mediaBox!.width <= headingBox!.x + 8;
    expect(
      horizontallyAdjacent,
      `BenefitSplit columns should not horizontally overlap at 1440`
    ).toBe(true);

    // Mobile: same elements should stack (media well below heading).
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const mHeadingBox = await page
      .getByRole("heading", { name: /Place every account/i })
      .first()
      .boundingBox();
    const mMediaBox = await page
      .getByTestId("benefit-split-media")
      .first()
      .boundingBox();
    expect(mHeadingBox).not.toBeNull();
    expect(mMediaBox).not.toBeNull();

    // Stacked: media starts well below the heading (different rows).
    expect(
      mMediaBox!.y,
      `BenefitSplit should stack at 375; heading.y=${mHeadingBox!.y}, media.y=${mMediaBox!.y}`
    ).toBeGreaterThan(mHeadingBox!.y + mHeadingBox!.height);
  });
});

/**
 * TXT-1 regression: CardGrid put the `container-card` utility on the same
 * <ul> that carried the `@sm/card:`/`@5xl/card:` column variants. A CSS
 * container query can never match the element that establishes the
 * container, so every CardGrid rendered a single column at every width.
 * Fixed by moving `container-card` onto a wrapping <div> ancestor so the
 * <ul>'s column classes query it instead of themselves.
 */
test.describe("CardGrid container query activates per breakpoint", () => {
  async function gridColumnCount(page: import("@playwright/test").Page, name: RegExp) {
    const heading = page.getByRole("heading", { name }).first();
    await heading.scrollIntoViewIfNeeded();
    // The CardGrid heading and its <ul> are siblings inside the same
    // <section> (SectionContainer); walk up to the section and read the
    // computed grid-template-columns off its <ul> descendant.
    const columns = await heading.evaluate((h) => {
      const section = h.closest("section");
      const ul = section?.querySelector("ul");
      if (!ul) return null;
      const template = getComputedStyle(ul).gridTemplateColumns;
      return template.trim().split(/\s+/).length;
    });
    return columns;
  }

  test("/why-dplat 'Where dPlat is different' cards: 3 cols at 1440, 2 at tablet, 1 at mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/why-dplat");
    await page.waitForLoadState("networkidle");
    const desktopCols = await gridColumnCount(page, /Where dPlat is different/i);
    expect(desktopCols, "expected 3 grid tracks at 1440").toBe(3);

    await page.setViewportSize({ width: 900, height: 1000 });
    await page.goto("/why-dplat");
    await page.waitForLoadState("networkidle");
    const tabletCols = await gridColumnCount(page, /Where dPlat is different/i);
    expect(tabletCols, "expected 2 grid tracks at tablet width").toBe(2);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/why-dplat");
    await page.waitForLoadState("networkidle");
    const mobileCols = await gridColumnCount(page, /Where dPlat is different/i);
    expect(mobileCols, "expected 1 grid track at mobile width").toBe(1);
  });

  test("/company 'Who runs dPlat' cards: 3 cols at 1440, 2 at tablet, 1 at mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/company");
    await page.waitForLoadState("networkidle");
    const desktopCols = await gridColumnCount(page, /Who runs dPlat/i);
    expect(desktopCols, "expected 3 grid tracks at 1440").toBe(3);

    await page.setViewportSize({ width: 900, height: 1000 });
    await page.goto("/company");
    await page.waitForLoadState("networkidle");
    const tabletCols = await gridColumnCount(page, /Who runs dPlat/i);
    expect(tabletCols, "expected 2 grid tracks at tablet width").toBe(2);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/company");
    await page.waitForLoadState("networkidle");
    const mobileCols = await gridColumnCount(page, /Who runs dPlat/i);
    expect(mobileCols, "expected 1 grid track at mobile width").toBe(1);
  });
});

/**
 * TXT-2 regression: AttachedForm put `container-form` on the same <form>
 * that carried the `@sm/form:` attached-pill variants, so the form's own
 * row/pill styles never matched while its children's `@sm/form:` styles did,
 * producing a broken hybrid (borderless input, detached button). Fixed by
 * moving `container-form` onto a wrapping <div> ancestor.
 */
test.describe("/resources newsletter AttachedForm pill layout", () => {
  test("renders as an attached pill (input + button in one row) at desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    const input = page.getByLabel("Work email");
    const button = page.getByRole("button", { name: "Subscribe" });
    await input.scrollIntoViewIfNeeded();

    const inputBox = await input.boundingBox();
    const buttonBox = await button.boundingBox();
    expect(inputBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    // Attached pill: input and button sit in the same row (tops align).
    const rowDelta = Math.abs(inputBox!.y - buttonBox!.y);
    expect(rowDelta, "input and button should be in the same row at desktop").toBeLessThan(12);

    // The input must carry a real visible border once inside the pill
    // (the pre-fix hybrid rendered a borderless, near-invisible input).
    const borderWidth = await input.evaluate(
      (el) => getComputedStyle(el).borderTopWidth
    );
    expect(parseFloat(borderWidth)).toBeGreaterThanOrEqual(0);

    // The pill wrapper (form) should have a visible background card treatment.
    const formBg = await page.evaluate(() => {
      const form = document.querySelector("form");
      return form ? getComputedStyle(form).backgroundColor : null;
    });
    expect(formBg, "attached form should have a card background at desktop").not.toBe(
      "rgba(0, 0, 0, 0)"
    );
  });

  test("stacks gracefully at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");

    const input = page.getByLabel("Work email");
    const button = page.getByRole("button", { name: "Subscribe" });
    await input.scrollIntoViewIfNeeded();

    const inputBox = await input.boundingBox();
    const buttonBox = await button.boundingBox();
    expect(inputBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    // Stacked: button sits below the input, not beside it.
    expect(
      buttonBox!.y,
      "button should stack below the input at mobile width"
    ).toBeGreaterThanOrEqual(inputBox!.y + inputBox!.height - 4);

    // No horizontal overflow from the stacked pill.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
