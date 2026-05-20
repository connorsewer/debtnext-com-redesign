import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { cn } from "@/lib/utils";

export interface ComparisonColumn {
  label: string;
  /** True if this column is the product being sold (gets the accent highlight) */
  isPrimary?: boolean;
}

export interface ComparisonRow {
  capability: string;
  /** One value per column, in the same order as the columns array */
  values: string[];
}

export interface ComparisonTableProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  surface?: SectionSurface;
}

/**
 * Comparison table. DESIGN.md §8.8: table on desktop, stacked cards on
 * mobile (<768px). The "primary" column (dPlat) gets a subtle accent
 * background and a brighter capability label across viewports.
 *
 * Used on /why-dplat — see content/pages/why-dplat.md.
 */
export function ComparisonTable({
  eyebrow,
  heading,
  body,
  columns,
  rows,
  surface = "light",
}: ComparisonTableProps) {
  const primaryColIdx = columns.findIndex((c) => c.isPrimary);

  return (
    <SectionContainer surface={surface}>
      <div className="container-section">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
            {heading}
          </h2>
          {body ? (
            <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
              {body}
            </p>
          ) : null}
        </div>

        {/* Tablet (768-1023 container width): horizontal scroll with sticky first column.
            Desktop (≥1024 container width): full table, no scroll. */}
        <div className="mt-10 hidden overflow-x-auto @md/section:block @md/section:mt-14 @lg/section:overflow-visible">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-[var(--background)] px-4 py-4 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)] @lg/section:static @lg/section:bg-transparent"
                >
                  Capability
                </th>
                {columns.map((col, idx) => (
                  <th
                    key={col.label}
                    scope="col"
                    className={cn(
                      "px-4 py-4 text-body-strong font-[480]",
                      idx === primaryColIdx
                        ? "text-[var(--accent-text-light)]"
                        : "text-[var(--foreground)]"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.capability}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-[var(--background)] px-4 py-4 text-body-strong font-[480] text-[var(--foreground)] @lg/section:static @lg/section:bg-transparent"
                  >
                    {row.capability}
                  </th>
                  {row.values.map((value, idx) => (
                    <td
                      key={`${row.capability}-${idx}`}
                      className={cn(
                        "px-4 py-4 text-body-md",
                        idx === primaryColIdx
                          ? "bg-[var(--card-alt)] font-[480] text-[var(--foreground)]"
                          : "text-[var(--text-tertiary)]"
                      )}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile (<768 container width): stacked cards with paired label/value */}
        <ul className="mt-10 space-y-4 @md/section:hidden">
        {rows.map((row) => (
          <li
            key={row.capability}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <p className="text-body-strong font-[480] text-[var(--foreground)]">
              {row.capability}
            </p>
            <dl className="mt-4 space-y-2">
              {columns.map((col, idx) => (
                <div
                  key={col.label}
                  className={cn(
                    "flex flex-col gap-1 rounded-[var(--radius-xs)] px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4",
                    idx === primaryColIdx
                      ? "bg-[var(--card-alt)]"
                      : ""
                  )}
                >
                  <dt
                    className={cn(
                      "text-body-sm",
                      idx === primaryColIdx
                        ? "font-[480] text-[var(--accent-text-light)]"
                        : "text-[var(--text-tertiary)]"
                    )}
                  >
                    {col.label}
                  </dt>
                  <dd className="text-body-sm text-[var(--foreground)]">
                    {row.values[idx]}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
