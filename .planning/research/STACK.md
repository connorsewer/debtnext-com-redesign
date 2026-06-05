# Stack Research

**Domain:** Premium visual + motion layer for an existing dark-fintech marketing site (DebtNext / dPlat, M6)
**Researched:** 2026-06-04
**Confidence:** HIGH

## Headline answer (read this first)

**Add zero new runtime dependencies.** Everything the 3-archetype visual library and the
7-type motion vocabulary need is already installed and validated in this repo:

- **Framer Motion 12.39.0** — verified in `package.json` and `node_modules/framer-motion/package.json`
- **GSAP 3.15.0** + `@gsap/react` 2.1.2 — verified; **all formerly-paid plugins are physically present and free** (`ScrollTrigger`, `SplitText`, `MorphSVGPlugin`, `Flip`, `Draggable`, `Observer`, `ScrollSmoother`, `InertiaPlugin` all in `node_modules/gsap/dist/`)
- **Hand-built SVG + CSS** — the repo already ships production chart atoms (`SegmentedBar`, `ValueBar`, `Sparkline`, `AreaLine`) and motion tokens in `src/components/product/parts.tsx` and `src/components/product/motion.tsx`

**The charting build-vs-buy decision is made: BUILD.** Do not add Recharts / Visx / Chart.js /
D3. Rationale in the dedicated section below. The "data story" archetype is small, annotated,
brand-styled charts (2–6 data points), which the existing SVG primitives already cover and the
DESIGN.md chart palette (§4.1) already tokenizes.

This keeps the milestone inside CLAUDE.md §2 ("Do not add libraries beyond this list without
flagging it") with no flag required.

## Recommended Stack

### Core Technologies (all already installed)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Framer Motion | 12.39.0 | Declarative, component-scoped motion: scroll-reveal, hover/lift, live-data entrances, micro-interactions, layout/tab crossfades | Already the repo's default for component motion. v12 is React-19-native (the v12 line was the React 19 release). Hooks already in use here (`useInView`, `useReducedMotion`, `animate`, `motion.*`). Declarative model fits per-component visuals far better than imperative GSAP. |
| GSAP | 3.15.0 | Imperative, timeline-based, scroll-scrubbed motion: the hero pin cinematic, the 400vh Platform tab-progression, any future scrubbed/sequenced storytelling | Already powering the hero + Platform handoff. 3.15 is well past the **3.13 (Apr 2025)** release where Webflow made **every** plugin free for commercial use, so SplitText/MorphSVG/ScrollTrigger are all licensed-clear. Use only where a scrubbed timeline genuinely beats Framer. |
| `@gsap/react` | 2.1.2 | `useGSAP()` hook — scoped, auto-cleanup GSAP in React 19 | Correct integration boundary for GSAP in this codebase; cleanup + StrictMode-safe. Already in use. |
| Hand-built SVG + CSS | n/a (platform) | The three archetypes (console / data story / schematic) and their atoms | A 100% in-house visual system is the entire point of the archetype library: "an archetype + a data payload, never a copy-paste." SVG gives pixel-precise, token-driven, animatable, accessible visuals with no bundle cost. The repo already proves the pattern in `parts.tsx`. |
| Tailwind v4 `@theme` + CSS Modules | v4 | Static styling, ambient drift keyframes, hover/focus states, reduced-motion gating | Drift and CSS-only micro-interactions belong here (cheaper than JS). Repo already uses CSS Modules for exactly this (`AmbientField.module.css`, `CursorGlow.module.css`, `hover.module.css`). |

### Supporting Libraries (already installed — no additions)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/dynamic` | next 16.2.6 | Lazy-load every interactive visual `ssr:false` | Already the pattern in `product/visuals/index.tsx` and `lazy.tsx`. Keep using inline-object-literal options (Turbopack static-analysis requirement, noted in the file). |
| `lucide-react` | 1.16.0 | Icons inside console/schematic visuals | Only if a visual needs an icon; prefer inline SVG for diagram glyphs to keep one stroke logic. |
| `cn` / `clsx` / `tailwind-merge` | installed | Class composition in visual atoms | Already used across `parts.tsx`. |

### Development Tools (already in place)

| Tool | Purpose | Notes |
|------|---------|-------|
| Playwright (1.60) | Reduced-motion + a11y + responsive matrix tests | Extend the existing `reduced-motion.spec.ts` and `axe-routes` to cover new visuals. Every new archetype/motion primitive must have a reduced-motion assertion. |
| axe-core / `@axe-core/playwright` (4.11) | a11y CI gate | New visuals: decorative → `aria-hidden`; meaningful → `role="img"` + `aria-label` (the `parts.tsx` atoms already do this). |
| `@lhci/cli` (0.15) | LCP/CLS/INP gate | Visuals stay lazy + transform/opacity-only so they don't regress the perf budget (CLAUDE.md §12). |
| gsap-skills pack | `.claude/skills/` GSAP guidance | Auto-loaded. Pull `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-performance` into any GSAP-touching plan task. |

## Charting: build-vs-buy decision (explicit)

**Decision: BUILD with hand-rolled SVG/CSS on the existing primitives. Do NOT add a charting dependency.**

Why a charting library is **not** warranted here:

1. **Scope is tiny and editorial.** The "data story" archetype is "one focused, annotated chart
   that teaches something true" (design spec §3.3) — 2–6 data points, one or two series, with a
   caption/annotation. That is not the analytics-dashboard workload that justifies Recharts/Visx.
2. **The primitives already exist and are validated.** `parts.tsx` ships `AreaLine` (gradient
   area + animated `pathLength` draw-on + glowing end dot), `Sparkline`, `SegmentedBar`,
   `ValueBar` — all reduced-motion-aware, all `role="img"`/`aria-label`-correct, all driven by
   `var(--chart-*)` tokens. Adding a chart lib would mean re-skinning it to match what we already have.
3. **Brand fit.** DESIGN.md §4.1: "Charts should feel integrated into the UI rather than like a
   separate analytics package." Every off-the-shelf lib carries default visual opinions (axes,
   tick styles, tooltips, legends) that fight the Mercury aesthetic and cost time to override.
