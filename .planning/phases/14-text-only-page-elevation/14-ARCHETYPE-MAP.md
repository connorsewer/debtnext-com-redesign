# Phase 14 archetype-mapping table (D-01 lift/no-lift decision record)

**Authored:** 2026-07-01 (Plan 14-01, Task 1)
**Status:** Awaiting Connor approval (Task 3 checkpoint)
**Decision basis:** D-01 (lift over coverage: a visual is added only where it advances the page's argument; a no-lift call is a deliberate decision, recorded, not an omission), D-02 (reuse the on-main archetype library, build nothing new), D-03 (CTA primacy: one filled "Request a demo" per band, motion below the CTA in visual weight), D-11 (accents from existing chart tokens only). Mirrors the approved Phase 12 D-08 map gate.

This map covers all 9 target routes. The operative discipline is RESTRAINT: most target pages already carry section-level scroll-reveal via the legacy `product/motion` barrel (`CardGrid`, `BulletList`, `CompareMatrix`, `ComparisonTable`, `ProcessStrip`, `IntegrationTable`, `LeadershipTable`, `IntegrationStrip` all self-animate), so several pages correctly get **nothing new**. Only two routes earn an archetype this phase: `/compare` and `/platform/integrations`. Each archetype row names the argument the visual advances that the prose/table does not (the D-01 lift bar, Pitfall 2). Each no-lift row names why a visual would be decoration.

## Governance surface (header)

- **`/compare` comparative claims:** live `[CLAIMS REVIEW]` + `[COI REVIEW]` surface. Comparative-claim copy additionally needs a **legal gate** (punch-list #4) beyond `[CLAIMS REVIEW]`; do not merge comparative-claim copy without it. The `/compare` DataStory contrast (dPlat time-to-production vs a typical 6-9 month build) is a comparative claim and carries both tags plus the legal gate.
- **`/company` TSI ownership section:** live `[COI REVIEW]` surface. The `/company` set is a no-lift set precisely so no visual or heavy motion buries or reframes the TSI ownership disclosure (D-01e, CLAUDE.md §6).
- Every payload module authored in Wave 2 (14-03) carries `[CLAIMS REVIEW]` / `[COI REVIEW]` header tags. Non-blocking per Andrew Budish's 2026-06-12 sign-off (D-04), retained for audit; flag both in the PR body.
- All routing/vendor framing stays agency-network-agnostic ("routes across the originator's existing vendors"); no claim positions dPlat as structurally separate from TSI's ARM business. No named clients or client logos.

## Per-route lift/no-lift table

| Route | Lift call | Slot | Payload intent (or no-lift rationale) | What argument the visual advances beyond the prose/table |
|---|---|---|---|---|
| `/compare` | **Archetype: DataStory** | `ProductVisualBand` | Time-to-production contrast: a `bars` (or `cards`) DataStory contrasting dPlat's already-in-production posture (integration patterns built and deployed since 2003) against a typical greenfield build's 6-9 month runway. dPlat side on `chart-1`; the "typical build" baseline on `chart-2` (muted). Annotation names the continuous-production point. `[CLAIMS REVIEW]` + `[COI REVIEW]` + legal gate. | The `CompareMatrix` table maps each platform's *scope* ("built for / chosen by / stops"). It says nothing about *time to production*. The DataStory advances a distinct, non-duplicative argument: dPlat is already running at production scale, so the buyer's implementation runway is short, where a competitor or a greenfield build is not. This is the strongest non-duplicative lift (RESEARCH Open Question 1). |
| `/platform/integrations` | **Archetype: Schematic (system/network map)** | `ProductVisualBand` | Source nodes (SAP / Oracle ERP, billing / CIS) → engine (dPlat routing) → vendor pool (collection agencies, law firms, recovery vendors) → sink (recovered / reconciled); labeled edges (placement files out, status / payments / reconciliation back). System-consistent with the `PlatformSystemMap` precedent. `chart-1` for the dPlat engine. | The `IntegrationTable` rows are a flat inventory of platform names and counts. They cannot show the *shape* of the flow: system-of-record → dPlat → 538-vendor network → reconciliation, with bidirectional edges. The Schematic advances the system-map argument the table rows cannot draw. No CTA competition. |
| `/why-dplat` | **Reveal-only (no new archetype)** | n/a (existing section motion) | The `CardGrid`, `ComparisonTable`, and `ProofBand` bands already animate via the legacy `product/motion` barrel. A proof DataStory would duplicate the figures the `ProofBand` stat row already carries, so it fails the D-01 lift bar (decoration, not argument). Confirmed no-lift. | n/a — a visual here would repeat the ProofBand figures. Reveal coverage stays; no figure the prose does not already state. |
| `/demo` | **Ambient / Reveal only (no archetype)** | n/a (`AmbientField` / existing reveal) | Never compete with the form submit CTA (D-01d). Atmosphere only, entrance motion only; no archetype, no competing figure. Pairs with the P14-01 / P14-02 form-a11y fixes in plan 14-02. | n/a — the page's job is the form submit; any archetype would compete with the single conversion CTA. |
| `/company` (hub) | **Reveal-only or nothing** | n/a | Hub sections (`CardGrid` / `ProofBand` / `BulletList`) already animate. The TSI ownership section must stay unobscured (D-01e, §6). No new archetype. Confirmed no-lift. | n/a — decoration risk against a live COI surface. |
| `/company/about` | **Reveal-only (already present)** | n/a | TSI ownership already wrapped in `RevealSection`; no new visual. Do not double-wrap self-animating sections (Pitfall 3). Confirmed no-lift. | n/a — TSI/COI section not to be obscured. |
| `/company/leadership` | **Reveal-only (already present)** | n/a | Already `RevealSection` ×2 plus `LeadershipTable` self-animates. Confirm coverage, no new archetype. | n/a. |
| `/company/careers` | **Reveal-only (already present)** | n/a | Already `RevealSection` ×1. Confirm, no new archetype. | n/a. |
| `/company/contact` | **Reveal-only (already present)** | n/a | Already `RevealSection` ×1. Confirm, no new archetype. | n/a. |
| `/resources` | **Reveal-only (no new archetype)** | n/a | Default Reveal-only: a DataStory on resource cards would be decoration (atmosphere, no argument the cards do not already carry). Confirmed no-lift. | n/a — a resource-card figure would repeat the card copy. |

**Archetype total this phase: 2 instances** (1 DataStory on `/compare`, 1 Schematic on `/platform/integrations`). Seven routes are deliberate no-lift (Reveal/Ambient/nothing), each recorded above with its rationale.

## Accent binding (D-11, no new colors)

Any archetype built this phase draws accents ONLY from `--chart-1` (`#5266EB`), `--chart-3` (`#10b981`), `--chart-4` (`#f59e0b`), `--chart-5` (`#06b6d4`). `--chart-2` (`#323649`) is near-canvas and reserved for baselines / grids / muted comparison, never a usable accent.

- **`/compare` (DataStory):** reserve `--chart-1` (indigo, the brand/dPlat series) for the dPlat side of the time-to-production contrast and `--chart-2` (muted) for the "typical build" baseline, so the argument survives grayscale (a longer muted baseline bar vs a short indigo dPlat bar reads without color).
- **`/platform/integrations` (Schematic):** `--chart-1` for the dPlat routing engine node; source and vendor / sink nodes use the near-canvas card fills with label-paired status per the DESIGN.md §4.1 status contract. Status colors are always label-paired (Pitfall 4).

No other color is introduced (CLAUDE.md §3, §16 stop-list).

## Distinctness / lift check (D-01, Pitfall 2)

**Archetype pages (the visual advances an argument the prose/table does not):**

- **`/compare` DataStory:** advances *time to production* — a temporal argument the scope-only `CompareMatrix` table never makes. dPlat is already in production; a greenfield build or a competitor is a multi-month runway. Not a restatement of any matrix cell.
- **`/platform/integrations` Schematic:** advances the *system-of-record → dPlat → vendor-network → reconciliation flow shape* — a directed diagram the flat `IntegrationTable` inventory cannot draw. Not a restatement of the platform-count rows.

**No-lift pages (a visual would be decoration):**

- **`/why-dplat`:** `CardGrid` / `ComparisonTable` / `ProofBand` already animate; a proof DataStory repeats the ProofBand figures. Decoration, not argument.
- **`/demo`:** any archetype competes with the single submit CTA. Ambient only.
- **`/company` set:** sections already animate; the TSI/COI disclosure must stay unobscured; a figure would repeat the page text.
- **`/resources`:** a resource-card DataStory repeats the card copy.

## Per-route distinctness strings

Payload-only unique substrings per ARCHETYPE route, sourced verbatim into the spec's `uniqueStrings`. Each is a payload-only string (a noun/label the archetype introduces), NOT a string that already appears in the page's table/prose copy, so a copy-pasted or decorative payload fails the assertion.

| Route | uniqueStrings | Why each is payload-only |
|---|---|---|
| `/platform/integrations` | `system of record`, `recovery vendors` | The `IntegrationTable` rows carry platform *names* (SAP, Oracle CC&B, Pega) and category labels; they do not carry the routing-diagram node labels "system of record" (the source node) or the "recovery vendors" sink-pool node label. Both are Schematic node/edge labels the table never renders. |
| `/compare` | `time to production`, `already in production` | The `CompareMatrix` table copy is scope language ("built for / chosen by / stops"); neither "time to production" nor "already in production" appears in the matrix or surrounding prose. Both are the DataStory's annotation/headline strings. (Not "digital journeys" and not any matrix cell text.) |

`/why-dplat` has NO distinctness strings because it is a no-lift Reveal-only route (no archetype). It is covered for reduced-motion + fail-open by the existing `reduced-motion.spec.ts` / `reveal-fail-open.spec.ts` nets, which already iterate `VISUAL_ROUTES`.

**AUDIT BL-01 note for the 14-03 executor:** `compare.ts:99` contains "digital journeys" (a banned construction, in the Symend `builtFor` cell). If `/compare` copy is touched when the DataStory payload lands, fix it in-line. The new DataStory payload must NOT reuse that string.

## Wave routing note

Plan 14-01 (this plan) authors this map and the gating `14-page-elevation.spec.ts` (RED until pages are wired). Wave 2 (plan 14-03) authors and wires the 2 approved payloads (`compareTimeline` DataStory, `integrationsSystemMap` Schematic) against this locked map; plan 14-04 relies on the recorded no-lift calls for the motion-confirm pass. No page work begins until Connor approves this map at the Task 3 checkpoint.
