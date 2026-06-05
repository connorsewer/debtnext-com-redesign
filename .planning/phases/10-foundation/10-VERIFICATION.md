---
phase: 10-foundation
verified: 2026-06-05T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Run Playwright reveal-fail-open.spec.ts against a Vercel preview"
    expected: "Every route in VISUAL_ROUTES passes: no in-viewport text-bearing element sits at computed opacity < 1 after scroll + accordion/tab open"
    why_human: "next build/start hang in this sandbox; spec requires a running server against real rendered output"
  - test: "Run Playwright reduced-motion.spec.ts VISUAL_ROUTES loop against a Vercel preview under prefers-reduced-motion:reduce"
    expected: "All routes pass: in-viewport text-bearing elements rest at opacity === 1 under reduced motion (reveals fail open)"
    why_human: "Requires running server; reduced-motion media emulation is a browser-level feature not testable statically"
  - test: "Run Playwright hero-gsap-free-mobile.spec.ts VISUAL_ROUTES loop at 412x823 against a Vercel preview"
    expected: "Zero /gsap/ network requests across all visual routes on mobile viewport"
    why_human: "Network request monitoring requires a running browser session"
  - test: "Trigger a CI run (or push to a branch) and confirm check-route-js-budget.sh passes and prints the measured First-Load-JS value"
    expected: "Script exits 0; printed value is well under the 300 KB PROVISIONAL ceiling; pin ROUTE_JS_BUDGET_BYTES to measured value + ~10% headroom"
    why_human: "next build does not run in this sandbox; .next/app-build-manifest.json is absent locally; budget is PROVISIONAL until first CI run"
  - test: "Confirm LHCI total-blocking-time assertion passes on /, /platform/placement, and /solutions/utilities in CI"
    expected: "All three routes report TBT <= 200ms under devtools throttling; if any route fails, tighten the payload or raise the ceiling with a measured justification"
    why_human: "LHCI requires a running server + CI environment; cannot run locally"
---

# Phase 10: Foundation Verification Report

**Phase Goal:** Stand up the single, centralized motion + archetype system so every later phase is mechanical payload-and-page work, and set every perf/a11y/governance contract once so consumers can't get it wrong.
**Verified:** 2026-06-05
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A developer can build any product visual by importing a named primitive from `src/components/motion/` (full 7-type vocabulary) and rendering one of three archetypes from a typed payload, never hand-rolling Framer/GSAP | ✓ VERIFIED | `src/components/motion/index.ts` exports all 7 types (RevealStagger/RevealItem, LiveValue/NumberShift/AnimatedNumber, PulseDot, Hoverable/CursorGlow, AmbientField, crossfade, Explorable); `archetypes.tsx` exposes ConsoleVisual/DataStoryVisual/SchematicVisual as lazy wrappers; no GSAP import anywhere in the barrel |
| 2 | Every motion primitive renders its final fully-visible state under `prefers-reduced-motion` and fails OPEN (no node stuck at `opacity:0`) — verified by a "no in-viewport node at opacity < 1" Playwright spec | ? HUMAN NEEDED | Code contract verified: `Reveal.tsx` branches on `useReducedMotion()` → `initial="show" animate="show"` (fail open); `LiveValue.tsx` has `if (reduce) { node.textContent = format(value); return; }` path; `reduced-motion.spec.ts` has opacity===1 assertion over VISUAL_ROUTES; `reveal-fail-open.spec.ts` has opacity < 1 assertion. Runtime execution deferred to CI/Vercel — server required |
| 3 | Every product number a visual renders lives in a typed payload under `src/content/visuals/` with zero baked constants; three archetypes render entirely from that payload | ✓ VERIFIED | `src/content/visuals/types.ts` defines ConsoleData/DataStoryData/SchematicData with required `ariaSummary`; `placement.ts` uses `satisfies ConsoleData` with `[CLAIMS REVIEW]` marker; Console/DataStory/Schematic archetypes accept only typed payloads; no numeric literals in archetype source files |
| 4 | CI guardrails are green: route-level First-Load-JS budget, INP/TBT in LHCI on visual-heavy routes, reveal-fail-open spec, mobile-GSAP-free spec; all existing Playwright specs stay green | ? HUMAN NEEDED | Configuration verified correct: `perf.yml` runs `check-route-js-budget.sh` after hero-asset step; `lighthouserc.json` collects `/`, `/platform/placement`, `/solutions/utilities` with `total-blocking-time` ≤200ms assertion and `throttlingMethod: devtools`; budget is PROVISIONAL 300KB pending first measured CI build. Runtime execution requires CI environment |
| 5 | The 6 dead `dashboard-dark.png` BenefitSplit `media` fallbacks are removed (hero use deferred to Phase 15) | ✓ VERIFIED | `grep -rn "dashboard-dark.png" src/content/` returns no matches; `HomepageHero.tsx:187` still references the asset (intentional hero use); `BenefitSplit.media` made optional; all 6 page call-sites removed orphaned `media=` props; commit `55de569` |

