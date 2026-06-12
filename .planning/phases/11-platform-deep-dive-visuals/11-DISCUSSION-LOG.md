# Phase 11: Platform deep-dive visuals - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-05
**Phase:** 11-platform-deep-dive-visuals
**Areas discussed:** Archetype mapping, Explorable flagship, Reuse vs rebuild, Data realism

---

## Area selection

| Option | Selected |
|--------|----------|
| Archetype mapping | ✓ |
| Explorable flagship | ✓ |
| Reuse vs rebuild | ✓ |
| Data realism | ✓ |

**User's choice:** All four areas.

---

## Archetype mapping

### Q: How should we decide which archetype each accordion item gets?
| Option | Selected |
|--------|----------|
| Match content meaning | ✓ |
| One archetype per page | |
| Two archetypes per page | |

### Q: Must every accordion item show a distinct visual, or can some share/repeat?
| Option | Selected |
|--------|----------|
| Every item distinct | ✓ |
| Distinct per page, OK to echo across pages | |
| Allow a 'family' look per page | |

**Notes:** ~18 distinct payloads is a large authoring + [CLAIMS REVIEW] surface;
recorded that the planner must produce the full mapping table for Connor's
approval before payload authoring (D-03).

---

## Explorable flagship

### Q: Which visual should be THE explorable flagship per page?
| Option | Selected |
|--------|----------|
| The BenefitSplit visual | ✓ |
| A dedicated accordion item | |
| A new standalone flagship band | |

### Q: What interaction model for the flagships?
| Option | Selected |
|--------|----------|
| Toggle-state | |
| Hover-to-inspect | |
| Per-page choice | ✓ |

**Notes:** Recorded the hard constraint that any hover-based page must still
ship a tap + keyboard equivalent (D-05), and that the BenefitSplit visual now
carries both the PLATVIS-02 flagship and PLATVIS-03 archetype-instance contracts
(D-06).

---

## Reuse vs rebuild

### Q: How do we satisfy PLATVIS-03 given the bespoke visuals already look polished?
| Option | Selected |
|--------|----------|
| Refactor into archetype + payload | ✓ |
| Convert only what isn't already payload-fed | |
| Replace with plain archetype renders | |

### Q: If an archetype can't fully express a bespoke detail, what's the fallback?
| Option | Selected |
|--------|----------|
| Extend the payload schema | ✓ |
| Accept archetype limits, simplify the visual | |
| Keep that one visual bespoke, flag it | |

**Notes:** Schema extensions touch Phase 10 foundation types
(`src/content/visuals/types.ts`); must keep existing validation green + apply
docs-in-sync (D-08).

---

## Data realism

### Q: How realistic should the numbers in the platform payloads be?
| Option | Selected |
|--------|----------|
| Real-shaped, anonymized | ✓ |
| Round / illustrative numbers | |
| Generic placeholders, swap later | |

**User's free-text:** "real-shaped, anonymized — andrew has given sign off for
us to utilize figures that compellingly and realistically market our products
and services."

### Q: How should payloads handle vendor/TSI (COI) framing?
| Option | Selected |
|--------|----------|
| Flag inline, build around it | ✓ |
| Avoid vendor/TSI framing entirely in visuals | |
| Pre-clear copy with Andrew before building | |

**User's free-text:** "cleared by andrew to do whatever we need to do."

**Notes:** Recorded as D-10 — Andrew pre-cleared real-shaped anonymized figures
+ vendor/TSI framing for Phase 11; [CLAIMS REVIEW]/[COI REVIEW] tags kept for
audit but non-blocking. Boundary preserved: named clients/logos still need
written consent (CLAUDE.md §7).

---

## Claude's Discretion

- Lazy-skeleton dimensions per archetype (Pitfall 4 / CLS)
- Payload file organization under `src/content/visuals/`
- Node/edge layouts, chart variants, motion timing within the locked vocabulary
- Per-page toggle-vs-hover choice (within the D-05 parity constraint)

## Deferred Ideas

- Standalone "explore the engine" flagship band per page
- Interactive accordion-panel visuals (Pitfall 7 focus complexity)
- Solutions visuals / homepage handoff re-point / `sections/mockups` retirement
  (Phases 12 / 13)
