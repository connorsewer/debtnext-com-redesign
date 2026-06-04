# Design: premium motion for the product visuals

Date: 2026-06-04
Status: Approved direction, pending spec review
Owner: Connor

## 1. Problem and goal

The five homepage `FeatureAccordion` product visuals (Placement, Optimization, Issues, Reporting, Compliance) are live and look premium, but they are mostly static: only the ambient status pulses and the container fade-up move. Bars don't grow, the area chart doesn't draw, numbers don't count, rows don't cascade.

Goal: give all five visuals a **calm, choreographed entrance plus quiet ambient life**, so each one "comes alive" when seen, then settles. Premium and restrained, per `DESIGN.md` ("calm fades, slight directional movement, no bounce, no parallax, no exaggerated scaling") and the motion vocabulary in `docs/product-visuals-system.md`.

**Key enabler:** only one visual is active at a time in the accordion, so there is no cumulative motion budget problem. Each visual can be choreographed richly.

## 2. Scope

**In scope:**
- A shared motion layer (`src/components/product/motion.tsx`) with reusable variants + timing tokens.
- Animating the shared chart parts (`parts.tsx`): `SegmentedBar`, `ValueBar`, `Sparkline`, `AreaLine`.
- An `AnimatedNumber` helper for count-ups, and a `MetricCell` numeric-animation path.
- Per-visual entrance choreography for all 5 visuals.
- Ambient life: keep existing pulses; add a soft glow on the `AreaLine` end dot.

**Out of scope (deferred):**
- "Living dashboard" perpetual data simulation (numbers ticking on a loop, feed rows auto-appearing). Considered and explicitly not chosen.
- The 3 unbuilt visuals (Command Center, Decision Engine, Integration Network) and their dash-flow/hub-glow motion.
- Any change to the hero, the handoff section, or the homepage `FeatureAccordion` container fade-up (already shipped).

## 3. Motion model

When a visual scrolls into view (or re-mounts on tab switch), it plays a staggered entrance, then settles:

1. Container fade-up (already shipped on the `FeatureAccordion` wrapper).
2. Children cascade in via a stagger container (~60ms between siblings): rows, cells, pills `opacity 0→1, y 8→0`.
3. Bars grow, charts draw, numbers count — concurrent with the cascade, slightly trailing.
4. Settle. Persisting ambient motion: status pulses (`LiveStatus`, breaching SLA dot, compliance feed dot) and the `AreaLine` end-dot glow. Nothing else loops.

**Trigger:** Framer Motion `whileInView` with `viewport={{ once: true, amount: 0.3 }}`. On initial page load the below-fold visual waits until scrolled into view; on tab switch the remounted visual is already in view and plays immediately. `useReducedMotion()` short-circuits to the final state.

## 4. Timing and easing tokens (`motion.tsx`)

From `docs/product-visuals-system.md` motion vocabulary + `DESIGN.md`:

```
EASE_ENTRANCE = [0.16, 1, 0.3, 1]      // calm ease-out for entrances
EASE_STATE    = [0.2, 0.7, 0.2, 1]     // state transitions / number shift
STAGGER       = 0.06                    // 60ms between siblings
DUR_ITEM      = 0.5                      // row/cell fade-up
DUR_BAR       = 0.8                      // bar grow / chart draw
DUR_COUNT     = 1.0                      // number count-up
PULSE         = 2.4                      // existing status pulse (unchanged)
TINT          = "#9CB4E8"               // number-shift tint color (--status-focus)
```

Exports: `staggerContainer` (variants with `staggerChildren: STAGGER`), `fadeUpItem` (variants: hidden `{opacity:0, y:8}` → show `{opacity:1, y:0, transition:{duration:DUR_ITEM, ease:EASE_ENTRANCE}}`). A `useReducedMotion`-aware helper returns the settled state when motion is reduced.

## 5. Shared parts animation (`parts.tsx`)

Each part gains an optional `animate?: boolean` (default `true`) and animates on mount-in-view. Transforms only:

- **SegmentedBar** — each segment grows `scaleX 0→1` from its left edge (`transform-origin: left`), staggered left→right. `% label` fades in after its segment.
- **ValueBar** — fill grows `scaleX 0→1` from left over `DUR_BAR`.
- **Sparkline** — each bar rises `scaleY 0→1` from the bottom (`transform-origin: bottom`), staggered.
- **AreaLine** — line path draws via `pathLength 0→1` (Framer animates SVG `pathLength`); area fill fades in behind it; the end dot scales in and gains a soft pulsing glow (`box-shadow`/SVG filter, `PULSE`-rate, reduced-motion stills it).

Reduced motion: all parts render at final state (`scaleX/Y: 1`, `pathLength: 1`, no glow loop).

## 6. Numbers

