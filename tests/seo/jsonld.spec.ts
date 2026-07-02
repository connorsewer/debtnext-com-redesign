import { test, expect } from "@playwright/test";

/**
 * SEO-02 / SEO-03 / SEO-04: structured data on the two routes that warrant
 * it. Parse every <script type="application/ld+json"> block, then assert the
 * expected @type set and required fields are present and well-formed.
 */

async function readJsonLd(
  page: import("@playwright/test").Page,
  route: string
): Promise<Record<string, unknown>[]> {
  await page.goto(route);
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(raw.length).toBeGreaterThan(0);
  return raw.map((text) => {
    let parsed: unknown;
    expect(() => {
      parsed = JSON.parse(text);
    }, `ld+json on ${route} must be valid JSON`).not.toThrow();
    return parsed as Record<string, unknown>;
  });
}

test.describe("SEO-02/03: homepage structured data", () => {
  test("/ exposes Organization + SoftwareApplication", async ({ page }) => {
    const blocks = await readJsonLd(page, "/");
    const byType = new Map(blocks.map((b) => [b["@type"], b]));

    const org = byType.get("Organization");
    expect(org, "Organization block present").toBeTruthy();
    expect(org?.["name"]).toBe("DebtNext");
    expect(org?.["legalName"]).toBe("DebtNext, LLC");
    expect(org?.["url"]).toBe("https://debtnext.com");
    expect(org?.["foundingDate"]).toBe("2003");
    expect(Array.isArray(org?.["sameAs"])).toBe(true);
    expect(org?.["sameAs"]).toContain("https://www.tsico.com");
    expect(org?.["sameAs"]).toContain(
      "https://www.linkedin.com/company/debtnext"
    );
    const parent = org?.["parentOrganization"] as
      | Record<string, unknown>
      | undefined;
    expect(parent?.["name"]).toBe("Transworld Systems Inc.");

    const app = byType.get("SoftwareApplication");
    expect(app, "SoftwareApplication block present").toBeTruthy();
    expect(app?.["name"]).toBe("dPlat");
    expect(app?.["applicationCategory"]).toBe("BusinessApplication");
    expect(app?.["operatingSystem"]).toBe("Web");
    expect(typeof app?.["description"]).toBe("string");
    expect((app?.["description"] as string).length).toBeGreaterThan(0);
    expect(app?.["offers"]).toBeTruthy();
  });
});

test.describe("SEO-04: demo structured data", () => {
  test("/demo exposes ContactPage with Sales contactPoint", async ({
    page,
  }) => {
    const blocks = await readJsonLd(page, "/demo");
    const contact = blocks.find((b) => b["@type"] === "ContactPage");
    expect(contact, "ContactPage block present").toBeTruthy();

    const entity = contact?.["mainEntity"] as
      | Record<string, unknown>
      | undefined;
    expect(entity?.["@type"]).toBe("Organization");

    const point = entity?.["contactPoint"] as
      | Record<string, unknown>
      | undefined;
    expect(point?.["contactType"]).toBe("Sales");
    expect(point?.["areaServed"]).toContain("US");
    expect(point?.["areaServed"]).toContain("CA");
  });
});
