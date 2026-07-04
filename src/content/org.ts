/**
 * Canonical organization facts for JSON-LD structured data.
 *
 * Every value here is sourced, not invented:
 * - legalName: SiteFooter copyright line ("DebtNext, LLC")
 * - foundingDate: company-about.ts ("since 2003")
 * - parent: CLAUDE.md §6 (wholly owned by Transworld Systems Inc.)
 * - linkedin: SiteFooter social link
 * - product: dPlat (CLAUDE.md flagship)
 *
 * No phone, email, or logo is asserted (none is approved for structured
 * data). Do not add fabricated contact points or ratings.
 */

const PRODUCTION_ORIGIN = "https://debtnext.com";

export const orgFacts = {
  name: "DebtNext",
  legalName: "DebtNext, LLC",
  url: PRODUCTION_ORIGIN,
  foundingDate: "2003",
  parent: {
    name: "Transworld Systems Inc.",
    url: "https://www.tsico.com",
  },
  sameAs: ["https://www.tsico.com", "https://www.linkedin.com/company/debtnext"],
  product: {
    name: "dPlat",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
  },
  areaServed: ["US", "CA"],
  // [CLAIMS] Channels sourced from live debtnext.com contact/company/careers pages.
  address: {
    streetAddress: "175 Montrose West Avenue, Suite 170",
    addressLocality: "Copley",
    addressRegion: "OH",
    postalCode: "44321",
    addressCountry: "US",
  },
  telephone: "+1-330-665-0400",
  email: {
    sales: "sales@debtnext.com",
    info: "info@debtnext.com",
    careers: "careers@debtnext.com",
  },
} as const;
