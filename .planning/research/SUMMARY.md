# Project Research Summary

**Project:** DebtNext.com / dPlat — Premium visual + motion system (M6)
**Domain:** Premium product-visual + motion layer for an existing dark-fintech B2B marketing site (Next.js 16 / React 19)
**Researched:** 2026-06-04
**Confidence:** HIGH

## Executive Summary

M6 adds a premium visual + motion layer to an already-shipped, sophisticated site. The research converges on one clear shape: this is an **integration milestone, not a greenfield one**, and it can be built with **zero new runtime dependencies**. Framer Motion 12, GSAP 3.15 (with every formerly-paid plugin now free and physically present), and the repo's hand-built SVG/CSS primitives already cover the full 7-type motion vocabulary and the three-archetype visual library. The charting build-vs-buy question is settled: **BUILD** with the existing `parts.tsx` SVG atoms. A charting lib (Recharts/Visx/Chart.js) would add bundle, fight DESIGN.md tokens, need a CLAUDE.md §2 flag, and re-skin work already done — none of which the 2-to-6-point annotated "data story" scope justifies.

The expert approach for a Mercury/Linear/Stripe-tier B2B site is **restraint executed perfectly**: real product visuals (never stock), per-context distinctness driven by data (not new layouts), and motion that is subtle, centralized, and reduced-motion-safe by default. The single most important architectural bet is the **"archetype + typed data payload" model**: each visual is one of three parametrized archetypes (Console / Data story / Schematic) fed a typed payload, never a copy-paste component. This is the direct fix for the 7-page `SolutionsIndustryCards` duplicate and the ~45 accordion placeholders — they collapse into payloads instead of new components, and centralizing the numbers in `src/content/visuals/*.ts` makes `[CLAIMS REVIEW]` enforceable.

The dominant risk is **perf regression on a homepage that is already over its LCP budget**. M5 is blocked because GSAP sits on the mobile critical path; M6 adds Framer Motion plus dozens of client visuals to the *same shared JS budget on the same homepage*. The mitigation is sequencing and discipline: **M6 Phase 0 must co-land with or after M5's Phase 5.3 (lazy GSAP)**, the homepage capstone (W7) must never precede the M5 hero LCP fix, and Phase 0 owns the load-bearing contracts — a per-route JS budget, the `whileInView` "fails closed / no stuck `opacity:0`" reveal guarantee, in-view gating to cap always-on cursor/hover loops (INP), and centralized reduced-motion handling. Get Phase 0 right and the rest is mechanical, page-by-page application.

## Key Findings

### Recommended Stack

**Zero new dependencies.** Everything needed is installed and validated in the repo. The split is already established and should be held: **Framer for declarative component motion, GSAP for scrubbed/pinned scroll cinematics, CSS for ambient/hover/micro-interactions.** Default to Framer; reach for GSAP only when a feature is genuinely timeline- or scroll-scrub-shaped. See `.planning/research/STACK.md`.

**Core technologies (all already present):**
- **Framer Motion 12.39.0** — scroll-reveal, live-data entrances, hover/lift, micro-interactions, tab/section crossfades — the repo default, React-19-native, centralizes `useReducedMotion`.
- **GSAP 3.15.0 + `@gsap/react` 2.1.2** — only the pinned hero/Platform 400vh scrub and schematic "data traveling the edges" if scrubbed/looping; all plugins free since 3.13.
- **Hand-built SVG + CSS (`parts.tsx`, CSS Modules)** — the three archetypes and their chart atoms; ~0 KB bundle, token-driven, accessible, animates with the loaded motion stack. This is the charting answer.

**Framer-vs-GSAP per motion type:** (1) scroll reveal → Framer; (2) live-data → Framer; (3) hover/cursor → Framer lift + vanilla rAF cursor glow; (4) ambient drift → CSS keyframes; (5) micro-interactions → Framer + CSS; (6) tab/section transitions → Framer, GSAP only for the existing pinned seam; (7) explorable → Framer. **GSAP-only justified cases in M6: the existing pinned hero/Platform scrub, and scrubbed schematic edge animation. Nothing else.**

### Expected Features

See `.planning/research/FEATURES.md`. Filtered through the restraint brief: "premium because motion is subtle and perfectly executed, not because there is a lot of it."

