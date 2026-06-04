# Content map: DebtNext.com

This document maps every page in the v1 site to its purpose, content sources, primary CTA, and approval gate. Use it as the index when working on copy or layout for any page.

## Site IA

```
/
├── /platform                          Platform overview
│   ├── /platform/placement            Placement Management
│   ├── /platform/optimization         Optimization Engine
│   ├── /platform/issues               Issues Management
│   ├── /platform/reporting            Reporting & Dashboards
│   └── /platform/integrations         Integration footprint (ERP, CIS, recovery)
├── /solutions                         Industries served
│   ├── /solutions/utilities           Utility recovery
│   ├── /solutions/financial-services  Financial services recovery
│   ├── /solutions/telecom             Telecom recovery
│   └── /solutions/fintech             Fintech recovery
├── /why-dplat                         Differentiation
├── /compare                           Named-platform comparison (rolls up under Why dPlat)
├── /resources                         Content hub (placeholder for v1)
├── /company                           About, TSI relationship, leadership
└── /demo                              Demo request form
```

v2 routes (out of scope for initial launch):
- `/platform/oversight`
- `/platform/media`
- `/platform/debt-sales`
- `/platform/legal-affidavit`
- `/resources/blog`, `/resources/case-studies`, `/resources/glossary`
- `/company/leadership`, `/company/careers`, `/company/press`

## Primary nav

| Label | Destination | Type |
|---|---|---|
| Platform | `/platform` | Dropdown (Placement, Optimization, Issues, Reporting, Integrations, All capabilities) |
| Solutions | `/solutions` | Dropdown (Utilities, Financial Services, Telecom, Fintech, All solutions) |
| Why dPlat | `/why-dplat` | Dropdown (Why dPlat, How dPlat compares → `/compare`, Integrations) |
| Resources | `/resources` | Direct link |
| Company | `/company` | Direct link |
| Request a demo | `/demo` | Primary CTA (filled pill) |

The `/compare` and `/platform/integrations` pages roll up under the Why dPlat
narrative in the nav. Integrations is cross-listed in the Platform dropdown
because its URL lives under `/platform`. On mobile, the nav shows top-level
routes only; both pages are reachable from the footer and from the homepage
(proof band → compare, integration strip → integrations).

The four `/solutions/<industry>` pages roll up under the Solutions dropdown.
They are also reachable from the footer Solutions group, the `/solutions`
parent industry cards, and the homepage industry trust band (each industry
label links to its solution page).

## Footer structure

| Group | Links |
|---|---|
| Platform | Placement, Optimization Engine, Issues, Reporting, Integrations, Compare platforms, All capabilities |
| Solutions | Utilities, Financial Services, Telecom, Fintech, All solutions |
| Company | About, Leadership, Careers, Contact |
| Resources | Blog, Case studies, Security, Compliance |
| Legal | Privacy, Terms, Cookies, Accessibility |

Footer bottom row: TSI ownership disclosure, copyright, social links (LinkedIn only for v1).

## Page-by-page index

### `/` (Homepage)

- **Purpose**: Position dPlat as a recovery management software platform. Drive demo requests.
- **Primary CTA**: Request a demo
- **Secondary action**: See how it works (scrolls to feature accordion)
- **Content source**: dPlat deck slides 2-3, RFP entries on company overview and platform differentiation
- **Sections**: Hero, trust band (industries served), feature accordion (5 capabilities), proof band, benefit deep-dive (decision engine), final CTA
- **Approvers**: Connor (visual), Andrew Budish (claims), Paul Goske (product accuracy)
- **Status flags**: `[CLAIMS REVIEW]` on the $1.5B/year and 60M+ accounts numbers

### `/platform` (Platform overview)

- **Purpose**: Show the full platform at a glance, with deep links to each capability page.
- **Primary CTA**: Request a demo
- **Content source**: dPlat deck slide 3 (positioning), slides 4-13 (modules)
- **Sections**: Hero, capability grid (9 modules), workflow visualization, integration ecosystem, final CTA
- **Approvers**: Connor, Paul Goske

### `/platform/placement` (Placement Management)

- **Purpose**: Detail how dPlat handles agency placement, recall, and decision engine logic.
- **Primary CTA**: Request a demo
- **Content source**: dPlat deck slide 4, RFP entries tagged "placement," "decision engine"
- **Sections**: Hero, how it works (3-step process strip), feature accordion (decision engine, recall logic, allocation matrix, business rules), product visual, final CTA
- **Approvers**: Paul Goske, Connor

