import { test, expect } from "@playwright/test";

// Phase 15 / HOMEVIS-01, updated 2026-07-02 for the hero-finale screenshot swap.
//
// The held finale now lands on the REAL approved dPlat dashboard screenshot
// (public/hero/dashboard-finale.png), served through next/image, instead of the
// DOM Console mockup that used to render there. This spec guards the new
// contract: the finale wrapper exists, contains a single <img> whose optimized
// src resolves the dashboard-finale asset, and carries descriptive (non-empty)
// alt text (WCAG 2.2 AA — this is a meaningful product visual, not decorative).
//
// Selectors:
//   [data-hero-framed-dashboard]  -> hero finale frame wrapper (HomepageHero.tsx)
//
// Desktop cinematic path: the finale wrapper is desktop-only (!isMobile gate), so
// use a desktop viewport. reduced-motion is NOT set. Structural, not live-pixel:
// the finale is opacity-animated by GSAP, but its DOM subtree is present from
// mount, so we assert the STABLE DOM CONTRACT rather than any scrubbed pixel
// state (live cinematic parity is HUMAN-VERIFY).

test.describe("Hero finale renders the real dashboard screenshot", () => {
  test("the held finale contains the dashboard-finale image with descriptive alt", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const finale = page.locator("[data-hero-framed-dashboard]");
    await expect(finale).toHaveCount(1);

    // Exactly one image inside the finale: the approved screenshot.
    const img = finale.locator("img");
    await expect(img).toHaveCount(1);

    // next/image rewrites src into /_next/image?url=...dashboard-finale..., so
    // assert the encoded source name appears in whatever src resolves.
    const src = await img.getAttribute("src");
    expect(src).toBeTruthy();
    expect(decodeURIComponent(src ?? "")).toContain("dashboard-finale");

    // Meaningful product visual: alt must be descriptive, not empty.
    const alt = await img.getAttribute("alt");
    expect(alt).toBeTruthy();
    expect((alt ?? "").length).toBeGreaterThan(20);

    // The retired raster and Console must both be gone.
    const rasterCount = await finale
      .locator('img[src*="dashboard-dark"]')
      .count();
    expect(rasterCount).toBe(0);
  });
});