**Must have (table stakes):**
- Real product visuals, never stock/illustration — the whole premise of M6.
- **Distinct** visual per context (no copy-paste) — distinctness from the *data payload*, not new layouts.
- Staggered scroll-reveal, number roll-ups, hover states, the 7 micro-interaction states, no-hard-cut transitions, content-shaped loading skeletons, lazy-load with no perf regression, reduced-motion parity everywhere.

**Should have (differentiators — pick few, do them perfectly):**
- **Per-industry data realism** (real account types, vendor mix, real-shaped numbers) — highest leverage, lowest architectural risk.
- **Three-archetype library** (Console / Data story / Schematic) teaching a true thing each.
- **Schematic with data traveling the edges** — the most dPlat-specific, anti-pastiche visual.
- **One explorable flagship per Platform page** (hover/toggle only — not a sandbox).
- Ambient drift and pulsing live-status cues, kept sub-threshold.

**Defer (v2+ / capstone):**
- W5 text-only page elevation (lower buyer impact).
- W7 homepage hero Console capstone — explicitly last, gated on the M5 hero perf fix.
- A real charting library / live backend data — out of scope (and a regulatory risk for this buyer).

**Anti-features (never build):** parallax/scroll-jacking, carousels, bounce/spring easing, decorative 3D/AI illustration, free-form product sandbox, real-backend "live" data, animating every element, new tokens, chat/exit-intent widgets. Several are already hard-banned in CLAUDE.md §15 / DESIGN.md §10.

### Architecture Approach

An **integration architecture** that consolidates two parallel visual libraries into one archetype-driven library and promotes scattered motion logic into a single authority — without regressing the homepage cinematic handoff. See `.planning/research/ARCHITECTURE.md`.

**Major components:**
1. **Content layer — `src/content/visuals/*.ts` (NEW, server-safe)** — typed per-context payloads (`ConsoleData` / `DataStoryData` / `SchematicData`). The single auditable home for every number a visual renders (`[CLAIMS REVIEW]`).
2. **Archetype layer — `Console` / `DataStory` / `Schematic` (NEW, `"use client"`, lazy `ssr:false`)** — parametrized renderers with zero baked data, built on existing `parts.tsx` + `primitives/`.
3. **Motion barrel — `src/components/motion/` (promoted to single source of truth)** — named primitives (`Reveal`, `LiveValue`, `Hoverable`, `transitions`, `Explorable`, `tokens`, re-exported `AmbientField`). Pages and archetypes never import `framer-motion`/`gsap` directly.

The key leverage point: `FeatureAccordion.visuals` and `BenefitSplit.visual` injection seams **already exist**, so pages adopt archetypes with zero section-component changes. The homepage handoff's `MockupForTab(id)` / `mockupTitleForTab(id)` signatures are held stable as the **regression firewall** — the implementation swaps behind them, the GSAP pin and `FramedDashboard` bezel are never touched.

### Critical Pitfalls

Top items from `.planning/research/PITFALLS.md` (all map to Phase 0 prevention):

1. **Re-opening the M5 hero LCP gate by piling JS onto the mobile critical path** — M5 and M6 share one JS budget on one homepage. Land lazy GSAP (M5 5.3) before/with M6 Phase 0; all visuals stay `dynamic(ssr:false)`; never import `motion` into layout/header/Server Components; add a per-route First-Load-JS budget to CI.
2. **`whileInView` reveals that ship blank (stuck `opacity:0`)** — current Motion has no IO fallback; content inside hidden tabs / non-scrolling / headless contexts fails closed. Every reveal primitive must render the final, fully-visible state under reduced motion; add a Playwright "no in-viewport node at `opacity < 1`" assertion after scroll + tab/accordion open.
3. **INP regression from many concurrent cursor/hover/rAF loops** — cap always-on motion to one ambient/cursor layer *per viewport* (in-view gated), keep hover in CSS, stop one-shot counters at final value, add INP/TBT to CI on visual-heavy routes.
4. **Animating layout properties + CLS from lazy mounts** — primitives use `transform`/`opacity`/`scaleX`/`clipPath` only; each lazy archetype's skeleton reserves the same box as the resolved visual.
5. **A11y on hand-built visuals** — hover/cursor-only interactions lock out keyboard/touch (real `<button>` + focus parity); status by color alone fails WCAG (label/icon mandatory in the primitive API); deterministic seeded randomness avoids hydration mismatch; reduced-motion handled once, centrally.