### `/platform/optimization` (Optimization Engine)

- **Purpose**: Show how the optimization engine rewards high-performing vendors and adapts placement strategy.
- **Primary CTA**: Request a demo
- **Content source**: dPlat deck slide 6, RFP entries tagged "decision engine," "optimization"
- **Sections**: Hero, mechanism explainer, benefit split (with dashboard mockup), final CTA
- **Approvers**: Paul Goske, Connor

### `/platform/issues` (Issues Management)

- **Purpose**: Detail dispute, complaint, and exception handling workflow.
- **Primary CTA**: Request a demo
- **Content source**: dPlat deck slide 7, RFP entries tagged "issues," "disputes," "complaints"
- **Sections**: Hero, issue lifecycle (process strip), feature accordion (auto-handling, SLA enforcement, audit trail, agency portal), product visual, final CTA
- **Approvers**: Paul Goske, Andrew Budish (compliance language), Connor

### `/platform/reporting` (Reporting and Dashboards)

- **Purpose**: Show reporting framework, BI integration, and dashboard capabilities.
- **Primary CTA**: Request a demo
- **Content source**: dPlat deck slides 9-10, RFP entries tagged "reporting," "BI," "dashboards"
- **Sections**: Hero, dashboard gallery, BI integration explainer, custom reporting, final CTA
- **Approvers**: Paul Goske, Connor

### `/platform/integrations` (Integration footprint)

- **Purpose**: Validate, for IT and engineering evaluators, that dPlat already connects to the systems credit originators run on. Late-funnel reassurance on integration scope and implementation risk.
- **Primary CTA**: Request a demo
- **Content source**: `DebtNext_Integrations_Page_Copy.docx` (Andy Hannan integration footprint). Proprietary-systems category described by industry, never by client name, per the source doc's review guidance.
- **Sections**: Hero, footprint band (60+ / 16 / Since 2003), four integration tables with count-up (ERP, CIS, proprietary, recovery), integration patterns, why-it-matters prose, scale proof band, final CTA
- **Approvers**: Michael Orefice, Joe Laughlin (platform thesis), Andrew Budish (any third-party client references)
- **Status flags**: `[CLAIMS REVIEW]` on integration counts and scale metrics; no client names until written permission

### `/solutions` (Industries served)

- **Purpose**: Show that dPlat is proven across multiple regulated industries.
- **Primary CTA**: Request a demo
- **Content source**: dPlat deck slide 2 (industries proof), RFP entries by industry tag
- **Sections**: Hero, 4 industry cards (utilities, financial services, telecom, fintech), proof band, final CTA
- **Approvers**: Connor, Andrew Budish (no named clients without consent)
- **Child pages**: each industry card links to its `/solutions/<industry>` page.

### `/solutions/utilities`, `/solutions/financial-services`, `/solutions/telecom`, `/solutions/fintech` (Industry pages)

- **Purpose**: Industry-specific positioning for each vertical dPlat serves.
- **Primary CTA**: Request a demo. **Secondary**: See the platform (`/platform`).
- **Content source**: `DebtNext_Solutions_Pages_Copy.docx`. Authored as typed modules in `src/content/solutions-<industry>.ts`.
- **Sections**: Hero, 3 "what's different" cards, "how dPlat runs it" feature accordion (animated product visuals), proof (editorial prose band), regulatory framework list, final CTA.
- **Navigation**: reachable from the Solutions nav dropdown, the footer Solutions group, the `/solutions` parent cards, and the homepage industry trust band.
- **Excluded copy**: internal review/governance callouts, the named utility client (Philadelphia Gas Works) and its unverified 250% paydown figure, and any hard BNPL delinquency figure. Fintech BNPL framing stays directional.
- **Approvers**: Connor, Andrew Budish (compliance language and any client references).

### `/why-dplat` (Differentiation)

- **Purpose**: Explain what makes dPlat different from custom-built solutions, single-vendor agency systems, and legacy recovery software.
- **Primary CTA**: Request a demo
- **Content source**: RFP entry 1 (differentiators), RFP entries tagged "differentiator"
- **Sections**: Hero, 3 differentiator cards (specialization, configurability, network), comparison table, proof band, final CTA
- **Approvers**: Connor, Andrew Budish (comparative claims need review)
- **Status flags**: `[COI REVIEW]` on any claim about vendor neutrality

### `/compare` (Named-platform comparison)

