---
status: fixing
trigger: "CI failures PR #11: aria-prohibited-attr on /solutions/fintech + /solutions/healthcare schematic; role=img assertion fails"
created: 2026-06-12
updated: 2026-06-12
---

## Current Focus

hypothesis: FeatureAccordion motion.div wrapper carries aria-label without role="img"; visible during lazy VisualSkeleton state
test: add role="img" to wrapper, run tsc+eslint
expecting: clean
next_action: edit FeatureAccordion.tsx:150

## Symptoms

expected: schematic accessible element carries role="img" + aria-label in all states
actual: aria-prohibited-attr (div with aria-label, no role) during lazy load on fintech/healthcare
errors: "aria-label attribute cannot be used on a div with no valid role attribute"
reproduction: axe scan @ mobile-375 on /solutions/fintech, /solutions/healthcare
started: phase-12-solutions-visuals

## Evidence

- checked: FeatureAccordion.tsx:150-158
  found: motion.div has aria-label={item.visualLabel} but NO role; inline opacity/filter/transform from Framer match failing DOM exactly
  implication: during lazy Schematic load, child is aria-hidden VisualSkeleton, so this wrapper is the only labelled element -> prohibited attr

## Resolution

root_cause: FeatureAccordion's active-visual motion.div sets aria-label but no role; during the dynamic Schematic's VisualSkeleton state the wrapper is the sole accessible element, triggering aria-prohibited-attr. Slower fintech/healthcare chunk resolution lets axe scan that state.
fix: add role="img" to the motion.div wrapper so aria-label is always valid in both lazy and loaded states
files_changed: [src/components/sections/FeatureAccordion.tsx]
verification:
