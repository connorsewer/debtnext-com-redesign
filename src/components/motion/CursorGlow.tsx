// src/components/motion/CursorGlow.tsx
// A soft radial light that follows the pointer within its parent container.
// Place inside a position:relative section. Desktop fine-pointer only, and
// disabled under prefers-reduced-motion. Purely decorative.
//
// Usage:
//   <section className="relative overflow-hidden">
//     <CursorGlow />
//     <div className="relative z-10">...hero content...</div>
//   </section>
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./CursorGlow.module.css";

interface CursorGlowProps {
  size?: number; // diameter in px
  className?: string;
}

export function CursorGlow({ size = 480, className }: CursorGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    // Only on devices with a precise pointer (skip touch).
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const parent = ref.current?.parentElement;
    const glow = ref.current;
    if (!parent || !glow) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let active = false;

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (!active) {
        active = true;
        glow.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      active = false;
      glow.style.opacity = "0";
    };

    const apply = () => {
      raf = 0;
      glow.style.transform = `translate(${tx - size / 2}px, ${ty - size / 2}px)`;
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, size]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${styles.glow} ${className ?? ""}`}
      style={{ width: size, height: size }}
    />
  );
}
