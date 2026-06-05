# Feature Research

**Domain:** Premium product-visual + motion system for a dark-canvas B2B fintech marketing site (M6, DebtNext / dPlat)
**Researched:** 2026-06-04
**Confidence:** MEDIUM-HIGH

> Scope note: this file covers ONLY the new M6 layer — the visual archetype library, per-context product visuals, and the 7-type motion vocabulary. The existing 11 routes, section primitives, cinematic hero, and a11y baseline are treated as shipped foundation, not features under research. Every recommendation is filtered through the restraint brief (`.impeccable.md` principles 3-5, DESIGN.md §10, spec §2: "premium because motion is subtle and perfectly executed, not because there is a lot of it").

**Workstream key** (from spec §3.1): `W1` Per-industry solutions visuals · `W2` Platform capability visuals · `W3` Solutions capability visuals · `W4` Motion + interactivity system · `W5` Text-only page elevation · `W6` Visual system consolidation · `W7` Homepage/hero capstone.

---

## Feature Landscape

### Table Stakes (Best-in-class B2B fintech sites all do these)

Mercury, Linear, Stripe, and Vercel-tier sites all ship these. Missing them is what makes the current site read as "sophisticated but with gaps" (spec §1). These are the minimum to clear the "flagship premium" bar for a VP+ enterprise buyer.

| Feature | Why Expected | Complexity | Workstream | Notes |
|---------|--------------|------------|------------|-------|
| Real product visuals, never stock/illustration | The single strongest signal across all 2026 best-in-class lists: "real product visuals (not stock illustrations)." Already a `.impeccable.md` principle 4. This is the whole premise of M6. | MEDIUM | W2,W3,W1 | Replaces ~45 text placeholders + 1 duplicate widget. The archetype library (Console/Data story/Schematic) is the delivery mechanism. |
| **Distinct** visual per context (no copy-paste) | The `SolutionsIndustryCards` duplicate across 7 pages is the clearest "templated" tell. Credibility comes from each industry seeing its own account types, numbers, vendor mix. | HIGH | W1,W3 | Distinctness must come from the *data payload*, not new layouts. "A visual = archetype + data payload" (spec §3.3). Real per-industry account types are the credibility lever. |
| Staggered scroll-reveal (fade-up, short distance) | Universal. "Sections fade and slide in as the user scrolls." Already partially built; M6 refines timing + extends coverage. | LOW | W4 | Motion type 1. Refine existing timing to DESIGN.md §4.7 easings; collapse to instant fade under reduced-motion. Keep travel distance small (premium = restraint). |
| Number roll-ups / count-ups on metrics | Standard "live data" cue that says "the product is thinking and responding." `CountUp.tsx` already exists; extend to the new Data-story archetype. | LOW | W4,W2,W3 | Motion type 2. Must only fire in-view, once, and respect reduced-motion. Numbers must be `[CLAIMS REVIEW]`-clean (generic/qualified). |
| Hover states that reveal context on cards/visuals | "Hover states can reveal more context on feature cards." Expected interactivity floor. | LOW-MEDIUM | W4 | Motion type 3. Card lift + cursor-reactive glow on dark panels (tier-3 pattern already shipped on homepage; extend site-wide). |
| Micro-interaction states on every interactive element | The 7 states (default/hover/focus/active/disabled/loading/error) are already a hard requirement (DESIGN.md §7, `.impeccable.md` principle 5). Premium sites get this exactly right. | MEDIUM | W4 | Motion type 5. Focus glow uses `#9CB4E8` 2px/2px — non-negotiable a11y floor. |
| Section/tab/route transitions with no hard cuts | Crossfade/morph between states. The cinematic hero→Platform handoff already does this; the bar is now site-wide consistency. | MEDIUM | W4,W7 | Motion type 6. The homepage handoff is the reference implementation; consolidation (W6) folds its mockups into the shared library. |
| Content-shaped loading placeholders (shimmer) | "Stripe, Linear, and Notion all use content-shaped placeholders that pulse with a shimmer." Expected for any lazy-loaded visual. | LOW | W4,W6 | Visuals are `ssr:false` dynamic imports (spec §5 perf); they need a calm skeleton, not a spinner. Prevents CLS during lazy load. |
| Lazy-load below-fold visuals, no perf regression | "Aggressive use of motion without slowing the page." LCP<2.5s / CLS<0.1 / INP<200ms is the gate (and `/` is already over LCP budget). | MEDIUM | W4,W6 | Animate transform/opacity only — never layout properties. This is the load-bearing perf constraint for the whole milestone. |
| Reduced-motion parity everywhere | WCAG 2.2 AA floor + already-tested. Every new motion primitive must collapse to instant fade. | LOW (if centralized) | W4 | Centralizing in `src/components/motion/` is what makes this cheap to guarantee (spec §4.1). |

