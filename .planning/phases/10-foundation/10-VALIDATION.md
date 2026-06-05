---
phase: 10
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-04
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `10-RESEARCH.md` "## Validation Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.60 (e2e/a11y/responsive) + LHCI 0.15 (perf) + tsc (types) + eslint (lint) |
| **Config file** | `lighthouserc.json` (throttlingMethod `devtools`, mobile 412×823, LCP gate 2300ms on `/`), `.github/workflows/{perf,a11y}.yml`, `tests/helpers/routes.ts` |
| **Quick run command** | `npx tsc --noEmit && npx eslint` |
| **Full suite command** | `npm run test:e2e` + `npx --no-install lhci autorun` |
| **Estimated runtime** | ~4-5 min (Playwright) + ~2 min (LHCI build+collect) |

> Sandbox note: `next build`/`start` hang here. Runtime Playwright + LHCI run via CI / a Vercel preview (`PLAYWRIGHT_BASE_URL=<preview>`), not local `next start`. `tsc`/`eslint`/grep run locally.

---

## Sampling Rate

- **After every task commit:** `npx tsc --noEmit && npx eslint`
- **After every plan wave:** the wave's Playwright spec(s) + `npm run build` (so the route-JS-budget script can run)
- **Before `/gsd-verify-work`:** full `npm run test:e2e` green + `lhci autorun` green (LCP ≤ gate, TBT ≤ budget) + `check-route-js-budget.sh` exit 0
- **Max feedback latency:** ~30s (tsc+eslint) per task; full suite at wave/phase gate

---

## Per-Requirement Verification Map

> Task IDs are assigned by the planner. This maps each FND requirement + success criterion to its proof; the planner must attach an `<automated>` verify (or a Wave 0 dependency) to every task realizing these.

| Req | Behavior | Test type | Automated command / proof | Exists? |
|-----|----------|-----------|---------------------------|---------|
| FND-01 | Barrel exposes 7-type vocabulary; reduced-motion fails open | type + e2e | `tsc` (barrel exports compile); `reduced-motion.spec.ts` extended (opacity===1) + new `reveal-fail-open.spec.ts` | partial — reduced-motion exists; reveal-fail-open ❌ W0 |
| FND-02 | 3 archetypes render from typed payload, no baked numbers | type + grep | `tsc` (archetype takes `data: XData` prop); grep asserts no numeric literals in archetype JSX (code-review) | ❌ W0 (archetypes don't exist) |
| FND-03 | Typed payload model in `src/content/visuals/`, `[CLAIMS REVIEW]`-auditable | type + grep | `tsc` against `types.ts`; grep `[CLAIMS REVIEW]` present in payload modules | ❌ W0 |
| FND-04 | New primitives extend `parts.tsx` under one stroke/type/color logic | type + a11y | `tsc`; `tests/a11y/axe-routes.spec.ts` (label-paired status, role/aria) | partial — axe exists; new atoms ❌ W0 |
| FND-05a | Route First-Load-JS budget on `/` | CI script | `scripts/check-route-js-budget.sh` exit 1 over budget; wired in `perf.yml` | ❌ W0 (model on `check-hero-assets.sh`) |
| FND-05b | TBT (INP lab proxy) on visual-heavy routes | LHCI | `lighthouserc.json` assertMatrix adds `total-blocking-time` + visual routes in `collect.url` | partial — LHCI exists, LCP-only ❌ W0 |
| FND-05c | "No stuck opacity:0" reveal spec | e2e | new `tests/responsive/reveal-fail-open.spec.ts` (scroll + tab/accordion open; assert no in-viewport opacity<1) | ❌ W0 |
| FND-05d | Mobile-GSAP-free spec across visual routes | e2e | `tests/responsive/hero-gsap-free-mobile.spec.ts` generalized | partial — exists for `/` only ✅; extend ❌ W0 |
| FND-05e | All existing specs stay green | e2e | `npm run test:e2e` (170 specs) | ✅ exists |
| FND-06 | No eager motion in `/`/shared chunk; co-land with 5.3 lazy-GSAP | CI script + e2e | `check-route-js-budget.sh` (`/` budget) + mobile-GSAP-free spec; LHCI Case C LCP ≤ gate | partial — LCP gate ✅; route JS budget ❌ W0 |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/responsive/reveal-fail-open.spec.ts` — FND-01, FND-05c (no stuck opacity:0 after scroll + tab/accordion open)
- [ ] `scripts/check-route-js-budget.sh` — FND-05a, FND-06 (`/` First-Load-JS budget); model on `scripts/check-hero-assets.sh`; wire into `perf.yml`
- [ ] `lighthouserc.json` extension — add `total-blocking-time` assertion + visual-heavy routes to `collect.url` (FND-05b)
- [ ] `tests/responsive/hero-gsap-free-mobile.spec.ts` generalization (or sibling) across visual routes (FND-05d)
- [ ] `tests/helpers/routes.ts` extension — add 6 solutions sub-pages + compare/company sub-pages (or a `VISUAL_ROUTES` list) so specs cover routes Phases 11-12 touch
- [ ] `reduced-motion.spec.ts` extension — computed `opacity===1` assertion for revealed content (FND-01)

*Framework install: none — all test tooling already present.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Archetype JSX has zero baked numeric constants | FND-02, FND-03 | grep can flag candidates but legit literals (keys, indices) need eyes | Code-review gate: scan each archetype's JSX for numeric literals; confirm every product number comes from the payload prop |
| Caption/payload copy claims are sourced | FND-03 | `[CLAIMS REVIEW]` / `[COI REVIEW]` are human gates (Andrew/Paul) | Any payload number → `[CLAIMS REVIEW]`; any vendor/TSI-relationship caption → `[COI REVIEW]` per CLAUDE.md §6, §7, §15 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (6 items above)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (per-task tsc+eslint)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