4. **Bundle + perf.** Recharts pulls D3 sub-packages (~tens of KB gz + React reconciliation cost);
   Visx is lighter but still a dependency tree. Hand-built SVG is ~0 KB beyond the component itself
   and animates with the motion stack already loaded.
5. **Token + a11y control.** Hand-built SVG lets us enforce the "no color alone" rule (DESIGN.md
   §4.1: labels/legends/data-table required) and the `transform/opacity-only` animation rule directly.
6. **CLAUDE.md §2 constraint.** A charting lib would require an explicit chat flag. Not worth it
   for this scope.

**When a chart library WOULD be warranted (future, not this milestone):** an actual logged-in
analytics product surface with dozens of interactive series, zoom/brush, live streaming, or
arbitrary user-configured dimensions. None of that is in M6. If that ever lands, **Visx**
(`@visx/*`, low-level D3-on-React primitives) is the right pick because it stays unopinionated and
composable; Recharts only if speed-to-ship beats visual control. Flag in chat at that time.

**Archetype-to-technique mapping:**

| Archetype | Build technique | Motion ownership |
|-----------|-----------------|------------------|
| **Console** (product-UI slice: worklist, KPIs, pools, statuses) | HTML/CSS + the `primitives/` atoms (`MetricCell`, `StatPill`, `LiveStatus`, `ProductCanvas`) + `parts.tsx` bars | Framer (entrance stagger, live-data roll-ups, hover lift, explorable toggles) |
| **Data story** (annotated chart) | Hand-built SVG using `var(--chart-1..5)`; reuse/extend `AreaLine`/`Sparkline`/`SegmentedBar` | Framer `pathLength`/`scaleX`/`scaleY` draw-on + `AnimatedNumber` callout; GSAP only if a multi-step scrubbed reveal is needed |
| **Schematic** (routing/flow diagram, data on edges) | Hand-built SVG (`<path>` edges, node groups) | **GSAP** for edge "data traveling" (`MotionPath`/`DrawSVG`-style draw via `strokeDashoffset`, or `MotionPathPlugin`) when scrubbed/looping; Framer for simple node fade-in and hover-to-inspect |