## Implications for Roadmap

Research strongly endorses the spec's Phase 0–4 structure, with one inversion (consolidate the homepage handoff *after* Console is proven, not first) and one hard cross-milestone dependency (M5 5.3). Suggested structure:

### Phase 0: Foundation (the hard-sequenced keystone)
**Rationale:** Unblocks every other phase. Until the motion barrel, typed payload schemas, three archetypes, and new primitives exist, no page work can start without re-deriving restraint and reduced-motion logic ad hoc. This is also where every perf/a11y contract is set once so consumers can't get it wrong.
**Delivers:** `src/components/motion/` barrel (`Reveal`/`LiveValue`/`Hoverable`/`transitions`/`Explorable`/`tokens`, re-exported `AmbientField`); new primitives (`WorklistRow`, `ChartFrame`, `FlowNode`, `FlowEdge`); `src/content/visuals/types.ts`; the three parametrized archetypes; lazy archetype wrappers; retire the 6 dead `dashboard-dark.png` fallbacks.
**Addresses:** Centralized motion primitives + reduced-motion parity; the archetype delivery mechanism for all real visuals.
**Avoids:** Pitfalls 1–10 — owns the JS budget, the "fails-closed reveal" contract, in-view gating, transform-only rule, per-archetype skeleton sizing, label-paired status, deterministic randomness, and centralized reduced-motion.
**Cross-milestone gate:** Co-land with or after **M5 Phase 5.3 (lazy GSAP)**. Do not build new motion on top of an open hero LCP gate.

### Phase 1: Platform deep-dive visuals (4 pages, ~20 items)
**Rationale:** Lower-risk than the homepage; the place to battle-test the Console/Schematic/DataStory payload schemas against real platform data before touching the cinematic handoff.
**Delivers:** Accordion placeholders → archetype payloads; one **explorable flagship** per Platform page.
**Uses:** Framer for entrance/live-data/explorable; hand-built SVG for charts/schematics; GSAP only if a schematic needs a scrubbed edge animation.
**Implements:** The archetype + typed-payload model end-to-end on real pages.

### Phase 2: Solutions visuals (7 pages, ~25 items) + kill the duplicate
**Rationale:** Highest-visibility credibility fix — the `SolutionsIndustryCards` 7-page duplicate is the clearest "templated" tell. Schemas are hardened by Phase 1.
**Delivers:** Duplicate widget → `DataStory` fed 6 per-industry payloads; per-industry Console hero + Schematic + Data story; accordion placeholders → payloads. Per-industry **data realism** is the lead differentiator here.
**Avoids:** Color-only/no-text-alt data-viz (Pitfall 8) at highest volume; `[CLAIMS REVIEW]` on every per-industry number.

### Phase 2.5 (interleaved): Consolidation — homepage handoff
**Rationale:** **Must come after Console is proven on a Platform page**, not first. The handoff is a 400vh GSAP-pinned cinematic and the riskiest surface on the site; the archetype must be battle-tested before re-pointing `MockupForTab`.
**Delivers:** 4 handoff tabs authored as Console payloads; `MockupForTab`/`mockupTitleForTab` re-implemented behind their existing signatures (the regression firewall); `sections/mockups/` retired only after the handoff renders identically through Console.
**Avoids:** The "consolidate first" anti-pattern; pin + bezel are never touched.

