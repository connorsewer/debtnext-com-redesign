// src/components/motion/transitions.ts
// Motion type 6: transitions (Framer). Shared crossfade variants for
// AnimatePresence-driven swaps (tabs, panels, routed sections). Consumers pass
// these to a motion element keyed by the active item.
//
// Reduced-motion contract (fail open): callers should pass `reduced: true`
// (typically `useReducedMotion()` value) to get an instant swap with no
// transition, so a panel never lingers at opacity:0.
import { DUR_ITEM, EASE_ENTRANCE } from "./tokens";

export interface CrossfadeOptions {
  /** Vertical travel for the enter/exit, in px. */
  distance?: number;
  /** Instant swap (no animation) under reduced motion. */
  reduced?: boolean;
}

/**
 * Shared crossfade variants for AnimatePresence. Use with
 * `initial="enter"`-style mode="wait" presence or a keyed motion element:
 *
 *   const v = crossfade({ reduced });
 *   <AnimatePresence mode="wait">
 *     <motion.div key={active} variants={v} initial="initial"
 *       animate="animate" exit="exit" />
 *   </AnimatePresence>
 */
export function crossfade({ distance = 8, reduced = false }: CrossfadeOptions = {}) {
  if (reduced) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1, transition: { duration: 0 } },
      exit: { opacity: 1, transition: { duration: 0 } },
    };
  }
  return {
    initial: { opacity: 0, y: distance },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: DUR_ITEM, ease: EASE_ENTRANCE },
    },
    exit: {
      opacity: 0,
      y: -distance,
      transition: { duration: DUR_ITEM * 0.6, ease: EASE_ENTRANCE },
    },
  };
}
