"use client";

// Issues explorable flagship (PLATVIS-02 + PLATVIS-03, D-06/D-07).
//
// Refactors IssuesWorklist into an Explorable-composed Console-archetype instance
// fed the typed `issuesFlagshipConsole` payload. The console rows (the four active
// worklist issues), the SLA timer bars, and the three metric cells (SLA adherence,
// average resolution, auto-resolved, carried as pills) render by default via
// Console.Header / Console.Rows / Console.Pills slots (no boolean props). Below the
// console, one Explorable.Toggle per issue reveals that issue's type, assigned
// party, SLA window, and resolution status in an Explorable.Panel.
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
      className="flex flex-col gap-4"
    >
      <Console data={issuesFlagshipConsole}>
        <Console.Header />
        <Console.Rows />
        <Console.Pills />
      </Console>

      <div className="flex flex-col gap-3 rounded-[14px] bg-[var(--product-canvas)] p-4 ring-1 ring-[var(--border)]">
        <p className="text-[10.5px] font-[500] uppercase tracking-[0.1em] text-[var(--status-focus)]">
          Inspect an issue
        </p>
        <div className="flex flex-wrap gap-2">
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
        {issuesFlagshipItems.map((item) => (
          <Explorable.Panel
            key={item.id}
            id={item.id}
            className={cn(
              "rounded-[10px] p-3 transition-shadow",
              "data-[active]:ring-1 data-[active]:ring-[var(--primary)]",
            )}
          >
            <IssueDetail item={item} />
          </Explorable.Panel>
        ))}
        <StatPill label="Aging issues escalate on the rules you configure" tone="indigo" />
      </div>
    </Explorable>
  );
}
