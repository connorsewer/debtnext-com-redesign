# Phase 13: Visual system consolidation - Research

**Researched:** 2026-06-12
**Domain:** React 19 / Next 15 component-facade migration; GSAP-pinned homepage handoff; archetype (Console) re-point behind a stable signature
**Confidence:** HIGH (all claims verified against the live codebase this session)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (verbatim from 13-CONTEXT.md)

**Regression firewall:**
- **D-01:** `HomepageHero.tsx` and `HomepageHandoffSection.tsx` must not change. `HomepageHero.tsx:9` imports `FramedDashboard` from the direct file path `@/components/sections/mockups/FramedDashboard`. `HomepageHandoffSection.tsx:8-11` imports `FramedDashboard, MockupForTab, mockupTitleForTab` from the `@/components/sections/mockups` index facade.
- **D-02:** Because `HomepageHero` imports `FramedDashboard` by direct file path, **`FramedDashboard.tsx` cannot move.** Keep it exactly where it is. This overrides the roadmap's open relocation question.
- **D-03:** `sections/mockups/index.tsx` stays as the stable public facade, exporting `MockupForTab`, `mockupTitleForTab`, and `FramedDashboard` with byte-identical signatures.

**Front A — handoff consolidation (core deliverable):**
- **D-04:** Repoint `MockupForTab`'s internals so each of the 4 tabs renders a **Console-archetype instance** instead of the bespoke mockups. Signatures unchanged; only rendered content changes.
- **D-05:** "Retire `sections/mockups/`" means: after parity, delete the 4 bespoke per-tab mockup files; the dir slims to `index.tsx` + `FramedDashboard.tsx`. The directory does not fully disappear.
- **D-06:** Migration order: migrate `placement` first as proof, validate the full regression-spec set, then `performance`, `issues`, `reporting`. Do not migrate all four blind.
- **D-07:** Regression-spec set that must stay green: (1) GSAP pin anchored; (2) bezel viewport-centered across the hero→Platform seam; (3) dashboard does not move during the crossfade; (4) reduced-motion spec green; (5) platform-mobile spec green. Planner names the exact spec files.

**Front B — FeatureAccordion bespoke visuals (P13-01, RAISE in planning):**
- **D-08:** The four bespoke FeatureAccordion visuals (`PlacementMatrix`, `OptimizationEngine`, `IssuesWorklist`, `ReportingDashboard`, registered in the `VISUALS` map) are LIVE, not dead. Deletable only after registry entries are repointed.
- **D-09 (recommended default, planner to confirm):** Scope Front A as the non-negotiable core. For Front B, evaluate whether Console payloads + Phase 11 Flagships cleanly back the FeatureAccordion. If yes: repoint the `VISUALS` registry, delete the four `Lazy*` wrappers + components as a set, verify the `VISUALS.reporting` key migration explicitly. If no / higher risk than value: keep the bespoke visuals (LIVE) and defer P13-01 to a later cleanup, noting it in HANDOFF.md. Do not delete LIVE components without a working replacement.

**Tokens + dead assets (P13-02):**
- **D-10:** Any replacement Console payload that carries chart color must use DESIGN.md chart tokens only. The off-token gradient endpoints in `PlacementMockup.tsx:10-12` (`#22c55e`, `#d97706`, `#0891b2`) must not survive. Verify no off-token hex literals remain in migrated handoff visuals.
- **D-11:** Confirm the 6 dead `dashboard-dark.png` BenefitSplit fallbacks (closed in Phase 10) are gone and grep for any remaining dead PNG references; remove any found.

**Claims / COI:**
- **D-12:** Any metric in a Console payload or caption gets `[CLAIMS REVIEW]`; any vendor/TSI framing gets `[COI REVIEW]`. Non-blocking for M6 visual payloads per 2026-06 pre-clearance, but markers stay for audit. Real-shaped anonymized figures only.

### Claude's Discretion (verbatim)
- Exact Console payload shape per tab, lazy-skeleton box matching (Pitfall 4), and whether the 4 handoff payloads live in `src/content/visuals/` or co-located. Decide consistent with the Phase 11/12 typed-payload pattern.

### Deferred Ideas (OUT OF SCOPE)
- Full removal of the `sections/mockups/` directory (impossible while the firewall imports `FramedDashboard` and the facade by those paths).
- If D-09 resolves to "defer," the P13-01 FeatureAccordion repoint + bespoke-visual deletion becomes a later cleanup phase item.
- Hero `dashboard-dark.png` fate — that is **Phase 15 (HOMEVIS-01)**, not Phase 13 (see Dead-Asset Sweep below).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SYSVIS-01 | `sections/mockups/` merged into the archetype library; homepage handoff renders Console instances behind unchanged `MockupForTab`/`mockupTitleForTab` signatures, GSAP pin + `FramedDashboard` bezel unchanged. | Console contract verdict + double-frame fix (§Console Contract); facade-internals-only migration order (§Migration Order); regression-spec gate (§Validation Architecture). |
| SYSVIS-02 | The 6 dead `dashboard-dark.png` BenefitSplit fallbacks are removed; the hero's use of the asset is resolved. | The 6 BenefitSplit fallbacks were removed in Phase 10 (10-06-PLAN). The ONLY remaining `dashboard-dark.png` reference is the hero finale, which is **Phase 15's** deliverable per ROADMAP. Phase 13's SYSVIS-02 obligation = confirm-and-document, not delete the hero asset (§Dead-Asset Sweep). |
</phase_requirements>

## Summary

