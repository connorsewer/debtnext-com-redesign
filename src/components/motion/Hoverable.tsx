// src/components/motion/Hoverable.tsx
// Motion type 3: hover micro-interactions (CSS). Thin wrapper that applies the
// shared hover.module.css classes so consumers get a named primitive instead of
// importing the CSS module per page. All effects are transform/opacity based and
// already disabled under prefers-reduced-motion inside hover.module.css.
//
// No "use client" needed: this renders a plain element with static classes.
import * as React from "react";
import hover from "./hover.module.css";

type HoverVariant = "card" | "button" | "arrow" | "underline";

const VARIANT_CLASS: Record<HoverVariant, string> = {
  card: hover.hoverCard,
  button: hover.hoverButton,
  arrow: hover.hoverArrow,
  underline: hover.hoverUnderline,
};

interface HoverableProps extends React.HTMLAttributes<HTMLElement> {
  /** Which shared hover treatment to apply. */
  variant: HoverVariant;
  /** Element to render. Defaults to a div. */
  as?: React.ElementType;
  children?: React.ReactNode;
}

export function Hoverable({
  variant,
  as: Tag = "div",
  className,
  children,
  ...rest
}: HoverableProps) {
  const cls = [VARIANT_CLASS[variant], className].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
