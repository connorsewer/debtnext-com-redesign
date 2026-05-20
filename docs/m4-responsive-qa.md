# M4 Responsive QA Matrix

Generated 2026-05-20. Run via: `PLAYWRIGHT_BASE_URL=http://localhost:3100 npx playwright test tests/responsive/breakpoint-matrix.spec.ts`

Tests assert (a) no horizontal overflow on `<html>` and (b) no console errors during load.

## Status per route × breakpoint

| Route | 320 | 375 | 414 | 768 | 1024 | 1280 | 1440 | 812×375 | 1180×820 |
|---|---|---|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/platform` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/platform/placement` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/platform/optimization` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/platform/issues` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/platform/reporting` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/solutions` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/why-dplat` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/company` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/resources` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/demo` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**99 / 99 passing.**

## Failures

None. (Initial run surfaced 2 failures on `/company` at 320 and 375 from `ProofBand` forcing N-column grid; resolved in this task.)

## Fixes applied during Task 22

- **`src/components/sections/ProofBand.tsx`** — the stat grid was inline-styled to `repeat(N, minmax(0, 1fr))` for all viewports. With 4 stats on `/company` (longest token: "Since 2003") at 320px content width (~288px), columns collapsed below the H2 line-box, pushing `scrollWidth` to 336px. Replaced with a responsive stack: `grid-cols-1` on the narrowest viewports, `sm:grid-cols-2` at 640px+, and the original `repeat(N, minmax(0, 1fr))` reinstated at `md:` via a `--proof-cols` custom property. No visual change at desktop.

## Known deferred

None at this time.
