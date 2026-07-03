"use client";

// Placement explorable flagship (PLATVIS-02 + PLATVIS-03, D-06/D-07).
//
// UNIFIED VISUAL (fix/platform-flagship-unified): the console rows and the
// inspect region now live inside ONE ProductCanvas frame, so the section reads
// as a single dense product surface instead of a console PLUS a stacked second
// panel. Composition:
//   - <Console bare> renders its slots (Header / Callout / Rows / Pills) in a
//     plain div (no second ProductCanvas frame, no double role="img"). The bare
//     div keeps role="img" over its STATIC rows only.
//   - A thin divider, then an integrated inspect toolbar (pill row) and the
//     per-tier inspect panel, are siblings of that bare div, inside the same
//     frame. They are NOT inside the console's role="img" (a11y: role="img"
//     must not wrap interactive content).
//
// D-05 parity contract (Phase 10 locked, preserved through the unification):
//   - Every headline value (tier accounts, vendor allocation bars, closed-pool
//     metrics) is in the DOM by default via the Console slots, never hover-gated.
//   - Toggles are the real <button>s from Explorable.Toggle (keyboard Enter/Space
//     + focus-visible ring inherited from the shell); pointer and keyboard users
//     reach the same panels.
//   - Panel content (the per-vendor allocation) is rendered immediately for every
//     tier, not conditionally mounted. The active toggle only highlights one panel
//     via data-active; the values are present under reduced motion because nothing
//     is hidden behind motion (no opacity:0 / display:none on the values).

import * as React from "react";

import { Explorable } from "@/components/motion/Explorable";
import { StatPill } from "@/components/product/primitives";
import { Console } from "@/components/product/visuals/Console";
import {
  placementFlagshipConsole,
  placementFlagshipTiers,
} from "@/content/visuals";
import type { PlacementFlagshipTier } from "@/content/visuals";
import { cn } from "@/lib/utils";

/** One tier's per-vendor allocation. Values render in the DOM unconditionally
 *  (D-05); data-active (driven by Explorable) only adds a highlight ring. */
function TierAllocation({ tier }: { tier: PlacementFlagshipTier }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        {tier.label} · {tier.accounts.toLocaleString("en-US")} accounts · {tier.window}
      </p>
      <ul className="flex flex-col gap-1.5">
        {tier.vendors.map((vendor) => (
          <li key={vendor.name} className="flex items-center gap-3">
            <span className="w-[132px] shrink-0 text-[12px] font-[500] text-[var(--product-text-2)]">
              {vendor.name}
            </span>
            <span
              className="relative h-1.5 flex-1 rounded-full bg-white/10"
              role="img"
              aria-label={`${vendor.name}: ${vendor.share}% of ${tier.label}`}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--primary)]"
                style={{ width: `${vendor.share}%` }}
              />
            </span>
            <span className="w-9 shrink-0 text-right text-[12px] tabular-nums text-[var(--product-text)]">
              {vendor.share}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Placement decision-engine flagship, unified. One ProductCanvas frame hosts the
 * Console rows (rendered bare) plus an integrated inspect region (pill toolbar +
 * per-tier allocation panel). Composes Console + Explorable slots, never boolean
 * props.
 */
export function PlacementFlagship() {
  return (
    <Explorable
      label="Placement decision engine, inspect a treatment tier's vendor allocation"
      defaultActive={placementFlagshipTiers[0]?.id ?? null}
      className="rounded-[16px] bg-[var(--product-canvas)] p-[26px] text-[var(--product-text)]"
    >
      <Console data={placementFlagshipConsole} bare>
        <Console.Header />
        <Console.Callout />
        <Console.Rows />
        <Console.Pills />
      </Console>

      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <p className="text-[10.5px] font-[500] uppercase tracking-[0.1em] text-[var(--status-focus)]">
          Inspect a tier
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {placementFlagshipTiers.map((tier) => (
            <Explorable.Toggle
              key={tier.id}
              id={tier.id}
              className="group flex min-h-touch items-center"
            >
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-[500] ring-1 transition-colors",
                  "text-[var(--product-text-2)] ring-[var(--border)] group-hover:text-[var(--product-text)]",
                  "group-aria-expanded:bg-[var(--primary)] group-aria-expanded:text-white group-aria-expanded:ring-[var(--primary)]",
                )}
              >
                {tier.label}
              </span>
            </Explorable.Toggle>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {placementFlagshipTiers.map((tier) => (
            <Explorable.Panel
              key={tier.id}
              id={tier.id}
              className={cn(
                "rounded-[10px] p-3 transition-shadow",
                "data-[active]:bg-white/[0.02] data-[active]:ring-1 data-[active]:ring-[var(--primary)]",
              )}
            >
              <TierAllocation tier={tier} />
            </Explorable.Panel>
          ))}
          <StatPill label="Allocation adjusts as pool performance shifts" tone="indigo" />
        </div>
      </div>
    </Explorable>
  );
}
