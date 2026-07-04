"use client";

import * as React from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface FAQItem {
  /** Stable id for aria wiring + analytics */
  id: string;
  question: string;
  /** Plain-text answer. Must match the faqPageSchema() text verbatim. */
  answer: string;
}

export interface FAQSectionProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items: FAQItem[];
  /** Analytics section identifier */
  section: string;
  /** Anchor target id */
  id?: string;
  surface?: "dark" | "elevated-dark";
}

/**
 * Accessible FAQ accordion. DESIGN.md §7.3 idiom (shared with FeatureAccordion):
 * - Each header is a real <button> with aria-expanded / aria-controls
 * - Multiple items may be open at once (standard FAQ behavior)
 * - grid-template-rows height transition, neutralized under reduced motion
 *
 * The visible question/answer text must match the paired faqPageSchema()
 * entries verbatim so the FAQPage JSON-LD stays truthful. Answers are authored
 * to be self-contained and extractable (40-90 words) for AI-search citation.
 */
export function FAQSection({
  eyebrow = "FAQ",
  heading = "Frequently asked questions",
  intro,
  items,
  section,
  id,
  surface = "dark",
}: FAQSectionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());
  const reduceMotion = useReducedMotion();

  function handleToggle(item: FAQItem) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
        track({ event: "accordion_toggle", section, item: item.question });
      }
      return next;
    });
  }

  return (
    <SectionContainer surface={surface} id={id}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        {heading ? (
          <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
            {heading}
          </h2>
        ) : null}
        {intro ? (
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
            {intro}
          </p>
        ) : null}
      </div>

      <ul className="mx-auto mt-10 flex max-w-3xl flex-col md:mt-12">
        {items.map((item) => {
          const isOpen = openIds.has(item.id);
          const panelId = `faq-${item.id}-panel`;
          const buttonId = `faq-${item.id}-button`;
          return (
            <li
              key={item.id}
              className="border-b border-[var(--border)] first:border-t"
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  onClick={() => handleToggle(item)}
                  className={cn(
                    "flex w-full min-h-touch items-center justify-between gap-6 py-5 text-left text-h4 font-[480] transition-colors duration-[var(--duration-instant)]",
                    isOpen
                      ? "text-[var(--foreground)]"
                      : "text-[var(--text-tertiary)] hover:text-white"
                  )}
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative inline-flex h-4 w-4 shrink-0 items-center justify-center"
                    )}
                  >
                    <span className="absolute h-[2px] w-4 rounded-full bg-current" />
                    <span
                      className={cn(
                        "absolute h-4 w-[2px] rounded-full bg-current transition-transform duration-[var(--duration-fast)] ease-[var(--ease-in-out)]",
                        isOpen ? "scale-y-0" : "scale-y-100"
                      )}
                    />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="grid"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition:
                    "grid-template-rows var(--duration-fast) var(--ease-in-out)",
                }}
              >
                <div className="overflow-hidden">
                  <motion.p
                    initial={false}
                    animate={
                      reduceMotion || !isOpen
                        ? { opacity: 1 }
                        : { opacity: [0, 1] }
                    }
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl pb-6 text-body-md text-[var(--text-tertiary)]"
                  >
                    {item.answer}
                  </motion.p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionContainer>
  );
}
