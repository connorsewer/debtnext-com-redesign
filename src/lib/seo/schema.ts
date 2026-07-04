import { homepageMeta } from "@/content/homepage";
import { orgFacts } from "@/content/org";

/**
 * Schema.org JSON-LD builders. Each returns a plain object serialized by
 * <JsonLd>. All facts trace to src/content/org.ts (sourced, not invented).
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgFacts.name,
    legalName: orgFacts.legalName,
    url: orgFacts.url,
    // No dedicated logo asset ships yet; the generated OG image route is the
    // only branded raster we own, so it doubles as the org logo.
    logo: `${orgFacts.url}/opengraph-image`,
    // One-sentence entity description built from org.ts facts (founded 2003,
    // dPlat, TSI parent). Helps AI-search entity resolution.
    description: `${orgFacts.name} builds ${orgFacts.product.name}, recovery management software for credit originators, and has since ${orgFacts.foundingDate}. A ${orgFacts.parent.name} company.`,
    foundingDate: orgFacts.foundingDate,
    // [COI REVIEW] TSI ownership + LinkedIn as the org's sameAs profiles.
    // Pre-cleared by Andrew for M6 (2026-06); marker retained for audit.
    sameAs: orgFacts.sameAs,
    parentOrganization: {
      "@type": "Organization",
      name: orgFacts.parent.name,
      url: orgFacts.parent.url,
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: orgFacts.product.name,
    applicationCategory: orgFacts.product.applicationCategory,
    operatingSystem: orgFacts.product.operatingSystem,
    description: homepageMeta.description,
    // featureList sourced from the dPlat SoftwareApplication schema package
    // (TSI-CORPUS-RECON-DIGEST-2026-07-04 §E item 1).
    featureList: [
      "Vendor management and performance scorecards",
      "Assignment and placement strategy engine",
      "Compliance workflow automation",
      "Audit trail and regulatory reporting",
      "Debt sale management",
      "Portfolio analytics and segmentation",
      "Real-time dashboards",
      "API integration with servicing and billing systems",
    ],
    publisher: {
      "@type": "Organization",
      name: orgFacts.name,
      url: orgFacts.url,
    },
    // Enterprise sale: quote-based, no public price. No invented amount.
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
      },
      availability: "https://schema.org/InStock",
    },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Request a demo",
    url: `${orgFacts.url}/demo`,
    mainEntity: {
      "@type": "Organization",
      name: orgFacts.name,
      url: orgFacts.url,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Sales",
        areaServed: orgFacts.areaServed,
      },
    },
  };
}

export interface BreadcrumbItem {
  /** Visible label for the crumb (e.g. "Platform"). */
  name: string;
  /** Absolute or root-relative path for the crumb (e.g. "/platform"). */
  path: string;
}

/**
 * BreadcrumbList schema for nested routes. Pass the trail from Home down to
 * (and including) the current page. Paths are resolved against the org URL so
 * `item` is always an absolute URL, which is what search engines expect.
 */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${orgFacts.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
