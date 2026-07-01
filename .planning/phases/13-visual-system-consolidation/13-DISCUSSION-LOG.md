# Phase 13: Visual system consolidation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 13-visual-system-consolidation
**Mode:** `--auto` (all gray areas auto-selected; recommended option chosen for each)
**Areas discussed:** FramedDashboard location, Migration order + regression specs, FeatureAccordion bespoke visuals (P13-01), Tokens + dead assets (P13-02)

---

## FramedDashboard location / facade strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Keep FramedDashboard + facade in place, repoint internals | `HomepageHero` imports FramedDashboard by direct file path, so moving it breaks the firewall. Keep both paths stable. | ✓ |
| Move FramedDashboard to `product/visuals/` | Roadmap called this "cosmetic" — but it forces changes to the firewall files. | |

**Auto-selected:** Keep in place — forced by the direct import at `HomepageHero.tsx:9`. (recommended default)
**Notes:** This resolves the roadmap's open "FramedDashboard relocation is cosmetic; decide here" question in favor of no move.

---

## Migration order + regression-spec set

| Option | Description | Selected |
|--------|-------------|----------|
| Placement tab first, then the other 3 after the spec set proves green | Lowest regression risk; proves the pattern on one tab before fanning out. | ✓ |
| Migrate all 4 tabs at once | Faster but no proof checkpoint on the riskiest surface. | |

**Auto-selected:** Placement first, validate 5-item regression-spec set, then performance/issues/reporting. (recommended default)
**Notes:** Regression-spec set locked: pin anchored, bezel centered across seam, dashboard static during crossfade, reduced-motion green, platform-mobile green.

---

## FeatureAccordion bespoke visuals (P13-01, folded audit item)

| Option | Description | Selected |
|--------|-------------|----------|
| Conditional repoint: planner decides if Console/Flagship cleanly backs the FeatureAccordion; repoint+delete as a set only if yes, else defer | Honors "they're LIVE not dead" — never delete working components without a replacement. | ✓ |
| Force repoint + delete all 4 in this phase | Matches the literal audit text but doubles migration risk on the homepage in one phase. | |
| Skip P13-01 entirely | Violates /finish-build rule that folded items become scope and must be raised. | |

**Auto-selected:** Conditional repoint, raised explicitly for the planner. (recommended default)
**Notes:** If repointed, verify the `VISUALS.reporting` key migration explicitly. The bespoke visuals are consumed live by the homepage FeatureAccordion — deletion requires a working archetype/Flagship replacement first.

---

## Tokens + dead assets (P13-02, folded audit item)

| Option | Description | Selected |
|--------|-------------|----------|
| Replacement Console payloads use DESIGN.md chart tokens only; verify no off-token hex survives; confirm dead PNGs gone | Closes the off-token gradient flag and the dead-asset confirmation in one pass. | ✓ |

**Auto-selected:** chart-tokens-only + dead-PNG sweep. (only sensible option)
**Notes:** Off-token endpoints flagged at `PlacementMockup.tsx:10-12` (`#22c55e`, `#d97706`, `#0891b2`) must not survive the migration. Confirm the 6 dead `dashboard-dark.png` BenefitSplit fallbacks (closed Phase 10) are gone.

## Claude's Discretion

- Exact Console payload shape per tab, lazy-skeleton box matching (Pitfall 4), payload file location consistent with the Phase 11/12 typed-payload pattern.

## Deferred Ideas

- Full removal of `sections/mockups/` (blocked by the firewall imports).
- If D-09 resolves to "defer," the FeatureAccordion repoint + bespoke-visual deletion moves to a later cleanup.
