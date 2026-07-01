import { test, expect } from "@playwright/test";

/**
 * P14-01 (plan 14-02): every errored DemoForm field must expose
 * aria-invalid="true" and aria-describedby="{id}-error" pointing at the
 * already-rendered <p id="{id}-error" role="alert"> message, so a
 * screen-reader user hears the field announced as invalid and hears the
 * error text. The honeypot websiteUrl input must stay untouched (no aria
 * wiring), so the bot trap is unchanged.
 *
 * Runs against PLAYWRIGHT_BASE_URL (the Vercel preview / local server).
 */
test.describe("DemoForm aria-invalid + aria-describedby on errored fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");
    // Submit the empty form to trigger zod validation on all required fields.
    await page.getByRole("button", { name: "Request a demo" }).click();
    // Wait for the first error message to render before asserting.
    await expect(page.locator("#firstName-error")).toBeVisible();
  });

  test("firstName exposes aria-invalid + aria-describedby and the error region exists", async ({
    page,
  }) => {
    const firstName = page.locator("input#firstName");
    await expect(firstName).toHaveAttribute("aria-invalid", "true");
    await expect(firstName).toHaveAttribute("aria-describedby", "firstName-error");

    const errorRegion = page.locator("#firstName-error");
    await expect(errorRegion).toHaveAttribute("role", "alert");
  });

  test("workEmail input and industry select both carry the aria wiring", async ({
    page,
  }) => {
    const workEmail = page.locator("input#workEmail");
    await expect(workEmail).toHaveAttribute("aria-invalid", "true");
    await expect(workEmail).toHaveAttribute("aria-describedby", "workEmail-error");

    const industry = page.locator("select#industry");
    await expect(industry).toHaveAttribute("aria-invalid", "true");
    await expect(industry).toHaveAttribute("aria-describedby", "industry-error");
  });

  test("the honeypot websiteUrl input has NO aria-invalid and NO aria-describedby", async ({
    page,
  }) => {
    const honeypot = page.locator("input#websiteUrl");
    const ariaInvalid = await honeypot.getAttribute("aria-invalid");
    const ariaDescribedby = await honeypot.getAttribute("aria-describedby");
    expect(ariaInvalid).toBeNull();
    expect(ariaDescribedby).toBeNull();
  });

  test("a field with no error carries neither aria-invalid nor aria-describedby", async ({
    page,
  }) => {
    // portfolioSize is optional; submitting empty produces no error for it,
    // so it must not receive the errored aria wiring.
    const portfolioSize = page.locator("select#portfolioSize");
    const ariaInvalid = await portfolioSize.getAttribute("aria-invalid");
    const ariaDescribedby = await portfolioSize.getAttribute("aria-describedby");
    expect(ariaInvalid).toBeNull();
    expect(ariaDescribedby).toBeNull();
  });
});
