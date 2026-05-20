import { FramedDashboard } from "./FramedDashboard";

/**
 * Reporting and compliance mockup. A trend chart of inventory vs.
 * liquidation, summary metrics, and a small "scheduled to BI" footer.
 * Conveys: pre-built reports, configurable extracts, BI integration.
 */
export function ReportingMockup() {
  // Two data series sampled across 8 weeks
  const inventory = [62, 60, 64, 63, 66, 68, 71, 73]; // billions / 100M-ish
  const liquidation = [22, 24, 23, 27, 28, 30, 33, 35]; // millions
  const labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

  const w = 320;
  const h = 110;
  const padX = 10;
  const innerW = w - padX * 2;

  const maxInv = Math.max(...inventory);
  const minInv = Math.min(...inventory);
  const maxLiq = Math.max(...liquidation);
  const minLiq = Math.min(...liquidation);

  const ptInv = (v: number, i: number) => {
    const x = padX + (innerW * i) / (inventory.length - 1);
    const y = h - 10 - ((v - minInv) / (maxInv - minInv)) * (h - 30);
    return `${x},${y}`;
  };
  const ptLiq = (v: number, i: number) => {
    const x = padX + (innerW * i) / (liquidation.length - 1);
    const y = h - 10 - ((v - minLiq) / (maxLiq - minLiq)) * (h - 30);
    return `${x},${y}`;
  };

  return (
    <FramedDashboard title="Liquidation trend · 8 weeks">
      <div className="grid grid-cols-3 gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Inventory
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            $2.48B
          </p>
        </div>
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Liquidation
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            $38.7M
          </p>
        </div>
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Net-back
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--chart-3)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            68.2%
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-4 text-body-sm text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
            Inventory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            Liquidation
          </span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-28 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={padX}
              x2={w - padX}
              y1={h - 10 - (h - 30) * f}
              y2={h - 10 - (h - 30) * f}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          ))}
          <polyline
            points={inventory.map(ptInv).join(" ")}
            stroke="var(--chart-3)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={liquidation.map(ptLiq).join(" ")}
            stroke="var(--primary)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-1 flex justify-between text-caption text-[var(--text-tertiary)]">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-body-sm text-[var(--text-tertiary)]">
        <span>Scheduled · weekly</span>
        <span className="text-[var(--foreground)]">Power BI · Snowflake</span>
      </div>
    </FramedDashboard>
  );
}
