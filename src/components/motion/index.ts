// src/components/motion/index.ts
// The single motion barrel: the full 7-type motion vocabulary every Phase 11-15
// visual imports from (Phase 10 FND-01/FND-06). Engine-per-job rule lives in
// DESIGN.md §4.7.
//
// IMPORTANT: this barrel NEVER imports GSAP. GSAP stays the single dynamic-import
// owner in src/components/sections/HeroCinematicController.tsx (scroll-scrub /
// pin cinematics only), so `/` keeps its lean eager chunk. Do not add a gsap
// re-export here.
//
// The 7 types:
//   1 scroll reveal (Framer)     → Reveal.tsx (RevealStagger / RevealItem + variants)
//   2 live data (Framer)         → LiveValue.tsx (LiveValue / AnimatedNumber / NumberShift), PulseDot.tsx
//   3 hover/cursor (CSS + rAF)   → Hoverable.tsx (wraps hover.module.css) + CursorGlow.tsx
//   4 ambient drift (CSS)        → AmbientField (re-exported from ../ambient)
//   5 micro-interactions (CSS)   → hover.module.css + the 7-state contract (DESIGN.md §4.7)
//   6 transitions (Framer)       → transitions.ts (crossfade)
//   7 explorable (Framer+state)  → Explorable.tsx (compound shell; first flagship Phase 11)

// 1 + tokens
export * from "./tokens";
export * from "./Reveal";

// 2 live data
export * from "./LiveValue";
export { PulseDot } from "./PulseDot";

// 3 hover / cursor
export { Hoverable } from "./Hoverable";
export { CursorGlow } from "./CursorGlow";

// 4 ambient drift
export { AmbientField } from "../ambient/AmbientField";

// 6 transitions
export * from "./transitions";

// 7 explorable
export { Explorable } from "./Explorable";
