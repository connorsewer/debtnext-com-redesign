# Phase 11 archetype-mapping table (D-03 deliverable)

**Authored:** 2026-06-05 (Plan 11-01, Task 1)
**Status:** Awaiting Connor approval (Task 2 checkpoint)
**Decision basis:** D-01 (archetype fits content meaning), D-02 (every item reads distinctly), D-09 (real-shaped anonymized numbers).

This table covers all 19 FeatureAccordion items across the 4 platform deep-dive
pages. Item ids are verified against `src/content/{placement,optimization,issues,reporting}.ts`.
Archetypes are one of Console / Data-story / Schematic. Each one-line intent names
the concrete data shape so no two visuals read alike (D-02), refined from each
item's body copy (not the indicative CONTEXT.md read).

## Mapping table

| Page | Item id | Archetype | One-line payload intent |
|---|---|---|---|
| placement | decision-engine | Console | Rule-evaluation console: account attributes (balance, age, disconnect reason, jurisdiction) scoring against tier rules, with a live rule count and a "routing now" callout. Reuses the existing `placementConsole`. |
| placement | vendor-pools | Schematic | Pool-composition flow: 5 treatment-stage pool nodes (pre-collect, primary, secondary, tertiary, specialty) each fed by allocation-share edges from a single placement source, vendor counts per pool. |
| placement | recall | Schematic | Recall-cascade flow: a tier chain where a closed recall window edge routes accounts from one tier node to the next, labeled with per-tier window lengths (30, 60, 90, 120 day). |
| placement | business-rules | Console | Rule-hierarchy console: 3 override rows (platform default, tier override, vendor override) for commission, settlement threshold, and plan length, with the resolved value trailing each row. |
| placement | reconciliation | Data-story | Reconciliation proof: a spark of 7 daily reconciliation runs with a match-rate annotation and an exception count, teaching "balances reconcile daily, exceptions surface". |
| optimization | bands | Data-story | Performance-band bars: liquidation-percentage bars for 4 vendors against a high/mid/low band threshold annotation, teaching "performance sorts into bands you define". |
| optimization | share | Console | Share-adjustment console: vendor rows showing current share, a shift trailing value (up/down per cycle), and cap/floor pills, teaching "share moves inside caps you authorize". |
| optimization | bonus | Console | Bonus-target console: pool rows each with a liquidation target bar, an achieved fill, and a bonus payout trailing value that pays when the target bar is met. |
| optimization | history | Data-story | Adjustment-trail cards: 4 dated optimization events (vendor, old share, new share, trigger metric), teaching "every adjustment is logged and reversible". |
| issues | auto-handling | Console | Auto-handling console: regulated-condition rows (deceased, bankruptcy, SCRA, balance discrepancy) each with a configured treatment and a live "handled automatically" status, teaching exposure-reducing automation. |
| issues | workflows | Schematic | Workflow-state flow: a custom issue type traveling created -> triaged -> SLA-timed -> resolved nodes with branch edges for automated vs manual handling. |
| issues | vendor-portal | Console | Issue-thread console: a single issue's message rows alternating vendor and operator, each with a timestamp and a media-attached indicator, teaching shared-workspace collaboration. |
| issues | sla | Console | SLA-worklist console: open-issue rows each with an issue type, an SLA timer bar (time remaining), and an escalation pill on aging rows, teaching enforced resolution windows. |
| issues | audit | Data-story | Audit-volume spark: a spark of timestamped audit events over a period with an "exportable for review" annotation, teaching "every interaction is recorded and queryable". |
| reporting | inventory | Console | Inventory console: open-inventory rows by treatment tier, each with an aging bar and an account-count trailing value, plus a portfolio liquidation-rate KPI. |
| reporting | vendor | Data-story | Vendor-comparison bars: liquidation-rate bars for 4 vendors within a pool, annotated with the pool's blended rate, teaching head-to-head vendor performance. |
| reporting | cost | Data-story | Cost-trend area: an area line of commission cost (or net-back) across 8 periods with a net-back annotation, teaching cost trended over time with commission modeling. |
| reporting | sla | Console | SLA-adherence console: vendor rows each with an adherence bar (percentage to your work standard) and an issue-resolution-time trailing value, teaching measurable vendor compliance. |
| reporting | activity | Data-story | Activity-breakdown bars: a bars chart of activity types (phones attempted, contacts, letters, settlements offered) by volume, teaching the configurable activity taxonomy. |

19 item rows. Archetype split: Console x9, Data-story x7, Schematic x3.

## Distinctness check (D-02)

No two intents share a data shape, within or across pages:

- The 9 Console payloads each carry a different row meaning: account-attribute scoring (decision-engine), 3-level override hierarchy (business-rules), vendor-share shifts (share), pool bonus targets (bonus), regulated-condition handling (auto-handling), an issue message thread (vendor-portal), an SLA timer worklist (sla / issues), a tier inventory list (inventory), and vendor SLA adherence (sla / reporting). The two `sla` items live on different pages and read differently (issue-timer worklist vs vendor-adherence bars), so they are not a repeat.
- The 7 Data-story payloads split across spark (reconciliation, audit), bars (bands, vendor, activity), cards (history), and area (cost). No two use the same chart kind with the same subject.
- The 3 Schematic payloads are a pool fan-out (vendor-pools), a tier cascade (recall), and a workflow state machine (workflows). Different node kinds and edge meanings.

