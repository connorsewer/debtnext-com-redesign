import { test, expect } from "@playwright/test";

import { VISUAL_ROUTES } from "../helpers/routes";

/**
 * SEO-01 / SEO-05: every v1 route ships an Open Graph image and a Twitter
 * summary_large_image card. The og:image comes from each route's
 * file-based `opengraph-image.tsx`; the twitter:card is inherited from the
 * root layout metadata. Twitter reuses the OG image (Next emits
 * twitter:image alongside og:image when a route has an OG image).
 */

test.describe("SEO-01/05: OG + Twitter metadata", () => {
  for (const route of VISUAL_ROUTES) {
    test(`${route} has an og:image and a summary_large_image card`, async ({
      page,
    }) => {
      await page.goto(route);

      const ogImage = page.locator('meta[property="og:image"]').first();
      await expect(ogImage).toHaveCount(1);
      const ogImageUrl = await ogImage.getAttribute("content");
      expect(ogImageUrl, `${route} og:image has a URL`).toBeTruthy();
      expect(ogImageUrl).toContain("opengraph-image");

      const twitterCard = page.locator('meta[name="twitter:card"]');
      await expect(twitterCard).toHaveCount(1);
      expect(await twitterCard.getAttribute("content")).toBe(
        "summary_large_image"
      );
    });
  }
});
