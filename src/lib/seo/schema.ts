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
