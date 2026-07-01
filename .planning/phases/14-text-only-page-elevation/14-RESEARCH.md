# Phase 14: Text-only page elevation - Research

**Researched:** 2026-07-01
**Domain:** Applying the matured archetype library (Console / DataStory / Schematic) + Phase 10 motion primitives to 9 text-heavy routes where a visual or motion lifts the argument; plus two folded a11y/design audit items (P14-01, P14-02)
**Confidence:** HIGH (every code claim verified against the live `main`-based branch this session unless tagged `[ASSUMED]`)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Scope & restraint**
- **D-01 (lift over coverage):** Not every page needs a visual. Each target page gets a visual ONLY where it lifts the argument; pages where a visual would be decoration get motion-only (Reveal/Ambient) or nothing. Restraint beats blanket coverage. The researcher/planner makes the per-page call and justifies each as "lift, not decoration."
- **D-02 (reuse the on-main archetype library; build nothing new without a proven gap):** Compose from the existing `src/components/product/visuals/` archetypes (DataStory, Schematic, Console used sparingly) and motion primitives (Reveal, Ambient, Marquee, PartnerMap, the `dn-c2c` coast-to-coast map). ROADMAP guidance: "Mostly DataStory + Schematic + Reveal/Ambient." A NEW archetype component requires an explicit gap argument raised in planning (stop-list adjacent).
- **D-03 (CTA primacy):** One filled "Request a demo" CTA per band preserved; secondary actions stay ghost/text. No new or competing CTAs. Motion is additive and below the CTA in visual weight.

**Per-page starting hypotheses (planner confirms / overrides)**
- **D-01a `/compare`:** a Schematic or DataStory that visualizes the comparative argument (e.g., capability matrix / time-to-production), NOT a decorative band. Comparative claims are `[CLAIMS REVIEW]` + need legal; competitor framing is `[COI REVIEW]`.
- **D-01b `/why-dplat`:** a supporting Schematic/DataStory or a Reveal/Ambient treatment on the existing argument bands.
- **D-01c `/platform/integrations`:** archetype consistent with the platform system (Schematic/network), no CTA competition.
- **D-01d `/demo`:** restrained Reveal/Ambient only; never compete with the form's submit CTA; pair with the P14-01/P14-02 form-a11y fixes.
- **D-01e `/company` set + `/resources`:** motion-where-it-lifts; the TSI ownership section on `/company`/`/about` stays a `[COI REVIEW]` surface and must not be visually obscured.

**Governance (live surfaces this phase)**
- **D-04:** Any new caption/label is governed copy: voice rules (no em dashes, no banned phrases, sentence case, contractions, digits). `[CLAIMS REVIEW]` on any metric; `[COI REVIEW]` on any vendor/TSI framing. Real-shaped anonymized figures only; no invented clients/metrics/testimonials. Per the 2026-06 Andrew pre-clearance, tags inside `src/content/visuals/*.ts` are non-blocking for M6 visuals but stay for audit. The `/compare` comparative claims and `/company` TSI section are the two live governance surfaces; flag `[COI REVIEW]`/`[CLAIMS REVIEW]` in the PR.

