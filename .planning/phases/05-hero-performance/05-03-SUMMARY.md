---
phase: 05
plan: 03
subsystem: hero-performance
tags: [perf, next-font-local, wordmark, wave-1, hero-02]
requires:
  - src/app/fonts.ts (Plan 01 Wave 0)
  - src/app/fonts/GeneralSans-Semibold.woff2 (Plan 01 Wave 0)
provides:
  - src/app/layout.tsx generalSans CSS variable on <html>
  - src/components/site/Wordmark.tsx leads with var(--font-general-sans)
  - tests/hero/wordmark-self-host.spec.ts (live, no test.skip)
  - .next/static/media/GeneralSans_Semibold-s.p.<hash>.woff2 (build emission)
affects:
  - src/app/globals.css (line 1 Fontshare @import removed)
  - HANDOFF.md (Wave 1 HERO-02 progress note)
tech-stack:
  added: []
  patterns:
    - "next/font/local CSS-variable resolution (defensive against hashed family names)"
    - "Playwright network-log + computed-style assertions for font-source regression"
key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/components/site/Wordmark.tsx
    - tests/hero/wordmark-self-host.spec.ts
    - HANDOFF.md
decisions:
  - "Wordmark.tsx remains a Server Component (no `use client`). Resolve font via CSS variable, not `className={generalSans.className}`, per RESEARCH.md Pattern 3."
  - "Retain `\"General Sans\"` literal in the fontFamily chain after the CSS variable as a safety net; not just var() alone."
  - "Do not assert preload `<link>` `crossorigin` attribute in the spec — next/font's exact attribute set is not load-bearing for the regression contract."
metrics:
  tasks_completed: 5
  commits: 5
  duration: "~18 minutes"
  files_created: 0
  files_modified: 5
  completed: "2026-05-21T16:30:00Z"
requirements_completed: [HERO-02]
---

# Phase 5 Plan 03: HERO-02 General Sans self-host — Summary

Eliminate the Fontshare CDN call on the hero render path; resolve General Sans 600 from `src/app/fonts/GeneralSans-Semibold.woff2` via `next/font/local`. Wordmark renders identically — `.dn-node` luminous pulse + `prefers-reduced-motion` gate untouched.

## What shipped

**Fontshare CDN removed (Task 1):**
- `src/app/globals.css` line 1 (`@import url("https://api.fontshare.com/v2/css?f[]=general-sans@600&display=swap");`) deleted.
- File now starts with `@import "tailwindcss";`.
- `.dn-node` `@keyframes` block, `.dn-node` class declaration, and the `@media (prefers-reduced-motion: reduce) { .dn-node { animation: none; } }` suppression all preserved verbatim.

**next/font/local wired (Task 2):**
- `src/app/layout.tsx` imports `generalSans` from `./fonts` (the Plan 01 Wave 0 module).
- `<html>` className extended from `` `dark ${inter.variable}` `` to `` `dark ${inter.variable} ${generalSans.variable}` ``.
- `next build` exits 0 with no font-resolution errors and emits the woff2 to `.next/static/media/GeneralSans_Semibold-s.p.0hfk9k1kkjsdy.woff2` (content-hashed). next/font auto-injects the preload `<link rel="preload" as="font" type="font/woff2" href="/_next/static/media/...">` in `<head>` for every page (root layout effect).

**Wordmark defensively rewired (Task 3):**
- `src/components/site/Wordmark.tsx` inline style fontFamily changed from
  `'"General Sans", Inter, system-ui, sans-serif'`
  to
  `'var(--font-general-sans), "General Sans", Inter, system-ui, sans-serif'`.
- The CSS variable resolves to next/font's hashed family alias (the `--font-general-sans` variable from `src/app/fonts.ts`), so the wordmark renders the local woff2 even if next/font hashes "General Sans" to `__General_Sans_<hash>`. Literal "General Sans" + Inter + system-ui chain retained as safety net for environments where next/font hasn't hydrated.
- The `<span aria-hidden="true" class="dn-node">` pulse sibling is untouched.

**Live spec replaces stub (Task 4):**
- `tests/hero/wordmark-self-host.spec.ts` rewritten from `test.skip()` body to a one-test, three-assertion spec:
  1. `page.on("request")` collects any URL containing `fontshare.com`. After `goto("/")` + `networkidle`, the collected array MUST be empty.
  2. `head link[rel="preload"][as="font"][href*="GeneralSans"]` MUST have exactly 1 match.
  3. `getComputedStyle` on `header span:has(.dn-node)` `font-family` MUST match `/General Sans|__General_Sans/i`.
- Spec passes in 8.5s locally; 1 passed, 0 failed.

