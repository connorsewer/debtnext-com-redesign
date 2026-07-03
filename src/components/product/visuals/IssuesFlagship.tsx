"use client";

// Issues explorable flagship (PLATVIS-02 + PLATVIS-03, D-06/D-07).
//
// UNIFIED VISUAL (fix/platform-flagship-unified): the console rows and the
// inspect region now live inside ONE ProductCanvas frame (see PlacementFlagship
// for the full rationale). <Console bare> renders its slots in a plain div; the
// pill toolbar and per-issue panel are siblings inside the same frame, outside
// the console's role="img".
//
// D-05 parity contract (Phase 10 locked, mirrored from OptimizationFlagship):
//   - Every worklist value (issue label, SLA bar, time-left, the three metric
//     pills) is in the DOM by default via the Console slots, never hover-gated.
//   - STATUS IS LABEL-PAIRED (Pitfall 8): each status renders as a text label
//     ("On time", "Warning", "Resolved", "Escalated") next to its dot, so status
//     never reads from color alone and survives reduced motion.
//   - Toggles are the real <button>s from Explorable.Toggle (keyboard Enter/Space
//     + focus-visible ring inherited from the shell); pointer and keyboard users
//     reach the same panels.
//   - Panel content (each issue's detail) is rendered immediately for every issue,
//     not conditionally mounted. The active toggle only highlights one panel via
//     data-active; the values are present under reduced motion because nothing is
//     hidden behind motion (no opacity:0 / display:none on the values).

import * as React from "react";

import { Explorable } from "@/components/motion/Explorable";
import { StatPill } from "@/components/product/primitives";
import { Console } from "@/components/product/visuals/Console";
import { issuesFlagshipConsole, issuesFlagshipItems } from "@/content/visuals";
import type { IssuesFlagshipItem } from "@/content/visuals";
import { cn } from "@/lib/utils";

/** Status-tone token map (reused from the IssuesWorklist tokens; DESIGN.md
 *  status palette). The dot is decorative; the adjacent text label carries the
 *  status (Pitfall 8). */
const STATUS_DOT: Record<IssuesFlagshipItem["statusTone"], string> = {
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  breach: "var(--status-breach)",
};

/** One issue's detail: type, assigned party, SLA window, and a label-paired
 *  status. Values render in the DOM unconditionally (D-05); data-active (driven
 *  by Explorable) only adds a highlight ring. */
function IssueDetail({ item }: { item: IssuesFlagshipItem }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        {item.label} · {item.type}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
        <span className="flex items-center gap-1.5 text-[var(--product-text-2)]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: STATUS_DOT[item.statusTone] }}
          />
          <span
            className="font-[500]"
            style={{ color: STATUS_DOT[item.statusTone] }}
          >
            {item.statusLabel}
          </span>
        </span>
        <span className="text-[var(--product-text-2)]">
          SLA{" "}
          <span className="font-[500] tabular-nums text-[var(--product-text)]">
            {item.slaWindow}
          </span>
        </span>
        <span className="text-[var(--product-text-2)]">
          Time left{" "}
          <span className="font-[500] tabular-nums text-[var(--product-text)]">
            {item.timeLeft}
          </span>
        </span>
      </div>
      <p className="text-[11px] text-[var(--product-text-3)]">{item.detail}</p>
      <p className="text-[11px] text-[var(--product-text-3)]">{item.assignedTo}</p>
    </div>
  );
}

/**
 * Issues worklist flagship. The Console renders the four active issues, their SLA
 * timer bars, and the SLA adherence / average resolution / auto-resolved metrics
 * by default; the Explorable toggles let a user inspect each issue's detail and
 * label-paired status. Composes Console + Explorable slots, never boolean props.
 */
export function IssuesFlagship() {
  return (
    <Explorable
      label="Issues worklist, inspect an issue's SLA detail and resolution status"
      defaultActive={issuesFlagshipItems[0]?.id ?? null}
      className="rounded-[16px] bg-[var(--product-canvas)] p-[26px] text-[var(--product-text)]"
    >
      <Console data={issuesFlagshipConsole} bare>
        <Console.Header />
        <Console.Rows />
        <Console.Pills />
      </Console>

      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <p className="text-[10.5px] font-[500] uppercase tracking-[0.1em] text-[var(--status-focus)]">
          Inspect an issue
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {issuesFlagshipItems.map((item) => (
            <Explorable.Toggle
              key={item.id}
              id={item.id}
              className="group flex min-h-touch items-center"
            >
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-[500] ring-1 transition-colors",
                  "text-[var(--product-text-2)] ring-[var(--border)] group-hover:text-[var(--product-text)]",
                  "group-aria-expanded:bg-[var(--primary)] group-aria-expanded:text-white group-aria-expanded:ring-[var(--primary)]",
                )}
              >
                {item.label}
              </span>
            </Explorable.Toggle>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {issuesFlagshipItems.map((item) => (
            <Explorable.Panel
              key={item.id}
              id={item.id}
              className={cn(
                "rounded-[10px] p-3 transition-shadow",
                "data-[active]:bg-white/[0.02] data-[active]:ring-1 data-[active]:ring-[var(--primary)]",
              )}
            >
              <IssueDetail item={item} />
            </Explorable.Panel>
          ))}
          <StatPill label="Aging issues escalate on the rules you configure" tone="indigo" />
        </div>
      </div>
    </Explorable>
  );
}