New `AnimatedNumber` (`motion.tsx` or a small component): props `{ value: number, prefix?, suffix?, decimals? }`. Counts from 0 → `value` over `DUR_COUNT` using a Framer motion value + `useReducedMotion`; writes the formatted string to a ref/`motion` text node, never per-frame React state. `tabular-nums` keeps width stable.

- **Clean numerics** (`97.4%`, `18.4%`, `64%`, account counts like `12,847`) use `AnimatedNumber` (count from zero).
- **Composite strings** (`$847.2M`, `$148.62`, `42% → 47%`) keep their static string but use the **number-shift**: on entrance the text briefly tints to `TINT` then resolves to default over `DUR_COUNT` with `EASE_STATE`. (Counting a formatted-currency or `a → b` string reads awkwardly.)

`MetricCell` gains an optional numeric path: when given an animatable value it renders `AnimatedNumber`; otherwise it renders the string with the number-shift tint. Existing `value: string` callers keep working.

## 7. Per-visual choreography

| Visual | Entrance choreography |
|---|---|
| **PlacementMatrix** | Header fades; queue strip slides in (`x` small); 4 tier rows cascade; each `SegmentedBar` grows; account counts count up; footer pills fade. |
| **OptimizationEngine** | 3 vendor rows cascade; liquidation `%` counts up; band tags (`HIGH/MID/LOW`) pop in (`scale 0.9→1`, opacity); `42% → 47%` shift tints in (number-shift); green bonus callout fades up last. |
| **IssuesWorklist** | Filter pills fade; 5 issue rows cascade; SLA timers tint in; **breaching dot keeps pulsing** (existing); 3 metric tiles count up. |
| **ReportingDashboard** | 4 panels fade in staggered; tier bars grow; net-back `AreaLine` draws + end-dot glow; top-vendor rows cascade; SLA `97.4%` counts up; sparkline rises. |
| **ComplianceStandards** | Adherence bars grow + `%` counts up; status tags pop; exceptions feed rows cascade; **live feed dot keeps pulsing** (existing). |

The 3 currently-static visuals (`PlacementMatrix`, `OptimizationEngine`, `ReportingDashboard`) become `"use client"` (already dynamic-imported, so no initial-bundle cost).

## 8. Performance and accessibility

- Animate only `transform` (`scaleX/Y`, `translate`, `scale`) and `opacity`, plus SVG `pathLength`. No `width`/`height`/`top`/`left`.
- Count-ups use a Framer motion value + `onChange` writing to a DOM/`motion` node; no per-frame `setState` (`rerender-use-ref-transient-values`).
- `useReducedMotion()` everywhere: entrances, count-ups, bar grows, chart draws, and all glows collapse to final state / stilled.
- Below-fold + one-visual-at-a-time → no LCP or CLS impact; entrance reserves final layout (no reflow as bars grow, since `scaleX` doesn't change layout box).
- `whileInView once: true` so the choreography runs once per view; tab-switch remount replays it naturally.

## 9. Files

| File | Change |
|---|---|
| `src/components/product/motion.tsx` | Create: timing tokens, `staggerContainer`/`fadeUpItem` variants, `AnimatedNumber`, reduced-motion helper |
| `src/components/product/visuals/parts.tsx` | Add `animate` prop + entrance motion to SegmentedBar/ValueBar/Sparkline/AreaLine |
| `src/components/product/primitives/MetricCell.tsx` | Optional numeric-animation path |
| `src/components/product/visuals/PlacementMatrix.tsx` | `"use client"` + choreography |
| `src/components/product/visuals/OptimizationEngine.tsx` | `"use client"` + choreography |
| `src/components/product/visuals/ReportingDashboard.tsx` | `"use client"` + choreography |
| `src/components/product/visuals/IssuesWorklist.tsx` | Choreography (already client) |
| `src/components/product/visuals/ComplianceStandards.tsx` | Choreography (already client) |

## 10. Testing / verification

Local Next server does not run in this sandbox (see `[[project_next_server_hangs_in_sandbox]]`). Verify by deploying to Vercel and walking each visual's choreography via the Chrome MCP on the live URL: confirm bars grow, chart draws, numbers count, rows cascade, and that ambient pulses persist after settle. Run a reduced-motion pass (`prefers-reduced-motion: reduce`) confirming every visual renders final-state with no entrance and stilled pulses.

## 11. Risks

- **Count-up readability** — formatted/composite values look wrong counting from zero. Mitigation: number-shift tint for composites, count-up only for clean numerics (§6).
- **Motion feeling busy** — too much at once contradicts the calm rule. Mitigation: single staggered pass, settle to near-static, ambient limited to existing pulses + one end-dot glow.
- **pathLength on the area fill** — only the stroke path supports `pathLength` draw; the fill should fade in (not draw). Mitigation: animate stroke `pathLength` + fill `opacity` separately (§5).
- **Bundle** — 3 visuals become client. Mitigation: they are already `next/dynamic` with `ssr:false`, so they are not in the homepage initial bundle.
