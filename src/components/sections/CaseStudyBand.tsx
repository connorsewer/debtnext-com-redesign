import * as React from "react";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface CaseStudyMetric {
  number: string;
  label: string;
}

export interface CaseStudy {
  /** Small caption above the headline, e.g. "Case study · Utilities" */
  eyebrow: string;
  headline: string;
  summary: string;
  metrics: CaseStudyMetric[];
  problem: string;
  solution: string;
  results: string;
}

export interface CaseStudyBandProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  studies: CaseStudy[];
  /** Confidential / anonymized note rendered below the studies. */
  disclaimer?: string;
  surface?: SectionSurface;
  id?: string;
}

const BLOCKS: { key: "problem" | "solution" | "results"; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Solution" },
  { key: "results", label: "Results" },
];

/**
 * Stacked case-study band. Each study leads with a headline and summary,
 * shows a metric row, then a Problem / Solution / Results breakdown.
 * Used on /resources. Cards follow the flat dark-surface pattern from
 * CardGrid (DESIGN.md §8.4).
 */
export function CaseStudyBand({
  eyebrow,
  heading,
  body,
  studies,
  disclaimer,
  surface = "dark",
  id,
}: CaseStudyBandProps) {
  return (
    <SectionContainer surface={surface} id={id}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
        {body ? (
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">{body}</p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-4 md:mt-14">
        {studies.map((study) => (
          <article
            key={study.headline}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 md:p-9"
          >
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
              {study.eyebrow}
            </p>
            <h3 className="mt-3 max-w-3xl text-h3 font-[480] text-[var(--foreground)]">
              {study.headline}
            </h3>
            <p className="mt-4 max-w-2xl text-body-lg text-[var(--text-tertiary)]">
              {study.summary}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--border)] pt-8 md:grid-cols-4">
              {study.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-h3 font-[480] text-[var(--foreground)]">
                    {metric.number}
                  </dt>
                  <dd className="mt-1 text-body-sm text-[var(--text-tertiary)]">
                    {metric.label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 grid gap-6 border-t border-[var(--border)] pt-8 md:grid-cols-3">
              {BLOCKS.map((block) => (
                <div key={block.key}>
                  <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
                    {block.label}
                  </p>
                  <p className="mt-3 text-body-md text-[var(--text-tertiary)]">
                    {study[block.key]}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {disclaimer ? (
        <p className="mt-8 max-w-3xl text-body-sm text-[var(--text-tertiary)]">
          {disclaimer}
        </p>
      ) : null}
    </SectionContainer>
  );
}
