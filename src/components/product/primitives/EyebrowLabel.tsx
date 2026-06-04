import * as React from "react";

import { cn } from "@/lib/utils";

export interface EyebrowLabelProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  ref?: React.Ref<HTMLParagraphElement>;
}

/** Uppercase eyebrow with a glowing 4px indigo dot prefix. Static. */
export const EyebrowLabel = React.memo(function EyebrowLabel({
  className,
  children,
  ref,
  ...props
}: EyebrowLabelProps) {
  return (
    <p
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-[10.5px] font-[500] uppercase tracking-[0.12em] text-[var(--status-focus)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1 w-1 rounded-full bg-[var(--primary)] shadow-[0_0_6px_2px_rgba(82,102,235,0.7)]"
      />
      {children}
    </p>
  );
});