### Phase 3: Text-only page elevation (8+ pages)
**Rationale:** Lower buyer-impact; lifts where motion/visuals earn their place. Archetypes are mature by now.
**Delivers:** DataStory + Schematic + Reveal/Ambient on compare / why-dplat / company/* / resources / integrations / demo.

### Phase 4: Homepage flagship capstone (W7)
**Rationale:** Consumes the matured system; highest-risk perf change (hero LCP).
**Delivers:** Hero elevated to a Console-archetype instance; `dashboard-dark.png` hero fate resolved; final motion polish.
**Hard gate:** **Must land after (or jointly with) the M5 hero-perf LCP fix — never before.** Re-run LHCI Case C before merge.

### Phase Ordering Rationale
- **Phase 0 is a strict prerequisite** for everything; it carries the dependency weight (motion barrel → all motion; archetypes → all page visuals).
- **Consolidation is deliberately not first** — proving Console on Platform de-risks the homepage handoff, the single most important ordering decision for avoiding a regression.
- **Homepage is genuinely last** and gated on M5, because both milestones touch the same hero and share the same marginal mobile JS budget.

### Research Flags

Phases likely needing deeper research / careful planning (consider `/gsd-research-phase`):
- **Phase 0:** The three payload schemas (`ConsoleData`/`DataStoryData`/`SchematicData`) covering all real cases is the main design risk — prototype the Console schema against the two existing Placement implementations before committing. The motion-barrel migration (moving `AnimatedNumber`/variants without breaking current consumers) also warrants a planning pass.
- **Phase 2.5 (Consolidation):** The GSAP-pin handoff re-point is high-risk; plan the exact migration order and the regression-spec set (pin anchored, bezel centered across the seam, reduced-motion, platform-mobile).
- **Phase 4 (Homepage):** Perf-critical; needs an LHCI re-baseline plan coordinated with M5 state.

Phases with standard patterns (lighter research):
- **Phase 1 / Phase 3:** Once Phase 0 lands, these are mechanical, page-by-page applications of proven archetypes + payloads.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions + free GSAP plugins verified by direct `package.json` / `node_modules` reads; zero-new-dep conclusion is grounded, not inferred. |
| Features | MEDIUM-HIGH | Table-stakes and anti-features consistent across every 2026 best-in-class source and locked brand docs. Differentiator restraint thresholds are a confirmed judgment call, not a discovery. |
| Architecture | HIGH | Grounded in direct reads of the live codebase; injection seams and the regression-firewall path verified against actual component APIs. |
| Pitfalls | HIGH | Tied to concrete repo files, the documented M5 LCP post-mortem, DESIGN.md, and current Motion/web.dev INP guidance. |

**Overall confidence:** HIGH

### Gaps to Address

- **`[CLAIMS REVIEW]` ceiling on per-industry data realism (open question for requirements):** the per-industry realism differentiator depends on real-shaped account types/numbers. If only fully-generic numbers clear review (Andrew Budish), the differentiator weakens. **Flag early, before Phase 2 planning** — it changes how much credibility the Solutions visuals can carry.
- **Payload import location:** dedicated `src/content/visuals/` dir (recommended, cleaner review surface) vs extending `solutions-*.ts`. Both work; decide in Phase 0.
- **`FramedDashboard` relocation:** cosmetic (relocate to `product/visuals/` vs keep in slimmed `sections/mockups/`); defer to consolidation phase.
- **M5 reconciliation:** the old roadmap's "Phase 8 (Motion)" is superseded/absorbed by M6 Phase 0 — do not double-schedule. Confirm Phase 5 close/renegotiation and milestone versioning (e.g. v1.1) in the milestone flow.

## Sources

### Primary (HIGH confidence)
- `package.json` + `node_modules/{gsap,framer-motion,@gsap/react}/package.json` and `node_modules/gsap/dist/` — installed versions and free-plugin status verified directly.
- Direct codebase reads: `src/components/product/{parts.tsx,motion.tsx,visuals/*,primitives/*}`, `src/components/{motion,ambient}/`, `sections/{FeatureAccordion,BenefitSplit,mockups,RevealSection}`, `src/hooks/use-in-view.ts`, `tests/hero/*`, `tests/responsive/reduced-motion.spec.ts`, `src/app/globals.css`.
- `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md` — the approved design spec (7 motion types, 3 archetypes, §5 guardrails, §7 M5 reconciliation).
- `.planning/STATE.md` + `docs/m5-phase-5-lhci-run.md` — M5 hero LCP post-mortem (GSAP on mobile critical path; lazy-GSAP fix queued as Phase 5.3).
- `DESIGN.md` §3.4/§4.1/§4.7/§9.6/§10/§11/§12, `CLAUDE.md` §2/§11/§12/§13/§15 — token, a11y, perf, and governance contracts.
- GSAP 3.13 release notes; motion.dev docs (`whileInView`/`useInView` IO-required, `MotionConfig reducedMotion`); web.dev INP guidance.

### Secondary (MEDIUM confidence)
- 2026 best-in-class SaaS design roundups (gridrebels, Webflow, SaaSFrame, Orbix), Linear/Mercury design references, Adobe Design "animation that fails safely," enterprise/risk-averse-buyer best-practice articles.

---
*Research completed: 2026-06-04*
*Ready for roadmap: yes*
