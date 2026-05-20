import { FramedDashboard } from "./FramedDashboard";

/**
 * Issues and disputes mockup. Worklist showing active issues with SLA
 * timers, severity, and assignment. Conveys: structured workflow, SLA
 * enforcement, audit-ready evidence.
 */
export function IssuesMockup() {
  const issues = [
    {
      type: "Dispute",
      account: "Account 1042-887",
      desc: "Balance contested by consumer",
      vendor: "Global Collect",
      sla: "Due 22h",
      slaTone: "warn",
      status: "Investigating",
    },
    {
      type: "Decedent",
      account: "Account 9821-204",
      desc: "Probate confirmation pending",
      vendor: "ABC Recovery",
      sla: "Due 3d",
      slaTone: "ok",
      status: "Auto-handled",
    },
    {
      type: "SCRA",
      account: "Account 7715-009",
      desc: "Active-duty verification",
      vendor: "Best Resolution",
      sla: "Overdue 1h",
      slaTone: "danger",
      status: "Escalated",
    },
    {
      type: "Balance",
      account: "Account 4198-661",
      desc: "Payment not matched",
      vendor: "Summit Recovery",
      sla: "Due 5d",
      slaTone: "ok",
      status: "Open",
    },
  ];

  const slaClass = (tone: string) => {
    if (tone === "danger") return "text-[var(--destructive)] bg-[var(--destructive)]/10 border-[var(--destructive)]/30";
    if (tone === "warn") return "text-[var(--chart-4)] bg-[var(--chart-4)]/10 border-[var(--chart-4)]/30";
    return "text-[var(--chart-3)] bg-[var(--chart-3)]/10 border-[var(--chart-3)]/30";
  };

  return (
    <FramedDashboard title="Issues queue · all vendors">
      <div className="grid grid-cols-3 gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Open
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            127
          </p>
        </div>
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Due today
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--chart-4)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            12
          </p>
        </div>
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Overdue
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--destructive)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            3
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {issues.map((it) => (
          <li
            key={it.account}
            className="flex items-start gap-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--card-alt)] p-3"
          >
            <span
              className={`mt-0.5 shrink-0 rounded-[var(--radius-xs)] border px-2 py-0.5 text-caption font-[480] ${slaClass(it.slaTone)}`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {it.sla}
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
          </li>
        ))}
      </ul>
    </FramedDashboard>
  );
}
