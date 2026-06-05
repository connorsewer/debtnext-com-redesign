/**
 * /platform/issues content — source: content/pages/issues.md
 * [COI REVIEW] preserved as comments. Andrew to review regulatory framing.
 */

import type { FeatureAccordionItem } from "@/components/sections/FeatureAccordion";
import type { ProcessStep } from "@/components/sections/ProcessStrip";

export const issuesMeta = {
  title: "Issues Management",
  description:
    "Resolve disputes, complaints, and account exceptions inside dPlat. SLA timers, configurable workflows, and full audit trails across your recovery vendor network.",
  canonical: "https://debtnext.com/platform/issues",
};

export const issuesHero = {
  eyebrow: "Issues Management",
  h1: "Resolve disputes, complaints, and exceptions in one place.",
  body:
    "Every dispute logged. Every SLA timed. Every action audited. dPlat's issues module gives your team and your recovery vendors a single workspace for resolving account-level problems, with automated handling for the conditions that need to move fast.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "Explore the platform", href: "/platform" },
};

// [COI REVIEW] Andrew to review framing on regulatory-exposure language.
export const issuesIntro = {
  heading: "Disputes and exceptions don't fit in email.",
  body:
    "When a consumer dispute, complaint, deceased indicator, or balance discrepancy lands on an account, the clock starts. Email threads and shared inboxes lose context, miss SLAs, and break audit trails. dPlat moves issue handling into a structured workflow with timers, ownership, and history.",
};

export const issuesProcess: {
  heading: string;
  steps: ProcessStep[];
} = {
  heading: "How an issue moves through dPlat.",
  steps: [
    {
      title: "Issue created",
      body:
        "A vendor, your team, or an automated rule creates an issue against an account. Issue type drives the workflow.",
    },
    {
      title: "Auto-handling fires",
      body:
        "For configured issue types (deceased, bankruptcy, SCRA, balance discrepancy), dPlat applies the account treatment you defined.",
    },
    {
      title: "SLA timer runs",
      body:
        "Every issue has an SLA window tied to its type. Timers surface in the worklist. Aging issues escalate based on your rules.",
    },
    {
      title: "Resolution and audit",
      body:
        "Resolution actions log against the issue. Media attached to the issue stays attached to the account. The full thread is auditable end to end.",
    },
    {
      title: "Account routes forward",
      body:
        "Issue type and resolution determine where the account goes next: back to vendor treatment, to a different tier, to permanent recall, or to a flagged status.",
    },
  ],
};

export const issuesAccordion: {
  heading: string;
  items: FeatureAccordionItem[];
} = {
  heading: "Issue handling, built for the conditions that matter.",
  items: [
    {
      id: "auto-handling",
      title: "Automated handling for regulated conditions",
      body:
        "Out-of-the-box issue types cover deceased, bankruptcy, SCRA, and other regulated states. When one of these conditions surfaces, dPlat applies your configured account treatment automatically (status change, vendor notification, recall action) without operator intervention. The auto-handling reduces exposure on conditions that need to move fast.",
      visualLabel: "Auto-handling configuration",
    },
    {
      id: "workflows",
      title: "Configurable workflows",
      body:
        "Beyond the standard set, define your own issue types with custom SLA windows, escalation rules, and account treatments. Workflows can be fully automated, fully manual, or hybrid depending on the issue type and your operational preference.",
      visualLabel: "Workflow editor with SLA configuration",
    },
    {
      id: "vendor-portal",
      title: "Vendor collaboration through the web portal",
      body:
        "Recovery vendors work issues from the same platform your team uses. Status updates, media attachments, and resolution notes flow into a shared audit trail. No email reconciliation required.",
      visualLabel: "Issue thread with vendor and operator messages",
    },
    {
      id: "sla",
      title: "SLA enforcement",
      body:
        "Every issue has a target resolution window tied to its type. Timers surface in the worklist. Aging issues route to escalation based on your rules. Compliance teams can audit SLA adherence by vendor, issue type, or time period.",
      visualLabel: "SLA worklist with timer badges",
    },
    {
      id: "audit",
      title: "Full audit trail",
      body:
        "Every interaction on every issue is timestamped, attributed, and recorded. Audit logs export for regulatory review or internal compliance audits. Issue history follows the account through every placement.",
      visualLabel: "Audit log timeline view",
    },
  ],
};

// [COI REVIEW] Andrew to confirm 'regulators' framing.
export const issuesBenefit = {
  heading: "Compliance evidence, not compliance theater.",
  body:
    "Regulators and internal compliance teams want to see how disputes and regulated conditions were handled. dPlat produces the evidence as a byproduct of the workflow. Audit logs, SLA reports, and resolution histories are queryable without a forensic exercise.",
  bullets: [
    "Every issue carries its full history with the account through every placement",
    "Vendor compliance to your SLAs is measurable and exportable",
    "Regulated conditions surface as exceptions automatically, not when someone notices",
  ],
};

export const issuesFinalCta = {
  heading: "See issue handling against your real workflow.",
  body:
    "Bring a recent dispute or exception scenario to the demo. We'll show you how dPlat would handle it.",
  primaryCta: { label: "Request a demo", href: "/demo" },
};