Phase 13 re-points the homepage handoff's `MockupForTab` switch so each of the 4 platform tabs renders a `Console` archetype instance fed a typed payload, while leaving the two firewall files (`HomepageHero.tsx`, `HomepageHandoffSection.tsx`) and the `FramedDashboard` bezel byte-identical. The facade-indirection in `sections/mockups/index.tsx` makes this holdable: the firewall calls `MockupForTab({ id })` and `mockupTitleForTab(id)`, never the bespoke components directly, so the internals can change behind the stable export surface. [VERIFIED: read of both firewall files + index.tsx]

There is exactly **one** structural landmine, and it is decisive: `Console` renders its content inside `ProductCanvas`, which paints its own `rounded-[16px] bg-[var(--product-canvas)] p-[26px]` dark card with radial blooms and a 56px grid. The current bespoke mockups render **bare** inner content (a plain `<div>`), and the parent (`HomepageHandoffSection` / `HomepageHero`) supplies the single `FramedDashboard` bezel around them. A naive `<Console data={...} />` placed inside `FramedDashboard` therefore **double-frames** (bezel + ProductCanvas card). The migration must render Console's bare slots without `ProductCanvas`, or accept a documented nested-canvas look and re-baseline. The clean path: use Console's compound slot API (`<Console.Header/>`, `<Console.Callout/>`, `<Console.Rows/>`, `<Console.Pills/>`) but **not** the `ConsoleRoot` wrapper, because `ConsoleRoot` is what mounts `ProductCanvas`. The slots require the `ConsoleContext` provider, so the migration needs a thin bare-context wrapper. This is the single highest-value finding for the planner. [VERIFIED: Console.tsx lines 229-248, ProductCanvas.tsx lines 28-37, all 4 mockup files]

The regression-spec reality is the second decisive finding. The roadmap and D-07 name five behaviors that "must stay green," but **only two of them are actually covered by an automated spec today**: `platform-mobile.spec.ts` (mobile stacked layout + desktop-pins-at-1440 height) and `reduced-motion.spec.ts` (+ `reveal-fail-open.spec.ts`, `hero-gsap-free-mobile.spec.ts`). The three desktop cinematic behaviors D-07 cares most about — GSAP pin anchored, bezel viewport-centered across the seam, dashboard static during crossfade — were verified by **human eye on the Vercel preview**, not by Playwright (STATE.md: "Pending human-verify: desktop cinematic visual parity"). The planner must decide whether to (a) add Wave-0 regression specs for these three before migrating, or (b) gate each tab on the existing specs + a documented human-verify checkpoint. Given D-06's "placement-first, validate, then the rest" mechanism, adding the missing specs in Wave 0 is the only way that gate has teeth. [VERIFIED: full tests/ scan]

**Primary recommendation:** Build a thin bare-canvas Console wrapper (Console slots without `ProductCanvas`), author 4 typed `ConsoleData` payloads in `src/content/visuals/`, re-point `MockupForTab`'s 4 switch arms to render that wrapper, migrate placement-first behind a Wave-0 regression-spec set (add the 3 missing cinematic specs), keep `mockupTitleForTab` returning the existing title strings (move them into the payloads). Front B (P13-01): **PROCEED** — it is low-risk and the backing data already exists (see §Front B verdict). Delete the 4 bespoke mockup files only after placement→performance→issues→reporting all pass parity.

## Console Contract (CRITICAL — Question 1)

### What Console accepts
[VERIFIED: src/components/product/visuals/Console.tsx]

```ts
export interface ConsoleProps {
  data: ConsoleData;          // required typed payload (zero baked numbers)
  children?: React.ReactNode; // optional slot composition; omit = default flat render
  className?: string;
}
export const Console = Object.assign(ConsoleRoot, { Header, Callout, Rows, Pills });
```

`ConsoleData` shape (from `src/content/visuals/types.ts`, lines 32-82):
- `header`: `{ eyebrow?, title, subtitle?, status?: {label, live?}, kpi?: {caption, value, valueSuffix?, decimals?, sub?} }`
- `callout?`: `{ icon?: "route"|"alert"|"check", title, sub?, action? }`
- `columns?`: `{ primary?, bar?, trailing? }`
- `rows`: `ConsoleRow[]` — `{ primary, secondary?, bar?: {segments[], label?, tone?}, trailing?: {value, prefix?, suffix?, decimals?, animate?: "count"|"shift"|"none"}, align? }`
- `pills?`: `{ label, tone?: "indigo"|"neutral" }[]`
- `ariaSummary`: REQUIRED text alternative (governed copy)

### Does Console render its own frame? YES — this is the double-frame risk
[VERIFIED: Console.tsx:230-236 → `ProductCanvas role="img" aria-label=...`; ProductCanvas.tsx:31-36 → `rounded-[16px] bg-[var(--product-canvas)] p-[26px]` + radial bloom + 56px grid]

`ConsoleRoot` wraps everything in `<ProductCanvas>`, which is a fully-styled dark card. The current bespoke mockups render BARE content — `PlacementMockup` returns a plain `<div ref={containerRef}>` with no canvas, no padding box, no rounding. [VERIFIED: PlacementMockup.tsx:24-25, all 4 mockups identical pattern] The parent supplies the ONE frame via `FramedDashboard` (a different bezel: outer border + traffic-light chrome bar + `p-3/p-4/p-5` inner). [VERIFIED: FramedDashboard.tsx:24-43]

**Consequence:** `<FramedDashboard><Console data={...} /></FramedDashboard>` = FramedDashboard bezel wrapping a ProductCanvas card = two nested dark surfaces with two paddings and two corner radii. This is a visible regression, not parity.

### The fix (recommended)
Render Console's slots **without** `ProductCanvas`. Two viable mechanics:

