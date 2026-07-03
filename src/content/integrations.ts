/**
 * /platform/integrations content — source: DebtNext_Integrations_Page_Copy
 * (approved external copy).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * Production note: per the source doc's review guidance, the proprietary-
 * systems category is described by industry, never by client name. Internal
 * governance notes and MOCKUP banners are omitted.
 *
 * [CLAIMS REVIEW] Andrew Budish to confirm the integration counts and the
 * scale metrics before launch.
 */

import type { IntegrationRow } from "@/components/sections/IntegrationTable";
import type { ProofStat } from "@/components/sections/ProofBand";

export const integrationsMeta = {
  title: "dPlat integrations: ERP, billing, CIS, and recovery platforms",
  description:
    "dPlat connects to SAP, Oracle, proprietary servicing systems, and recovery platforms credit originators already run. 60+ production integrations.",
  canonical: "https://debtnext.com/platform/integrations",
};

export const integrationsHero = {
  eyebrow: "Integrations",
  h1: "Plug into the systems credit originators actually run on.",
  body:
    "dPlat integrates with the enterprise platforms, billing engines, customer-service environments, and recovery workflows your portfolio already moves through. Over 60 production integrations across 16 platform types, with twenty years of integration patterns behind them.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};

// Logo wall (typographic chips, no image assets). Andy wanted recognizable
// systems scrolling under the hero CTA to credentialize the page.
export const integrationsLogos = {
  eyebrow: "Connected to the systems you already run",
  logos: [
    "SAP",
    "Oracle CC&B",
    "Oracle Utilities C2M",
    "Pega",
    "CSG",
    "ICOMS",
    "CACS",
    "Artiva",
    "CIS+",
    "CRS",
    "PCC",
    "dPlat-to-dPlat",
  ],
};

export const integrationsFootprint: {
  eyebrow: string;
  heading: string;
  stats: ProofStat[];
  notes: string[];
} = {
  eyebrow: "The footprint",
  heading: "What dPlat connects to today.",
  stats: [
    { number: "60+", label: "Production integrations" },
    { number: "16", label: "Platform types" },
    { number: "538", label: "Agency and legal partners integrated" },
    { number: "Since 2003", label: "In continuous production" },
  ],
  notes: [
    "The concentration sits in the systems large credit originators actually use to bill, service, and manage customer accounts. SAP and Oracle utility environments alone account for 34 active integrations. Add proprietary servicing platforms and dPlat already covers most of the footprint an enterprise originator needs.",
    "Past the enterprise systems, dPlat is integrated on the back end with 538 collection agencies, law firms, and recovery vendors. Placement files, status updates, payments, and reconciliation move between dPlat and your network directly, with no vendor portal in between.",
    "For your engineering team, that means most of the integration work has already been done. The patterns, the field mappings, the reconciliation logic, and the exception handling are built, tested, and deployed against production volumes.",
  ],
};

export const integrationsErp: {
  eyebrow: string;
  heading: string;
  body: string;
  rows: IntegrationRow[];
  footnote: string;
} = {
  eyebrow: "Enterprise and ERP",
  heading: "Enterprise and ERP integrations.",
  body:
    "The largest concentration of dPlat deployments lives inside enterprise resource planning environments. Utility billing engines and ERP-class platforms run on these systems, and dPlat is already inside them at production scale.",
  rows: [
    { platform: "SAP", category: "Enterprise ERP" },
    { platform: "Oracle CC&B", category: "Utility CIS" },
    { platform: "Oracle Utilities C2M", category: "Utility CIS" },
    { platform: "CR Software", category: "Collections" },
    { platform: "Artiva", category: "Collections" },
  ],
  footnote:
    "The bulk of these run inside large utility and telecom operations where SAP and Oracle handle billing, service requests, and customer-master data. dPlat reads placement files, applies your business rules, and pushes account status, payments, and reconciliation results back to those systems on schedule.",
};

export const integrationsCis: {
  eyebrow: string;
  heading: string;
  body: string;
  rows: IntegrationRow[];
} = {
  eyebrow: "Customer servicing and billing",
  heading: "Customer service and billing platforms.",
  body:
    "Traditional servicing and billing ecosystems used across utilities, telecom, and consumer financial services. These integrations pull placement and update files on a defined cadence, with field mapping customized for each source.",
  rows: [
    { platform: "ICOMS", category: "Cable/Telecom CIS" },
    { platform: "CSG", category: "Telecom billing" },
    { platform: "CSS", category: "Customer servicing" },
    { platform: "PCC", category: "Customer servicing" },
    { platform: "CRS", category: "Customer servicing" },
    { platform: "CIS+", category: "Utility CIS" },
    { platform: "CACS", category: "Collections" },
    { platform: "DPI", category: "Servicing" },
  ],
};

export const integrationsProprietary: {
  eyebrow: string;
  heading: string;
  body: string[];
  rows: IntegrationRow[];
} = {
  eyebrow: "Proprietary servicing platforms",
  heading: "Proprietary and custom systems.",
  body: [
    "Ten active dPlat integrations sit against proprietary or heavily customized client servicing platforms. These deployments take longer to scope than ERP-class integrations but run on the same architectural patterns: defined data exchange, mapped business rules, scheduled reconciliation, and bidirectional status updates.",
    "Client systems in this category include proprietary servicing platforms operated by Fortune 100 financial institutions, large investor-grade utilities, education-services networks, and consumer-products manufacturers.",
  ],
  rows: [
    { platform: "Proprietary servicing platforms", category: "Custom" },
  ],
};

export const integrationsRecovery: {
  eyebrow: string;
  heading: string;
  body: string;
  rows: IntegrationRow[];
} = {
  eyebrow: "Recovery and workflow",
  heading: "Recovery and workflow platforms.",
  body:
    "Operational workflow and recovery management integrations. The dPlat-to-dPlat pattern is notable: a client running dPlat at their corporate placement layer with a recovery vendor also running dPlat at their operational layer, both instances exchanging placement, status, and reconciliation data.",
  rows: [
    { platform: "Pega", category: "Workflow/BPM" },
    { platform: "dPlat-to-dPlat", category: "Recovery" },
  ],
};

export const integrationsPatterns = {
  eyebrow: "How dPlat integrates",
  heading: "Integration patterns.",
  body:
    "dPlat supports the integration approaches enterprise IT teams already use. The choice is yours; the platform doesn't dictate it.",
  bullets: [
    "API integrations for real-time data exchange",
    "SFTP for scheduled, secured file movement",
    "Direct file exchange where security policy requires it",
    "Custom field mapping per source system",
    "Bidirectional updates: dPlat ingests placement files and returns account status, payments, and reconciliation results",
  ],
};

export const integrationsWhyMatters = {
  eyebrow: "Why integration history matters",
  heading: "What 60+ integrations tells you about scope and risk.",
  paragraphs: [
    "Most recovery software vendors have integrated with a handful of source systems. dPlat has done it more than 60 times across 16 platform types. That's a credibility check enterprise buyers can verify directly during evaluation.",
    "It also reduces real implementation risk. The integration patterns aren't being designed for the first time. That puts the timeline pressure on the parts of the project that always take real time: your team's availability, security review, and the source-system owner. Systems like SAP and Oracle CC&B have known data shapes that dPlat's existing mappings already account for. Exception handling, reconciliation breaks, and corner cases have surfaced and been solved against real production volumes.",
    "The implementation runway shortens. The unknowns shrink. The team you put on the project actually finishes it.",
  ],
};

// [CLAIMS REVIEW] Connor + Andrew to confirm exact framing on each metric.
export const integrationsProof: {
  eyebrow: string;
  heading: string;
  stats: ProofStat[];
} = {
  eyebrow: "At scale, in production",
  heading: "In production, at scale, since 2003.",
  stats: [
    {
      number: "116.8M+",
      label: "Active accounts under management",
      caption: "Across client portfolios",
    },
    {
      number: "$1.9B+",
      label: "Transactional dollars managed annually",
      caption: "Processed through the platform on behalf of clients",
    },
    {
      number: "20+ yrs",
      label: "In continuous production",
      caption: "Building recovery software since 2003",
    },
  ],
};

export const integrationsFinalCta = {
  heading: "See dPlat connected to your stack.",
  body:
    "A 30-minute walkthrough against your portfolio, your source systems, and your vendor mix. The people running the demo are the people who configure the platform.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