## Motion type → Framer vs GSAP assignment (explicit, per type)

The repo already establishes the right split: **Framer for declarative component motion, GSAP for
scrubbed/pinned/sequenced scroll cinematics.** Keep that line. Default to Framer; reach for GSAP
only when a feature is genuinely timeline- or scroll-scrub-shaped.

| # | Motion type | Owner | Why | Existing anchor in repo |
|---|-------------|-------|-----|--------------------------|
| 1 | **Scroll reveal** (staggered fade-up) | **Framer** | `whileInView` + `staggerChildren` is exactly this; already tokenized | `product/motion.tsx` (`staggerContainer`, `fadeUpItem`, `inViewProps`) |
| 2 | **Live-data motion** (number roll-ups, filling bars, pulsing status) | **Framer** | `animate()` for counts, `scaleX/scaleY/clipPath` for bars, `repeat:Infinity` opacity for pulse | `AnimatedNumber`, `NumberShift` (motion.tsx); `ValueBar`, `SegmentedBar`, `Sparkline`, `AreaLine` glow dot (parts.tsx) |
| 3 | **Hover + cursor interactivity** (card lift, cursor-reactive glow) | **Framer (lift) + vanilla CSS/rAF (cursor glow)** | Lift = `whileHover`/CSS transform; cursor glow is a pointer-tracked rAF translate, already built and intentionally not a lib | `motion/hover.module.css`, `motion/CursorGlow.tsx` |
| 4 | **Ambient drift** (slow blurred light behind dark bands) | **CSS keyframes** (no JS) | Cheapest, GPU-friendly, runs without React; deterministic seeding avoids hydration mismatch | `ambient/AmbientField.tsx` + `.module.css` |
| 5 | **Micro-interactions** (button press, toggles, focus glow, input states — the 7 states) | **Framer + CSS** | State transitions are `whileTap`/`whileFocus` + CSS `:focus-visible`; keep durations on `--duration-instant`/`--duration-fast` | shadcn Button override + DESIGN.md §4.7 tokens |
| 6 | **Section + tab + route transitions** (crossfade/morph) | **Framer for tabs/sections; GSAP for the existing pinned hero→Platform seam** | `AnimatePresence` + `layout`/`layoutId` for tab/section crossfade; the 400vh pinned scrub is already GSAP and should stay GSAP | Hero `pin:true` (GSAP), Platform CSS-sticky tabs; new tab visuals → Framer `AnimatePresence` |
| 7 | **Explorable visuals** (hover-to-inspect, toggle states inside a visual) | **Framer** (+ GSAP `Observer`/`Draggable` only if drag is needed) | Local component state + `whileHover`/`AnimatePresence` for inspect panels and toggles; no drag is in scope, so GSAP `Draggable`/`Inertia` stay unused unless a draggable explorable is added later | new work; pattern is `parts.tsx` atoms + local state |

**GSAP-only justified cases in M6:** (a) extending the existing pinned hero/Platform scrub, and
(b) schematic "data traveling the edges" if it needs scrubbed/looping path animation
(`MotionPathPlugin` or `strokeDashoffset` draw). Everything else is Framer or CSS. Do not introduce
GSAP for plain scroll-reveals or hover — that would duplicate the Framer primitives and split the
reduced-motion gating logic.

## Reduced-motion gating (version-sensitive, verified)

Three layers already coexist correctly; new work must plug into the same three, not invent a fourth:

- **Framer:** `useReducedMotion()` per primitive (as in `parts.tsx`/`motion.tsx`). Optionally wrap
  the app in `<MotionConfig reducedMotion="user">` (verified on motion.dev) to auto-disable
  transform/layout animations globally while preserving opacity — a good belt-and-suspenders for
  new primitives, but per-component `useReducedMotion` remains the explicit contract here.
