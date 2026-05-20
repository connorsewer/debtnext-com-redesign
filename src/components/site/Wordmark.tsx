import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
}

/**
 * The DebtNext wordmark — General Sans SemiBold with a luminous indigo
 * node trailing the final letter.
 *
 * The node is not decoration. It represents a live point in the
 * orchestration lattice — a visual cue that every DebtNext surface is
 * connected to a working system. Pulse animation lives in globals.css
 * (`.dn-node`) and is suppressed under `prefers-reduced-motion`.
 */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.32em] tracking-tight text-[var(--foreground)]",
        className
      )}
      style={{
        fontFamily: '"General Sans", Inter, system-ui, sans-serif',
        fontWeight: 600,
      }}
    >
      <span>DebtNext</span>
      <span
        aria-hidden="true"
        className="dn-node inline-block h-[0.36em] w-[0.36em] shrink-0 rounded-full bg-[var(--primary)]"
      />
    </span>
  );
}