**Score:** 5/5 truths verified (3 fully automated, 2 require runtime confirmation)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/motion/index.ts` | 7-type motion vocabulary barrel | ✓ VERIFIED | Exports RevealStagger/RevealItem, LiveValue/NumberShift/PulseDot, Hoverable/CursorGlow, AmbientField, crossfade, Explorable; no GSAP import |
| `src/components/motion/Reveal.tsx` | Fail-open scroll reveal | ✓ VERIFIED | `useReducedMotion()` branch renders `initial="show" animate="show"` |
| `src/components/motion/LiveValue.tsx` | Fail-open live number | ✓ VERIFIED | `if (reduce)` path sets final value immediately |
| `src/components/motion/Explorable.tsx` | Compound-component shell | ✓ VERIFIED | Intentional shell per plan; first real explorable is Phase 11 (PLATVIS-02) |
| `src/components/product/motion.tsx` | Zero-edit re-export shim | ✓ VERIFIED | `export * from "@/components/motion"` — all 17 consumers compile unchanged |
| `src/components/product/primitives/WorklistRow.tsx` | Console row atom | ✓ VERIFIED | Delegates bars to parts.tsx, count to AnimatedNumber, label-paired status |
| `src/components/product/primitives/ChartFrame.tsx` | Data-story container with ariaSummary | ✓ VERIFIED | Required `ariaSummary` drives `role="img"` + `aria-label` |
| `src/components/product/primitives/FlowNode.tsx` | Schematic node atom (PROVISIONAL) | ✓ VERIFIED | PROVISIONAL/A2 per plan; hardens in Phase 11 |
| `src/components/product/primitives/FlowEdge.tsx` | Schematic edge atom (PROVISIONAL) | ✓ VERIFIED | `strokeDashoffset` flow; static fallback under reduced motion; no GSAP |
| `src/content/visuals/types.ts` | Three typed payload schemas | ✓ VERIFIED | ConsoleData/DataStoryData/SchematicData each with required `ariaSummary` |
| `src/content/visuals/placement.ts` | Reference payload with `satisfies ConsoleData` | ✓ VERIFIED | `satisfies ConsoleData`; `[CLAIMS REVIEW]` marker on numeric block; `[COI REVIEW]` on vendor framing |
| `src/components/product/visuals/Console.tsx` | Console compound archetype | ✓ VERIFIED | React 19 `use()` context, slots + flat render, renders from ConsoleData |
| `src/components/product/visuals/DataStory.tsx` | Data-story archetype | ✓ VERIFIED | Switches on `chart.kind`; `cards` branch subsumes SolutionsIndustryCards duplicate |
| `src/components/product/visuals/Schematic.tsx` | Schematic archetype (PROVISIONAL) | ✓ VERIFIED | PROVISIONAL/A2; FlowNode/FlowEdge from SchematicData |
| `src/components/product/visuals/archetypes.tsx` | Lazy ssr:false public API | ✓ VERIFIED | `dynamic(..., { ssr: false })` with inline-literal options for each archetype |
| `scripts/check-route-js-budget.sh` | Route First-Load-JS budget guard | ✓ VERIFIED | Exists; manifest-parse logic; PROVISIONAL 300KB ceiling; wired in `perf.yml` |
| `tests/responsive/reveal-fail-open.spec.ts` | No-stuck-opacity:0 Playwright spec | ✓ VERIFIED | Exists; imports VISUAL_ROUTES; `getComputedStyle` + `opacity < 1` assertion |
| `tests/helpers/routes.ts` | VISUAL_ROUTES list (23 routes) | ✓ VERIFIED | Exports VISUAL_ROUTES with 6 solutions sub-pages, /compare, /platform/integrations, 4 /company sub-pages; ROUTES unchanged |
| `lighthouserc.json` | TBT assertion + 3 collected URLs | ✓ VERIFIED | `total-blocking-time` ≤200ms; collects `/`, `/platform/placement`, `/solutions/utilities`; `throttlingMethod: devtools` |
| `.github/workflows/perf.yml` | Route-JS budget step wired | ✓ VERIFIED | `bash scripts/check-route-js-budget.sh` runs after hero-asset step, before LHCI |
| `DESIGN.md §4.7` | Engine-per-job rule documented | ✓ VERIFIED | `grep "engine-per-job" DESIGN.md` matches at line 503 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/components/product/motion.tsx` | `src/components/motion` | `export * from "@/components/motion"` | ✓ WIRED | Shim confirmed; 17 consumers unmodified |
| `src/components/motion/LiveValue.tsx` | reduced-motion final value | `if (reduce)` early-return | ✓ WIRED | `if (reduce) { node.textContent = format(value); return; }` at line 47 |
| `src/components/motion/Reveal.tsx` | final "show" state | `initial="show" animate="show"` when `reduce` | ✓ WIRED | Both RevealStagger and RevealItem branch correctly |
| `.github/workflows/perf.yml` | `scripts/check-route-js-budget.sh` | bash step after hero-asset step | ✓ WIRED | `grep "check-route-js-budget" .github/workflows/perf.yml` matches line 25 |
| `lighthouserc.json` | `total-blocking-time` | assertMatrix assertion + collect.url additions | ✓ WIRED | TBT assertion present; 3 URLs in collect.url |
| `tests/responsive/reveal-fail-open.spec.ts` | VISUAL_ROUTES | import from `../helpers/routes` | ✓ WIRED | Import confirmed |
| `tests/responsive/reduced-motion.spec.ts` | opacity===1 assertion | VISUAL_ROUTES loop | ✓ WIRED | Confirmed at lines 71-128 |
| `tests/responsive/hero-gsap-free-mobile.spec.ts` | VISUAL_ROUTES | imported loop | ✓ WIRED | `import { VISUAL_ROUTES }` at line 2; loop at line 67 |
| `src/components/product/visuals/archetypes.tsx` | ConsoleVisual/DataStoryVisual/SchematicVisual | `dynamic(..., { ssr: false })` | ✓ WIRED | Inline-literal options per Turbopack requirement |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `Console.tsx` | `data: ConsoleData` | typed payload passed as prop | Yes — renders `data.header`, `data.rows`, `data.pills` etc.; no fallback to empty | ✓ FLOWING |
| `DataStory.tsx` | `data: DataStoryData` | typed payload passed as prop | Yes — switches on `data.chart.kind`; no static values | ✓ FLOWING |
| `Schematic.tsx` | `data: SchematicData` | typed payload passed as prop | Yes — maps `data.nodes` + `data.edges`; PROVISIONAL geometry | ✓ FLOWING |
| `archetypes.tsx` | payload passed through | lazy wrapper; no state | Yes — passes `data` prop straight to underlying archetype | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| motion barrel has no GSAP import | `grep -rn "gsap" src/components/motion/` | Only a comment warning against adding GSAP; zero import statements | ✓ PASS |
| `product/motion.tsx` is a shim | `cat src/components/product/motion.tsx` | Single `export * from "@/components/motion"` line | ✓ PASS |
| `dashboard-dark.png` absent from src/content/ | `grep -rn "dashboard-dark.png" src/content/` | No matches | ✓ PASS |
| VISUAL_ROUTES covers sub-pages | `grep -n "VISUAL_ROUTES" tests/helpers/routes.ts` | Exported at line 18; 23 routes including 6 solutions, 4 company, /compare, /platform/integrations | ✓ PASS |
| `perf.yml` wires budget script | `grep -n "check-route-js-budget" .github/workflows/perf.yml` | Line 25 confirmed | ✓ PASS |
| `lighthouserc.json` valid + TBT present | node JSON.parse + grep | Valid JSON; `total-blocking-time` present; 3 URLs in collect | ✓ PASS |
| `check-route-js-budget.sh` bash-valid | `bash -n scripts/check-route-js-budget.sh` | (Confirmed by executor; static bash syntax check) | ✓ PASS |
| Playwright reveal-fail-open spec runtime | Requires Vercel preview | Cannot execute without running server | ? SKIP |
| LHCI TBT runtime | Requires CI | Cannot execute without CI environment | ? SKIP |

