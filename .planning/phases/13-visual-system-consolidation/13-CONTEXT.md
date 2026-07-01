# Phase 13: Visual system consolidation - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning
**Mode:** `--auto` (recommended defaults selected; each logged in DISCUSSION-LOG.md)

<domain>
## Phase Boundary

Merge the second homepage visual library (`src/components/sections/mockups/`) into the proven archetype library so the homepage **handoff** renders Console-archetype instances for all 4 platform tabs behind unchanged `MockupForTab` / `mockupTitleForTab` signatures, with the GSAP pin, the 400vh sticky progression, and the `FramedDashboard` bezel behaving identically to today. Retire the bespoke per-tab mockup files once parity holds, and confirm remaining dead PNG references are gone.

**In scope:** the homepage handoff (`sections/mockups/`), the folded audit items P13-01 and P13-02, dead-asset confirmation.
**NOT in scope:** new capabilities, new tabs, new copy, any change to the GSAP/pin/bezel *behavior* (only the rendered content of each tab changes), homepage hero structure.
</domain>

<decisions>
## Implementation Decisions

### Regression firewall (LOCKED by roadmap + confirmed in code)
- **D-01:** `HomepageHero.tsx` and `HomepageHandoffSection.tsx` must not change. Confirmed imports that pin the firewall:
  - `HomepageHero.tsx:9` imports `FramedDashboard` from the **direct file path** `@/components/sections/mockups/FramedDashboard`.
  - `HomepageHandoffSection.tsx:8-11` imports `FramedDashboard, MockupForTab, mockupTitleForTab` from the `@/components/sections/mockups` index facade.
- **D-02:** Because `HomepageHero` imports `FramedDashboard` by direct file path, **`FramedDashboard.tsx` cannot move**. The roadmap called its relocation "cosmetic"; the direct import makes any move a firewall violation. Decision: **keep `FramedDashboard.tsx` exactly where it is.** This overrides the roadmap's open relocation question.
- **D-03:** `sections/mockups/index.tsx` stays as the stable public facade, exporting `MockupForTab`, `mockupTitleForTab`, and `FramedDashboard` with byte-identical signatures.

### Front A — handoff consolidation (SYSVIS-01/02, core deliverable)
- **D-04:** Repoint `MockupForTab`'s internals so each of the 4 tabs (placement, performance, issues, reporting) renders a **Console-archetype instance** (`product/visuals/Console.tsx`, proven on a Platform page in Phase 11) instead of the bespoke `PlacementMockup` / `VendorPerformanceMockup` / `IssuesMockup` / `ReportingMockup`. Signatures unchanged; only rendered content changes.
- **D-05:** "Retire `sections/mockups/`" means: after parity, **delete the 4 bespoke per-tab mockup component files**; the dir slims to `index.tsx` (facade) + `FramedDashboard.tsx` (both pinned by the firewall). The directory does not fully disappear.
- **D-06:** **Migration order:** migrate the `placement` tab first as the proof case, validate the full regression-spec set against it, then migrate `performance`, `issues`, `reporting`. Do not migrate all four blind.
- **D-07:** **Regression-spec set that must stay green** (the acceptance gate for each tab): (1) GSAP pin anchored; (2) `FramedDashboard` bezel viewport-centered across the hero→Platform seam; (3) dashboard does not move during the crossfade; (4) reduced-motion Playwright spec green; (5) platform-mobile Playwright spec green. The planner names the exact spec files.

### Front B — FeatureAccordion bespoke visuals (P13-01, folded audit item — RAISE in planning)
- **D-08:** The four bespoke FeatureAccordion visuals (`PlacementMatrix`, `OptimizationEngine`, `IssuesWorklist`, `ReportingDashboard` in `product/visuals/`, registered in the `VISUALS` map in `product/visuals/index.tsx`) are **LIVE, not dead** — they are consumed by the homepage FeatureAccordion. They are deletable **only after** their registry entries are repointed to archetype/Flagship equivalents.
- **D-09 (recommended default, planner to confirm):** Scope Front A (handoff) as the non-negotiable core. For Front B, the planner evaluates whether the Console payloads built for the handoff (and the existing Phase 11 Flagship components) cleanly back the FeatureAccordion. **If yes:** repoint the `VISUALS` registry to archetype/Flagship equivalents, then delete the four `Lazy*` wrappers + components **as a set**, and **verify the `VISUALS.reporting` key migration explicitly** (per P13-01). **If no / higher risk than value:** keep the bespoke FeatureAccordion visuals (they are correct and LIVE) and defer P13-01 deletion to a later cleanup, noting it in HANDOFF.md. Do not delete LIVE components without a working replacement.

### Tokens + dead assets (P13-02, folded audit item)
- **D-10:** Any replacement Console payload that carries chart color must use **DESIGN.md chart tokens only**. The off-token gradient endpoints flagged in `PlacementMockup.tsx:10-12` (`#22c55e`, `#d97706`, `#0891b2`) must not survive into the replacement. Verify no off-token hex literals remain in the migrated handoff visuals.
- **D-11:** Confirm the 6 dead `dashboard-dark.png` BenefitSplit fallbacks (closed in Phase 10) are gone and grep the repo for any remaining dead PNG references; remove any found.

