import { FramedDashboard } from "./FramedDashboard";

/**
 * Placement and routing mockup. Shows the decision engine routing a
 * batch of inbound accounts across vendor pools by tier with allocation
 * percentages. Conveys: configurable rules, automatic routing, vendor
 * pools as the primary structural unit.
 */
export function PlacementMockup() {
  const pools = [
    { tier: "Pre-collect", pct: 35, vendors: 2, bar: "from-[var(--primary)] to-[var(--primary-hover)]" },
    { tier: "Primary", pct: 28, vendors: 3, bar: "from-[var(--chart-3)] to-[#22c55e]" },
    { tier: "Secondary", pct: 18, vendors: 2, bar: "from-[var(--chart-4)] to-[#d97706]" },
    { tier: "Tertiary", pct: 12, vendors: 4, bar: "from-[var(--chart-5)] to-[#0891b2]" },
    { tier: "Specialty", pct: 7, vendors: 1, bar: "from-[var(--text-tertiary)] to-[var(--text-tertiary)]/60" },
  ];

  return (
    <FramedDashboard title="Placement run · 12:04 PM">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Inbound batch
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            120,418
          </p>
          <p className="text-body-sm text-[var(--text-tertiary)]">
            accounts · $284.6M
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--chart-3)]/30 bg-[var(--chart-3)]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
          <span className="text-body-sm font-[480] text-[var(--foreground)]">
            Engine running
          </span>
        </div>
      </div>

      {/* Allocation rows */}
      <ul className="mt-4 space-y-3">
        {pools.map((pool) => (
          <li key={pool.tier} className="flex items-center gap-4">
            <div className="w-28 shrink-0">
              <p className="text-body-strong font-[480] text-[var(--foreground)]">
                {pool.tier}
              </p>
              <p className="text-body-sm text-[var(--text-tertiary)]">
                {pool.vendors} vendor{pool.vendors === 1 ? "" : "s"}
              </p>
            </div>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]">
              <div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${pool.bar}`}
                style={{ width: `${pool.pct * 2.4}%` }}
              />
            </div>
            <span
              className="w-10 shrink-0 text-right text-body-strong font-[480] text-[var(--foreground)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {pool.pct}%
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-body-sm text-[var(--text-tertiary)]">
        <span>Daily reconciliation</span>
        <span className="text-[var(--chart-3)]">All vendors current</span>
      </div>
    </FramedDashboard>
  );
}