### Requirements Coverage

| Requirement | Plan | Description | Status | Evidence |
|-------------|------|-------------|--------|----------|
| FND-01 | 10-02 | Motion primitive barrel, 7-type vocabulary, reduced-motion fail-open | ✓ SATISFIED | `src/components/motion/index.ts` exports all 7 types; Reveal + LiveValue fail-open verified |
| FND-02 | 10-05 | Three parametrized archetypes (Console, Data story, Schematic) from typed payload | ✓ SATISFIED | Console/DataStory/Schematic components exist; render from ConsoleData/DataStoryData/SchematicData; zero baked numbers |
| FND-03 | 10-04 | Typed per-context payload model in `src/content/visuals/` | ✓ SATISFIED | `types.ts` + `placement.ts` + `index.ts` under `src/content/visuals/`; `[CLAIMS REVIEW]`-auditable |
| FND-04 | 10-03 | Shared product primitives extend `parts.tsx` set | ✓ SATISFIED | WorklistRow/ChartFrame/FlowNode/FlowEdge under `src/components/product/primitives/`; all delegate to existing parts.tsx atoms |
| FND-05 | 10-01, 10-06 | CI guardrails (route JS budget, TBT, reveal-fail-open spec, mobile-GSAP-free spec) | ✓ SATISFIED (config) / ? RUNTIME HUMAN | All configuration files exist and are correctly wired; runtime execution deferred to CI |
| FND-06 | 10-02 | No eager motion code on `/` shared chunk; co-lands after M5 Phase 5.3 lazy-GSAP | ✓ SATISFIED | GSAP absent from motion barrel; all archetypes are `ssr:false` lazy; `product/motion.tsx` is a re-export shim with no runtime weight |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/product/primitives/IssuesWorklist.tsx` | 11 | `'AnimatedNumber' is defined but never used` (pre-existing eslint warning) | ℹ️ Info | Pre-existing; not introduced by Phase 10; logged in `deferred-items.md`; warning-level only |
| `scripts/check-route-js-budget.sh` | header | `ROUTE_JS_BUDGET_BYTES` is PROVISIONAL 300 KB placeholder | ⚠️ Warning | Intentional and documented; must be pinned to measured value on first CI build; not a blocker |

No blockers found. No stubs that prevent the phase goal. The `Explorable.tsx` shell and `SchematicData` PROVISIONAL/A2 status are intentional and documented — both are hardened in Phase 11 (PLATVIS-02).

### Human Verification Required

#### 1. Reveal fail-open runtime check

**Test:** Deploy a Vercel preview from the current branch. Run `npx playwright test tests/responsive/reveal-fail-open.spec.ts` with `PLAYWRIGHT_BASE_URL=<preview-url>`.
**Expected:** All 23 VISUAL_ROUTES pass; no route reports in-viewport text-bearing elements at `opacity < 1` after scroll + accordion/tab open.
**Why human:** `next build/start` hangs in this sandbox; the spec requires a running rendered server to inspect computed styles.

#### 2. Reduced-motion opacity runtime check

**Test:** Run `npx playwright test tests/responsive/reduced-motion.spec.ts` with `PLAYWRIGHT_BASE_URL=<preview-url>`.
**Expected:** The new VISUAL_ROUTES loop passes for all 23 routes: all in-viewport text-bearing elements rest at `opacity === 1` under `prefers-reduced-motion: reduce`.
**Why human:** Requires running browser session with media emulation against a live server.

#### 3. Mobile GSAP-free visual routes runtime check

**Test:** Run `npx playwright test tests/responsive/hero-gsap-free-mobile.spec.ts` with `PLAYWRIGHT_BASE_URL=<preview-url>`.
**Expected:** Zero `/gsap/` network requests across all 23 VISUAL_ROUTES at 412x823 viewport.
**Why human:** Network request monitoring requires a running browser session.

#### 4. Route First-Load-JS budget pinning

**Test:** Trigger a CI run (push branch or re-run perf workflow). Observe the `check-route-js-budget.sh` output — it prints `PASS  /  First-Load-JS: N bytes (budget: 307200)`. Take that N value, add ~10% headroom, and update `ROUTE_JS_BUDGET_BYTES` in `scripts/check-route-js-budget.sh`.
**Expected:** The script exits 0; the measured value is recorded and the PROVISIONAL placeholder replaced.
**Why human:** `next build` does not run in this sandbox; the manifest file is absent locally.

#### 5. LHCI TBT assertion confirmation

**Test:** Confirm from CI that LHCI passes the `total-blocking-time` ≤200ms assertion on `/`, `/platform/placement`, and `/solutions/utilities` under `throttlingMethod: devtools`.
**Expected:** All three routes pass. If any fail, the ceiling may need adjusting with a measured justification.
**Why human:** Requires full CI run with a built Next.js server.

### Gaps Summary

No gaps found. All five success criteria are satisfied at the code/configuration level. Five items require human runtime confirmation (all CI/Playwright execution deferred per the sandbox constraint noted in the verification prompt). The PROVISIONAL route-JS budget is an intentional documented placeholder, not a gap.

---

_Verified: 2026-06-05_
_Verifier: Claude (gsd-verifier)_
