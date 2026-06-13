# Phase 12: Solutions per-industry visuals - Context

**Gathered:** 2026-06-12 (auto mode — recommended defaults selected, per Connor's standing discretion mandate)
**Status:** Ready for planning

<domain>
## Phase Boundary

Kill the 7-instance duplicate `SolutionsIndustryCards` widget and give each of the 6 industry sub-pages (utilities, financial-services, telecom, fintech, insurance, healthcare) its own real-data visual library: a Console hero, a Schematic of how dPlat routes that industry's accounts, and a Data-story proof visual, plus real archetype visuals on every solutions FeatureAccordion item. No two solutions pages may show an identical visual. Requirements: SOLVIS-01..05.

NOT in scope: homepage handoff (Phase 13), text-only pages (Phase 14), new page sections, new CTAs, explorable interactivity requirements (platform-page contract, not a SOLVIS requirement).

</domain>

<decisions>
## Implementation Decisions

### Duplicate-widget replacement (SOLVIS-01)
- **D-01:** Delete `src/components/product/visuals/SolutionsIndustryCards.tsx` and its `LazySolutionsIndustryCards` wrapper entirely. AUDIT correction P12-01 applies: this is a live component on all 7 pages (6 industry `ProductVisualBand`s + the `/solutions` hub's BenefitSplit `visual` prop), so this is a migration, not a dead-code deletion — every consumer must be repointed in the same plan that deletes it.
- **D-02:** Each industry page's `ProductVisualBand` slot renders that industry's Console hero (satisfies SOLVIS-02 in the same move as SOLVIS-01).
- **D-03:** The `/solutions` hub gets ONE cross-industry overview visual (DataStory cards-branch fed a cross-industry payload), visually distinct from all 6 industry pages. The hub is not required to carry the full triad.

### Per-industry triad placement (SOLVIS-02/03/04)
- **D-04:** Console hero lives in the existing `ProductVisualBand` slot under the PageHero on each industry page. Static archetype rendering; Explorable shells are NOT required (Claude's discretion to add one only where it costs nothing).
- **D-05:** Schematic ("how dPlat routes <industry> accounts") attaches to the routing-themed FeatureAccordion item where one exists; where no accordion item is routing-themed, it gets its own band. Planner maps this per page in 12-ARCHETYPE-MAP.md.
- **D-06:** Data-story proof visual pairs with each page's proof content (accordion outcomes item or adjacent to the proof ProseSection). Same per-page mapping artifact decides placement.

### Accordion visuals (SOLVIS-05)
- **D-07:** 18 accordion placeholders (3 per industry, identified via `visualLabel` in `src/content/solutions-*.ts`) all get real archetype visuals via the proven `FeatureAccordion.visuals` mechanism from Phase 11.
- **D-08:** Produce `12-ARCHETYPE-MAP.md` (item → archetype + payload) BEFORE page work begins, mirroring Phase 11's approved 11-ARCHETYPE-MAP / D-03 gate pattern. Distinctness check is part of the map: no two industries may receive an identical visual composition.

### Payload realism and governance
- **D-09:** Per-industry payloads use real-shaped, anonymized, industry-realistic data: account types and dynamics that differ per vertical (utility arrears/deposit cycles; financial-services charge-off/card portfolios; telecom device + service receivables; fintech BNPL/personal loans; insurance premium/subrogation; healthcare self-pay/balance-after-insurance). Andrew Budish's complete sign-off (2026-06-12, recorded in AUDIT FIX-03 and project memory) clears real-shaped anonymized figures and vendor/TSI framing; `[CLAIMS REVIEW]`/`[COI REVIEW]` tags are RETAINED as audit-trail markers, non-blocking.
- **D-10:** Every number lives in typed payloads under `src/content/visuals/` (one module per industry, e.g. `solutions-utilities.ts`, plus a hub payload), validated against the existing schemas in `src/content/visuals/types.ts`. Zero baked constants in components. No named clients, no invented testimonials.

### Industry accent treatment (AUDIT P12-02)
- **D-11:** No new colors. Industries map to the EXISTING DESIGN.md chart-palette tokens (chart-1..chart-5 family + primary) for any per-industry accent; the invented hexes (#4AA8C9, #8472F0, #3D9DE0) die with the deleted component. This avoids a CLAUDE.md §16 new-color stop.
- **D-12:** Status colors are always label-paired (text or icon beside color) per the Pitfall 8 contract; data stories must survive grayscale and screen readers (ariaSummary on every archetype instance, role="img" pattern from Phase 11).

### Perf and regression posture
- **D-13:** LHCI keeps `/solutions/utilities` as the representative solutions route (already in lighthouserc.json). Do NOT add the other 5 industry routes to LHCI — the 6-URL collection already runs ~21 minutes; representative-route sampling is the documented tradeoff. Content-route TBT bar is 300ms (AUDIT BL-07); CLS < 0.1; LCP < 2.5s.
- **D-14:** A `solutions-visuals.spec.ts` Playwright spec mirrors `platform-visuals.spec.ts` (archetype presence per accordion item, default-visible values, reduced-motion data parity, no stuck opacity) across all 6 industry pages + the hub. axe + touch-target specs already cover all 23 routes (AUDIT FIX-02). Lazy skeletons must match resolved boxes (Pitfall 4); accordion visuals keep the shared 20rem `VisualSkeleton`.

### Claude's Discretion
- Exact archetype assignment per accordion item (within the D-08 map artifact).
- Whether any industry page gets a zero-cost Explorable flourish (not required).
- Payload module naming/structure within `src/content/visuals/` conventions.
- Wave structure for the 6 industry pages (e.g., utilities first as the proven pattern, then parallel).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system + governance
- `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md` — the M6 design source (archetype definitions, motion vocabulary, per-page intent)
- `DESIGN.md` §4.1 (color/chart/product-visual tokens), §4.7 (motion engine-per-job) — token-first rules; no new colors (D-11)
- `.planning/AUDIT-2026-06-12.md` — P12-01 (SolutionsIndustryCards is live, migration not deletion), P12-02 (industry accent hexes), BL-07 (TBT 300ms bar rationale)
- `CLAUDE.md` §5 (voice rules for captions), §6 (COI language), §16 (stop-list)

### Proven Phase 11 pattern (replicate, don't reinvent)
- `.planning/phases/11-platform-deep-dive-visuals/11-ARCHETYPE-MAP.md` — the mapping-artifact pattern D-08 mirrors
- `.planning/phases/11-platform-deep-dive-visuals/11-CONTEXT.md` — Phase 11 locked decisions (D-05 parity contract, lazy skeleton sizing)
- `tests/responsive/platform-visuals.spec.ts` — the spec shape D-14 mirrors (including the iterations === Infinity idle-guard fix)
- `src/content/visuals/types.ts` — ConsoleData / DataStoryData / SchematicData schemas all payloads must satisfy

### Research
- `.planning/research/` (SUMMARY, PITFALLS) — Pitfall 4 (CLS skeletons), Pitfall 8 (color-only status), the SOLVIS open question on payload realism (now RESOLVED by Andrew's 2026-06-12 sign-off)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Console` / `DataStory` / `Schematic` archetypes (`src/components/product/visuals/`) — render entirely from typed payloads; battle-tested on 4 platform pages in Phase 11
- `FeatureAccordion.visuals` mechanism — accordion item → lazy archetype visual wiring, proven in Phase 11
- `VisualSkeleton` (20rem, `archetypes.tsx`) — shared accordion-visual skeleton; per-archetype lazy wrappers in `src/components/product/visuals/lazy.tsx`
- `ProductVisualBand` section — the hero-band slot every industry page already renders (currently feeding the duplicate)
- Motion barrel (`src/components/motion/`) — Reveal/LiveValue primitives; never hand-roll Framer/GSAP

### Established Patterns
- Page anatomy is identical across all 6 industry pages: PageHero → ProductVisualBand → CardGrid(challenges) → FeatureAccordion(how-it-runs, 3 items) → ProseSection(proof) → BulletList(regulatory) → FinalCTA. The triad maps onto existing slots; no new section components needed.
- Payloads live in `src/content/visuals/*.ts` with `[CLAIMS REVIEW]`/`[COI REVIEW]` header tags (audit-trail, non-blocking per D-09)
- Per-commit docs-in-sync rule (HANDOFF.md etc. in the same commit)

### Integration Points
- 7 consumers of `LazySolutionsIndustryCards`: `src/app/solutions/page.tsx` (BenefitSplit `visual` prop) + 6 industry `page.tsx` files (ProductVisualBand child)
- `src/content/solutions-*.ts` — `items[].visualLabel` fields mark the 18 accordion placeholders
- `tests/helpers/routes.ts` VISUAL_ROUTES — already includes all solutions routes; axe/touch/reveal/reduced-motion specs run on them today

</code_context>

<specifics>
## Specific Ideas

- The distinctness requirement (SOLVIS-01 "no two pages show an identical visual") is the credibility fix this phase exists for — the duplicate widget is the clearest "templated" tell on the site. Treat distinctness as a verifiable gate in the archetype map, not a vibe.
- Industry realism is the differentiator: a utilities buyer should recognize their world (arrears, deposits, seasonal spikes), a healthcare buyer theirs (self-pay, balance-after-insurance). Real-shaped anonymized figures are pre-cleared.

</specifics>

<deferred>
## Deferred Ideas

- Explorable flagships on solutions pages — platform-page contract; revisit only if a page begs for it (zero-cost discretion per D-04).
- Adding all 6 industry routes to LHCI — revisit if representative sampling misses a regression; would need CI wall-clock budget work first.
- RSC re-architecture for hydration-bound TBT — already backlogged (AUDIT BL-07).

</deferred>

---

*Phase: 12-solutions-per-industry-visuals*
*Context gathered: 2026-06-12 (auto mode)*