- **GSAP:** guard inside `useGSAP` with `gsap.matchMedia()` / a reduced-motion media query.
- **CSS:** the global `prefers-reduced-motion: reduce` block in `globals.css` plus per-module
  static fallbacks (`AmbientField` already ships `bloomStatic`).

Every new archetype and motion primitive must collapse to an instant fade / no-transform state and
get a Playwright `reduced-motion` assertion (extends the existing 11-route spec).

## Installation

```bash
# Nothing to install. All required packages are already in package.json:
#   framer-motion@12.39.0, gsap@3.15.0, @gsap/react@2.1.2
# All GSAP plugins (ScrollTrigger, SplitText, MorphSVG, Flip, Draggable,
# Observer, ScrollSmoother, Inertia) are present in node_modules/gsap/dist/
# and free for commercial use as of GSAP 3.13 (repo runs 3.15).
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Hand-built SVG charts | **Visx** (`@visx/*`) | Only if M6+ grows into a real interactive analytics surface (dozens of series, brush/zoom, streaming). Stays unopinionated; would still need brand skinning. Requires a chat flag. |
| Hand-built SVG charts | **Recharts** | Only if a future dashboard needs speed-to-ship over visual control. Carries D3 deps + default styling that fights the Mercury look. Not for M6. |
| Hand-built SVG charts | **Chart.js / canvas libs** | Never for this brand: canvas charts aren't DOM-accessible by default, can't use `var(--chart-*)` tokens cleanly, and don't animate with the existing motion stack. |
| Framer for live-data/hover | GSAP for the same | Only inside an already-GSAP scrubbed timeline; standalone use would split reduced-motion logic. |
| GSAP `MorphSVGPlugin` for schematic morphs | Framer `pathLength` / `strokeDashoffset` draw | Prefer the Framer/CSS draw for simple edge reveals; reserve MorphSVG for genuine shape-to-shape morphs (rare in this scope). |
| `MotionConfig reducedMotion="user"` (global) | Per-component `useReducedMotion` only | Keep per-component as the contract (already pervasive); add global `MotionConfig` as defense-in-depth, not a replacement. |

## What NOT to Use (no-new-dep list)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Recharts / Visx / Chart.js / D3 / ECharts / Nivo | Charting scope is 2–6-point annotated visuals; libs add bundle, fight brand tokens, need a CLAUDE.md §2 flag, and re-skin work we already did | Existing `parts.tsx` SVG atoms (`AreaLine`, `Sparkline`, `SegmentedBar`, `ValueBar`) |
| `motion` (the renamed npm package) as a *second* dep | Repo standardizes on `framer-motion@12`; `motion/react` is the same code under a new name. Mixing both = two copies, larger bundle | Keep importing from `framer-motion` |
| `gsap-trial` | The trial package exists only for pre-3.13 plugin access; all plugins are free in 3.15 already installed | Plain `gsap` (3.15.0) |
| `react-spring` / `auto-animate` / `lottie-react` / `react-countup` | Duplicate capabilities already covered by Framer + the repo's `AnimatedNumber`; Lottie/JSON animation conflicts with the "explain not decorate" + hand-built brand system | Framer Motion + existing primitives |
| `react-intersection-observer` | Framer's `useInView` and the `whileInView` prop already cover scroll-reveal triggering | `useInView` / `inViewProps` |
| New color / spacing / type tokens | DESIGN.md is single source of truth (§4.1 chart palette, §4.7 motion); adding tokens needs a chat flag | `var(--chart-1..5)`, `--duration-*`, `--ease-*`, `--status-*` |
| GSAP `ScrollSmoother` site-wide | Smooth-scroll hijacking fights "calm/precise," can break keyboard nav + a11y, and risks INP budget | Native scroll + Framer reveals; GSAP pin only where already used |
| Parallax / bounce / elastic / rotation | Banned in DESIGN.md §10/§4.7 and `.impeccable.md` principle 4 | Fade + small vertical translate only |

## Stack Patterns by Variant

**If the motion is per-component, declarative, or triggered by viewport/hover/state:**
- Use **Framer Motion 12** primitives (extend `product/motion.tsx`)
- Because it's the repo default, React-19-native, and centralizes reduced-motion via `useReducedMotion`

**If the motion is scroll-scrubbed, pinned, or a multi-step sequenced timeline:**
- Use **GSAP 3.15 + `useGSAP` + ScrollTrigger** (extend the hero/Platform pattern)
- Because GSAP's timeline + ScrollTrigger model is purpose-built for scrubbed cinematics and is already validated for the seam

**If the motion is purely ambient/decorative and needs no React state:**
- Use **CSS keyframes in a CSS Module** (extend `AmbientField`/`hover` modules)
- Because it's the cheapest path, GPU-friendly, and runs without hydration concerns

**If a visual needs a chart:**
- Use **hand-built SVG** with `var(--chart-*)`, draw-on via Framer `pathLength`/`scaleX`
- Because it matches brand, stays accessible (`role="img"`/labels), and adds zero deps

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| framer-motion@12.39.0 | react@19.2.4 | v12 is the React-19-native line; verified in use across the repo |
| gsap@3.15.0 | @gsap/react@2.1.2 | All plugins free since 3.13 (Apr 2025); 3.15 confirmed in `node_modules/gsap/package.json` |
| @gsap/react@2.1.2 | react@19.2.4 + Turbopack | `useGSAP` is StrictMode/cleanup-safe; already used for hero pin |
| next/dynamic | Turbopack (next 16.2.6) | Options MUST be inline object literals (`{ ssr:false, loading }`) — documented constraint in `product/visuals/index.tsx` |
| SVG visuals | DESIGN.md `--chart-1..5` tokens | Light + dark token sets both defined (globals.css); visuals must read tokens, not hex |

## Integration points (for the roadmapper / planners)

- **Motion primitives:** extend `src/components/product/motion.tsx` (tokens + Framer variants) and
  `src/components/motion/` (cursor/hover). Single source of truth — no ad-hoc Framer/GSAP in pages
  (design spec §4.1).
- **Visual atoms:** extend `src/components/product/primitives/` (add chart atoms, flow nodes,
  worklist rows) and `src/components/product/parts.tsx` (bars/lines already here).
- **Archetypes:** parametrized components in `src/components/product/visuals/` consuming typed
  payloads (`src/content/visuals/*.ts` or extended `src/content/solutions-*.ts`).
- **Consolidation:** fold `src/components/sections/mockups/` into the archetype library; the
  homepage handoff tabs become Console-archetype instances (design spec §4.3). Retire the 6 dead
  `dashboard-dark.png` `media` fallbacks.
- **Lazy boundary:** keep the `next/dynamic` + `Fallback` pattern from `visuals/index.tsx`/`lazy.tsx`.
- **Reduced-motion:** every new primitive wires `useReducedMotion` (Framer) / `gsap.matchMedia`
  (GSAP) / the global CSS block, and gets a Playwright reduced-motion assertion.

## Sources

- `package.json` + `node_modules/{gsap,framer-motion,@gsap/react}/package.json` — installed versions verified directly (HIGH)
- `node_modules/gsap/dist/` directory listing — all paid plugins physically present and free (HIGH)
- `src/components/product/{parts.tsx,motion.tsx,visuals/index.tsx}`, `src/components/{ambient,motion}/` — existing patterns read directly (HIGH)
- `DESIGN.md` §4.1 chart palette, §4.7 motion tokens, §10 motion bans — token + restraint contract (HIGH)
- GSAP 3.13 release notes (gsap.com/blog/3-13) — all plugins free for commercial use; SplitText rewrite; latest is 3.15 (HIGH)
- motion.dev/docs/react-accessibility — `MotionConfig reducedMotion="user"` behavior + `useReducedMotion` best practices in Motion/Framer v12 (HIGH)
- CSS-Tricks "GSAP is Now Completely Free" + Codrops free-plugins demos — corroborating the Webflow acquisition + free-plugin status (MEDIUM, corroborates HIGH)

---
*Stack research for: premium visual + motion layer (DebtNext/dPlat M6)*
*Researched: 2026-06-04*
