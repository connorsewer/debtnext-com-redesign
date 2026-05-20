"use client";

import { motion } from "framer-motion";

export const issuesMockupTitle = "Issues queue · all vendors";

const issues = [
  { type: "Dispute", account: "Account 1042-887", desc: "Balance contested by consumer", vendor: "Global Collect", sla: "Due 22h", slaTone: "warn", status: "Investigating" },
  { type: "Decedent", account: "Account 9821-204", desc: "Probate confirmation pending", vendor: "ABC Recovery", sla: "Due 3d", slaTone: "ok", status: "Auto-handled" },
  { type: "SCRA", account: "Account 7715-009", desc: "Active-duty verification", vendor: "Best Resolution", sla: "Overdue 1h", slaTone: "danger", status: "Escalated" },
  { type: "Balance", account: "Account 4198-661", desc: "Payment not matched", vendor: "Summit Recovery", sla: "Due 5d", slaTone: "ok", status: "Open" },
];

const slaClass = (tone: string) => {
  if (tone === "danger") return "text-[var(--destructive)] bg-[var(--destructive)]/10 border-[var(--destructive)]/30";
  if (tone === "warn") return "text-[var(--chart-4)] bg-[var(--chart-4)]/10 border-[var(--chart-4)]/30";
  return "text-[var(--chart-3)] bg-[var(--chart-3)]/10 border-[var(--chart-3)]/30";
};

/**
 * Issues queue with motion:
 * - Stat tiles count in via fade
 * - Issue cards stagger in from below
 * - "Overdue" stat has a slow always-running pulse (urgency cue)
 * - The overdue SLA pill has a ping ring for emphasis
 */
export function IssuesMockup() {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 border-b border-[var(--border)] pb-4">
        {[
          { label: "Open", value: "127", tone: "fg" },
          { label: "Due today", value: "12", tone: "warn" },
          { label: "Overdue", value: "3", tone: "danger" },
        ].map((tile, i) => (
          <motion.div
            key={tile.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {tile.label}
            </p>
            <p
              className={
                "mt-1 text-h3 font-[480] " +
                (tile.tone === "warn"
                  ? "text-[var(--chart-4)]"
                  : tile.tone === "danger"
                    ? "animate-pulse text-[var(--destructive)]"
                    : "text-[var(--foreground)]")
              }
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {tile.value}
            </p>
          </motion.div>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {issues.map((it, i) => (
          <motion.li
            key={it.account}
            className="flex items-start gap-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--card-alt)] p-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.25 + i * 0.07,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          >
            <span
              className={`relative mt-0.5 shrink-0 rounded-[var(--radius-xs)] border px-2 py-0.5 text-caption font-[480] ${slaClass(it.slaTone)}`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {it.sla}
              {it.slaTone === "danger" ? (
                <span className="absolute inset-0 -z-10 animate-ping rounded-[var(--radius-xs)] bg-[var(--destructive)]/20" />
              ) : null}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-strong font-[480] text-[var(--foreground)]">
                {it.type} · {it.desc}
              </p>
              <p className="mt-0.5 text-body-sm text-[var(--text-tertiary)]">
                {it.account} · {it.vendor}
              </p>
            </div>
            <span className="shrink-0 text-body-sm text-[var(--text-tertiary)]">
              {it.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
