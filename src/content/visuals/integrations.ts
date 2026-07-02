/**
 * /platform/integrations visual payload (Plan 14-03, Task 1).
 *
 * One Schematic system/network map for the ProductVisualBand slot on
 * /platform/integrations, per the approved 14-ARCHETYPE-MAP.md (D-01 lift):
 * the flat IntegrationTable rows are a platform-name inventory; they cannot
 * draw the SHAPE of the flow. This Schematic advances that argument:
 *   system of record (SAP / Oracle ERP · billing / CIS)
 *     -> dPlat routing engine
 *       -> recovery vendors (collection agencies · law firms · recovery vendors)
 *         -> reconciliation sink (recovered and reconciled to the source system)
 * with labeled, bidirectional-in-spirit edges (placement files out; status,
 * payments, and reconciliation back). System-consistent with the
 * PlatformSystemMap precedent. chart-1 (indigo) carries the dPlat engine node.
 *
 * Distinctness (the 14-page-elevation spec asserts these verbatim, sourced from
 * 14-ARCHETYPE-MAP.md "Per-route distinctness strings"): the payload carries
 * "system of record" (the source node label) and "recovery vendors" (the vendor
 * pool node label). Neither appears in the IntegrationTable platform-name rows,
 * so a copy-pasted or decorative payload fails the assertion.
 *
 * Real-shaped raw material (src/content/integrations.ts): 60+ production
 * integrations across 16 platform types; SAP + Oracle ERP + billing / CIS
 * systems of record; 538 collection agencies, law firms, and recovery vendors
 * on the back end. All figures anonymized, generic, real-shaped.
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim (integration counts,
 * platform-type count, vendor-network size). Real-shaped, anonymized, generic;
 * Andrew pre-cleared 2026-06-12 (project memory). Tag retained for audit
 * traceability, non-blocking this phase. No named clients, no client logos.
 *
 * [COI REVIEW] The routing captions and ariaSummary reference the originator's
 * recovery vendor network. Framing stays agency-network-agnostic per CLAUDE.md
 * §6 ("routes across the originator's existing vendors"); no claim positions
 * dPlat as structurally separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { SchematicData } from "./types";

/** Schematic system/network map: how dPlat connects the system of record to the
 *  recovery vendor network and reconciles the result. Source -> engine -> vendor
 *  pool -> reconciliation sink, with labeled edges. */
export const integrationsSystemMap = {
  eyebrow: "HOW ROUTING WORKS",
  title: "How dPlat connects your systems to your vendors",
  nodes: [
    {
      id: "sor",
      label: "System of record",
      // NBSP around "/" (billing / CIS) keeps "CIS" from wrapping onto
      // its own line as an orphan in the narrow 4-column schematic grid; same
      // words and punctuation as the approved copy, layout-only whitespace fix.
      sub: "SAP · Oracle ERP · billing / CIS",
      kind: "source",
    },
    {
      id: "engine",
      label: "dPlat routing engine",
      sub: "60+ integrations · 16 platform types",
      kind: "engine",
    },
    {
      id: "vendors",
      label: "Recovery vendors",
      sub: "Collection agencies · law firms · 538 partners",
      kind: "vendor",
    },
    {
      id: "sink",
      label: "Recovered and reconciled",
      sub: "Balances reconcile back to the source system",
      kind: "sink",
    },
  ],
  edges: [
    { from: "sor", to: "engine", label: "Placement files", flow: true },
    { from: "engine", to: "vendors", label: "Routed to the network", flow: true },
    { from: "vendors", to: "engine", label: "Status · payments", flow: true },
    { from: "engine", to: "sink", label: "Reconciliation" },
  ],
  ariaSummary:
    "System map for how dPlat connects your systems to your recovery vendors. The system of record (SAP, Oracle ERP, and billing or CIS platforms) sends placement files into the dPlat routing engine, which spans over 60 production integrations across 16 platform types. dPlat routes each account across the originator's existing recovery vendors, a network of 538 collection agencies, law firms, and recovery vendors, with no vendor portal in between. Status updates and payments flow back to the engine, and recovered balances reconcile back to the source system.",
} satisfies SchematicData;