**Folded audit items (in scope, raise in planning)**
- **D-05a — P14-01 (a11y):** `DemoForm.tsx` (~369-378) — wire `aria-invalid` and `aria-describedby="{id}-error"` on fields with errors (the form-level error region is already correct).
- **D-05b — P14-02 (design/a11y):** Normalize form-input focus treatment (`DemoForm.tsx`, `HomepageHero.tsx`, `AttachedForm.tsx` use a 3px ring / border-color change instead of the spec's 2px `#9CB4E8` outline + 2px offset). EITHER normalize to the token outline OR document the input ring as an intentional pattern in DESIGN.md. Recommended default: document as intentional if normalizing regresses the attached-form pill aesthetic; planner decides. Note `HomepageHero.tsx` is Phase-13 firewall — if P14-02 must touch it, that change lands on `main`/its own track, NOT silently here; raise it.

**Gates (acceptance)**
- **D-06:** Every elevated page keeps LCP < 2.5s, CLS < 0.1, INP < 200ms, passes axe-core (mobile-375 + desktop-1440), is added to the reduced-motion Playwright spec, and ALL existing Playwright specs stay green. Below-fold visuals lazy-load (`ssr:false` + skeleton matching the Phase 11/12 pattern). Content-route TBT ceiling is 300ms (regression detector; TBT is hydration-bound per AUDIT BL-07).
- **D-07 (sandbox):** `next dev`/`next start` hang here. Verify with `tsc --noEmit`, `eslint`, `next build`, `playwright test --list`; spec/axe/LHCI truth comes from CI on the PR.

**Stop-list (ask Connor, do not decide)**
- Any new nav item, new conversion action, new color/type/spacing token, or a page not in the route map. A new archetype component (vs. composing existing ones).

### Claude's Discretion
- Exact archetype per page and the typed payload shape (consistent with the Phase 11/12 typed-payload pattern in `src/content/visuals/`).
- Which pages get visual vs. motion-only vs. nothing (the D-01 lift judgment).
- Whether P14-02 normalizes the focus ring or documents it as intentional.
- Lazy-skeleton box sizing to avoid CLS.

### Deferred Ideas (OUT OF SCOPE)
- The homepage hero (Phase 15), any homepage handoff/firewall files, new pages/routes, new nav items, new conversion actions, new design tokens, re-opening the homepage LCP budget, named clients/logos.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGEVIS-01 | `/compare` gains archetype visual(s) + motion where they lift (not decoration) | `CompareMatrix` already renders the market-map table with staggered fade-up; the lift opportunity is a **Schematic** (network-agnostic routing) or **DataStory** (time-to-production / continuous-production proof). `ProseSection`/`ProofBand` slots identified. Governance: comparative claims are the live `[CLAIMS REVIEW]`+legal surface. §"Per-page elevation map" |
| PAGEVIS-02 | `/why-dplat` gains a supporting visual / motion treatment | `CardGrid` + `ComparisonTable` + `ProofBand` already animate via legacy `product/motion`. A **DataStory** (proof) or **Schematic** paired with the differentiators band is the lift; else Reveal-only. §"Per-page elevation map" |
| PAGEVIS-03 | `/company` set + `/resources` gain visuals / motion where they lift | company-hub (0 page-level motion), about (RevealSection ×1), leadership (×2), careers (×1), contact (×1), resources (0) verified. TSI/COI section must not be obscured. Mostly Reveal/Ambient; a hub or resources DataStory is optional. §"Per-page elevation map" |
| PAGEVIS-04 | `/platform/integrations` and `/demo` elevated consistent with the system, no CTA competition | integrations has a live network/ERP/CIS story → **Schematic** (system-map) is the strongest lift and is already system-consistent (`PlatformSystemMap` precedent). `/demo` gets **Ambient/Reveal only** (D-01d) + the P14-01/P14-02 form fixes. §"Per-page elevation map" |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **§2 stack:** no new libraries. Everything needed is installed: `next 16.2.6`, `framer-motion ^12.39.0`, `@playwright/test ^1.60.0`, `typescript ^5` `[VERIFIED: package.json]`. GSAP stays the single dynamic-import owner in `HeroCinematicController` and is never touched here.
- **§3 brand:** primary `#5266EB`, dark canvas `#171721`, no new colors/sizes/spacing without a §16 stop. Any archetype accent maps to the existing chart tokens (`--chart-1/3/4/5`; `--chart-2` is near-canvas, unusable) — same rule Phase 12 locked (D-11).
- **§4 CTA:** one filled "Request a demo" per band; visuals never introduce a competing CTA. Motion sits below the CTA in visual weight (D-03).
- **§5 voice:** no em dashes, no "not X, it's Y", banned-phrase list, sentence case, contractions, digits — applies to every payload caption, `ariaSummary`, eyebrow, annotation. Use `·` separators (established console convention). **AUDIT BL-01:** `compare.ts:99` "digital journeys" already flags a banned word; if `/compare` copy is touched, fix in-line.
- **§6 COI:** vendor/TSI framing stays agency-network-agnostic ("routes across the originator's existing vendors"); `[COI REVIEW]` on any vendor-network framing. The `/company` + `/company/about` TSI ownership sections are live COI surfaces — a visual must not visually bury or reframe them.
- **§7 claims:** all figures real-shaped anonymized generic; `[CLAIMS REVIEW]` on every payload module and on the `/compare` comparative claims (which ALSO need legal review, punch-list #4).
- **§11 a11y:** WCAG 2.2 AA, 44px touch targets, `prefers-reduced-motion`, axe-core in CI. `axe-routes.spec.ts` + `touch-targets.spec.ts` already iterate all 23 `VISUAL_ROUTES` (AUDIT FIX-02), so every target route is already covered.
- **§12 perf:** LCP < 2.5s, CLS < 0.1, INP < 200ms; visuals stay lazy `ssr:false`, no eager motion code. Content-route TBT bar is 300ms (AUDIT BL-07).
- **§15/§16:** no invented clients/testimonials; no new colors/components/nav/CTA. The archetypes map onto existing slots (`ProductVisualBand`, `BenefitSplit.visual`, `FeatureAccordion.visuals`, or a new `ProductVisualBand` instance which is an existing component) so no §16 stop is triggered by composing them.
- **Memory rules:** docs (HANDOFF.md / DESIGN.md / .impeccable.md) update in the SAME commit as the code they describe; `next dev`/`next start` hang in this sandbox.

## Summary

This is the same mechanical archetype-replication pattern Phases 11 and 12 shipped, applied to 9 text-heavy routes — but with a **restraint filter** on top (D-01: visual only where it lifts) and **two folded form-a11y items** that are independent of the visual work. The archetype infrastructure is fully paid for: `ConsoleVisual` / `DataStoryVisual` / `SchematicVisual` (lazy, `ssr:false`, 20rem CLS-matched skeleton) render from typed payloads in `src/content/visuals/`; the three schemas (`ConsoleData` / `DataStoryData` / `SchematicData`) are unchanged and already carry a `cards` DataStory branch and a full source→engine→vendor→sink Schematic vocabulary. Adding a visual to a page is: author a payload module, import the archetype wrapper, drop it in a slot, add per-route spec assertions. Zero new components, zero new libraries, zero schema changes expected.

**The single most important finding — the "0 motion refs" counts are misleading.** The per-page ref counts in the phase description (compare 0, why-dplat 0, resources 0, company-hub 0) count *page-level* motion imports. But the section components those pages compose (`CardGrid`, `BulletList`, `CompareMatrix`, `ComparisonTable`, `ProcessStrip`, `IntegrationTable`, `LeadershipTable`, `IntegrationStrip`) already animate via a staggered fade-up from the legacy `@/components/product/motion` barrel (`fadeUpItem` / `staggerContainer` / `inViewProps`) `[VERIFIED: grep this session]`. So **every one of these pages already has restrained scroll-reveal motion today.** The "elevation" job is therefore narrower than "add motion to bare pages": it is (a) add an *archetype visual* where the argument earns one (compare, why-dplat, integrations, optionally a hub/resources), and (b) confirm/extend the existing reveal coverage, not invent it. This directly serves D-01's restraint discipline — several pages may correctly get **nothing new** because they already animate and a visual would be decoration.

**Primary recommendation:** Wave-0 a `14-ARCHETYPE-MAP.md` (mirroring Phase 12's approved-map gate) that makes the per-page lift/no-lift call explicit and lists exact archetype + slot + payload intent + per-route distinctness strings, PLUS a `14-page-elevation.spec.ts` skeleton. Do the two form-a11y fixes (P14-01, P14-02) as an independent early wave since they are mechanical and unblock nothing else. Then elevate the 2-3 pages that clearly earn an archetype (`/compare`, `/platform/integrations`, and one of `/why-dplat`), verify the rest already animate, and extend the reduced-motion + fail-open + new page-elevation specs across all touched routes.

## Standard Stack

No new libraries. `[VERIFIED: package.json]`

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.6 | App Router pages, `next/dynamic` lazy visuals | `[VERIFIED: package.json]` |
| framer-motion | ^12.39.0 | Reveal / LiveValue / AmbientField (reduced-motion aware) via the motion barrel + archetypes | `[VERIFIED: package.json]` — never imported directly in page work |
| @playwright/test | ^1.60.0 | `14-page-elevation.spec.ts` + extending reduced-motion/fail-open | `[VERIFIED: package.json]` |
| typescript | ^5 | `satisfies ConsoleData/DataStoryData/SchematicData` payload validation | `[VERIFIED: package.json]` |
| @axe-core/playwright | ^4.11.3 | axe already covers all 23 routes (AUDIT FIX-02) | `[VERIFIED: package.json]` |
| @lhci/cli | ^0.15.1 | LHCI perf gates (representative routes only) | `[VERIFIED: package.json]` |

### Repo assets to reuse (the real "stack")
| Asset | Path | Role in this phase |
|---|---|---|
| Archetype wrappers | `src/components/product/visuals/archetypes.tsx` | `ConsoleVisual` / `DataStoryVisual` / `SchematicVisual` — lazy, `ssr:false`, 20rem `VisualSkeleton` `[VERIFIED]` |
| Payload schemas | `src/content/visuals/types.ts` | `ConsoleData` / `DataStoryData` (incl. `cards` branch) / `SchematicData` — unchanged `[VERIFIED]` |
| Payload barrel | `src/content/visuals/index.ts` | New per-page payload modules export here (Phase 12 convention) |
| Scroll-reveal (page-level) | `src/components/sections/RevealSection.tsx` | Framer fade-and-rise, fail-open, reduced-motion-safe; already used on about/leadership/careers/contact `[VERIFIED]` |
| Ambient drift | `src/components/ambient/AmbientField.tsx` (also re-exported from motion barrel) | Decorative particle/bloom layer; `aria-hidden`, seeded (no hydration mismatch), reduced-motion collapses to static bloom `[VERIFIED]` |
| Motion barrel | `src/components/motion/index.ts` | `Reveal`, `LiveValue`/`AnimatedNumber`, `PulseDot`, `Hoverable`, `CursorGlow`, `AmbientField`, `Explorable` — never GSAP `[VERIFIED]` |
| Legacy section motion | `src/components/product/motion.tsx` | `fadeUpItem`/`staggerContainer`/`inViewProps` — already inside CardGrid/BulletList/CompareMatrix/etc. (do not double-wrap) `[VERIFIED]` |
| Band slot | `src/components/sections/ProductVisualBand.tsx` | Existing full-bleed visual slot (no height floor — see Pitfall 1) `[VERIFIED]` |
| Spec template | `tests/responsive/platform-visuals.spec.ts` | Shape for `14-page-elevation.spec.ts` (archetype presence, flagship default-visible values, reduced-motion data-parity, no-stuck-opacity) `[VERIFIED]` |
| Route helper | `tests/helpers/routes.ts` | `VISUAL_ROUTES` already includes all 9 targets `[VERIFIED]` |

**Installation:** none.

## Architecture Patterns

### Recommended structure (mirrors Phase 12)
```
src/content/visuals/
├── compare.ts            # new — Schematic and/or DataStory payload(s) for /compare
├── why-dplat.ts          # new (if it earns a visual) — DataStory/Schematic
├── integrations.ts       # new — Schematic (network/system map)
└── index.ts              # re-export the new payloads

.planning/phases/14-text-only-page-elevation/
├── 14-ARCHETYPE-MAP.md   # Wave-0 approval gate (per-page lift call + payload intents + distinctness strings)
└── 14-RESEARCH.md        # this file

tests/responsive/
└── 14-page-elevation.spec.ts   # new — per-route archetype/motion assertions
```
Note the shared-basename pattern is already proven safe: `src/content/integrations.ts` (page copy) vs `src/content/visuals/integrations.ts` (payloads) mirror `placement.ts` vs `visuals/placement.ts` `[VERIFIED: both patterns exist]`.

### Pattern 1: Archetype in an existing slot (the whole phase, mechanically)
```tsx
// Source: src/components/product/visuals/archetypes.tsx + Phase 11/12 page wiring (verified)
import { SchematicVisual } from "@/components/product/visuals/archetypes";
import { integrationsSystemMap } from "@/content/visuals";

// inside the page, in a ProductVisualBand (or a new ProductVisualBand instance):
<ProductVisualBand>
  <SchematicVisual data={integrationsSystemMap} />
</ProductVisualBand>
```
`SchematicVisual`/`DataStoryVisual`/`ConsoleVisual` are lazy `ssr:false` wrappers; the payload module is server-safe (zero client cost, no `"use client"`).

### Pattern 2: Page-level scroll-reveal (already the house style)
```tsx
// Source: src/app/company/about/page.tsx (verified) — wrap a band to fade-and-rise
<RevealSection>
  <SectionContainer surface="dark">...</SectionContainer>
</RevealSection>
```
`RevealSection` returns children untouched under `prefers-reduced-motion` (fail-open) `[VERIFIED]`. Do NOT wrap a section whose inner component already animates via `product/motion` (CardGrid/BulletList/etc.) unless you want the whole band to rise as one — double reveals read as jank.

### Pattern 3: Ambient drift on a dark band (restrained, decorative)
```tsx
// Source: src/components/ambient/AmbientField.tsx header (verified)
<section className="relative">
  <AmbientField particleCount={5} bloom />   {/* aria-hidden, reduced-motion → static bloom */}
  <div className="relative z-10">...content...</div>
</section>
```
This is the `/demo` and possibly `/why-dplat`/`/resources` lift where an archetype would be decoration — atmosphere without a competing figure or CTA (D-01d).

### Payload authoring contract (Phase 12 template)
```ts
// [CLAIMS REVIEW] real-shaped anonymized figures (non-blocking per Andrew 2026-06; tag retained for audit)
// [COI REVIEW] vendor/TSI framing stays agency-network-agnostic
export const integrationsSystemMap = {
  title: "How dPlat connects to your systems",
  nodes: [ /* source (billing/ERP/CIS) → engine → vendor pools → sink */ ],
  edges: [ /* labeled, flow:true where a data path animates */ ],
  ariaSummary: "Full governed-prose text alternative describing the routing in words.",
} satisfies SchematicData;   // satisfies, NOT `: SchematicData` — keeps excess-property checking
```

### Anti-Patterns to Avoid
- **Blanket coverage.** Adding an archetype to every page violates D-01. If a page already animates (all the CardGrid/BulletList pages do) and a figure would be decoration, the correct output is *nothing new* (or Ambient at most). The `14-ARCHETYPE-MAP` must record a no-lift call as a deliberate decision, not an omission.
- **Type-annotating payloads (`: ConsoleData`)** instead of `satisfies` — loses excess-property checking, the compile-time correctness proof (Phase 12 precedent).
- **Double-wrapping already-animated sections** in `RevealSection` — CardGrid/BulletList/CompareMatrix/etc. already carry `staggerContainer` fade-up; wrapping them again stacks two reveals.
- **Hand-rolling Framer/GSAP in page code** — import a named primitive from the barrel or use the archetype wrappers (§DESIGN.md 4.7; FND-01).
- **Importing `Console.tsx`/`DataStory.tsx`/`Schematic.tsx` directly from a page** — always go through the lazy `*Visual` wrappers or TBT/CLS regress (Pitfall 1, 5).
- **Obscuring the TSI/COI section** on `/company` or `/company/about` with a visual or heavy motion (D-01e, §6).
- **Touching `HomepageHero.tsx` silently** for P14-02 — it is a Phase-13/15 firewall file; if the fix must reach it, raise it as a separate track (D-05b).

## Per-page elevation map (the D-01 lift judgment — planner confirms in 14-ARCHETYPE-MAP)

| Route | Today's motion (page-level) | Today's motion (via section components) | Recommended lift | Rationale |
|---|---|---|---|---|
| `/compare` | none | CompareMatrix (stagger fade-up), CardGrid ×2, LeadershipTable, ProofBand `[VERIFIED]` | **DataStory or Schematic** (1) — visualize time-to-production / continuous-production, OR network-agnostic routing that makes the comparative point | Strongest lift candidate (D-01a). Live `[CLAIMS REVIEW]`+legal + `[COI REVIEW]` surface. |
| `/why-dplat` | none | CardGrid, ComparisonTable, ProofBand `[VERIFIED]` | **DataStory (proof)** OR Reveal-only | Argument bands already animate; a proof DataStory on the ProofBand story is the only real lift, else no new visual (D-01b). |
| `/platform/integrations` | LogoMarquee ×1 | ProofBand ×2, IntegrationTable ×4, BulletList `[VERIFIED]` | **Schematic (system/network map)** | Clear system-of-record → dPlat → vendor-network story; system-consistent with `PlatformSystemMap` precedent; no CTA competition (D-01c, PAGEVIS-04). |
| `/demo` | none | CardGrid ×1 | **Ambient/Reveal only** | Never compete with the form submit CTA (D-01d). Pair with P14-01/P14-02. No archetype. |
| `/company` (hub) | none | CardGrid, ProofBand, BulletList `[VERIFIED]` | **Reveal-only or nothing** | Sections already animate; TSI section must stay unobscured (D-01e/§6). Optional: nothing new. |
| `/company/about` | RevealSection ×1 (TSI block) | ProseSection, ProofBand | **Reveal-only (already present)** | TSI ownership already wrapped in RevealSection; likely no new visual. |
| `/company/leadership` | RevealSection ×2 | ProseSection, CardGrid, BulletList | **Reveal-only (already present)** | Already elevated; confirm coverage. |
| `/company/careers` | RevealSection ×1 | ProseSection ×2, BulletList | **Reveal-only (already present)** | Already elevated; confirm coverage. |
| `/company/contact` | RevealSection ×1 | CardGrid, ProseSection | **Reveal-only (already present)** | Already elevated; confirm coverage. |
| `/resources` | none | CardGrid, CaseStudyBand, AttachedForm | **Reveal-only or optional DataStory** | Case-study/resource cards could carry a DataStory but risks decoration; default Reveal-only (D-01e). |

**Net:** the archetype work concentrates on ~2-3 pages (`/compare`, `/platform/integrations`, optionally `/why-dplat`). The `/company` set + `/resources` + `/demo` are motion-confirm/Ambient, not archetype work. This is the restraint D-01 demands and keeps the payload/copy surface (and the `[CLAIMS REVIEW]`/`[COI REVIEW]` load) small.

## Folded audit items (independent of the visual work)

### P14-01 — DemoForm aria wiring `[VERIFIED: DemoForm.tsx read]`
- **Current state:** `inputClasses(error)` at `DemoForm.tsx:369-378` returns **only** `{ className }`. It sets a red border on error but wires **no** `aria-invalid` and **no** `aria-describedby`. The `Field` component *does* render the error `<p id="{id}-error" role="alert">` (lines 356-364), so the target id already exists — nothing reads it programmatically.
- **Fix (mechanical):** have `inputClasses` (or the input call sites) add `aria-invalid={error ? true : undefined}` and `aria-describedby={error ? \`${id}-error\` : undefined}` per field. All 6 inputs + 2 selects + 1 textarea spread `{...inputClasses(errors.<field>)}` and pass an `id`, so threading the id through (or moving the aria wiring into `Field`, which already knows both `id` and `error`) fixes all fields in one edit. **Recommended:** wire it in `Field` where `id` and `error` are both in scope, or extend `inputClasses(error, id)`.
- **Note:** the honeypot `websiteUrl` input (line 294) is intentionally unlabeled/hidden — do not add error wiring there.

### P14-02 — form-input focus normalization `[VERIFIED: 3 files read]`
Three inputs use a **3px ring** (`focus:ring-3 focus:ring-[var(--focus)]/35`) or border-color-only, not the DESIGN.md input-state spec:
- `DemoForm.tsx:372` — `focus:ring-3 focus:ring-[var(--focus)]/35` + `focus:border-[var(--primary)]`
- `HomepageHero.tsx:236` — `focus:ring-3 focus:ring-[var(--focus)]/35` (**firewall file** — D-05b)
- `AttachedForm.tsx:55` — `focus:border-[var(--primary)]` only, no ring

**Key finding — the 3px ring is NOT off-spec by accident.** DESIGN.md distinguishes two focus contracts:
- **General interactive elements (§8 buttons/links/tabs):** "2px outline `#9CB4E8`, 2px offset" (DESIGN.md lines 760, 1013, 1041, etc.).
- **Input states specifically (DESIGN.md §8.3 "Input states", lines 1110-1118):** *"Focus-visible: border `#5266EB`; focus ring or background tint `rgba(82,102,235,.05)`."* And the `shadows.focus` token (line 133) is literally `0 0 0 3px rgba(156, 180, 232, 0.35)` — a **3px** ring.

So the current input treatment (border → `--primary`/#5266EB + a `--focus`/#9CB4E8 ring) already matches the *input-specific* spec and the `shadows.focus` token; it is the general 2px-outline rule that does not apply to text inputs. **Recommendation (planner's call per D-05b):** document the input ring as the intentional §8.3 pattern in DESIGN.md (cite `shadows.focus` + §8.3 Input states) rather than normalizing to the 2px outline — normalizing would regress the AttachedForm pill aesthetic and contradict the token. The one genuine inconsistency worth fixing is `AttachedForm.tsx:55` having **no ring at all** (border-only) — bring it in line with the §8.3 ring for consistency. `HomepageHero.tsx` is a firewall file: if any change reaches it, land it on its own track and raise it (do not touch silently).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Comparative/proof chart on /compare or /why-dplat | Bespoke chart component | `DataStoryVisual` + `DataStoryData` (area/spark/bars/cards) | FND-02/03; reduced-motion fail-open + `role="img"` already solved |
| Integrations network/system map | Custom SVG diagram | `SchematicVisual` + `SchematicData` (source/engine/vendor/sink nodes + labeled edges) | Phase 11 shipped 3 schematics on this schema; `PlatformSystemMap` precedent |
| Scroll-reveal on a band | Per-page `useInView`/Framer | `RevealSection` (or barrel `Reveal`) | Fail-open + reduced-motion baked in; already the house pattern |
| Ambient atmosphere on a dark band | Hand-rolled particle canvas | `AmbientField` | Seeded (no hydration mismatch), `aria-hidden`, reduced-motion → static bloom |
| Count-up on a stat | Framer in page code | `AnimatedNumber`/`LiveValue` from the barrel (already inside ProofBand) | FND-01 contract |
| Lazy visual wrapper | New `next/dynamic` call site | `*Visual` wrappers in `archetypes.tsx` | Already lazy `ssr:false` with CLS-matched skeleton + Turbopack inline-literal handled |

**Key insight:** Phases 10-12 already paid every infrastructure cost. This phase adds ~1-3 payload modules, edits ~2-3 page files for archetypes, makes 2 small form edits, and adds 1 spec + extends 2 specs — nothing else. The restraint discipline (D-01) means *most* target pages get no new component at all.

## Runtime State Inventory

Not a rename/refactor/migration phase (additive visual/motion elevation). Categories checked explicitly for completeness:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — static marketing site, no datastore | None — verified (no DB; content is typed modules) |
| Live service config | None. LHCI config (`lighthouserc.json`) unchanged; no target route is added to LHCI (representative-route sampling, Phase 12 D-13 precedent) | None |
| OS-registered state | None | None |
| Secrets/env vars | None touched. `ZOHO_WEBHOOK_URL`/`RESEND_API_KEY` power the DemoForm submit but P14-01/P14-02 are client-side a11y/CSS only — no env change | None |
| Build artifacts | `.next/` cache may hold stale chunks after new payload/spec files | `next build` from clean in CI (default) — nothing manual |
| Test references | `VISUAL_ROUTES` already lists all 9 targets; `axe-routes` + `touch-targets` already iterate them | Extend reduced-motion + fail-open coverage is automatic (they iterate `VISUAL_ROUTES`); add the new page-elevation spec |

## Common Pitfalls

### Pitfall 1: ProductVisualBand has no height floor (CLS)
**What goes wrong:** `ProductVisualBand` renders bare children with no `min-height` `[VERIFIED: component read]`. The `*Visual` lazy skeleton is `min-h-[20rem]`; if a Schematic/DataStory resolves taller, the swap shifts layout and blows the CLS < 0.1 gate.
**Why it happens:** the archetype hydrates client-side (`ssr:false`); the skeleton must reserve the resolved height.
**How to avoid:** author the payload to a bounded height, verify resolved height on the Vercel preview, and if it exceeds 20rem follow the `FLAGSHIP_SKELETON_MIN_H` (`min-h-[44rem]`) precedent in `lazy.tsx` (a dedicated taller skeleton or a `min-h` wrapper on the band child).
**Warning signs:** LHCI CLS regression on the representative route; visible jump under throttled load.

### Pitfall 2: Decoration masquerading as lift (D-01's actual bar)
**What goes wrong:** a page gets a pretty figure that repeats what the text/table already says; it fails D-01 ("explain, not decorate") even though "the page has a visual."
**How to avoid:** the `14-ARCHETYPE-MAP` records, per page, *what argument the visual advances that the prose does not*. If the answer is "it looks nice," the correct output is Reveal/Ambient or nothing. The reviewer gate is Connor's map approval (Phase 12 D-08 precedent).

### Pitfall 3: Double-reveal jank
**What goes wrong:** wrapping a `CardGrid`/`BulletList`/`CompareMatrix` (which already stagger-fade via `product/motion`) in a `RevealSection` produces two overlapping entrances.
**How to avoid:** know which sections self-animate `[VERIFIED: grep — CardGrid, BulletList, CompareMatrix, ComparisonTable, ProcessStrip, IntegrationTable, LeadershipTable, IntegrationStrip all import product/motion]`. Only wrap sections that do NOT self-animate (ProseSection, raw SectionContainer blocks), which is exactly what about/leadership/careers/contact already do.

### Pitfall 4: Color-only status (Pitfall 8 lineage)
**What goes wrong:** archetype accents (chart tokens) carry meaning without a text pairing; grayscale/screen-reader users lose it.
**How to avoid:** every archetype instance gets a complete `ariaSummary` telling the story in words; every accent appears beside a text tag/label (the schemas already pair accents with tags). FIX-01 (IssuesWorklist status label) is the cautionary precedent.

### Pitfall 5: TBT drift on content routes (AUDIT BL-07)
**What goes wrong:** content routes hover in a 230-280ms TBT band on shared runners; the bar is 300ms. An eager archetype import (importing `Schematic.tsx` at page top instead of the lazy wrapper) would blow well past it.
**How to avoid:** import only the `*Visual` lazy wrappers + server-safe payload modules. TBT is hydration-bound (project memory) — do not chase JS-size micro-cuts if a run lands ~290ms; that's runner noise, not a regression.

### Pitfall 6: Voice / COI / CLAIMS violations in new copy
**What goes wrong:** payload captions, `ariaSummary`s, annotations are the phase's new-copy surface. Em dashes, banned words (BL-01's "digital journeys" already lurks in `compare.ts`), company-focused framing, or vendor-independence claims slip in. The `/compare` comparative claims additionally need **legal** sign-off (punch-list #4), and the `/company` TSI section is a live COI surface.
**How to avoid:** §5 self-check per module; `·` separators not em dashes; `[CLAIMS REVIEW]`/`[COI REVIEW]` headers on every payload module (Phase 12 template); flag both tags in the PR body; keep all vendor framing agency-network-agnostic.

### Pitfall 7: Spec false-pass on distinctness
**What goes wrong:** a spec copied from `platform-visuals.spec.ts` that only asserts "`role="img"` exists" passes even if two pages render the same payload.
**How to avoid:** per-route `industryUniqueStrings`-style config with page-specific value strings asserted on load AND under reduced motion (Phase 12 precedent). For this phase the unique strings are per-argument (e.g. an integrations-only node label, a compare-only annotation).

## Code Examples

All from the repo (patterns to replicate verbatim).

### Archetype wrapper (lazy, ssr:false, CLS-matched skeleton)
```tsx
// Source: src/components/product/visuals/archetypes.tsx (verified)
export function SchematicVisual({ data }: { data: SchematicData }) {
  return <LazySchematic data={data} />;   // dynamic(import("./Schematic"), { ssr:false, loading: VisualSkeleton })
}
```

### Page-level reveal (fail-open, reduced-motion-safe)
```tsx
// Source: src/components/sections/RevealSection.tsx (verified)
export function RevealSection({ children, delay = 0 }: RevealSectionProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;            // fail-open: content fully visible
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >{children}</motion.div>
  );
}
```

### DemoForm P14-01 target (where aria wiring belongs)
```tsx
// Source: src/components/forms/DemoForm.tsx:369-378 (verified) — currently className-only:
function inputClasses(error: unknown) {
  return { className: cn("... focus:ring-3 focus:ring-[var(--focus)]/35 ...",
    error ? "border-[var(--destructive)]" : "border-[var(--border)] hover:border-[var(--focus)]") };
}
// The Field component already renders <p id={`${id}-error`} role="alert">, so the
// describedby target exists — wire aria-invalid + aria-describedby to it (P14-01).
```

### DataStory `cards` branch (already in the schema)
```ts
// Source: src/content/visuals/types.ts (verified) — no schema change needed
chart: { kind: "cards"; cards: { name; accent; tag; value; decimals?; suffix?; bar; sub }[] }
```

## State of the Art

| Old Approach (repo today) | Current Approach (this phase) | Changed | Impact |
|---|---|---|---|
| Text-heavy pages carry section-level fade-up but no archetype figures | Archetype visual where the argument earns it; Reveal/Ambient where it doesn't | Phase 10 built it; 11/12 proved it | The "bare page" framing is wrong — pages already animate; the job is targeted archetype lift |
| DemoForm shows red border on error but no programmatic association | `aria-invalid` + `aria-describedby` wired (P14-01) | This phase | Screen readers announce the error and its message |
| Input focus uses a 3px `--focus` ring (matches §8.3 + `shadows.focus` token) | Documented as the intentional input pattern; AttachedForm ring brought in line (P14-02) | This phase | Consistency + a DESIGN.md note; no aesthetic regression |

**Deprecated/outdated:** none introduced. Legacy `@/components/product/motion` (`fadeUpItem` etc.) coexists with the Phase 10 barrel; this phase does not consolidate them (out of scope).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `/compare` and `/platform/integrations` arguments genuinely earn an archetype (vs. being decoration) | Per-page elevation map | Low — Connor's `14-ARCHETYPE-MAP` approval is the gate; if a page doesn't earn it, drop to Reveal/Ambient. |
| A2 | A Schematic/DataStory in `ProductVisualBand` may resolve taller than the 20rem skeleton | Pitfall 1 | If it fits 20rem, no action; if taller and unhandled, CLS gate fails — verify resolved height on preview either way. |
| A3 | Real-shaped anonymized figures used in any new compare/integrations payload are shaped from domain knowledge, not a source doc | Governance / Pitfall 6 | Low for M6 visuals (Andrew pre-cleared real-shaped anonymized figures + vendor/TSI framing, non-blocking); BUT `/compare` comparative claims also need **legal** review (punch-list #4) — flag `[CLAIMS REVIEW]` + `[COI REVIEW]` and do not merge comparative-claim copy without the legal gate. |
| A4 | Documenting the 3px input ring as intentional (vs. normalizing to 2px) is the right P14-02 call | Folded audit items | Low — DESIGN.md §8.3 + `shadows.focus` token both specify a 3px input ring; this is planner's explicit choice per D-05b. |

All other claims in this document are `[VERIFIED]` against the codebase this session or `[CITED]` from the named planning artifacts.

## Open Questions

1. **Does `/compare` get a Schematic (routing argument) or a DataStory (time-to-production / continuous-production proof)?**
   - What we know: both fit an existing schema; the page has ProseSection + ProofBand slots and a market-map table already.
   - What's unclear: which advances the comparative argument best without duplicating the table.
   - Recommendation: decide in `14-ARCHETYPE-MAP`; a DataStory on the "6-9 month typical timeline vs dPlat" contrast is the strongest non-duplicative lift. Comparative claims need legal (punch-list #4).

2. **Do `/company` hub + `/resources` get anything new, or is confirming existing reveal coverage sufficient?**
   - What we know: their section components already animate; TSI/COI section must stay unobscured.
   - Recommendation: default to Reveal-only/nothing (D-01e); record the no-lift call explicitly in the map.

3. **P14-02: normalize the ring or document it?**
   - Recommendation: document as the §8.3 intentional input pattern (backed by `shadows.focus` token); fix only AttachedForm's missing ring. Escalate any HomepageHero change (firewall).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| node / npm | build, tsc, eslint | ✓ | repo-pinned | — |
| next build | local verification | ✓ (works in sandbox) | 16.2.6 | — |
| next dev / next start | local visual checks | ✗ HANGS in this sandbox (project memory, D-07) | — | `next build` + `tsc --noEmit` + eslint locally; Playwright + LHCI against CI/Vercel preview |
| Playwright | `14-page-elevation.spec.ts` + spec extensions | ✓ | ^1.60.0 | Runs via `PLAYWRIGHT_BASE_URL` against preview (Phase 11/12 precedent) |
| axe-core / LHCI | a11y + perf gates (CI) | ✓ | axe ^4.11.3 / lhci ^0.15.1 | CI on the PR |

**Missing dependencies with no fallback:** none. The dev-server constraint is fully routed around by the Phase 11/12 workflow (build/typecheck/lint locally; behavioral + a11y + perf specs against CI/preview).

## Validation Architecture

Nyquist validation is enabled (`.planning/config.json` `workflow.nyquist_validation: true` `[VERIFIED]`).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright `@playwright/test` ^1.60.0 (+ `tsc --noEmit`, eslint, `next build`, axe-core, LHCI in CI) |
| Config file | `playwright.config.*` at repo root; `lighthouserc.json`; `.github/workflows/perf.yml`; route source `tests/helpers/routes.ts` |
| Quick run command | `npx tsc --noEmit && npx eslint <changed files>` (local); `npx playwright test tests/responsive/14-page-elevation.spec.ts` (vs `PLAYWRIGHT_BASE_URL` preview) |
| Full suite command | `npx playwright test` (vs preview) + axe + LHCI via CI |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGEVIS-01 | `/compare` renders its archetype; value strings unique to the compare argument; survives reduced motion | e2e | `14-page-elevation.spec.ts`: per-route `role="img"` archetype with non-empty aria-label + compare-unique strings on load AND under `reducedMotion:"reduce"` | ❌ Wave 0 |
| PAGEVIS-02 | `/why-dplat` renders its lift (archetype OR confirmed reveal), reduced-motion-safe | e2e | `14-page-elevation.spec.ts`: archetype-or-reveal assertion per the map decision | ❌ Wave 0 |
| PAGEVIS-03 | `/company` set + `/resources`: reveals rest at opacity 1 (reduced-motion) + no stuck opacity (motion-on); any new visual is distinct | e2e | Existing `reduced-motion.spec.ts` + `reveal-fail-open.spec.ts` (both iterate `VISUAL_ROUTES`, already list these routes) + any map-added archetype assertion | ✅ (reveal nets) / ❌ (new archetype rows) |
| PAGEVIS-04 | `/platform/integrations` Schematic present + integrations-unique strings; `/demo` Ambient/Reveal only, form CTA intact | e2e | `14-page-elevation.spec.ts`: integrations archetype + strings; `/demo` = fail-open reveal only (no archetype assertion), submit CTA present | ❌ Wave 0 |
| P14-01 | DemoForm error fields expose `aria-invalid` + `aria-describedby` | e2e (a11y) | new assertion (or extend `tests/a11y/*`): trigger validation, assert `aria-invalid="true"` + `aria-describedby="{id}-error"` on each errored field | ❌ Wave 0 |
| P14-02 | Input focus ring consistent; DESIGN.md documents the §8.3 pattern | manual + doc | visual review on preview; DESIGN.md §8.3 note in the same commit | manual/doc |
| (a11y) | axe + touch targets on all 9 routes | CI e2e | `axe-routes.spec.ts` + `touch-targets.spec.ts` over `VISUAL_ROUTES` (23 routes, AUDIT FIX-02) | ✅ exists |
| (perf) | LCP < 2.5s, CLS < 0.1, TBT ≤ 300ms | CI perf | LHCI in `perf.yml` on representative routes (no new routes added — Phase 12 D-13 precedent) | ✅ exists |
| (typing) | Payloads satisfy schemas | compile | `npx tsc --noEmit` (the `satisfies` proofs) | ✅ exists |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit && npx eslint <changed>` + `next build` locally (dev server unavailable in sandbox, D-07)
- **Per wave merge:** `npx playwright test tests/responsive/14-page-elevation.spec.ts` + `reduced-motion.spec.ts` + `reveal-fail-open.spec.ts` against the preview
- **Phase gate:** full Playwright suite + axe + LHCI green in CI on the PR before `/gsd-verify-work`; P14-01/P14-02 resolved; `[CLAIMS REVIEW]`/`[COI REVIEW]` flagged in the PR (compare comparative claims → legal gate)

### CLS skeleton sizing (D-06 / Pitfall 1)
- Any archetype dropped in `ProductVisualBand` must verify resolved height ≤ the skeleton box on the preview. Default skeleton is `min-h-[20rem]`; taller resolves follow the `FLAGSHIP_SKELETON_MIN_H` (`min-h-[44rem]`) precedent. Verified against the representative LHCI CLS gate.

### Wave 0 Gaps
- [ ] `14-ARCHETYPE-MAP.md` — the per-page lift/no-lift call + archetype + slot + payload intent + per-route distinctness strings; Connor-approval gate (Phase 12 D-08 precedent) BEFORE page work.
- [ ] `tests/responsive/14-page-elevation.spec.ts` — per-route config `{ route, archetypeExpected, uniqueStrings[], revealOnly? }` for the pages that get an archetype (compare, integrations, and any map-approved others); mirrors `platform-visuals.spec.ts` (minus Explorable-toggle — flagships not required here); asserts on load AND under reduced motion.
- [ ] DemoForm a11y assertion (new test or extend `tests/a11y/`) covering P14-01 (`aria-invalid` + `aria-describedby`).
- Framework install: none — all tooling exists.

*(reduced-motion + reveal-fail-open + axe + touch-target coverage for all 9 routes already exists via `VISUAL_ROUTES` iteration — no new wiring for those; they just start exercising any new motion this phase adds.)*

## Security Domain

`security_enforcement` is not set in `.planning/config.json` `[VERIFIED: grep — only workflow.nyquist_validation present]`. This phase is a static marketing-site visual/motion + client-side form-a11y pass with no auth, no data storage, no new input handling (P14-01 improves association of an existing validated form; P14-02 is CSS). The only relevant control is input validation, already handled:

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes (existing) | `react-hook-form` + `zod` on `DemoForm` (existing); P14-01 only adds a11y association, no validation change |
| V2/V3/V4/V6 | no | No auth/session/access-control/crypto surface in this phase |

Threat surface unchanged by this phase; the honeypot `websiteUrl` field stays untouched.

## Sources

### Primary (HIGH confidence — verified this session)
- `src/components/product/visuals/{archetypes.tsx,lazy.tsx,index.tsx}` — lazy `*Visual` wrappers, `VisualSkeleton` (20rem), `FLAGSHIP_SKELETON_MIN_H` (44rem), registry ids
- `src/content/visuals/types.ts` — `ConsoleData` / `DataStoryData` (incl. `cards`) / `SchematicData` schemas, field-by-field
- `src/components/motion/index.ts` + `src/components/ambient/AmbientField.tsx` + `src/components/sections/RevealSection.tsx` — motion barrel exports, ambient signature, reveal fail-open
- `src/components/sections/CompareMatrix.tsx` + `src/content/compare.ts` + `src/content/integrations.ts` — /compare and /integrations content/section shapes; legacy `product/motion` usage
- All 9 target `page.tsx` files (compare, why-dplat, company + about/leadership/careers/contact, resources, platform/integrations, demo) — current visual/motion refs and page anatomy
- `src/components/forms/DemoForm.tsx` (Field, inputClasses, 9 input call sites) + `src/components/ui/AttachedForm.tsx` + `src/components/sections/HomepageHero.tsx:236` — P14-01/P14-02 exact state
- `DESIGN.md` §8.3 Input states (lines 1110-1118), `shadows.focus` token (line 133), §4.7 motion engine split (lines 507-517), focus tokens
- `tests/helpers/routes.ts` (`VISUAL_ROUTES` includes all 9), `tests/responsive/{platform-visuals,reduced-motion,reveal-fail-open}.spec.ts` — spec templates + existing coverage
- `package.json`, `.planning/config.json` (`nyquist_validation: true`, no `security_enforcement`)
- `grep`: `product/motion` importers (CardGrid, BulletList, CompareMatrix, ComparisonTable, ProcessStrip, IntegrationTable, LeadershipTable, IntegrationStrip) — the "already animate" finding

### Secondary (MEDIUM / CITED)
- `.planning/phases/14-text-only-page-elevation/14-CONTEXT.md` (D-01..D-07), `.planning/REQUIREMENTS.md` (PAGEVIS-01..04), `.planning/STATE.md`, `.planning/AUDIT-2026-06-12.md` (P14-01, P14-02, BL-01, BL-07, punch-list #4), Phase 12 `12-RESEARCH.md` + `12-ARCHETYPE-MAP.md` (pattern precedent), project memory (next dev hangs, TBT hydration-bound, Andrew figures/COI clearance)

### Tertiary (LOW / assumed)
- Domain-shaped figures for any new compare/integrations payload (A3) — pre-cleared in shape by Andrew for M6 visuals; compare comparative claims still need the legal gate.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; every asset verified in-repo
- Architecture / slot fit: HIGH — direct replication of the shipped Phase 11/12 pattern; schemas read field-by-field; all 9 pages read
- Per-page lift judgment: MEDIUM — the "already animate" finding is HIGH-confidence verified, but the specific archetype-vs-nothing call per page is a design decision gated by Connor's `14-ARCHETYPE-MAP` approval
- P14-01: HIGH — `inputClasses` returns className-only; error id already exists; fix is mechanical
- P14-02: HIGH on the finding (DESIGN.md §8.3 + `shadows.focus` token specify a 3px input ring, so the ring is on-spec for inputs); MEDIUM on the recommendation (document vs. normalize is planner's call per D-05b)
- Pitfalls: HIGH (each anchored to a verified code fact or AUDIT item)

**Research date:** 2026-07-01
**Valid until:** stable while the branch tracks this `main` state (~30 days). Re-verify page anatomy and `VISUAL_ROUTES` if Phase 13 (SYSVIS) merges to main first, since it touches the visuals registry the pages fall back to.