## Schema-fit notes

For each item, whether an existing Phase 10 field expresses it, or a candidate
D-08 additive optional extension. All proposed extensions are additive optional
fields only; `placement.ts`'s existing `satisfies ConsoleData` stays green.

- **decision-engine (Console):** Fully expressed by existing `ConsoleData` (reuses `placementConsole`). No change.
- **vendor-pools (Schematic):** Expressed by `SchematicData` nodes + edges; `kind: "source" | "vendor"` and edge `label` carry allocation share. No change.
- **recall (Schematic):** Expressed by `SchematicData`; tier nodes chained by labeled edges (window length). `kind: "engine"` for the recall trigger. No change.
- **business-rules (Console):** Expressed by `ConsoleData` rows; the 3 override levels map to `primary` (level name) + `secondary` (rule) + `trailing` (resolved value). No change.
- **reconciliation (Data-story):** `chart.kind: "spark"` + `annotation`. No change.
- **bands (Data-story):** `chart.kind: "bars"` with per-vendor values; band threshold rides `annotation`. No change.
- **share (Console):** Rows with `trailing.animate: "shift"` express the per-cycle delta; cap/floor ride `pills`. No change.
- **bonus (Console):** Target bar via `bar` (single-segment fill vs target), payout via `trailing`. No change.
- **history (Data-story):** `chart.kind: "cards"` (dated adjustment cards). The card shape (`name/tag/value/sub`) carries vendor + trigger + old/new share. No change.
- **auto-handling (Console):** Rows with `header.status.live` and per-row `secondary` (treatment). No change.
- **workflows (Schematic):** State nodes + branch edges; `flow: true` animates the active path. No change.
- **vendor-portal (Console):** Message rows via `primary` (author) + `secondary` (message) + a media indicator. **CANDIDATE D-08:** message rows need an author-side hint (vendor vs operator) for visual alignment. If `secondary` + a tone pill cannot carry it cleanly during authoring, add an additive optional `ConsoleRow.align?: "start" | "end"` to `types.ts`. Decide at authoring time; default is to express with existing fields.
- **sla (issues, Console):** SLA timer via `bar` (time-remaining fill) + escalation via row context. No change.
- **audit (Data-story):** `chart.kind: "spark"` + `annotation`. No change.
- **inventory (Console):** Aging bar via `bar`, count via `trailing`, liquidation rate via `header.kpi`. No change.
- **vendor (Data-story):** `chart.kind: "bars"`. No change.
- **cost (Data-story):** `chart.kind: "area"` + `annotation`. No change.
- **sla (reporting, Console):** Adherence bar via `bar` (single-segment percentage), resolution time via `trailing`. No change.
- **activity (Data-story):** `chart.kind: "bars"`. No change.

Net: 18 of 19 items express with the Phase 10 schemas as-is. One candidate
additive extension (`ConsoleRow.align?`) is flagged for vendor-portal and decided
at authoring time; it is optional and non-breaking if added. This plan (11-01)
only authors the 5 placement payloads, none of which need the extension, so the
extension question lands in Wave 2 (11-03 issues) if at all.

## [CLAIMS REVIEW] / [COI REVIEW] surface

Per D-10, Andrew has pre-cleared real-shaped anonymized figures and vendor/TSI
framing for this phase. Tags below stay on the payloads for audit traceability;
they are not merge-blockers this phase. No named clients or client logos appear.

**[CLAIMS REVIEW] (carries numeric claims):** every item above carries figures,
so all 19 payloads carry a `[CLAIMS REVIEW]` comment. The numeric-claim weight
concentrates in: liquidation/performance percentages (bands, vendor, share,
bonus, inventory), cost/net-back figures (cost), SLA adherence percentages (sla
reporting), recovery-volume and account counts (decision-engine, inventory), and
reconciliation match rates (reconciliation).

**[COI REVIEW] (carries vendor/TSI framing):** captions touching the vendor
network or routing across vendors. Concentrated in: vendor-pools and recall
(routing across the originator's vendor network), share and bonus (rewarding
vendors), vendor-portal (recovery vendors collaborating), auto-handling and audit
(regulated-condition framing), vendor (reporting, cross-vendor comparison). All
framing stays agency-network-agnostic per CLAUDE.md §6 ("routes across the
originator's existing vendors"); no claim positions dPlat as structurally separate
from TSI's ARM business.

## Plan 11-01 scope note

This plan authors and wires the 5 **placement** payloads only (decision-engine,
vendor-pools, recall, business-rules, reconciliation) plus the placement
Explorable flagship. The optimization / issues / reporting rows above are the
approved intents that Wave 2 (Plans 11-02 / 11-03 / 11-04) authors against this
locked table.