1. **Bare-context wrapper (recommended).** A small new component provides `ConsoleContext` and renders the slots in a plain flex column — copying the layout of `ConsoleRoot`'s default render (`Header → Callout → Rows → Pills`) but dropping the `ProductCanvas` wrapper and its `role="img"`/`aria-label`. Because `useConsole()` reads `React.use(ConsoleContext)` (Console.tsx:39-47), the slots work under any provider, not only `ConsoleRoot`. The `aria-label` (data.ariaSummary) must move onto the bare wrapper's root so the a11y contract (Pitfall 8) is preserved. This is the cleanest: zero change to Console.tsx, zero double-frame, full slot reuse.

2. **Add a `frame?: boolean` / `bare?` prop to `ConsoleRoot`** that swaps `ProductCanvas` for a plain `<div>`. This edits Console.tsx (a shared, Phase-11-proven file) — higher blast radius, touches platform/solutions consumers' type surface. Lower-risk to leave Console.tsx untouched and add the wrapper in (1).

> Discretion call (planner): wrapper-in-`sections/mockups/` vs. a shared `Console.Bare` export in `product/visuals/`. The latter is more reusable; the former keeps the firewall blast radius inside the dir being migrated. Recommendation: a shared bare renderer in `product/visuals/` (e.g. `ConsoleBare` or `Console.Bare`) since Phase 14/15 will likely want the same bare-inside-a-frame capability. Either way, Console.tsx's existing exports stay backward-compatible.

### Feeding each of the 4 tabs
Author 4 `ConsoleData` payloads (one per tab) under `src/content/visuals/` using the exact data already living in the bespoke mockups, mapped field-for-field. The `placement.ts` reference payload (lines 34-85) already proves `ConsoleData` expresses the placement case; the type-doc comments in `types.ts` were explicitly written to cover the **Mockup** cases too (BarSpec single-segment for pct fills, `header.kpi` for the "Inbound batch" block, `header.status.live` for the "Engine running" pulse). [VERIFIED: types.ts:23-30, 36-44; placement.ts:13-24 validation conclusion] Mapping notes per tab:

- **placement** (`PlacementMockup`): KPI block "Inbound batch / 120,418 / accounts · $284.6M" → `header.kpi`; "Engine running" pulse → `header.status: {label:"Engine running", live:true}`; the 4 pool rows (Pre-collect 35% / Primary 28% / Secondary 18% / Tertiary 12%, each with vendor count) → `rows` with single-segment `bar.segments:[pct]` + `secondary:"N vendors"` + `trailing:{value:pct, suffix:"%"}`. The off-token gradient endpoints (D-10) disappear: bar color comes from `tone` tokens, not gradient hex.
- **performance** (`VendorPerformanceMockup`): header "Liquidation, all pools / 14.7% / +1.3% vs prior 30d" → `header` (title/kpi or subtitle); 4 vendor rows (grade badge, name, liq%, delta, sparkline). NOTE: the grade badge + sparkline are NOT native Console row features. The planner must decide whether to (a) approximate with `bar`/`trailing` + pills, accepting a slightly different but token-clean look, or (b) extend the Console row schema. Recommendation: approximate within the existing schema; a sparkline-per-row extension is scope creep. This is the tab with the **least clean** 1:1 mapping — flag for a parity checkpoint.
- **issues** (`IssuesMockup`): 3 stat tiles (Open 127 / Due today 12 / Overdue 3) + 3 issue cards with SLA pills and status. Maps to `header.kpi` or a small stat row + `rows` with `secondary` (account · vendor) and `trailing`/`pills` for SLA/status. Label-paired status (Pitfall 8) already a Console concern via `LiveStatus`/tones.
- **reporting** (`ReportingMockup`): 3 summary tiles + a dual-polyline 8-week chart + footer. The dual-line chart is NOT a Console feature — Console is a worklist/KPI archetype, not a time-series chart. This tab arguably wants `DataStory` (`chart.kind:"area"`) rather than `Console`. BUT D-04 locks "Console-archetype instance" for all 4 tabs. Recommendation: render the reporting tab as a Console of summary KPIs + rows (drop or simplify the dual-line trend), OR raise with the user that reporting may justify a DataStory exception. **Flag this as an Open Question** — it is the second-least-clean mapping after performance.

