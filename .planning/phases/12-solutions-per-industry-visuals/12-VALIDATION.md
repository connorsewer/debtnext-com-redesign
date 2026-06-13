---
phase: 12
slug: solutions-per-industry-visuals
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-12
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `@playwright/test` ^1.60.0 (+ `tsc --noEmit`, eslint, `next build`, LHCI in CI) |
| **Config file** | `playwright.config.ts` (existing); `lighthouserc.json`; `.github/workflows/perf.yml` |
| **Quick run command** | `npx tsc --noEmit && npx eslint <changed files>` (local; dev server unavailable in sandbox) |
| **Full suite command** | `npx playwright test` against `PLAYWRIGHT_BASE_URL` preview + LHCI via CI |
| **Estimated runtime** | ~60s quick; ~8 min full Playwright in CI; ~21 min LHCI |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit && npx eslint <changed files>` (+ `next build` when wiring changes)
- **After every plan wave:** Run `npx playwright test tests/responsive/solutions-visuals.spec.ts` against the preview (plus reduced-motion + reveal-fail-open specs when visuals changed)
- **Before `/gsd-verify-work`:** Full Playwright suite + axe + LHCI green in CI on the PR; `grep -rn "SolutionsIndustryCards" src/ | wc -l` → 0
- **Max feedback latency:** ~60s local; one CI round-trip (~25 min) for preview-gated checks

---

## Per-Task Verification Map

> Task-level rows are filled by the planner (per-task `<automated>` fields). Requirement-level contract below.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | — | 0 | SOLVIS-01 | — | N/A | static + e2e | `grep -rn "SolutionsIndustryCards" src/ \| wc -l` → 0; solutions-visuals spec asserts per-route industry-unique value strings | ❌ W0 | ⬜ pending |
| TBD | — | — | SOLVIS-02 | — | N/A | e2e | spec: per route, `ProductVisualBand` contains `role="img"` archetype with industry-specific aria-label/value strings | ❌ W0 | ⬜ pending |
| TBD | — | — | SOLVIS-03 | — | N/A | e2e | spec: mapped accordion item (or band) surfaces the Schematic's industry-specific ariaSummary fragment | ❌ W0 | ⬜ pending |
| TBD | — | — | SOLVIS-04 | — | N/A | e2e | spec: same shape for the mapped DataStory proof item | ❌ W0 | ⬜ pending |
| TBD | — | — | SOLVIS-05 | — | N/A | e2e | spec: per route, click `#feat-{id}-button` for all 3 items, assert `role="img"` non-empty label (catches the current homepage-registry fallback, which lacks `role="img"`) | ❌ W0 | ⬜ pending |
| TBD | — | — | D-14 parity | — | N/A | e2e | port `assertReducedMotionDataParity` + `assertNoStuckOpacity` (keep `iterations === Infinity` idle-guard) | ❌ W0 | ⬜ pending |
| TBD | — | — | D-13 perf | — | N/A | CI perf | LHCI on `/solutions/utilities` (already collected; TBT ≤ 300ms, CLS < 0.1, LCP < 2.5s) | ✅ | ⬜ pending |
| TBD | — | — | a11y | — | N/A | CI e2e | existing `axe-routes.spec.ts` + `touch-targets.spec.ts` over VISUAL_ROUTES | ✅ | ⬜ pending |
| TBD | — | — | typing | — | N/A | compile | `npx tsc --noEmit` (`satisfies` proofs on all 7 payload modules) | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/responsive/solutions-visuals.spec.ts` — covers SOLVIS-01..05 + D-14; per-route config `{ route, accordionItemIds, heroValues, industryUniqueStrings }` for 6 industry routes + hub; mirrors `platform-visuals.spec.ts` minus Explorable-toggle assertions (flagships not required per D-04). MUST assert industry-unique payload strings per route (cross-route distinctness), not mere archetype presence — the accordion-id collision with homepage `ACCORDION_VISUAL_IDS` means presence alone passes today's broken state.
- [ ] `12-ARCHETYPE-MAP.md` — the D-08 approval artifact (18 items + 6 heroes + hub + distinctness table) before any page work
- Framework install: none — all tooling exists

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Per-page visual quality review | CLAUDE.md §14 | Aesthetic judgment | Connor reviews each industry page on the Vercel preview |
| Archetype-map approval | D-08 | Distinctness is a design call | Review 12-ARCHETYPE-MAP.md distinctness table before page waves execute |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s local / 1 CI round-trip for preview-gated checks
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
