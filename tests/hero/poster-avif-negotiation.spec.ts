import { test, expect } from "@playwright/test";

/**
 * HERO-03 regression: the hero LCP poster image is served as AVIF (under
 * 200 KB) to clients that send `Accept: image/avif` in the request
 * headers. Sharp (bundled with next@16.2.6) handles the content
 * negotiation via the images.formats config in next.config.ts.
 *
 * Two assertions in one spec file:
 *   1. AVIF content-type + sub-200KB body when Accept includes image/avif
 *   2. The migrated <Image> emits fetchpriority="high" on the rendered <img>
 *      (Next 16: `preload` prop + `fetchPriority="high"` replaces deprecated `priority`)
 */
test.describe("HERO-03: hero poster AVIF negotiation", () => {
  test("AVIF served on Accept: image/avif and content-length < 200 KB", async ({ page }) => {
    // Send the Accept header BEFORE navigation so /_next/image picks AVIF.
    await page.setExtraHTTPHeaders({
      Accept: "image/avif,image/webp,image/png,*/*",
    });

    // Wait for the optimized hero poster response. The /_next/image
    // request URL contains the original `src` path encoded in `url=`,
    // so we filter on `homepage-hero-start`.
    const responsePromise = page.waitForResponse(
      (res) => {
        const url = res.url();
        return url.includes("/_next/image") && url.includes("homepage-hero-start");
      },
      { timeout: 10_000 }
    );

    await page.goto("/");
    const response = await responsePromise;

    expect(response.status(), "expected 2xx from /_next/image").toBeLessThan(400);

    const contentType = response.headers()["content-type"] ?? "";
    expect(
      contentType,
      `expected AVIF content-type, got: ${contentType}`
    ).toContain("image/avif");

    const buffer = await response.body();
    expect(
      buffer.byteLength,
      `AVIF poster is ${buffer.byteLength} bytes; HERO-03 budget is 200000 bytes`
    ).toBeLessThan(200_000);
  });

  test("hero <Image> rendered <img> has fetchpriority=\"high\" (Next 16 LCP hint)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // The LCP <Image> is the first <img> inside the homepage-hero section's
    // startFrameRef wrapper. Next 16 emits the `fetchPriority` JSX prop
    // as the HTML `fetchpriority` attribute (lowercase) on the rendered <img>.
    const heroImg = page.locator("section[data-slot=homepage-hero] img").first();
    await expect(heroImg, "expected to find the hero <Image>'s rendered <img>").toBeVisible();

    const fetchPriority = await heroImg.getAttribute("fetchpriority");
    expect(
      fetchPriority,
      `expected fetchpriority="high" on hero <Image>, got: ${fetchPriority}`
    ).toBe("high");

    // Bonus belt-and-braces: confirm a <link rel="preload" as="image">
    // for the hero is in <head> (next/image emits this for `preload` prop).
    const preloadLink = page.locator(
      'head link[rel="preload"][as="image"]'
    );
    await expect(
      preloadLink,
      "expected next/image to emit <link rel=preload as=image> in <head>"
    ).not.toHaveCount(0);
  });
});