### Reconciling with `mockupTitleForTab` + FramedDashboard title
The firewall calls `<FramedDashboard title={mockupTitleForTab(activeId)}>` (HandoffSection.tsx:209) and `<FramedDashboard title="DebtNext · Executive Portfolio Overview">` (hero finale, a hardcoded literal NOT from the facade — Phase 15's concern). `mockupTitleForTab` must keep returning the existing title strings ("Placement run · 12:04 PM", "Vendor scorecard · YTD", "Issues queue · all vendors", "Liquidation trend · 8 weeks"). [VERIFIED: index.tsx:57-68, all 4 `*MockupTitle` consts] Cleanest: move each title string into its payload module (or keep them as exported consts) and have `mockupTitleForTab` return them. The title is rendered by FramedDashboard's chrome bar, NOT by Console — so Console's own `header.title` is the in-canvas title and the FramedDashboard `title` is the window-chrome label. Both coexist exactly as today (the bespoke mockups already have their own internal headers + the chrome title). No conflict.

## Migration Order (CRITICAL — Question 2)

The facade-internals-only approach in CONTEXT **works** — confirmed. [VERIFIED: firewall files call only `MockupForTab`/`mockupTitleForTab`/`FramedDashboard`; never the bespoke components]

Recommended wave structure (mirrors Phase 11's "prove placement end-to-end, then fan out"):

**Wave 0 — de-risk + scaffolding (before touching any tab):**
1. Build the bare Console renderer (no `ProductCanvas`) + verify it renders the existing placement data identically to `PlacementMockup` inside `FramedDashboard`.
2. Add the THREE missing regression specs (pin anchored, bezel viewport-centered across the seam, dashboard static during crossfade) so D-07's gate has teeth. Without these, "validate the full regression-spec set against placement" (D-06) cannot be done by CI — only by human eye.
3. Author the `placement` `ConsoleData` payload in `src/content/visuals/` (e.g. `handoff-placement.ts` or reuse/extend the existing `placement.ts`).

**Wave 1 — placement proof (D-06):**
4. Re-point `MockupForTab`'s `case "placement"` to the bare Console + payload. Keep all other arms on the bespoke components.
5. Run the full regression-spec set + human-verify the desktop cinematic on a preview. Gate: all green + visual parity.

**Wave 2 — fan out (only after placement passes):**
6. Re-point `performance`, then `issues`, then `reporting` (each its own task, each re-running the gate). Author each payload. Flag performance (grade/sparkline) and reporting (dual-line chart) parity at their checkpoints.

**Wave 3 — retire + cleanup:**
7. After all 4 tabs render through Console and the gate is green, delete the 4 bespoke mockup files (`PlacementMockup`, `VendorPerformanceMockup`, `IssuesMockup`, `ReportingMockup`) and their `index.tsx` re-exports/imports. The facade keeps exporting `MockupForTab`/`mockupTitleForTab`/`FramedDashboard` with identical signatures (D-03/D-05). The dir slims to `index.tsx` + `FramedDashboard.tsx`.
8. P13-02 token sweep + dead-PNG confirmation (see below).
9. Front B (P13-01) if D-09 resolves to PROCEED (independent of Front A; can be its own wave/task).

**Firewall guarantee mechanism:** the planner should add a byte-level check (e.g. `git diff --exit-code` on the two firewall files, or a stored hash) to the phase verification so any accidental edit fails the gate. The firewall files were last meaningfully changed in Phase 5.3 (lazy-GSAP); they must end Phase 13 unchanged.

## Standard Stack

No new libraries. Phase 13 is a re-point within the existing stack. [VERIFIED: package usage across read files]

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15 (App Router) | `next/dynamic` lazy archetypes (`{ ssr:false, loading }` inline literals — Turbopack requirement) | Already the project standard |
| react | 19 | `React.use(ConsoleContext)` for slot consumption | Console already uses it |
| framer-motion | (in repo) | Console row stagger/reveal via the motion barrel | Console/primitives already depend on it |
| gsap + @gsap/react | (in repo, lazy) | Pin/scrub — UNCHANGED; lives only in `HeroCinematicController` via dynamic import | Parity, not new motion |

**Installation:** none.

## Architecture Patterns

### Facade indirection (the firewall mechanism)
`sections/mockups/index.tsx` exports `MockupForTab` / `mockupTitleForTab` / `FramedDashboard`. The firewall imports only these. Re-pointing the switch internals is invisible to the firewall. [VERIFIED]

### Bare-content-inside-shared-frame
The parent owns the single `FramedDashboard` bezel; the tab content renders BARE. Console violates this by default (`ProductCanvas`). The bare-renderer wrapper restores the contract. This is the load-bearing pattern for SYSVIS-01.

### Typed payload (Phase 11/12 pattern)
A visual = archetype + typed payload in `src/content/visuals/*.ts`, validated with `satisfies ConsoleData`. Mirror `placement.ts`. Every number carries `[CLAIMS REVIEW]`; vendor/TSI framing carries `[COI REVIEW]` (D-12). [VERIFIED: placement.ts header comments]

### Lazy skeleton box-matching (Pitfall 4)
`next/dynamic({ ssr:false, loading })` with a skeleton whose `min-h` matches the resolved box. The handoff currently renders the bespoke mockups eagerly (no lazy wrapper in `MockupForTab` — they're imported statically). [VERIFIED: index.tsx imports + switch] If the planner introduces lazy loading for the Console instances, the skeleton must reserve the resolved height INSIDE `FramedDashboard` (see CLS section). If it keeps them eager (simplest, matches today), there is no skeleton concern but the Console chunk enters the handoff path — measure against the `/` JS budget.

### Anti-Patterns to Avoid
- **Double-frame:** `<FramedDashboard><Console/></FramedDashboard>` with the default `ConsoleRoot`. Use the bare renderer.
- **Editing the firewall files** to "make Console fit." D-01 forbids it; the bare renderer makes it unnecessary.
- **Moving `FramedDashboard.tsx`.** D-02 forbids it (direct import in HomepageHero.tsx:9).
- **Deleting LIVE Front-B components before repointing.** D-08/P13-01 — repoint the registry first.
- **Migrating all 4 tabs in one task.** D-06 — placement first, validate, then fan out.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab content rendering | New per-tab components | `Console` slots + typed payload | The whole point of M6's archetype library; bespoke mockups are what we're retiring |
| The bezel | A new frame | `FramedDashboard` (unchanged) | Firewall (D-02); bezel parity is the acceptance criterion |
| Count-up numbers | Custom counters | Console `trailing.animate:"count"` (motion barrel) | Already proven Phase 11 |
| Chart color | Gradient hex (the P13-02 bug) | DESIGN.md `--chart-*` tokens via `tone` | D-10; off-token hex is the exact audit finding |

**Key insight:** Phase 13 is a deletion-by-substitution. The less new code, the smaller the regression surface on the riskiest visual surface in the build.

## Common Pitfalls

### Pitfall 1: Double-frame (ProductCanvas inside FramedDashboard)
**What goes wrong:** Console's `ConsoleRoot` paints a `ProductCanvas` card; `FramedDashboard` paints a bezel around it → two nested surfaces.
**Why:** the bespoke mockups render bare; Console doesn't.
**How to avoid:** bare Console renderer (slots without `ProductCanvas`); move `ariaSummary` onto the bare root.
**Warning signs:** visible inner rounded card with its own padding and bloom inside the window chrome; CLS box taller than the bespoke mockup.

### Pitfall 2: Phantom regression gate (specs that don't exist)
**What goes wrong:** D-06 says "validate the full regression-spec set against placement," but 3 of the 5 D-07 behaviors have no automated spec — so "validated" means "looked right on the preview."
**Why:** the desktop cinematic was human-verified, never Playwright-verified (STATE.md). [VERIFIED: tests/ scan found no pin/bezel/crossfade assertions]
**How to avoid:** add the 3 missing specs in Wave 0 BEFORE migrating placement.
**Warning signs:** a "green" placement migration that only ran `platform-mobile` + `reduced-motion`.

### Pitfall 3: CLS at the lazy swap (Pitfall 4 from the system)
**What goes wrong:** a lazy Console skeleton shorter/taller than the resolved Console box shifts layout inside `FramedDashboard`.
**Why:** the resolved Console height differs from the bespoke mockup height per tab.
**How to avoid:** if lazy, measure each tab's resolved box inside FramedDashboard and reserve it in the skeleton (the `lazy.tsx` flagship pattern reserves `min-h-[44rem]`). If eager (matches today), no skeleton — but watch the `/` JS budget.
**Warning signs:** LHCI CLS regression on `/`; dashboard "jumps" on tab switch.

### Pitfall 4: Reduced-motion fail-open on the new Console content
**What goes wrong:** Console rows animate in via `RevealStagger`/`RevealItem`; if a reveal parks at opacity:0 the new handoff content fails closed.
**Why:** `reveal-fail-open.spec.ts` skips `[data-handoff-section]` (line 135) because the section's opacity is scroll-scrubbed — so the new Console content inside it is NOT covered by that spec on the desktop path. The reduced-motion static branch (mobile/reduced) IS covered (it renders the stacked FramedDashboards).
**How to avoid:** the bare renderer must inherit the barrel's fail-open (it does, via `RevealStagger`/`RevealItem`); verify the mobile/reduced static stack shows the new Console content at opacity:1 (covered by `reduced-motion.spec.ts` + `platform-mobile.spec.ts`).
**Warning signs:** blank dashboard under reduced motion; `reduced-motion.spec.ts` `/` failing.

### Pitfall 5: performance/reporting tabs don't map cleanly to Console
**What goes wrong:** grade badges + per-row sparklines (performance) and the dual-line 8-week trend (reporting) are not native Console features.
**Why:** Console is a KPI/worklist archetype; the reporting trend is a time-series (DataStory territory).
**How to avoid:** approximate within the Console schema (recommended) OR raise a DataStory exception for reporting with the user (D-04 locks Console). Decide at the per-tab parity checkpoint.
**Warning signs:** trying to extend `ConsoleRow` with chart fields = scope creep.

## Code Examples

### The double-frame, illustrated
```tsx
// Source: VERIFIED Console.tsx:230-236 (ConsoleRoot) + ProductCanvas.tsx:31-36
// ConsoleRoot ALWAYS wraps in ProductCanvas (a styled dark card):
function ConsoleRoot({ data, children, className }: ConsoleProps) {
  return (
    <ConsoleContext value={data}>
      <ProductCanvas role="img" aria-label={data.ariaSummary} className={...}>
        {children ?? (<><Header /><Callout /><Rows /><Pills /></>)}
      </ProductCanvas>
    </ConsoleContext>
  );
}
// FramedDashboard ALSO wraps in a bezel (FramedDashboard.tsx:24-43).
// So <FramedDashboard><Console/></FramedDashboard> = bezel + card = double frame.
```

### Recommended bare renderer (sketch the planner can adapt)
```tsx
// New: a bare Console (slots, no ProductCanvas). Reuses Console.* slots verbatim.
// The slots read ConsoleContext via React.use(), so any provider works.
import { Console } from "@/components/product/visuals/Console";
// ... provide ConsoleContext + render slots in a plain flex column, with
// aria-label={data.ariaSummary} + role="img" on the bare root (Pitfall 8).
// Then in MockupForTab: case "placement": return <ConsoleBare data={placementHandoffConsole} />;
```
> The exact wiring depends on whether `ConsoleContext` is exported. It is NOT currently exported (Console.tsx:39 `const ConsoleContext`). The planner either (a) exports it, or (b) adds a `Console.Bare`/`bare` render path inside Console.tsx that skips `ProductCanvas`. Option (b) is one localized edit to a shared file; option (a) leaks an internal. Recommend (b): a `bare?: boolean` on `ConsoleProps` that renders the same slots in a plain `<div role="img" aria-label={data.ariaSummary}>` instead of `<ProductCanvas>`. This keeps all existing `<Console data/>` calls byte-identical (default `bare=false`) and is backward-compatible.

### Mockup → payload mapping (placement, verified data)
```ts
// Source: VERIFIED PlacementMockup.tsx:8-13, 41-44 → ConsoleData
// pools: Pre-collect 35% / Primary 28% / Secondary 18% / Tertiary 12%
// header KPI: "Inbound batch" 120,418, "accounts · $284.6M", "Engine running" pulse
// rows[].bar.segments:[pct] (single-segment), trailing:{value:pct, suffix:"%"}
// off-token gradient endpoints (#22c55e/#d97706/#0891b2) DROPPED — tone tokens only
```

## Front B Verdict (P13-01 — Question 5): PROCEED (low risk)

[VERIFIED: index.tsx VISUALS registry, FeatureAccordion.tsx:160-163, content/visuals/index.ts exports, Phase 11 Flagships exist]

**Recommendation: PROCEED, as a separate Wave from Front A.** Rationale:

1. **The backing data already exists.** Front B's 5 ids are `placement / optimization / issues / reporting / compliance`. Phase 11 already authored typed payloads for the first four (`placementConsole`, `optimizationFlagshipConsole`, `issuesFlagshipConsole`, `reportingFlagshipConsole`, plus accordion-specific payloads like `placementVendorPools` etc.) and four `*Flagship` components. [VERIFIED: content/visuals/index.ts:20-58] So repointing `VISUALS.placement` → a Console/Flagship instance is authoring-light, not net-new design.
2. **No double-frame on Front B.** The FeatureAccordion visual container (`FeatureAccordion.tsx:140`) is its own `bg-[var(--product-canvas)]` box, and the current `PlacementMatrix` etc. already render their own `ProductCanvas` inside it. So Front B already tolerates the canvas-in-a-box look that Front A must avoid. Repointing to a Console/Flagship instance keeps the same visual contract. [VERIFIED: FeatureAccordion.tsx:140-176, PlacementMatrix.tsx:29]
3. **`VISUALS.reporting` key migration (the explicit P13-01 requirement).** Today `VISUALS.reporting` → `ReportingDashboard` (a bespoke component). The repoint changes it to a Console/Flagship-backed instance keyed under the SAME `reporting` id. The `compliance` id has no Phase 11 Flagship/Console equivalent (`ComplianceStandards` is bespoke and is the only one without a payload twin). [VERIFIED: index.ts has no `compliance*` export] So Front B can repoint 4 of 5 ids cleanly; `compliance` either keeps `ComplianceStandards` (it's not in the P13-01 deletion set — P13-01 names only the four: PlacementMatrix, OptimizationEngine, IssuesWorklist, ReportingDashboard) or gets a new payload. **Keep `ComplianceStandards` as-is; it is not in the P13-01 four.**

**Risk if PROCEED:** the homepage FeatureAccordion is a LIVE buyer-facing surface; a botched repoint shows the wrong/blank visual on `/`. Mitigation: `reveal-fail-open.spec.ts` + `reduced-motion.spec.ts` already cover `/` (the accordion is NOT inside `[data-handoff-section]`, so unlike Front A it IS covered by reveal-fail-open). Repoint one id at a time, verify the accordion still shows a visual.

**If the planner prefers DEFER:** acceptable per D-09; the bespoke Front-B visuals are correct and LIVE. Note it in HANDOFF.md as a later cleanup. But the data is sitting right there, so PROCEED is the higher-value call.

## P13-02 + Dead-Asset Sweep (Questions 6 & 7)

### Off-token hex (P13-02) — CONFIRMED
[VERIFIED: grep across src/]
The ONLY off-token hex literals in the migration surface are exactly the three flagged:
- `PlacementMockup.tsx:10` `to-[#22c55e]` (Primary pool)
- `PlacementMockup.tsx:11` `to-[#d97706]` (Secondary pool)
- `PlacementMockup.tsx:12` `to-[#0891b2]` (Tertiary pool)

These are gradient ENDPOINTS approximating DESIGN.md chart tokens. Replacement map (from DESIGN.md §chart tokens + globals.css):
| Off-token | Approximates | Replace with |
|-----------|--------------|--------------|
| `#22c55e` (green) | `--chart-3` `#10b981` | `tone:"success"` (Console maps to chart-3) |
| `#d97706` (amber) | `--chart-4` `#f59e0b` | `tone:"warning"` (Console maps to chart-4) |
| `#0891b2` (cyan) | `--chart-5` `#06b6d4` | chart-5 token (no Console `tone` for cyan; use the token directly or `tone:"indigo"`) |

[VERIFIED: DESIGN.md:33-37, 322-326; globals.css:214-218, 280-284] Because the placement payload's bars use `tone` tokens (not gradient hex), **all three literals vanish on migration** — they only ever lived in the bespoke `PlacementMockup`, which Wave 3 deletes. No new token needed. The other two off-token sets the audit found (`#4AA8C9/#8472F0/#3D9DE0` in `SolutionsIndustryCards`) were Phase 12's concern and `SolutionsIndustryCards` was deleted in Phase 12 (SOLVIS-01). [VERIFIED: grep returned zero matches for those hexes — already gone]

### Dead PNG references — CONFIRMED (one remaining, and it's Phase 15's, not Phase 13's)
[VERIFIED: `grep -rn "\.png" src/` and `grep -rn dashboard-dark`]
The ONLY `.png` reference anywhere in `src/` is:
- `HomepageHero.tsx:187` `src="/product/dashboard-dark.png"` — the hero finale's held-dashboard image, `aria-hidden`, decorative.

This is NOT dead and NOT Phase 13's to remove:
- The 6 dead **BenefitSplit** `dashboard-dark.png` fallbacks were already removed in Phase 10 (10-06-PLAN, FND-05). [VERIFIED: ROADMAP Phase 10 plan list + AUDIT correction #5/§Phase 10 SC5]
- The hero's use of `dashboard-dark.png` is explicitly **deferred to Phase 15 (HOMEVIS-01)** per ROADMAP Phase 10 SC5 ("the hero's use of the asset is deferred to Phase 15") and Phase 15 SC1 ("the dashboard-dark.png hero asset's fate is resolved"). Phase 13's SYSVIS-02 obligation is therefore **confirm + document**, not delete. Editing the hero would also violate the D-01 firewall.

**Phase 13 dead-asset action:** confirm (a) the 6 BenefitSplit fallbacks are gone (Phase 10), (b) no other dead PNG refs exist (none — verified), (c) record that the hero PNG is intentionally retained pending Phase 15. No deletion.

## Runtime State Inventory

This is a code-only re-point (no datastores, services, OS state, secrets, or external config). One build-artifact note.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — verified by scope (no DB/datastore touched) | none |
| Live service config | None — verified (no external service references the mockup module) | none |
| OS-registered state | None | none |
| Secrets/env vars | None — verified (migration touches no env keys) | none |
| Build artifacts | Next.js `.next/` build cache will hold stale chunk graph for the deleted mockup modules after Wave 3 deletion; a `rm -rf .next` / clean rebuild avoids stale-chunk confusion during local verification (the sandbox can't run `next dev`/`start`, but `next build` + `tsc` + Playwright-vs-preview DO run — per MEMORY) | clean rebuild before final verification |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Two homepage visual systems (bespoke `sections/mockups/` + `product/visuals/` archetypes) | One archetype library (Console/DataStory/Schematic) + typed payloads; bespoke mockups retired | Phase 10-13 (M6) | Phase 13 collapses the handoff onto Console |
| Per-pool gradient hex in mockups | DESIGN.md `--chart-*` tokens via `tone` | Phase 13 (P13-02) | off-token hex eliminated |

**Deprecated/outdated after Phase 13:** `PlacementMockup`, `VendorPerformanceMockup`, `IssuesMockup`, `ReportingMockup` (deleted Wave 3). The bespoke FeatureAccordion visuals (`PlacementMatrix`, `OptimizationEngine`, `IssuesWorklist`, `ReportingDashboard`) deprecated only if Front B PROCEEDs.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Rendering Console's slots without `ProductCanvas` produces visual parity with the bare mockups inside `FramedDashboard` | Console Contract | If the slot layout differs materially from the bespoke layouts, parity needs per-tab tuning (caught at the placement checkpoint, D-06) |
| A2 | Approximating performance grade/sparkline and reporting dual-line trend within the Console schema is acceptable parity | Pitfall 5 | If the user/Connor judges it a downgrade, reporting may need a DataStory exception to D-04 — raise at checkpoint |
| A3 | Keeping the Console instances eager (as the mockups are today) won't breach the `/` JS budget | CLS / Pattern | If it does, switch to lazy with box-matched skeletons; measure via LHCI |

## Open Questions

1. **Reporting tab: Console vs DataStory?**
   - Known: D-04 locks "Console-archetype instance" for all 4 tabs. Reporting's dual-line 8-week trend is time-series (DataStory `chart.kind:"area"` territory).
   - Unclear: whether a Console of summary KPIs is acceptable parity for the reporting tab, or whether the trend chart is load-bearing enough to justify a DataStory exception.
   - Recommendation: attempt Console-with-KPIs; if it loses the trend story, raise a scoped DataStory exception with Connor at the reporting checkpoint.

2. **Performance tab: grade badges + per-row sparklines.**
   - Known: not native Console features.
   - Unclear: acceptable to drop/approximate vs. extend the schema.
   - Recommendation: approximate (tone-coded rows + pills); no schema extension.

3. **Bare renderer location: `bare?` prop on Console vs. exported `ConsoleContext` vs. local wrapper.**
   - Recommendation: add a backward-compatible `bare?: boolean` to `ConsoleProps` (one localized edit; all existing calls unaffected).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next build (`next build`) | local verification | ✓ | Next 15 | — (per MEMORY: `next build`/`tsc`/Playwright-vs-preview run locally; only `next dev`/`start` hang) |
| Playwright | regression specs | ✓ | (repo) | run vs Vercel preview URL |
| LHCI | CLS/JS-budget gate on `/` | ✓ (CI) | (repo) | preview |
| GSAP/@gsap/react | pin/scrub parity (unchanged) | ✓ | (repo, lazy) | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** local `next dev`/`start` hang in the sandbox — verify via `next build` + Playwright against a preview URL.

## Validation Architecture

> nyquist_validation is enabled (not set false). Phase 13 validation = the regression-spec set stays green + byte-level confirmation the firewall files are unchanged.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (`@playwright/test`) + LHCI (perf) + axe-core (a11y) |
| Config file | `playwright.config.*` (repo root); `lighthouserc.json`; `.github/workflows/perf.yml` |
| Quick run command | `npx playwright test tests/responsive/platform-mobile.spec.ts tests/responsive/reduced-motion.spec.ts` |
| Full suite command | `npx playwright test` (170 specs, all must stay green) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SYSVIS-01 | Mobile renders 4 stacked Console dashboards; desktop pins at 1440 | integration | `npx playwright test tests/responsive/platform-mobile.spec.ts` | ✅ (assertions on h3 titles + pin height) |
| SYSVIS-01 | Handoff content fails open under reduced motion (static stack visible) | integration | `npx playwright test tests/responsive/reduced-motion.spec.ts` | ✅ (covers `/` ROUTES + VISUAL_ROUTES) |
| SYSVIS-01 | GSAP pin anchored on desktop | integration | (new) `tests/responsive/handoff-pin-anchored.spec.ts` | ❌ Wave 0 — no existing spec asserts pin anchoring |
| SYSVIS-01 | Bezel viewport-centered across hero→Platform seam | integration | (new) `tests/responsive/handoff-bezel-seam.spec.ts` | ❌ Wave 0 — currently human-verified only |
| SYSVIS-01 | Dashboard static (no x/y move) during crossfade | integration | (new) `tests/responsive/handoff-dashboard-static.spec.ts` | ❌ Wave 0 — currently human-verified only |
| SYSVIS-01 | Mobile never fetches GSAP after migration | integration | `npx playwright test tests/responsive/hero-gsap-free-mobile.spec.ts` | ✅ (412x823 /gsap/ watcher across VISUAL_ROUTES) |
| SYSVIS-01 | Firewall files byte-unchanged | static | `git diff --exit-code -- src/components/sections/HomepageHero.tsx src/components/sections/HomepageHandoffSection.tsx` | ❌ Wave 0 — add as a verification step |
| SYSVIS-01 | `/` CLS/INP/LCP hold after Console enters the handoff | perf | LHCI Case C on `/` (`.github/workflows/perf.yml`) | ✅ (existing gate) |
| SYSVIS-02 | No dead PNG refs; hero PNG intentionally retained | static | `grep -rn "\.png" src/` returns only the hero finale ref | ✅ (manual grep) |
| P13-02 | No off-token hex in migrated handoff visuals | static | `grep -rn "#22c55e\|#d97706\|#0891b2" src/` returns zero after Wave 3 | ✅ (manual grep) |

### Sampling Rate
- **Per task commit:** `npx playwright test tests/responsive/platform-mobile.spec.ts tests/responsive/reduced-motion.spec.ts` + `tsc --noEmit` + `eslint`.
- **Per tab migration (Wave 1/2 gate, D-06/D-07):** the full regression-spec set (the 5 named + the 3 new) + human-verify desktop cinematic on a preview.
- **Phase gate:** full Playwright suite green + LHCI `/` gate green + firewall `git diff --exit-code` clean, before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `tests/responsive/handoff-pin-anchored.spec.ts` — asserts the desktop 400vh sticky pin holds (the `data-handoff-section` height > 2400 at 1440 partly covers this; the NEW spec should assert the sticky inner stays at viewport top through the scroll range). Covers the "pin anchored" half of SYSVIS-01 SC2.
- [ ] `tests/responsive/handoff-bezel-seam.spec.ts` — asserts the hero framed-dashboard (`[data-hero-framed-dashboard]`) and the handoff frame (`[data-handoff-mockup-frame]`) share the same viewport-x/center at the seam. (Selectors VERIFIED in HomepageHero.tsx:177 + HandoffSection.tsx:205.)
- [ ] `tests/responsive/handoff-dashboard-static.spec.ts` — asserts the dashboard's bounding box x/y does not move across a tab crossfade (only content swaps). 
- [ ] Firewall byte-check step (git diff or hash) wired into phase verification.
- [ ] Bare Console renderer must be reduced-motion fail-open verified (inherits the barrel; confirm against the mobile/reduced static stack).

*(The 3 new cinematic specs are the crux: without them, D-06's "validate the full regression-spec set against placement before fanning out" is not machine-checkable. If the planner judges them too brittle to author cheaply, the fallback is a documented human-verify checkpoint per tab — but that weakens the gate.)*

## Security Domain

Not applicable to this phase. `security_enforcement` is not configured `true` for this marketing-site project, and Phase 13 introduces no auth, session, input-handling, or crypto surface — it re-points presentational components behind an existing facade. Standing a11y (WCAG 2.2 AA + axe-core) and the `ariaSummary` text-alternative contract (Pitfall 8) are the relevant non-functional gates, covered under Validation Architecture.

## Sources

### Primary (HIGH confidence — read this session)
- `src/components/sections/mockups/index.tsx` — the `MockupForTab`/`mockupTitleForTab` facade + FramedDashboard re-export (the single Front-A repoint site)
- `src/components/sections/mockups/FramedDashboard.tsx` — the bezel (D-02, stays put)
- `src/components/sections/mockups/{Placement,VendorPerformance,Issues,Reporting}Mockup.tsx` — the 4 bespoke files + the off-token hex (P13-02)
- `src/components/sections/HomepageHero.tsx` (firewall; direct FramedDashboard import line 9; hero PNG line 187)
- `src/components/sections/HomepageHandoffSection.tsx` (firewall; facade consumption lines 8-11, 147-149, 209-215; data-handoff-mockup-frame line 205)
- `src/components/product/visuals/Console.tsx` (the double-frame source: ConsoleRoot→ProductCanvas, lines 229-248; slots; React.use context line 39)
- `src/components/product/primitives/ProductCanvas.tsx` (the styled card that causes double-frame)
- `src/components/product/visuals/index.tsx` (Front-B VISUALS registry + AccordionVisual)
- `src/components/product/visuals/PlacementFlagship.tsx` (Phase 11 Console-composed flagship pattern; Front-B backer candidate)
- `src/components/product/visuals/PlacementMatrix.tsx` (Front-B bespoke; renders its own ProductCanvas)
- `src/components/sections/FeatureAccordion.tsx` (Front-B consumer; visual container line 140-176)
- `src/content/visuals/{index.ts,types.ts,placement.ts}` (ConsoleData schema + reference payload + existing payload barrel)
- `tests/responsive/{platform-mobile,reduced-motion,reveal-fail-open,hero-gsap-free-mobile}.spec.ts` (the actual regression specs; the 3 cinematic gaps)
- `DESIGN.md` chart tokens (lines 33-37, 322-326); `src/app/globals.css` (214-218, 280-284)
- `.planning/{ROADMAP,REQUIREMENTS,STATE,AUDIT-2026-06-12}.md`, `13-CONTEXT.md`

### Secondary / Tertiary
- None — no web/Context7 lookup needed; GSAP behavior is parity-only and the existing code is the source of truth.

## Metadata

**Confidence breakdown:**
- Console contract / double-frame: HIGH — read Console.tsx + ProductCanvas.tsx + all 4 mockups directly.
- Migration order / firewall mechanism: HIGH — read both firewall files and the facade; confirmed they call only the stable exports.
- Regression-spec set: HIGH — full tests/ scan; confirmed the 3 cinematic specs do NOT exist and the desktop path is human-verified.
- P13-02 / dead PNG: HIGH — grep-verified exact hex literals and the single remaining PNG ref.
- Front B verdict: HIGH — confirmed backing payloads/flagships exist for 4 of 5 ids and the accordion container tolerates the canvas look.

**Research date:** 2026-06-12
**Valid until:** stable until the handoff or Console internals change (no external dependencies); re-verify if Phase 14 edits Console.tsx.
