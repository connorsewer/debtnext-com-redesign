import { test, expect } from "@playwright/test";

/**
 * HERO-03 regression: the hero LCP poster image is served as AVIF (under
 * 200 KB) to clients that send `Accept: image/avif,*\/*` in the request
 * headers. Sharp (bundled with next@16.2.6) handles the content
 * negotiation via the images.formats config in next.config.ts.
 *
 * Filled by 05-04-PLAN.md (HERO-03 AVIF poster). Stubbed for now.
 */
test.describe("HERO-03: hero poster AVIF negotiation", () => {
  test.skip("AVIF served on Accept: image/avif and content-length < 200000", async () => {
    // TODO (Plan 04):
    //   await page.setExtraHTTPHeaders({ Accept: "image/avif,image/webp,*/*" });
    //   const responsePromise = page.waitForResponse((res) =>
    //     res.url().includes("/_next/image") && res.url().includes("homepage-hero-start")
    //   );
    //   await page.goto("/");
    //   const response = await responsePromise;
    //   expect(response.headers()["content-type"]).toContain("image/avif");
    //   const buffer = await response.body();
    //   expect(buffer.byteLength, `AVIF poster is ${buffer.byteLength} bytes; budget is 200000`).toBeLessThan(200000);
    //
    //   // And confirm the <Image> migrated from priority to preload:
    //   const heroImg = page.locator("section[data-slot=homepage-hero] img").first();
    //   expect(await heroImg.getAttribute("fetchpriority")).toBe("high");
    expect(true).toBe(true);
  });
});
