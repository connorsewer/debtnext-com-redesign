import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProductCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

/** Glass card: subtle gradient fill, 1px light border, inset top highlight,
 *  deep ambient shadow. Static. */
export const ProductCard = React.memo(function ProductCard({
  className,
  children,
  style,
  ref,
  ...props
}: ProductCardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[14px] border border-[rgba(255,255,255,0.07)] p-[18px] shadow-[0_24px_44px_-18px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.008))",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
