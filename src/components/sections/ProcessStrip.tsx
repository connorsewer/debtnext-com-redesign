"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { fadeUpItem, staggerContainer } from "@/components/product/motion";

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ProcessStripProps {
  eyebrow?: string;
  heading: string;
  steps: ProcessStep[];
  surface?: SectionSurface;
}

/**
 * 3-5 numbered steps with thin dividers and a subtle blue active state.
 * Pattern from DESIGN.md §7.6 process strip variant.
 *
 * Grid column counts are derived from `steps.length` so a 3- or 4-step strip
 * fills the row instead of leaving unfilled grid tracks that expose the
 * `<ol>`'s divider background as a phantom empty box (audit PLT-2/PLT-3).
 * Tailwind can't resolve dynamically interpolated class names, so the
 * complete class strings are looked up per step count rather than built
 * with a template literal.
 */
const GRID_COLUMNS_BY_STEP_COUNT: Record<number, string> = {
  3: "@md/section:grid-cols-3",
  4: "@md/section:grid-cols-2 @lg/section:grid-cols-4",
  5: "@md/section:grid-cols-3 @lg/section:grid-cols-5",
};

export function ProcessStrip({
  eyebrow,
  heading,
  steps,
  surface = "dark",
}: ProcessStripProps) {
  const reduce = useReducedMotion();
  const gridColumnsClassName =
    GRID_COLUMNS_BY_STEP_COUNT[steps.length] ??
    GRID_COLUMNS_BY_STEP_COUNT[5];
  return (
    <SectionContainer surface={surface}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
      </div>

      <motion.ol
        className={`mt-10 flex flex-col gap-0 md:mt-14 @md/section:grid @md/section:gap-px @md/section:overflow-hidden @md/section:rounded-[var(--radius-sm)] @md/section:bg-[var(--border)] ${gridColumnsClassName}`}
        variants={staggerContainer}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((step, idx) => (
          <motion.li
            key={step.title}
            variants={reduce ? undefined : fadeUpItem}
            className="group/step relative flex gap-4 pl-6 [&:not(:last-child)]:pb-8 [&:not(:last-child)]:border-l [&:not(:last-child)]:border-[var(--border)] @md/section:flex @md/section:flex-col @md/section:gap-3 @md/section:bg-[var(--background)] @md/section:p-6 @md/section:pl-6 @md/section:pb-6 @md/section:border-l-0 @lg/section:p-8 @lg/section:pl-8 @lg/section:pb-8"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 inline-flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--card)] text-caption font-[480] text-[var(--text-tertiary)] @md/section:hidden"
            >
              {idx + 1}
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
                Step {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4 font-[480] text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="text-body-sm text-[var(--text-tertiary)]">
                {step.body}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </SectionContainer>
  );
}