**Docs + commit (Task 5):**
- HANDOFF.md M5 section gained a `**Phase 5 Wave 1 progress — HERO-02 shipped (2026-05-21, plan 05-03):**` paragraph after the existing HERO-01 line.
- `.planning/STATE.md` intentionally NOT touched — orchestrator owns STATE.md per the parallel-execution contract.

## Commits (oldest first)

| Hash | Subject |
|------|---------|
| `28b8036` | refactor(phase-5/hero-02): remove Fontshare @import from globals.css L1 |
| `78fad57` | feat(phase-5/hero-02): wire generalSans into root layout |
| `596b081` | feat(phase-5/hero-02): wordmark fontFamily leads with --font-general-sans |
| `6a48acf` | test(phase-5/hero-02): replace HERO-02 spec stub with live assertions |
| (this commit) | docs(phase-5/hero-02): summary + HANDOFF.md HERO-02 progress |

## Verification results

| Check | Result | Notes |
|------|--------|-------|
| `head -1 src/app/globals.css` | `@import "tailwindcss";` | Fontshare `@import` gone. |
| `grep -ci "fontshare" src/app/globals.css` | `0` | Zero remaining Fontshare references in `globals.css`. |
| `.dn-node` keyframes + class + reduced-motion block | preserved | `@keyframes dn-node-pulse` (1 match), `prefers-reduced-motion` (3 matches in file). |
| `npm run build` | exit 0 | Clean build; 17 static pages generated. |
| `ls .next/static/media/ \| grep -i general` | `GeneralSans_Semibold-s.p.0hfk9k1kkjsdy.woff2` | next/font emitted the content-hashed asset. |
| `npx tsc --noEmit` | 2 pre-existing errors | `tests/responsive/reduced-motion.spec.ts:6` + `.next/dev/types/validator.ts:5` — both noted in Wave 0 `deferred-items.md`; NOT introduced by Plan 03. |
| `npx playwright test tests/hero/wordmark-self-host.spec.ts` | 1 passed | New spec green in 8.5s. |
| `npx playwright test tests/responsive/ tests/a11y/ tests/hero/` | 167 passed, 1 skipped | The 1 remaining skip is the HERO-03 `poster-avif-negotiation.spec.ts` stub for Plan 04. |

## Deviations from plan

### Auto-fixed Issues

None. Plan 03 executed exactly as written; the only minor adjustment was splitting the layout.tsx edit into two atomic `Edit` calls (import line, then html className) rather than the single multi-string replacement the plan implied, because the `Edit` tool requires unique string matches and the two regions are non-adjacent. No semantic deviation.

### Deferred Issues (out of scope per scope-boundary rules)

The two pre-existing tsc errors logged in `.planning/phases/05-hero-performance/deferred-items.md` during Plan 01 remain. Plan 03 did not touch either file.

## Threat surface scan

No NEW security-relevant surface introduced. Threat register:
- **T-V10-01** (woff2 tampering): Plan 01 Wave 0 mitigated (sha256 in `.planning/phases/05-hero-performance/.woff2-sha256.txt` + commit body). Plan 03 only consumes the validated asset; `next/font/local` revalidates at build time.
- All other threats (T-V12-01, T-INFO-01, T-TAMP-01) are out of scope for this plan.

## Spec delta

| Before | After |
|--------|-------|
| 167 passing, 2 skipped (HERO-02 + HERO-03 stubs) | 167 passing, 1 skipped (HERO-03 stub only) |

Net: +1 active spec, -1 skipped. The HERO-02 contract is now CI-enforced.

## Manual verification (deferred to Plan 05 pre-ship walkthrough)

Per `05-VALIDATION.md` Manual-Only Verifications row 2: visual diff of `/` nav wordmark at 1440px before/after the swap to confirm letter shapes + `.dn-node` pulse position are pixel-identical. The Playwright spec already covers the structural assertions (no CDN call, preload link, computed font-family). Manual eyeballing belongs to Plan 05's walkthrough, not this commit.

## What this unblocks

- Plan 04 (HERO-03 AVIF poster) can land next; the layout.tsx scaffolding it needs (next/font already wired) is in place.
- Plan 05 (HERO-04 LHCI gate trip) still depends on Plan 04 landing first.

## Self-Check: PASSED

All 4 modified source/test files verified on disk with expected content:
- `src/app/globals.css` — Fontshare gone, .dn-node block intact
- `src/app/layout.tsx` — generalSans import + variable applied to <html>
- `src/components/site/Wordmark.tsx` — var(--font-general-sans) leads
- `tests/hero/wordmark-self-host.spec.ts` — live spec, no test.skip
- `HANDOFF.md` — HERO-02 progress paragraph present

All 4 task commits (28b8036, 78fad57, 596b081, 6a48acf) verified in `git log`.
