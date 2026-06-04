import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProductCanvasProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of radial indigo blooms anchored on the canvas. */
  bloom?: "single" | "dual";
  ref?: React.Ref<HTMLDivElement>;
}

const BLOOM = {
  single:
    "radial-gradient(60% 55% at 25% 12%, rgba(82,102,235,0.14), transparent 70%)",
  dual:
    "radial-gradient(58% 50% at 18% 12%, rgba(82,102,235,0.14), transparent 70%), radial-gradient(55% 45% at 86% 92%, rgba(82,102,235,0.10), transparent 70%)",
} as const;

/** Outer dark canvas: radial indigo bloom + edge-faded 56px grid. Static. */
export const ProductCanvas = React.memo(function ProductCanvas({
  bloom = "single",
  className,
  children,
  style,
  ref,
  ...props
}: ProductCanvasProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "@container relative isolate h-full overflow-hidden rounded-[16px] bg-[var(--product-canvas)] p-[26px]",
        className,
      )}
      style={{ backgroundImage: BLOOM[bloom], ...style }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(circle at 50% 38%, black, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 38%, black, transparent 82%)",
        }}
      />
      {children}
    </div>
  );
});
