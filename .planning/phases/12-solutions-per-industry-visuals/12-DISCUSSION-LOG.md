# Phase 12: Solutions per-industry visuals - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 12-solutions-per-industry-visuals
**Mode:** `--auto` (recommended defaults selected without interactive questioning, per Connor's 2026-06-12 standing discretion mandate)
**Areas discussed:** Duplicate-widget replacement, Triad placement, Payload realism, Industry accents, Accordion mapping, Perf/test posture

---

## Duplicate-widget replacement

| Option | Description | Selected |
|--------|-------------|----------|
| Delete + repoint all 7 consumers to per-industry Console heroes; hub gets one cross-industry overview | Satisfies SOLVIS-01+02 in one move; honors AUDIT P12-01 (live component, migration not deletion) | ✓ |
| Parameterize the existing component per industry | Keeps the layout shell but fails distinctness intent (same widget shape on every page) | |
| Delete outright without hub replacement | Leaves the hub's BenefitSplit visual slot empty | |

## Triad placement

| Option | Description | Selected |
|--------|-------------|----------|
| Map triad onto existing slots (Console → ProductVisualBand; Schematic → routing accordion item or own band; DataStory → proof slot) | Zero new section components; planner finalizes per-page in 12-ARCHETYPE-MAP.md | ✓ |
| Add three new dedicated bands per page | More layout work, lengthens pages, risks CTA competition | |
| Explorable flagships like Phase 11 | Not a SOLVIS requirement; 6-page interactivity scope + perf risk | |

## Payload realism

| Option | Description | Selected |
|--------|-------------|----------|
| Industry-realistic real-shaped anonymized data per vertical | Pre-cleared by Andrew's 2026-06-12 complete sign-off; tags retained as audit markers | ✓ |
| Fully generic numbers on all 6 pages | Resolves the old open question conservatively but kills the per-industry-realism differentiator; superseded by the sign-off | |

## Industry accents

| Option | Description | Selected |
|--------|-------------|----------|
| Map industries to existing chart-palette tokens; no new colors | Stays inside DESIGN.md; avoids CLAUDE.md §16 new-color stop; invented hexes die with the old component (AUDIT P12-02) | ✓ |
| Define a new 6-token industry-accent ramp in DESIGN.md | Requires a §16 Connor decision; more spec surface for marginal gain | |

## Accordion mapping

| Option | Description | Selected |
|--------|-------------|----------|
| 12-ARCHETYPE-MAP.md artifact first, mirroring Phase 11's approved D-03 gate; distinctness checked in the map | Proven pattern; makes "no two pages alike" verifiable | ✓ |
| Map ad hoc per page during execution | Faster start, but distinctness and coverage become vibes | |

## Perf/test posture

| Option | Description | Selected |
|--------|-------------|----------|
| Representative LHCI route (/solutions/utilities, already collected) + solutions-visuals Playwright spec across all 6 pages | CI already ~21 min at 6 URLs; Playwright carries breadth, LHCI carries depth | ✓ |
| Add all 6 industry routes to LHCI | ~11 URLs × 5 runs blows the CI wall-clock budget | |

## Claude's Discretion

- Exact archetype per accordion item (inside the map artifact)
- Zero-cost Explorable flourish (only if free)
- Payload module structure/naming
- Execution wave structure (utilities-first proven-pattern recommended)

## Deferred Ideas

- Explorables on solutions pages (revisit on demand)
- Full 6-route LHCI coverage (needs CI budget work)
- RSC re-architecture for TBT (backlogged, AUDIT BL-07)