### Claims / COI
- **D-12:** Any metric in a Console payload or caption gets a `[CLAIMS REVIEW]` marker; any vendor/TSI framing gets `[COI REVIEW]`. Per the 2026-06 pre-clearance these markers are non-blocking for M6 visual payloads but stay for audit. Real-shaped anonymized figures only; no invented clients.

### Claude's Discretion
- Exact Console payload shape per tab, lazy-skeleton box matching (Pitfall 4), and whether the 4 handoff payloads live in `src/content/visuals/` or co-located — planner/researcher decide, consistent with the Phase 11/12 typed-payload pattern.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope + audit
- `.planning/ROADMAP.md` — Phase 13 section (goal, SYSVIS-01/02, success criteria, "high-risk migration" note, regression-spec recommendation)
- `.planning/AUDIT-2026-06-12.md` §"Phase 13" — P13-01 (dead-code-after-repoint, `VISUALS.reporting` verification) and P13-02 (off-token gradients in `PlacementMockup.tsx:10-12`)
- `.planning/REQUIREMENTS.md` — SYSVIS-01, SYSVIS-02 acceptance criteria

### Firewall surfaces (MUST NOT CHANGE)
- `src/components/sections/HomepageHero.tsx` — imports `FramedDashboard` by direct path (line 9)
- `src/components/sections/HomepageHandoffSection.tsx` — imports the mockups facade (lines 8-11); hosts the GSAP pin + 400vh progression + bezel render (lines 147-149, 209-215)

### Migration source + target
- `src/components/sections/mockups/index.tsx` — the `MockupForTab` / `mockupTitleForTab` facade to repoint; re-exports `FramedDashboard`
- `src/components/sections/mockups/FramedDashboard.tsx` — shared bezel (stays put per D-02)
- `src/components/sections/mockups/{PlacementMockup,VendorPerformanceMockup,IssuesMockup,ReportingMockup}.tsx` — bespoke files to delete after parity
- `src/components/product/visuals/Console.tsx` — the Console archetype (proven Phase 11) that replaces the bespoke mockups
- `src/components/product/visuals/index.tsx` — the `VISUALS` registry / `AccordionVisual` for Front B (P13-01)
- `src/components/product/visuals/{PlacementFlagship,OptimizationFlagship,IssuesFlagship,ReportingFlagship}.tsx` — Phase 11 flagships, candidate backers for Front B

### Design system + prior proof
- `DESIGN.md` — chart color tokens (D-10), motion rules, reduced-motion contract
- `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md` — M6 motion/visual system design source
- `.planning/phases/11-platform-deep-dive-visuals/` — Phase 11 artifacts proving Console on a Platform page (the de-risking precondition for this re-point)
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Console` archetype (`product/visuals/Console.tsx`) — proven on a Platform page in Phase 11; the direct replacement for the 4 bespoke handoff mockups.
- Phase 11 Flagships (`PlacementFlagship`, `OptimizationFlagship`, `IssuesFlagship`, `ReportingFlagship`) — candidate backers for the FeatureAccordion repoint (Front B).
- `FramedDashboard.tsx` — shared bezel; reused unchanged, supplied once by the parent.
- Typed-payload pattern from Phases 11/12 (`src/content/visuals/*.ts`) — the established way to feed real-shaped numbers into archetypes.

### Established Patterns
- Two distinct homepage visual systems: the **handoff** (`sections/mockups/`, GSAP-pinned 4-tab crossfade) and the **FeatureAccordion** (`product/visuals/` `VISUALS` registry, 5 items). Phase 13 core targets the handoff; P13-01 targets the FeatureAccordion.
- `next/dynamic` with inline `{ ssr: false, loading }` literals (Turbopack requirement) — lazy skeletons must match the resolved box (Pitfall 4).
- Facade indirection (`index.tsx` exporting `*ForTab` switch functions) is what makes the firewall holdable: internals can change behind a stable export surface.

### Integration Points
- `MockupForTab({ id })` switch in `sections/mockups/index.tsx` — the single repoint site for Front A.
- `VISUALS` map + `AccordionVisual({ id })` in `product/visuals/index.tsx` — the repoint site for Front B (P13-01).
</code_context>

<specifics>
## Specific Ideas

The single most important ordering decision in M6 (per ROADMAP) is that this consolidation comes *after* Console is proven on a Platform page (Phase 11), because the homepage handoff is the riskiest surface and must not be the first place Console is tried. Phase 11 is complete, so the precondition is satisfied. Treat the placement-tab-first migration order (D-06) plus the 5-item regression-spec gate (D-07) as the mechanism that keeps this from regressing the homepage.
</specifics>

<deferred>
## Deferred Ideas

- Full removal of the `sections/mockups/` directory (impossible while the firewall imports `FramedDashboard` and the facade by those paths) — a future refactor could move `FramedDashboard` and update the two firewall files together, but that is explicitly out of scope here.
- If D-09 resolves to "defer," the P13-01 FeatureAccordion repoint + bespoke-visual deletion becomes a later cleanup phase item.

### Reviewed Todos (not folded)
None — `todo match-phase 13` returned 0 matches.
</deferred>

---

*Phase: 13-visual-system-consolidation*
*Context gathered: 2026-06-12*
