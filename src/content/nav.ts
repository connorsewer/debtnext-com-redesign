/**
 * Site navigation source — drives SiteHeader, MobileNav, and SiteFooter.
 * Routes mirror docs/content-map.md §"Primary nav" and §"Footer structure".
 */

export type NavLink = {
  label: string;
  href: string;
};

export const primaryNav: NavLink[] = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Why dPlat", href: "/why-dplat" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
];

/**
 * Platform subpages exposed in the desktop nav dropdown.
 * Mobile nav still shows just the top-level routes.
 */
export const platformSubNav: NavLink[] = [
  { label: "Placement Management", href: "/platform/placement" },
  { label: "Optimization Engine", href: "/platform/optimization" },
  { label: "Issues Management", href: "/platform/issues" },
  { label: "Reporting and Dashboards", href: "/platform/reporting" },
  { label: "Integrations", href: "/platform/integrations" },
  { label: "All capabilities", href: "/platform" },
];

/**
 * Industry solution subpages exposed in the desktop nav dropdown.
 * Mobile nav still shows just the top-level routes.
 */
export const solutionsSubNav: NavLink[] = [
  { label: "Utilities", href: "/solutions/utilities" },
  { label: "Financial Services", href: "/solutions/financial-services" },
  { label: "Telecom", href: "/solutions/telecom" },
  { label: "Fintech", href: "/solutions/fintech" },
  { label: "Insurance", href: "/solutions/insurance" },
  { label: "Healthcare and RCM", href: "/solutions/healthcare" },
  { label: "All solutions", href: "/solutions" },
];

/**
 * "Why dPlat" rollup dropdown. The proof-and-differentiation pages live here:
 * the overview, the named-platform comparison, and the integration footprint.
 */
export const whyDplatSubNav: NavLink[] = [
  { label: "Why dPlat", href: "/why-dplat" },
  { label: "How dPlat compares", href: "/compare" },
  { label: "Integrations", href: "/platform/integrations" },
];

/**
 * Company child pages exposed in the desktop nav dropdown.
 * Mobile nav still shows just the top-level routes.
 */
export const companySubNav: NavLink[] = [
  { label: "About", href: "/company/about" },
  { label: "Leadership", href: "/company/leadership" },
  { label: "Careers", href: "/company/careers" },
  { label: "Contact", href: "/company/contact" },
  { label: "Company overview", href: "/company" },
];

export const primaryCta: NavLink = {
  label: "Request a demo",
  href: "/demo",
};

export const footerGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Placement", href: "/platform/placement" },
      { label: "Optimization Engine", href: "/platform/optimization" },
      { label: "Issues", href: "/platform/issues" },
      { label: "Reporting", href: "/platform/reporting" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Compare platforms", href: "/compare" },
      { label: "All capabilities", href: "/platform" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Utilities", href: "/solutions/utilities" },
      { label: "Financial Services", href: "/solutions/financial-services" },
      { label: "Telecom", href: "/solutions/telecom" },
      { label: "Fintech", href: "/solutions/fintech" },
      { label: "Insurance", href: "/solutions/insurance" },
      { label: "Healthcare and RCM", href: "/solutions/healthcare" },
      { label: "All solutions", href: "/solutions" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Leadership", href: "/company/leadership" },
      { label: "Careers", href: "/company/careers" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      // Blog / Case studies / Security / Compliance all resolved to the same
      // /resources page; collapsed to one working link until those libraries
      // exist as distinct routes.
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

export const tsiOwnershipLine =
  "DebtNext is a TSI company.";