### Differentiators (Where this site can feel flagship, not just competent)

These set the site apart for a risk-averse buyer who is comparing against legacy collections UIs and generic B2B SaaS. Each one must still pass the restraint test. **Pick few; do them perfectly.** Trying to differentiate on all of these would itself violate the brief.

| Feature | Value Proposition | Complexity | Workstream | Notes |
|---------|-------------------|------------|------------|-------|
| Explorable flagship visual (hover-to-inspect / toggle states inside the visual) | Lets a buyer *operate* a slice of dPlat without a demo — directly serves "reduce decision risk." The clearest "this is a real operator tool" signal. | HIGH | W4,W2 | Motion type 7. Spec §4.4 scopes this to ONE flagship item per Platform page (not every accordion). Keep it: hover a worklist row to inspect, toggle a pool/status filter. No free-form sandbox. |
| Three-archetype library teaching a true thing each (Console / Data story / Schematic) | A *system* (not one-off mockups) is what reads as "expensive." Data story = annotated chart that teaches; Schematic = routing/flow with data on the edges. | HIGH | W1,W2,W3,W6 | The core architectural bet. Distinctness + consistency at once. Schematic-with-data-on-edges is the most differentiated and the most legacy-collections-software-unlike. |
| Per-industry data realism (real account types, vendor mix, real-shaped numbers) | A utilities buyer seeing utility account types (not generic "Account 001") is the difference between credible and templated. | MEDIUM-HIGH | W1,W3 | Data only — reuses the same archetypes. All numbers `[CLAIMS REVIEW]`; generic/qualified, no invented clients. This is the highest-leverage, lowest-architectural-risk differentiator. |
| Ambient drift behind dark bands (slow, blurred, barely perceptible) | "Feels expensive" comes from details you don't consciously notice (Linear: "structure should be felt not seen"). A faint moving light gives depth without decoration. | MEDIUM | W4,W7 | Motion type 4. Tier-3 ambient layer already shipped; extend carefully. The risk is it tips into "decoration" — keep it sub-threshold and off under reduced-motion. |
| Pulsing live-status dots / filling bars as ambient "system is live" cues | Signals a running system rather than a screenshot. Cheap, high-credibility for an operations buyer. | LOW | W4,W2,W3 | Motion type 2. `LiveStatus` primitive already exists. Use sparingly — 1-2 per visual, not a Christmas tree. |
| Schematic with data traveling the edges (routing/flow) | The most "dPlat-specific" visual: shows placement routing to a vendor network, which no generic SaaS template and no legacy collections UI shows. Directly illustrates the core value prop. | HIGH | W1,W2 | Strongest anti-pastiche move. Animate dots along edges (transform only). Keep one stroke weight, one type scale (spec §4.2). |
| Homepage hero as a Console-archetype instance (retire the static PNG) | A live-feeling hero centerpiece instead of `dashboard-dark.png` raster lifts the first impression to flagship tier. | HIGH | W7,W6 | Capstone only (spec §4.3). Must NOT regress hero LCP — the poster image owns LCP, the live visual layers on top (DESIGN.md perf). Coordinate with M5's open hero-perf gate. |

