---
phase: 11-platform-deep-dive-visuals
plan: 03
subsystem: platform-deep-dive-visuals
tags: [platform-visuals, archetypes, explorable, issues, a11y, cls]
requires:
  - "11-01: locked archetype API, Explorable shell, FeatureAccordion.visuals, FlagshipSkeleton min-h-[44rem], reduced-motion data-parity assertion shape"
  - "11-02: latest reference flagship + page-wiring pattern (optimization)"
provides:
  - "/platform/issues renders real archetype visuals on all 5 accordion items"
  - "issues Explorable-composed flagship (label-paired status, D-05 parity)"
  - "5 typed, governed issues payloads + flagship payload in the visuals barrel"
  - "ConsoleRow.align? optional additive field (D-08) for two-sided message threads"
  - "platform-visuals spec covers /platform/issues incl. reduced-motion data-parity"
affects:
  - "src/content/visuals/types.ts (additive optional field only)"
  - "src/content/visuals/index.ts (append-only)"
  - "src/components/product/visuals/lazy.tsx (append-only)"
  - "tests/responsive/platform-visuals.spec.ts (append-only)"
tech-stack:
  added: []
  patterns:
    - "Explorable-composed Console archetype fed a typed payload (mirrors PlacementFlagship / OptimizationFlagship)"
    - "Status shown as a text label paired with a decorative dot (Pitfall 8), never color alone"
    - "Lazy flagship reuses the 11-01-locked FlagshipSkeleton (min-h-[44rem]) for CLS-free chunk resolve"
key-files:
  created:
    - "src/content/visuals/issues.ts"
    - "src/components/product/visuals/IssuesFlagship.tsx"
  modified:
    - "src/content/visuals/types.ts"
    - "src/content/visuals/index.ts"
    - "src/components/product/visuals/lazy.tsx"
    - "src/app/platform/issues/page.tsx"
    - "tests/responsive/platform-visuals.spec.ts"
decisions:
  - "Adopted the candidate D-08 ConsoleRow.align? optional field for the vendor-portal message thread; it is additive, optional, backward-compatible, and the default flat Console render ignores it (existing payloads stay green)."
  - "Flagship metric cells (SLA adherence 97.4%, average resolution 3.2h, auto-resolved 64%) are carried as Console pills so they render by default (D-05) without re-introducing IssuesWorklist's bespoke MetricCell grid."
  - "Spec flagshipValues use the worklist title + 'On time' status label so the existing reduced-motion data-parity assertion exercises a status LABEL surviving prefers-reduced-motion."
metrics:
  duration: "~12 min"
  completed: "2026-06-05"
  tasks: 3
  files: 7
  commits: 3
---

# Phase 11 Plan 03: /platform/issues Deep-Dive Visuals Summary

Wired /platform/issues end to end against the 11-01-locked pattern: 5 typed, governed accordion payloads rendered through `FeatureAccordion.visuals`, and the IssuesWorklist BenefitSplit refactored into an `Explorable`-composed Console archetype with label-paired status and reduced-motion data-parity.

## What shipped

- **5 issues accordion payloads** (`src/content/visuals/issues.ts`), one per approved archetype:
  - `auto-handling` -> Console (regulated-condition rows with configured treatment + live "auto-handled" status)
  - `workflows` -> Schematic (custom issue type traveling created -> triaged -> auto / SLA-timed vendor action -> resolved)
  - `vendor-portal` -> Console (two-sided issue message thread, vendor and operator rows, using the new `align?` field)
  - `sla` -> Console (open-issue worklist with SLA timer bars + escalation)
  - `audit` -> Data-story (audit-event spark over a period + exportable annotation)
  - plus the **flagship Console payload** (active worklist + the three metric cells as pills) and per-issue detail.
- **Issues Explorable flagship** (`IssuesFlagship.tsx`): one `Explorable.Toggle`/`Explorable.Panel` per worklist issue; all worklist values and metric pills render by default; status is paired with a text label ("On time", "Warning", "Resolved", "Escalated"), never color alone; toggles are real keyboard-operable `<button>`s from the shell.
- **Lazy + page wiring**: `LazyIssuesFlagship` added to `lazy.tsx` reusing the 11-01-locked `FlagshipSkeleton` (`min-h-[44rem]` = 704px) so the chunk resolves with no layout shift; `/platform/issues` now passes a `visuals` map covering all 5 ids and the BenefitSplit swaps `LazyIssuesWorklist` -> `LazyIssuesFlagship`. Page stays a Server Component. `IssuesWorklist.tsx` retained (no longer imported here) for the Phase 13 audit.
- **Spec coverage**: appended the `/platform/issues` config to `PLATFORM_VISUAL_PAGES`; it inherits the archetype `role="img"` check, default-visible flagship values, keyboard-toggle parity, no-stuck-opacity, and reduced-motion data-parity assertions. flagshipValues include a status label so the data-parity assertion confirms the label survives `prefers-reduced-motion`.

## Shared files: appended, not rewritten

`index.ts`, `lazy.tsx`, and `platform-visuals.spec.ts` already carried placement + optimization. This plan appended the issues entries following the exact two-page pattern; no prior wiring was changed. `types.ts` received a single additive optional field.

## Deviations from Plan

None of substance. One in-scope authoring decision the plan explicitly deferred to authoring time: the candidate D-08 `ConsoleRow.align?` field. It was needed to express the vendor-portal two-sided thread cleanly, so it was added as an **optional, additive, backward-compatible** field (`align?: "start" | "end"`). The default flat Console render ignores it; `placement.ts` / `optimization.ts` `satisfies ConsoleData` stays green. tsc and eslint confirm.

## Governance

- `[CLAIMS REVIEW]`: 8 comments (>= one per numeric payload block) across all 5 payloads + flagship.
- `[COI REVIEW]`: 7 comments on regulatory/vendor framing (deceased / bankruptcy / SCRA captions, vendor-network routing). Andrew's D-10 clearance covers the framing; tags kept for audit, non-blocking this phase.
- No client names or logos (CLAUDE.md §15). No em dashes in any changed file. Sentence-case, digits, contractions per CLAUDE.md §5.

## Verification

- `npx tsc --noEmit` exits 0.
- `npx eslint` clean on all 7 changed files.
- Distinctness (D-02): each issues payload reads on its own data shape (condition rows, workflow state machine, two-sided thread, SLA timer worklist, audit spark) and is distinct from every placement / optimization payload.
- DEFERRED-TO-PREVIEW: `platform-visuals.spec.ts`, `reveal-fail-open.spec.ts`, `reduced-motion.spec.ts` run against a Vercel preview via `PLAYWRIGHT_BASE_URL` (next dev/start hang in this sandbox; the spec is preview-driven by design). Confirm the issues route passes, including the reduced-motion data-parity assertion on the "On time" status label.

## Known Stubs

None. Every accordion item and the flagship render real typed payloads; zero text-on-dark placeholders remain.

## Self-Check: PASSED

- FOUND: src/content/visuals/issues.ts
- FOUND: src/components/product/visuals/IssuesFlagship.tsx
- FOUND commit a069a29 (Task 1), bcd78ba (Task 2), 19c3bec (Task 3)
- tsc 0, eslint 0, no em dashes, all 5 accordion ids + flagship swap verified by grep
