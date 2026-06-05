// src/components/motion/tokens.ts
// Timing + easing tokens for the motion vocabulary (Phase 10 FND-01/FND-06).
// Moved verbatim from src/components/product/motion.tsx. Pure constants, no
// "use client" needed; safe to import from server or client modules.
// (docs/product-visuals-system.md motion vocab)

export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const; // calm ease-out
export const EASE_STATE = [0.2, 0.7, 0.2, 1] as const; // state / number shift
export const STAGGER = 0.06;
export const DUR_ITEM = 0.5;
export const DUR_BAR = 0.8;
export const DUR_COUNT = 1.0;
export const TINT = "#9CB4E8"; // --status-focus, number-shift tint
export const TEXT_DEFAULT = "#EDEDF3"; // --product-text