### Anti-Features (Deliberately do NOT build — tied to the restraint brief)

These are common on "impressive" SaaS sites and would actively *damage* trust with a calm, risk-averse, regulated buyer. Several are already banned in `CLAUDE.md §15` / `DESIGN.md §10` / `.impeccable.md`; listed here so the roadmap never reintroduces them under the banner of "premium."

| Feature | Why It Gets Requested | Why Problematic Here | Alternative |
|---------|----------------------|----------------------|-------------|
| Parallax scrolling / scroll-jacking | Reads as "modern/premium" to some | Banned (DESIGN.md §10, `.impeccable.md` principle 4). Fights the buyer's control, reads gimmicky, hurts INP, motion-sickness risk. Anti-trust for risk-averse buyers. | Anchored scroll-reveal that respects native scroll speed (motion type 1). |
| Carousels / auto-rotating sliders | "Show more in less space" | Banned. Low engagement, hides content, CLS risk, reads as generic-B2B-template. | Static grid or a deliberate `ProcessStrip`; let whitespace carry it (principle 3). |
| Bounce / spring / playful easing | "Feels lively/delightful" | Banned. Consumer-fintech tell (Cash App/Robinhood anti-reference). Undermines "calm, precise, technical." | Linear/ease-out, short distances, DESIGN.md §4.7 easings only. |
| Decorative 3D blobs / abstract gradient art / AI marketing illustration | "Looks designed" | Generic-B2B-SaaS-pastiche anti-reference (`.impeccable.md` anti-ref 3). Violates principle 4 (visuals explain, don't decorate). | Real product archetypes. Atmospheric cool imagery allowed for hero only. |
| Free-form interactive "sandbox" / clickable product tour everywhere | "Let them try it!" | Over-scoped, heavy JS (INP risk), and over-promises vs an enterprise demo motion. Distracts from the single "Request a demo" CTA. | ONE constrained explorable flagship per Platform page (differentiator above), hover/toggle only. |
| Live data fetched from a real backend | "Most authentic" | No backend in scope, freshness/accuracy/compliance burden, `[CLAIMS REVIEW]` exposure, perf cost. False "live" claims are a regulatory risk for this buyer. | Realistic *static* typed data payloads that animate on reveal. "Live-feeling," not live. |
| Cursor-following custom elements / heavy hover spectacle | "Interactive and premium" | Tips from "subtle glow" into "look at me." Distracts a buyer who wants quiet competence. | Keep cursor-reactive glow sub-threshold (tier-3 level), card lift small. |
| Sound / video autoplay with audio, looping motion in copy bands | "Engaging" | Hostile in a managed-desktop work context; reads unserious. | Muted, metadata-preloaded hero video only (already the rule). |
| Animating every element on every page | "Make it feel alive" | This is THE failure mode the spec warns against (§2). Motion everywhere reads cheap and busy, the opposite of premium. Hurts INP. | Motion budget per band: pick the one thing worth animating; let the rest be still. "One voltage per band" applied to motion. |
| New colors/type/spacing to make a visual "pop" | "This chart needs an accent" | Violates token discipline (DESIGN.md is sole source; spec non-goal). Reference-dilution risk. | One stroke weight, one type scale, one color logic from existing tokens (spec §4.2). Raise in chat if genuinely blocked. |
| Chat widget / exit-intent / scroll overlays | "Capture more leads" | Hard-banned (`CLAUDE.md §15`). Conflicts with calm brand and form-first capture. | The existing `DemoForm` / `AttachedForm` is the only capture path. |

---

## Feature Dependencies

```
W4 Motion primitives  (src/components/motion/)
    └──unblocks──> all scroll-reveal, count-up, hover, transition behavior on every visual
W6 Consolidation + archetype primitives (product/primitives/, merge sections/mockups)
    └──unblocks──> W1 + W2 + W3 archetype instances (Console / Data story / Schematic)
                       └──unblocks──> Explorable flagship (W2)  [needs Console archetype + motion type 7]
                       └──unblocks──> Per-industry data realism (W1/W3)  [needs all 3 archetypes]
W7 Homepage capstone ──requires──> mature W4 + W6 (applies the finished system; retires hero PNG)
Ambient drift (W4) ──enhances──> every dark band, but is independent of the archetype library
Reduced-motion handling ──must wrap──> every W4 primitive (built once, centrally)
Lazy-load + shimmer (W4/W6) ──gates──> all below-fold archetype instances (perf contract)
```

### Dependency Notes

- **Foundation first (spec Phase 0):** W4 motion primitives + W6 consolidated archetype library/primitives must land before any page-level visual work. This matches spec §6 Phase 0 ("unblocks everything"). Roadmap should not parallelize W1/W2/W3 ahead of W6.
- **Explorable flagship depends on the Console archetype** existing and stable — it is an *enhancement* of a Console instance, not a separate component. Schedule after W2's base accordion instances work.
- **Homepage capstone is genuinely last** — it consumes the matured system and is the highest-risk perf change (hero LCP). Don't pull it forward.
- **Conflict to manage:** the homepage hero Console instance (W7) conflicts with M5's still-open hero-perf LCP gate. These two milestones touch the same hero. Sequence so W7 lands after (or jointly with) the M5 hero-perf fix, never before.
- **Ambient drift is independent** of the archetype library — can ship in the Phase 0/foundation wave or alongside W7 without blocking page visuals.

---

## MVP Definition

"MVP" here = the smallest M6 increment that lifts the site to credible-flagship without breaking restraint or perf.

### Launch With (Phase 0 + first page wave)

- [ ] **W4 motion primitives, reduced-motion-aware, centralized** — every other feature depends on it; enforces restraint centrally.
- [ ] **W6 consolidated archetype library + primitives; dead `dashboard-dark.png` fallbacks retired** — removes the duplicate-system tech debt that blocks clean page work.
- [ ] **Three archetypes (Console / Data story / Schematic) built and parametrized** — the delivery mechanism for all real visuals.
- [ ] **W1 kill the 7-page duplicate widget** — single highest-credibility fix; the most visible "templated" tell on the live site.
- [ ] **Scroll-reveal timing refined + count-ups extended** — table-stakes motion polish, low cost.

### Add After Validation (subsequent page waves)

- [ ] **W2 Platform capability visuals (~20 items)** — once archetypes are proven on solutions, apply to platform deep-dives.
- [ ] **W3 Solutions capability visuals (~25 items) with per-industry data realism** — the differentiator that makes each industry feel its own.
- [ ] **One explorable flagship per Platform page** — add after base W2 instances read well; highest motion complexity, do last among page work.
- [ ] **Ambient drift extended site-wide** — once the budget/threshold is tuned on one band.

### Future Consideration (post-M6)

- [ ] **W5 text-only page elevation (compare, why-dplat, company/*, resources, integrations, demo)** — lifts where it earns its place; lower buyer-impact than platform/solutions, defer.
- [ ] **W7 homepage/hero flagship capstone** — explicitly the capstone (spec §6 Phase 4); gated on M5 hero perf. Last.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Motion primitives (W4), reduced-motion-aware | HIGH | MEDIUM | P1 |
| Archetype library + consolidation (W6) | HIGH | HIGH | P1 |
| Kill 7-page duplicate widget (W1) | HIGH | MEDIUM | P1 |
| Real per-industry data realism (W1/W3) | HIGH | MEDIUM | P1 |
| Scroll-reveal refine + count-ups (W4) | MEDIUM | LOW | P1 |
| Platform capability visuals ~20 (W2) | HIGH | HIGH | P2 |
| Solutions capability visuals ~25 (W3) | HIGH | HIGH | P2 |
| Explorable flagship per Platform page (W4/W2) | HIGH | HIGH | P2 |
| Hover/cursor glow + micro-interactions site-wide (W4) | MEDIUM | LOW-MEDIUM | P2 |
| Ambient drift site-wide (W4) | LOW-MEDIUM | MEDIUM | P2 |
| Schematic-with-data-on-edges (W1/W2) | MEDIUM-HIGH | HIGH | P2 |
| Text-only page elevation (W5) | MEDIUM | MEDIUM | P3 |
| Homepage hero Console capstone (W7) | HIGH | HIGH | P3 (gated on M5 hero perf) |

**Priority key:** P1 = foundation, must land first · P2 = core value, page-by-page after foundation · P3 = capstone / lower-impact, defer.

## Competitor Feature Analysis

| Feature | Mercury | Linear | Stripe | dPlat (our approach) |
|---------|---------|--------|--------|----------------------|
| Real product visuals | Atmospheric hero + product slices | Crafted, instant-loading interface shots | Real dashboard/API surfaces | 3-archetype library fed real per-context data |
| Per-context distinctness | Single product | Single product | Per-product visuals | Per-industry data payloads on shared archetypes |
| Motion philosophy | One voltage, very restrained | "Structure felt not seen"; instant-loading, scroll-triggered | Scroll storytelling, content-shaped shimmer | 7-type vocabulary, centrally restrained, reduced-motion default |
| Explorable / interactive | Minimal | Scroll-revealed feature context | Some interactive code/API demos | One constrained explorable flagship per Platform page |
| Anti-decoration stance | Strict (single CTA/band) | Strict (minimalist) | Moderate (more density) | Strict — visuals explain not decorate (principle 4) |

## Confidence Assessment

- **HIGH** on table-stakes and anti-features: these are consistent across every 2026 best-in-class source and align with already-locked brand docs. The anti-feature list is largely re-asserting existing bans, so low risk.
- **MEDIUM** on the differentiator scoping (especially explorable flagship and ambient drift): web sources confirm these patterns exist and read premium when restrained, but the exact restraint threshold for *this* audience is a judgment call the spec already made — I'm confirming, not discovering. Validate the explorable flagship scope (hover/toggle only, one per page) with Connor before building.
- **Open question for requirements:** how much per-industry *data* can clear `[CLAIMS REVIEW]`? The differentiator value of per-industry realism depends on having real-shaped account types/numbers. If only fully-generic numbers are approvable, the realism differentiator weakens — flag early.

## Sources

- [20 Best SaaS Website Designs in 2026 (gridrebels)](https://www.gridrebels.studio/post/20-best-saas-website-designs-in-2026-examples-that-actually-convert)
- [Mercury Design System for React — Indigo #5266eb (shadcn.io)](https://www.shadcn.io/design/mercury)
- [35 SaaS website design examples 2026 (Webflow)](https://webflow.com/blog/saas-website-design-examples)
- [10 SaaS Landing Page Trends for 2026 (SaaSFrame)](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [B2B SaaS Dashboard UI Design 2026 (Orbix)](https://www.orbix.studio/blogs/b2b-saas-dashboard-design-examples)
- [Linear design aesthetic (LogRocket)](https://blog.logrocket.com/ux-design/linear-design/)
- [A calmer interface for a product in motion (Linear)](https://linear.app/now/behind-the-latest-design-refresh)
- [Animation and motion standards (ASU Enterprise Brand Guide)](https://brandguide.asu.edu/execution-guidelines/web/ux-design/animation)
- [Animation that fails safely: defensive design for motion-sensitive users (Adobe Design)](https://medium.com/@Adobe_Design/animation-that-fails-safely-defensive-design-for-motion-sensitive-users-de3c779f476d)
- [Enterprise Website Design best practices (Webstacks)](https://www.webstacks.com/blog/enterprise-website-design)
- [Strategies for introducing new tech to risk-averse buyers (BuyerDeck)](https://buyerdeck.com/strategies-introducing-new-technologies-risk-averse-buyers/)

---
*Feature research for: premium product-visual + motion system (M6, DebtNext/dPlat)*
*Researched: 2026-06-04*
