# Design: Product-visuals foundation + 5 FeatureAccordion visuals

Date: 2026-06-04
Status: Approved direction, pending spec review
Owner: Connor

## 1. Problem and goal

The homepage `FeatureAccordion` ("How it works — One platform across the recovery lifecycle") pairs each of its 5 capability items with a product visual on the right. Today that visual is a placeholder card reading `Visual / {visualLabel}` ([FeatureAccordion.tsx:131-153](../../../src/components/sections/FeatureAccordion.tsx#L131)). The 5 slots are visibly empty.

This increment builds the **canonical product-visual system** (a set of reusable primitives) and uses it to fill all 5 accordion slots with real, animated, on-brand React components — not generated screenshots. Per `docs/midjourney-prompts.md`, AI-generated UI reads as cheap; product screens are built as components and image generation is reserved for atmospheric/brand-motif imagery.

This is the **"upgrade in place"** decision: the new `src/components/product/` system becomes the one canonical visual language going forward. The existing `src/components/sections/mockups/` (handoff-tab mockups) are **not** migrated in this increment — that is a deliberate, separate follow-up.

## 2. Scope

**In scope (this increment):**
- 7 foundation primitives at `src/components/product/primitives/`.
- 5 composed visuals filling the accordion slots, built verbatim from `docs/multimodal-image-prompts.md` specs.
- Wiring all 5 into `FeatureAccordion`'s right column, keyed by item id.
- Additive design tokens in `globals.css` + documentation in `DESIGN.md`.
- Landing the 4 reference docs into `docs/`.

**Out of scope (deferred, documented in §10):**
- Migrating the existing handoff-tab mockups onto the new system.
- Command Center, Decision Engine, Integration Network components (specs #1, #2, #5).
- Platform sub-page heroes (`/platform/*`) reuse.
- Midjourney brand-motif / atmospheric imagery.
- Resolving the content-architecture overlap (Issues + Reporting appear in both the handoff tabs and the accordion).

## 3. Source of truth for content

Every visual's copy, numbers, and layout come **verbatim** from `docs/multimodal-image-prompts.md`. No invented metrics. All numeric values are placeholders pending Andrew's sign-off and ship behind a `[CLAIMS REVIEW]` flag:

| Accordion id | Component | Spec in multimodal doc |
|---|---|---|
| `placement` | `PlacementMatrix` | §6 Placement matrix |
| `optimization` | `OptimizationEngine` | §7 Optimization engine |
| `issues` | `IssuesWorklist` | §3 Issues worklist |
| `reporting` | `ReportingDashboard` | §4 Reporting dashboard |
| `compliance` | `ComplianceStandards` | §8 Compliance and work standards |

Each component holds its content as a typed local data object (so copy edits and the future Andrew-approved values are one-file changes). `[COI REVIEW]` applies to the CFPB / compliance language in `IssuesWorklist` and `ComplianceStandards`.

## 4. File layout (new)

```
src/components/product/
  primitives/
    ProductCanvas.tsx     # dark canvas: radial indigo bloom + 56px masked grid
    ProductCard.tsx       # glass card: gradient fill, inset highlight, ambient shadow
    EyebrowLabel.tsx      # uppercase eyebrow + glowing 4px indigo dot
    LiveStatus.tsx        # pulsing-dot pill (LIVE / EVALUATED / AUDITED)
    EventBadge.tsx        # floating top-right canvas notification, long-dwell cycle
    MetricCell.tsx        # KPI: label + value (+ unit suffix) + colored delta
    StatPill.tsx          # small inline footer metric pill
    index.ts
  visuals/
    PlacementMatrix.tsx
    OptimizationEngine.tsx
    IssuesWorklist.tsx
    ReportingDashboard.tsx
    ComplianceStandards.tsx
    index.tsx             # AccordionVisual({ id }) switch, mirrors mockups/index.tsx
```

Conventions mirror the existing `sections/mockups/`: `"use client"` only where motion needs it, `forwardRef`, `className` passthrough, `React.memo` wrap, no `any`, `tabular-nums` on all numerics.

## 5. Primitive contracts

Each primitive is small, single-purpose, independently testable.

- **ProductCanvas** — outer container. Props: `bloom?: "single" | "dual"`, `className`, `children`. Renders `#171721` base, one/two radial indigo blooms (`rgba(82,102,235,0.10–0.14)`), a 56px grid with an edge-fading radial mask, 16px radius, 26–28px padding. Static (no motion).
- **ProductCard** — glass card. Gradient `rgba(255,255,255,0.028)→0.008`, 1px `rgba(255,255,255,0.07)` border, inset top highlight, ambient shadow, 14px radius, 22–24px padding. Static.
- **EyebrowLabel** — `children` text. 10.5px uppercase, 0.12em tracking, `var(--status-focus)` (#9CB4E8), glowing 4px indigo dot prefix.
- **LiveStatus** — `label`, `tone?: "live" | "success"`. Pill, pulsing dot (2.4s, scale 0.85→1.15, opacity 0.45→1), `useReducedMotion` stills it to a static dot.
- **EventBadge** — `label`. Floats top-right of the **canvas** (not card). Cycle: 14–16s long-dwell appear/fade. Reduced-motion: rendered statically visible.
- **MetricCell** — `label`, `value`, `unit?`, `delta?`, `deltaTone?: "success" | "breach" | "neutral"`. Label 10.5px uppercase tertiary; value 17–18px/500/-0.022em with smaller unit suffix; delta colored.
- **StatPill** — `label`, `tone?`. Small inline pill for footers.

All: `useReducedMotion` (Framer) gates every animation; pass `@axe-core/playwright` with no violations; `React.memo`.

## 6. Design tokens (additive, non-breaking)

Add to the dark `:root`/theme block in `src/app/globals.css` and the `@theme` mapping, and document in a new `DESIGN.md` subsection (same commit, per the docs-in-sync rule):

```
--status-success:  #5BCB89;
--status-warning:  #FFB86C;
--status-breach:   #E27676;
--status-special:  #BB86FC;   /* SCRA */
--status-focus:    #9CB4E8;   /* alias of existing --focus, named for product use */
--product-canvas:  #171721;
--product-card:    #1B1B27;
```

No existing token values change, so nothing else can regress. Primitives consume these via CSS vars (never hardcoded hex), per the "use tokens from DESIGN.md" rule.

## 7. Composed-visual composition

Each visual is `ProductCanvas > (EyebrowLabel + header row with LiveStatus) > body (rows / matrix / panels per spec) > footer StatPills`, plus an `EventBadge` where the spec calls for one. Content is verbatim from the multimodal spec. Density per spec:

- **PlacementMatrix** — routing-rules matrix: highlighted "1,847 accounts ready to route" queue strip, 4 tier rows with segmented graduated-indigo allocation bars + account counts, footer pills.
- **OptimizationEngine** — closed-pool results: 3 vendor rows (liquidation % + band tag + `from→to` allocation shift arrow), green bonus callout, footer. Right pill "EVALUATED".
- **IssuesWorklist** — 5 issue rows (type chip, mono ID + masked acct, description, assignment, SLA timer with colored dot + status), filter-pill row, 3 metric tiles. Uses success/warning/breach/special tones + breaching-timer pulse.
- **ReportingDashboard** — 2×2 panel grid: liquidation-by-tier bars, net-back area line, ranked top-vendors, SLA 97.4% + sparkline. Range tabs. Footer "Power BI feed active".
- **ComplianceStandards** — 3 vendor adherence rows (bar + status pill), live auto-surfaced-exceptions feed (deceased/bankruptcy/SCRA with pulsing dot), footer. Right pill "AUDITED".

## 8. Integration into FeatureAccordion

`FeatureAccordion`'s right column currently maps `items` to placeholder divs. Replace the placeholder block ([FeatureAccordion.tsx:141-150](../../../src/components/sections/FeatureAccordion.tsx#L141)) with `<AccordionVisual id={item.id} />`, keeping the existing absolute-positioned cross-fade wrapper and `aria-hidden={activeId !== item.id}`.

- The visuals render **edge-to-edge inside the slot** (drop the `p-8` wrapper for real visuals; `ProductCanvas` owns its own padding). The slot's `bg-[var(--card)] ring-1 ring-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden` becomes the outer frame; `ProductCanvas` fills it.
- `FeatureAccordionItem` keeps `visualLabel` as the accessible fallback / alt-style label; no content-map change required.
- Only the active item animates: inactive (aria-hidden) visuals pause/disable motion to keep CPU flat (only one visual is ever visible). Implementation may gate on the `isActive` prop or render-active-only.

## 9. Responsive + performance

- Each visual renders legibly at **320 / 480 / 768 / 1024** container widths using container queries. Below ~480px, a condensed layout (fewer rows, smaller type, secondary elements hidden) per the doc's open mobile question. The accordion's mobile visual min-height may need bumping from `min-h-[14rem]` to fit a condensed composition.
- FeatureAccordion sits well below the fold (after hero + handoff + trust band), so these visuals are **not** LCP-critical and do not touch the Phase 5.3 gate. Still, to protect the homepage client bundle, the 5 visuals are candidates for `next/dynamic` lazy import (decided in the plan); motion is `useReducedMotion`-gated throughout.

## 10. Deferred placement map (documented, not built)

The remaining 3 specs and reuse targets, recorded so "where they fit" is settled:

| Spec | Component | Future home |
|---|---|---|
| 1. Command center | `CommandCenter` | Homepage hero finale swap **or** a Platform/Handoff "Overview" tab |
| 2. Decision engine | `DecisionEngine` | `/platform/placement` + `/platform/optimization` heroes (tab-forked) |
| 5. Integration network | `IntegrationNetwork` | `IntegrationStrip` section + `/platform` overview |
| 6,7,3,4 | the 4 accordion visuals | also reused on the matching `/platform/*` sub-page heroes |
| — | Midjourney brand-motif (1 of 4 dirs) | atmospheric backdrops, deferred polish |

## 11. Docs to land (this increment)

Copy into `docs/` (the system references `docs/product-visuals-system.md` by path):
- `product-visuals-system.md`
- `asset-and-animation-guide.md`
- `midjourney-prompts.md`
- `multimodal-image-prompts.md`

## 12. Testing and acceptance

- All 7 primitives + 5 visuals render at 320/480/768/1024 with no overflow/clipping.
- `@axe-core/playwright` passes with no violations on the homepage with each accordion item active.
- All existing Playwright specs (170) stay green; accordion keyboard nav + cross-fade unchanged.
- Reduced motion: every pulse/cycle/transition stilled; visuals render fully legible static.
- TypeScript strict, no `any`; `npm run build` clean; lint clean.
- Visual review by Connor on the Vercel preview.

## 13. Risks

- **Bundle weight** — 5 animated client components on the homepage. Mitigation: lazy import, lean per-visual JS, reduced-motion gating, animate-active-only.
- **Density at mobile** — dense specs vs short mobile slot. Mitigation: explicit condensed <480px composition per visual; bump mobile min-height.
- **Claims exposure** — placeholder metrics. Mitigation: `[CLAIMS REVIEW]` flag in the PR; content isolated in per-component data objects for one-edit replacement once Andrew approves; `[COI REVIEW]` on compliance/CFPB language.

## 14. Tracking

Lightweight: this design → one implementation plan (via `writing-plans`). If the broader system rollout (migrate handoff mockups, build Command Center / Decision Engine / Integration Network, platform sub-pages) proceeds, open a GSD milestone (M6 "Product visuals") with full ceremony at that point. This increment stays outside the M5 roadmap, which remains blocked on Phase 5.3.
