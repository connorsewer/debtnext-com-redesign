"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { fadeUpItem, staggerContainer, useHydrated } from "@/components/product/motion";

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

/*
 * Numeric column counts matching GRID_COLUMNS_BY_STEP_COUNT, used to place
 * hairline dividers on the `<li>` elements themselves. Painting dividers via
 * the ol's `--border` background + gap-px leaks into any unfilled grid track
 * (e.g. the 3+2 wrap of a 5-step strip in the @md window), so each li draws
 * its own border-l/border-t instead; a track with no li paints nothing.
 */
const MD_COLS_BY_STEP_COUNT: Record<number, number> = { 3: 3, 4: 2, 5: 3 };
const LG_COLS_BY_STEP_COUNT: Record<number, number> = { 3: 3, 4: 4, 5: 5 };

/* Complete class strings only: Tailwind cannot resolve interpolated names. */
function dividerClasses(idx: number, mdCols: number, lgCols: number): string {
  const mdLeft = idx % mdCols > 0;
  const mdTop = idx >= mdCols;
  const lgLeft = idx % lgCols > 0;
  const lgTop = idx >= lgCols;
  const classes = [
    mdLeft ? "@md/section:border-l" : "",
    mdTop ? "@md/section:border-t" : "",
  ];
  if (lgCols !== mdCols) {
    if (lgLeft !== mdLeft) {
      classes.push(lgLeft ? "@lg/section:border-l" : "@lg/section:border-l-0");
    }
    if (lgTop !== mdTop) {
      classes.push(lgTop ? "@lg/section:border-t" : "@lg/section:border-t-0");
    }
  }
  return classes.filter(Boolean).join(" ");
}

export function ProcessStrip({
  eyebrow,
  heading,
  steps,
  surface = "dark",
}: ProcessStripProps) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  // Fail open: arm the hidden initial state only after hydration (and never
  // under reduced motion) so the SSR markup renders visible.
  const armed = !reduce && hydrated;
  const gridColumnsClassName =
    GRID_COLUMNS_BY_STEP_COUNT[steps.length] ??
    GRID_COLUMNS_BY_STEP_COUNT[5];
  const mdCols = MD_COLS_BY_STEP_COUNT[steps.length] ?? 3;
  const lgCols = LG_COLS_BY_STEP_COUNT[steps.length] ?? 5;
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
        className={`mt-10 flex flex-col gap-0 md:mt-14 @md/section:grid @md/section:overflow-hidden @md/section:rounded-[var(--radius-sm)] ${gridColumnsClassName}`}
        variants={staggerContainer}
        initial={armed ? "hidden" : false}
        whileInView={armed ? "show" : undefined}
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((step, idx) => (
          <motion.li
            key={step.title}
            variants={reduce ? undefined : fadeUpItem}
            className={`group/step relative flex gap-4 pl-6 [&:not(:last-child)]:pb-8 @max-md/section:[&:not(:last-child)]:border-l @md/section:flex @md/section:flex-col @md/section:gap-3 @md/section:bg-[var(--background)] @md/section:p-6 @md/section:pl-6 @md/section:pb-6 border-[var(--border)] @lg/section:p-8 @lg/section:pl-8 @lg/section:pb-8 ${dividerClasses(idx, mdCols, lgCols)}`}
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
