---
phase: 14
slug: text-only-page-elevation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-01
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `@playwright/test` ^1.60.0 (+ `tsc --noEmit`, eslint, `next build`, axe-core, LHCI in CI) |
| **Config file** | `playwright.config.*` (root); `lighthouserc.json`; `.github/workflows/perf.yml`; route source `tests/helpers/routes.ts` |
| **Quick run command** | `npx tsc --noEmit && npx eslint <changed files>` (local; dev server unavailable in sandbox, D-07) |
| **Full suite command** | `npx playwright test` against `PLAYWRIGHT_BASE_URL` preview + axe + LHCI via CI |
| **Estimated runtime** | ~60s quick; ~8 min full Playwright in CI; ~21 min LHCI |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit && npx eslint <changed files>` (+ `next build` when wiring changes)
- **After every plan wave:** Run `npx playwright test tests/responsive/14-page-elevation.spec.ts` + `reduced-motion.spec.ts` + `reveal-fail-open.spec.ts` against the preview
- **Before `/gsd-verify-work`:** Full Playwright suite + axe + LHCI green in CI on the PR; P14-01/P14-02 resolved; `[CLAIMS REVIEW]`/`[COI REVIEW]` flagged in the PR (compare comparative claims → legal gate)
- **Max feedback latency:** ~60s local; one CI round-trip (~25 min) for preview-gated checks

---

## Per-Task Verification Map

> Task-level rows are filled by the planner (per-task `<automated>` fields). Requirement-level contract below.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | — | 0 | PAGEVIS-01 | — | N/A | e2e | `14-page-elevation.spec.ts`: `/compare` `role="img"` archetype, non-empty aria-label + compare-unique strings, on load AND under `reducedMotion:"reduce"` | ❌ W0 | ⬜ pending |
| TBD | — | — | PAGEVIS-02 | — | N/A | e2e | `14-page-elevation.spec.ts`: `/why-dplat` archetype-or-reveal assertion per the 14-ARCHETYPE-MAP decision | ❌ W0 | ⬜ pending |
| TBD | — | — | PAGEVIS-03 | — | N/A | e2e | existing `reduced-motion.spec.ts` + `reveal-fail-open.spec.ts` over `VISUAL_ROUTES` (already list `/company` set + `/resources`) + any map-added archetype rows | ✅ nets / ❌ new rows | ⬜ pending |
| TBD | — | — | PAGEVIS-04 | — | N/A | e2e | `14-page-elevation.spec.ts`: `/platform/integrations` Schematic + integrations-unique strings; `/demo` fail-open reveal only, submit CTA present | ❌ W0 | ⬜ pending |
| TBD | — | — | P14-01 | — | N/A | e2e (a11y) | trigger DemoForm validation; assert `aria-invalid="true"` + `aria-describedby="{id}-error"` on each errored field | ❌ W0 | ⬜ pending |
| TBD | — | — | P14-02 | — | N/A | manual + doc | visual review on preview; DESIGN.md §8.3 input-ring note lands in the same commit as any focus change | manual/doc | ⬜ pending |
| TBD | — | — | a11y | — | N/A | CI e2e | `axe-routes.spec.ts` + `touch-targets.spec.ts` over `VISUAL_ROUTES` (23 routes, AUDIT FIX-02) | ✅ | ⬜ pending |
| TBD | — | — | perf | — | N/A | CI perf | LHCI in `perf.yml` on representative routes (LCP < 2.5s, CLS < 0.1, content-route TBT ≤ 300ms) | ✅ | ⬜ pending |
| TBD | — | — | typing | — | N/A | compile | `npx tsc --noEmit` (`satisfies` proofs on new payload modules) | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `14-ARCHETYPE-MAP.md` — per-page lift/no-lift call + archetype + slot + payload intent + per-route distinctness strings; approval gate (Phase 12 D-08 precedent) BEFORE page work
- [ ] `tests/responsive/14-page-elevation.spec.ts` — per-route config `{ route, archetypeExpected, uniqueStrings[], revealOnly? }` for archetype pages (compare, integrations, any map-approved others); mirrors `platform-visuals.spec.ts` minus Explorable-toggle; asserts on load AND under reduced motion
- [ ] DemoForm a11y assertion (new test or extend `tests/a11y/`) covering P14-01
- Framework install: none — all tooling exists

*(reduced-motion + reveal-fail-open + axe + touch-target coverage for all 9 routes already exists via `VISUAL_ROUTES` iteration — no new wiring; they start exercising any new motion this phase adds.)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Input focus-ring consistency + DESIGN.md §8.3 documentation | P14-02 | Focus-ring aesthetics are a visual judgment; the doc change is prose | Tab through DemoForm + AttachedForm on the preview; confirm 3px `#9CB4E8` ring per DESIGN.md §8.3; confirm DESIGN.md documents the input-ring pattern |
| CLS skeleton sizing for any new archetype slot | PAGEVIS-01/04 (D-06) | Resolved-height vs skeleton-box comparison needs the rendered preview | On the preview, confirm each new archetype's resolved height ≤ its skeleton (`min-h-[20rem]` default; `FLAGSHIP_SKELETON_MIN_H` precedent for taller) with no visible layout shift |
| Lift-not-decoration judgment per page | D-01 | Editorial/design call | Connor reviews 14-ARCHETYPE-MAP.md and the preview per page |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s local / one CI round-trip for preview-gated checks
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
