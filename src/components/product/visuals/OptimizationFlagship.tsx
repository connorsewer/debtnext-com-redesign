"use client";

// Optimization explorable flagship (PLATVIS-02 + PLATVIS-03, D-06/D-07).
//
// UNIFIED VISUAL (fix/platform-flagship-unified): the console rows and the
// inspect region now live inside ONE ProductCanvas frame (see PlacementFlagship
// for the full rationale). <Console bare> renders its slots in a plain div; the
// pill toolbar and per-vendor panel are siblings inside the same frame, outside
// the console's role="img".
//
// D-05 parity contract (Phase 10 locked, mirrored from PlacementFlagship):
//   - Every headline value (vendor liquidation, next-cycle share bars, the bonus
//     callout) is in the DOM by default via the Console slots, never hover-gated.
//   - Toggles are the real <button>s from Explorable.Toggle (keyboard Enter/Space
//     + focus-visible ring inherited from the shell); pointer and keyboard users
//     reach the same panels.
//   - Panel content (each vendor's band, accounts, share shift, trigger) is
//     rendered immediately for every vendor, not conditionally mounted. The active
//     toggle only highlights one panel via data-active; the values are present
//     under reduced motion because nothing is hidden behind motion (no opacity:0 /
//     display:none on the values).

import * as React from "react";

import { Explorable } from "@/components/motion/Explorable";
import { StatPill } from "@/components/product/primitives";
import { Console } from "@/components/product/visuals/Console";
import {
  optimizationFlagshipConsole,
  optimizationFlagshipVendors,
} from "@/content/visuals";
import type { OptimizationFlagshipVendor } from "@/content/visuals";
import { cn } from "@/lib/utils";

/** One vendor's band detail and this-cycle to next-cycle share shift. Values
 *  render in the DOM unconditionally (D-05); data-active (driven by Explorable)
 *  only adds a highlight ring. */
function VendorDetail({ vendor }: { vendor: OptimizationFlagshipVendor }) {
  const moved = vendor.toShare !== vendor.fromShare;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        {vendor.label} · {vendor.band} band · {vendor.accounts.toLocaleString("en-US")} accounts
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
        <span className="text-[var(--product-text-2)]">
          Liquidation{" "}
          <span className="font-[500] tabular-nums text-[var(--product-text)]">
            {vendor.liquidation}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[var(--product-text-2)]">
          Share
          <span className="font-[500] tabular-nums text-[var(--product-text)]">
            {vendor.fromShare}%
          </span>
          <span aria-hidden="true" className="text-[var(--product-text-3)]">
            to
          </span>
          <span
            className={cn(
              "font-[500] tabular-nums",
              // --product-primary-text, not --primary: raw primary is only
              // 3.6:1 on product surfaces — below AA for this 12px number.
              moved
                ? "text-[var(--product-primary-text)]"
                : "text-[var(--product-text)]",
            )}
          >
            {vendor.toShare}%
          </span>
        </span>
      </div>
      <p className="text-[11px] text-[var(--product-text-3)]">{vendor.trigger}</p>
    </div>
  );
}

/**
 * Optimization engine flagship. The Console renders the three evaluated vendors,
 * the bonus callout, and the reallocation metrics by default; the Explorable
 * toggles let a user inspect each vendor's band detail and share shift. Composes
 * Console + Explorable slots, never boolean props.
 */
export function OptimizationFlagship() {
  return (
    <Explorable
      label="Optimization engine, inspect a vendor's band detail and share shift"
      defaultActive={optimizationFlagshipVendors[0]?.id ?? null}
      className="rounded-[16px] bg-[var(--product-canvas)] p-[26px] text-[var(--product-text)]"
    >
      <Console data={optimizationFlagshipConsole} bare>
        <Console.Header />
        <Console.Callout />
        <Console.Rows />
        <Console.Pills />
      </Console>

      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <p className="text-[10.5px] font-[500] uppercase tracking-[0.1em] text-[var(--status-focus)]">
          Inspect a vendor
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {optimizationFlagshipVendors.map((vendor) => (
            <Explorable.Toggle
              key={vendor.id}
              id={vendor.id}
              className="group flex min-h-touch items-center"
            >
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-[500] ring-1 transition-colors",
                  "text-[var(--product-text-2)] ring-[var(--border)] group-hover:text-[var(--product-text)]",
                  "group-aria-expanded:bg-[var(--primary)] group-aria-expanded:text-white group-aria-expanded:ring-[var(--primary)]",
                )}
              >
                {vendor.label}
              </span>
            </Explorable.Toggle>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {optimizationFlagshipVendors.map((vendor) => (
            <Explorable.Panel
              key={vendor.id}
              id={vendor.id}
              className={cn(
                "rounded-[10px] p-3 transition-shadow",
                "data-[active]:bg-white/[0.02] data-[active]:ring-1 data-[active]:ring-[var(--primary)]",
              )}
            >
              <VendorDetail vendor={vendor} />
            </Explorable.Panel>
          ))}
          <StatPill label="Share moves on the next cycle inside your caps and floors" tone="indigo" />
        </div>
      </div>
    </Explorable>
  );
}
