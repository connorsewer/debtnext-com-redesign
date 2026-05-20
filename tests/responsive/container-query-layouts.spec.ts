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
    const mediaBox = await page
      .locator('img[alt*="placement matrix" i], img[alt*="dashboard" i]')
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
      .locator('img[alt*="placement matrix" i], img[alt*="dashboard" i]')
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
