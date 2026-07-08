"use client";

import * as React from "react";

import { AccordionVisual, isAccordionVisualId } from "@/components/product/visuals";
import { SectionContainer } from "@/components/sections/SectionContainer";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface FeatureAccordionItem {
  id: string;
  title: string;
  body: string;
  /** Accessible name + caption for the static text-placeholder fallback (pages
   *  that reuse FeatureAccordion without a live visual). Live visuals carry
   *  their own accessible name, so this is not used when one is present. */
  visualLabel: string;
}

export interface FeatureAccordionProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: FeatureAccordionItem[];
  /** Analytics section identifier */
  section: string;
  /** Anchor target id (used by hero "See how it works" link) */
  id?: string;
  /** Optional live product visuals keyed by item id. Takes precedence over the
   *  homepage AccordionVisual registry and the text placeholder, so any page
   *  can pair a specific accordion item with a live visual. */
  visuals?: Record<string, React.ReactNode>;
}

/**
 * Accordion with paired product visual. DESIGN.md §7.3 + §8.5:
 * - Header is a real <button> with aria-expanded / aria-controls
 * - One open at a time
 * - Smooth height transition with grid-template-rows trick (works under
 *   reduced motion because the global @media block neutralizes it)
 * - Visual cross-fades to the active item
 *
 * The paired visual resolves in priority order: an explicit `visuals[id]` node,
 * then the homepage AccordionVisual flagship registry, then a static text
 * placeholder. Live visuals carry their own accessible name (Console role="img",
 * Explorable role="group"); only the placeholder takes role="img"/visualLabel.
 */
export function FeatureAccordion({
  eyebrow,
  heading,
  intro,
  items,
  section,
  id,
  visuals,
}: FeatureAccordionProps) {
  const [activeId, setActiveId] = React.useState(items[0]?.id);

  function handleToggle(itemId: string, item: FeatureAccordionItem) {
    if (itemId === activeId) return; // keep the active item open
    setActiveId(itemId);
    track({ event: "accordion_toggle", section, item: item.title });
  }

  return (
    <SectionContainer surface="dark" id={id}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
        {intro ? (
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
            {intro}
          </p>
        ) : null}
      </div>

      <div className="mt-10 grid gap-10 md:mt-14 @lg/section:grid-cols-[1fr_1.1fr] @lg/section:gap-16">
        <ul className="order-1 flex flex-col @lg/section:order-none">
          {items.map((item) => {
            const isOpen = activeId === item.id;
            const panelId = `feat-${item.id}-panel`;
            const buttonId = `feat-${item.id}-button`;
            return (
              <li
                key={item.id}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => handleToggle(item.id, item)}
                    className={cn(
                      "flex w-full min-h-touch items-center justify-between gap-6 py-5 text-left text-h4 font-[480] transition-colors duration-[var(--duration-instant)]",
                      isOpen
                        ? "text-[var(--foreground)]"
                        : "text-[var(--text-tertiary)] hover:text-white"
                    )}
                  >
                    <span>{item.title}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-block h-2 w-2 rounded-full transition-colors duration-[var(--duration-instant)]",
                        isOpen ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                      )}
                    />
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
                    transition: "grid-template-rows var(--duration-fast) var(--ease-in-out)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-body-md text-[var(--text-tertiary)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="relative order-2 min-h-[22rem] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--product-canvas)] shadow-[var(--shadow-nav)] ring-1 ring-[var(--border)] @lg/section:order-none @lg/section:min-h-[24rem]">
          {(() => {
            // Render ONLY the active item, in normal flow, so the panel grows
            // to the active visual's height (the dense Issues/Reporting visuals
            // would clip against a fixed height). Product visual for the 5
            // homepage capability ids; every other page that reuses
            // FeatureAccordion keeps the original placeholder.
            const item = items.find((i) => i.id === activeId) ?? items[0];
            if (!item) return null;
            // Live visuals (page-supplied `visuals` or the homepage flagship
            // registry) carry their own semantics (Console role="img",
            // Explorable role="group") and some are interactive. Wrapping them
            // in role="img" both masks that structure and trips axe
            // nested-interactive (role="img" must not have focusable
            // descendants), so the labelled image wrapper is reserved for the
            // static text placeholder.
            const liveVisual =
              visuals?.[item.id] ??
              (isAccordionVisualId(item.id) ? (
                <AccordionVisual id={item.id} />
              ) : null);
            return (
              // The key remounts the panel per active item, which re-runs the
              // CSS .dn-visual-enter entrance (globals.css; inert under
              // prefers-reduced-motion). Replaces the framer cross-fade so
              // this component no longer imports framer-motion.
              <div
                key={item.id}
                {...(liveVisual
                  ? {}
                  : { role: "img", "aria-label": item.visualLabel })}
                className="dn-visual-enter"
              >
                {liveVisual ?? (
                  <div className="flex min-h-[22rem] w-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <span className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
                      Visual
                    </span>
                    <p className="text-h3 font-[480] text-[var(--foreground)]">
                      {item.visualLabel}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </SectionContainer>
  );
}
