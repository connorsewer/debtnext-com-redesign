import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

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
 */
export function ProcessStrip({
  eyebrow,
  heading,
  steps,
  surface = "dark",
}: ProcessStripProps) {
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

      <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-sm)] bg-[var(--border)] md:mt-14 md:grid-cols-3 lg:grid-cols-5">
        {steps.map((step, idx) => (
          <li
            key={step.title}
            className="group/step relative flex flex-col gap-3 bg-[var(--background)] p-6 md:p-8"
          >
            <span className="text-caption font-[480] uppercase tracking-wider text-[var(--primary)]">
              Step {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="text-h4 font-[480] text-[var(--foreground)]">
              {step.title}
            </h3>
            <p className="text-body-sm text-[var(--text-tertiary)]">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
