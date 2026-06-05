// src/components/product/motion.tsx
// Re-export shim (Phase 10 FND-06). Source moved to src/components/motion/.
// Existing consumers import unchanged; import-path cleanup is a later mechanical
// codemod, NOT this phase.
//
// The 17 consumers of "@/components/product/motion" keep compiling because every
// name they use (EASE_*, DUR_*, STAGGER, TINT, TEXT_DEFAULT, staggerContainer,
// fadeUpItem, popItem, inViewProps, AnimatedNumber, NumberShift) is re-exported
// from the barrel below.
export * from "@/components/motion";
