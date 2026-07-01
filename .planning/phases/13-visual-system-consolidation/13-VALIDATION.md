---
phase: 13
slug: visual-system-consolidation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-12
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 13 validation = the regression-spec set stays green + byte-level confirmation the firewall files are unchanged.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (`@playwright/test`) + LHCI (perf) + axe-core (a11y) |
| **Config file** | `playwright.config.*` (repo root); `lighthouserc.json`; `.github/workflows/perf.yml` |
| **Quick run command** | `npx playwright test tests/responsive/platform-mobile.spec.ts tests/responsive/reduced-motion.spec.ts` |
| **Full suite command** | `npx playwright test` (all specs must stay green) |
| **Estimated runtime** | ~quick: ~30-60s; full suite several minutes (CI) |

> NOTE: `next dev`/`next start` HANG in this sandbox — run Playwright against `next build` output or the Vercel preview / CI, never a local dev server. `tsc --noEmit` and `eslint` DO run locally.

---

## Sampling Rate

- **After every task commit:** `npx playwright test tests/responsive/platform-mobile.spec.ts tests/responsive/reduced-motion.spec.ts` + `tsc --noEmit` + `eslint`
- **Per tab migration (Wave 1/2 gate, D-06/D-07):** the full regression-spec set (the 5 named + the 3 new cinematic specs) + human-verify desktop cinematic on a preview
- **Before `/gsd-verify-work`:** full Playwright suite green + LHCI `/` gate green + firewall `git diff --exit-code` clean
- **Max feedback latency:** quick set < ~60s

---

## Per-Requirement Verification Map

| Req | Behavior | Test Type | Automated Command | File Exists |
|-----|----------|-----------|-------------------|-------------|
| SYSVIS-01 | Mobile renders 4 stacked Console dashboards; desktop pins at 1440 | integration | `npx playwright test tests/responsive/platform-mobile.spec.ts` | ✅ |
| SYSVIS-01 | Handoff content fails open under reduced motion (static stack visible) | integration | `npx playwright test tests/responsive/reduced-motion.spec.ts` | ✅ |
| SYSVIS-01 | GSAP pin anchored on desktop | integration | `tests/responsive/handoff-pin-anchored.spec.ts` | ❌ Wave 0 |
| SYSVIS-01 | Bezel viewport-centered across hero→Platform seam | integration | `tests/responsive/handoff-bezel-seam.spec.ts` | ❌ Wave 0 |
| SYSVIS-01 | Dashboard static (no x/y move) during crossfade | integration | `tests/responsive/handoff-dashboard-static.spec.ts` | ❌ Wave 0 |
| SYSVIS-01 | Mobile never fetches GSAP after migration | integration | `npx playwright test tests/responsive/hero-gsap-free-mobile.spec.ts` | ✅ |
| SYSVIS-01 | Firewall files byte-unchanged | static | `git diff --exit-code -- src/components/sections/HomepageHero.tsx src/components/sections/HomepageHandoffSection.tsx` | ❌ Wave 0 (verification step) |
| SYSVIS-01 | `/` CLS/INP/LCP hold after Console enters the handoff | perf | LHCI Case C on `/` (`.github/workflows/perf.yml`) | ✅ |
| SYSVIS-02 | No dead PNG refs; hero finale PNG intentionally retained (Phase 15) | static | `grep -rn "\.png" src/` returns only the hero finale ref | ✅ (manual grep) |
| P13-02 | No off-token hex in migrated handoff visuals | static | `grep -rn "#22c55e\|#d97706\|#0891b2" src/` returns zero after Wave 3 | ✅ (manual grep) |

---

## Wave 0 Requirements

- [ ] `tests/responsive/handoff-pin-anchored.spec.ts` — asserts the desktop 400vh sticky pin holds (sticky inner stays at viewport top through the scroll range). Covers the "pin anchored" half of SYSVIS-01 SC2.
- [ ] `tests/responsive/handoff-bezel-seam.spec.ts` — asserts the hero framed-dashboard (`[data-hero-framed-dashboard]`) and the handoff frame (`[data-handoff-mockup-frame]`) share the same viewport-x/center at the seam. (Selectors verified: HomepageHero.tsx:177, HandoffSection.tsx:205.)
- [ ] `tests/responsive/handoff-dashboard-static.spec.ts` — asserts the dashboard bounding box x/y does not move across a tab crossfade (only content swaps).
- [ ] Firewall byte-check step (`git diff --exit-code` on the two firewall files) wired into phase verification.
- [ ] Bare Console renderer reduced-motion fail-open verified against the mobile/reduced static stack.
- [ ] `placement` tab Console payload authored (Wave 0 reference payload, mirrors Phase 11/12 typed-payload pattern).

*The 3 new cinematic specs are the crux: without them, D-06's "validate the full regression-spec set against placement before fanning out" is not machine-checkable. Fallback if a spec proves too brittle to author cheaply: a documented human-verify checkpoint per tab — but that weakens the gate, so author them first.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Desktop cinematic feel (pin/bezel/crossfade reads identically to today) | SYSVIS-01 | Subjective parity judgment beyond the automated x/y assertions | Connor reviews `/` on the Vercel preview at desktop width; scroll through the hero→Platform seam for all 4 tabs |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (3 cinematic specs + firewall byte-check)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s (quick set)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