- **Purpose**: High commercial intent. Help buyers actively evaluating named alternatives see where dPlat fits and where each competitor was built for and stops. Rolls up under the Why dPlat narrative.
- **Primary CTA**: Request a demo
- **Content source**: `DebtNext_Comparison_Page_Copy.docx` (Strategic Marketing landscape analysis). Names six competitors (NeuAnalytics, Convoke, C&R Software, Finvi, Symend, HighRadius) by their own public positioning. The Phase-2 `/compare/[competitor]` subpages are not built; that section is omitted from the live page.
- **Sections**: Hero, 2026 market context, comparison matrix (platforms as rows, dPlat highlighted, staggered reveal), differentiators, team behind the platform (leadership table with tenure count-up + service pillars), where dPlat works best, scale proof band, final CTA
- **Approvers**: Andrew Budish (competitive comparison language), Michael Orefice, Joe Laughlin (platform thesis)
- **Status flags**: `[CLAIMS REVIEW]` on competitive scope, leadership tenure, and scale metrics

### `/resources` (Content hub, v1 placeholder)

- **Purpose**: Hold the place for the future content engine. Light page in v1.
- **Primary CTA**: Request a demo
- **Content source**: Connor's editorial plan (TBD)
- **Sections**: Hero, 3 placeholder content cards (blog, case studies, security center), newsletter signup (or "coming soon"), final CTA
- **Approvers**: Connor

### `/company` (About, TSI relationship, leadership)

- **Purpose**: Tell the dPlat story, disclose TSI ownership cleanly, introduce leadership.
- **Primary CTA**: Request a demo
- **Content source**: RFP entry 3 (company overview), RFP entry 2 (leadership team), dPlat deck slide 2
- **Sections**: Hero (who we are), founding story, TSI ownership section, leadership team, locations, final CTA
- **Approvers**: Connor, Andrew Budish (TSI disclosure language), Joe Laughlin (corporate framing)
- **Status flags**: `[COI REVIEW]` on the TSI section

### `/demo` (Demo request)

- **Purpose**: Capture qualified demo requests. Push to Zoho CRM.
- **Primary CTA**: Submit (form action)
- **Content source**: Sarah's qualifier rubric
- **Sections**: Hero (what to expect), demo form, what happens next (3-step strip), security reassurance
- **Approvers**: Connor, Sarah Sanchez-Anderson (form fields), Austin Johnson (Zoho integration)

## Content source quick-reference

| Source | Path | Use for |
|---|---|---|
| Solution overview deck | `source-materials/dPlat_Solution_Overview_v04232026.pptx` | Module positioning, IA, capability descriptions |
| RFP answer library | `source-materials/DebtNext_entries.xlsx` | Operational detail, compliance language, capability depth |
| Design spec | `DESIGN.md` | All visual and interaction decisions |
| Mercury reference | mercury.com | Visual benchmark only; do not copy copy or imagery |

## Approval gate quick-reference

| Approver | What they own |
|---|---|
| Connor Laughlin | All copy, visual direction, CTA decisions, launch readiness |
| Andrew Budish | Compliance language, regulatory claims, named-client usage, TSI disclosure language, COI-sensitive copy |
| Joe Laughlin | Corporate framing, TSI relationship positioning |
| Michael Orefice | High-level brand alignment with TSI GTM |
| Paul Goske | Product accuracy on every platform page |
| Rob Novosel, Frank Ellenberger | Technical depth, integration claims |
| Sarah Sanchez-Anderson | Demo form fields, lead qualifier alignment |
| Austin Johnson | Zoho CRM integration, form-to-pipeline flow |
| Jeremiah Benes | DNS, GA4/GTM setup, technical SEO |

## Open content questions (resolve before content lock)

1. **Industries proof framing**: deck says "9 of 10 largest US utility companies" (can we use this externally with Andrew's sign-off), or do we need to soften to "major US utility providers"?
2. **The $1.5B figure**: RFP entry says "approximately $1.5 billion in payments on an annual basis for our clients." Use as-is, or attribute to platform throughput?
3. **40% media fulfillment reduction**: deck slide 8. Andrew needs to approve as performance claim with qualifier ("up to 40% reduction observed in client deployments").
4. **TSI ownership masthead**: footer-only, or also a small "a TSI company" tag near the dPlat wordmark in the header?
5. **Press / news**: do we link to TSI news (DebtNext acquisition, Clearlake backing) or keep that off the dPlat marketing site entirely?
6. **Customer logos**: any logos we can use with written consent? If not, the proof band uses industry categories instead of logos for v1.
