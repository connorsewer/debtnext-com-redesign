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
        // HERO-02: lead with the CSS variable next/font/local generates.
        // The variable points at the hashed family name that the @font-face
        // injection produces, so we resolve to the local woff2 even if
        // next/font hashes "General Sans" to something like "__General_Sans_abc123".
        // The literal "General Sans" + Inter + system-ui chain remains as a
        // safety net for environments where next/font hasn't hydrated yet.
        fontFamily: 'var(--font-general-sans), "General Sans", Inter, system-ui, sans-serif',
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
