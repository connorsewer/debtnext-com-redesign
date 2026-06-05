---
phase: 10-foundation
plan: 04
subsystem: visuals-payloads
tags: [motion, payloads, types, claims-review, coi-review]
requires: [10-02, 10-03]
provides:
  - "src/content/visuals/ typed payload home (ConsoleData / DataStoryData / SchematicData)"
  - "placementConsole reference payload proving ConsoleData against real PlacementMatrix data"
  - "src/content/visuals/index.ts barrel for pages + lazy archetype registry"
affects:
  - "Phase 11 archetypes render from these schemas"
  - "Phase 12 solutions payloads import these types"
  - "Phase 13 consolidation relies on ConsoleData covering both Placement consoles"
tech-stack:
  added: []
  patterns:
    - "Three explicit payload interfaces (no discriminated union, no type discriminator)"
    - "`satisfies ConsoleData` reference payload as compile-time schema validation"
    - "Numbers centralized in src/content/visuals/ with [CLAIMS REVIEW] markers"
key-files:
  created:
    - src/content/visuals/types.ts
    - src/content/visuals/placement.ts
    - src/content/visuals/index.ts
  modified: []
decisions:
  - "ConsoleData is slot-shaped (header/callout/columns/rows/pills) so it expresses both the multi-segment PlacementMatrix console and the single-value PlacementMockup console without baked constants"
  - "Three separate interfaces, no union VisualData type and no `type:` discriminator (10-RESEARCH Open Question 2)"
  - "SchematicData shipped PROVISIONAL (A2); hardened in Phase 11 against PlatformSystemMap + real how-it-works data"
  - "Pulse modeled as data (header.status.live) and rendered by the archetype via PulseDot (A1)"
metrics:
  duration: ~12m
  completed: 2026-06-05
---

# Phase 10 Plan 04: Typed visual payload model Summary

Typed per-context payload home `src/content/visuals/` with three explicit server-safe schemas (ConsoleData, DataStoryData, SchematicData), each carrying a required `ariaSummary`, plus a `satisfies ConsoleData` reference payload (`placementConsole`) that proves the schema expresses the real PlacementMatrix console with zero baked constants.

## What shipped

- `src/content/visuals/types.ts` — three explicit interfaces (no discriminated union, no `type` discriminator field). ConsoleData (+ BarSpec, ConsoleHeader, ConsoleCallout, ConsoleRow), DataStoryData (chart `kind` union incl. the `cards` variant that subsumes SolutionsIndustryCards), SchematicData (+ SchematicNode, SchematicEdge). Server-safe (no `"use client"`). SchematicData flagged PROVISIONAL (A2).
- `src/content/visuals/placement.ts` — `placementConsole` typed with `satisfies ConsoleData`, mapping the real PlacementMatrix data field-by-field (4 rows with multi-segment vendor-allocation bars, count-up trailing values, callout card, 3 stat pills). `[CLAIMS REVIEW]` on the numeric block; `[COI REVIEW]` on the vendor-network framing. A comment documents the both-implementations validation conclusion.
- `src/content/visuals/index.ts` — barrel re-exporting the types + the placement payload for pages and the lazy registry.

## Schema-validation result

**Does the authored placement payload satisfy ConsoleData?** Yes. `npx tsc --noEmit` exits 0 with the payload typed via `satisfies ConsoleData`, so every field is exact (no excess, no missing). The real PlacementMatrix rows, multi-segment allocation bars (`[40,35,25]`, `[45,35,20]`, `[60,40]`, `[55,45]`), count-up account totals (12,847 / 8,420 / 4,108 / 2,290), the "ready to route" callout, the column labels, and the three stat pills all map onto the schema with zero baked constants.

**Any field the PlacementMockup case could not express?** None. The same ConsoleData expresses the Mockup console:

- single-value pct rows → `bar.segments: [N]` (one entry instead of many);
- the "Inbound batch" KPI block → optional `header.kpi`;
- the always-on "Engine running" pulse → `header.status.live: true`, with the pulse rendered by the Console archetype via `<PulseDot>` (A1) and collapsing to a static dot under reduced motion.

So one slot-based ConsoleData covers both real Placement consoles. The Phase 13 fork risk (T-10-11) is closed at the schema level; the only open item is the A1 pulse-under-reduced-motion read, which is an archetype-render concern validated in Phase 11, not a schema gap.

## Tasks

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Author the three payload schemas | 83769b2 | src/content/visuals/types.ts |
| 2 | Validate ConsoleData + barrel | 1a53805 | src/content/visuals/placement.ts, src/content/visuals/index.ts |

## Verification

- `npx tsc --noEmit` exits 0 (the `satisfies ConsoleData` proves the payload fits the schema).
- `npx eslint src/content/visuals/` exits 0.
- grep confirms: 3 schemas, 3 required `ariaSummary: string`, no `VisualData =` union, `[CLAIMS REVIEW]` + `satisfies ConsoleData` in placement.ts, both-implementations conclusion comment, barrel re-exports types + payload, no `"use client"` in any file.
- Voice self-check on rendered copy (ariaSummary, captions, pills): 0 em dashes, no "not X, it's Y" / banned constructions, no banned phrases. (Em dashes were also removed from code comments so the whole file is `—`-free.)

## Governance flags raised

- `[CLAIMS REVIEW]` — all numeric values in `placement.ts` (placeholder, generic, illustrative; Andrew sign-off required before production), mirroring the existing PlacementMatrix.tsx convention.
- `[COI REVIEW]` — the callout, pills, and ariaSummary reference the customer's vendor network and routing. Language kept agency-network-agnostic (the platform routes across the originator's existing vendors); confirm framing with Andrew.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None. The numbers are deliberately illustrative placeholders carrying `[CLAIMS REVIEW]` (the established repo convention for product visuals pre-Andrew-sign-off), not unwired stubs. This is a foundation payload-model plan; the archetypes that consume these payloads land in Phase 11.

## Threat Flags

No new security surface introduced beyond the plan's threat model. T-10-09 (claims) and T-10-10 (COI) mitigations are applied via the `[CLAIMS REVIEW]` / `[COI REVIEW]` markers and the voice self-check; T-10-11 (schema fork risk) is mitigated by the validated reference payload and the documented Mockup-case coverage.

## Self-Check: PASSED

All created files exist on disk; both task commits (83769b2, 1a53805) are in the git log.
