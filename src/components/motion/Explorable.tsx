// src/components/motion/Explorable.tsx
// Motion type 7: explorable (Framer + state). Compound-component shell for
// "hover-to-inspect / toggle-state" data visuals. This is the contract only;
// the first real explorable flagship ships in Phase 11 (PLATVIS-02). Archetypes
// compose <Explorable> with Explorable.Toggle / Explorable.Panel rather than
// passing showKpis / interactive booleans (architecture-compound-components).
//
// React 19.2.4: ref is passed as a normal prop (the legacy ref-forwarding helper
// is gone in this codebase); context is consumed with use(), not useContext().
//
// A11y + reduced-motion contract:
//   - Toggle controls are real <button>s, keyboard-operable, with the project
//     focus-visible ring (#9CB4E8, handled globally via :focus-visible tokens).
//   - Values are visible by default, never hover-gated, so keyboard and reduced-
//     motion users see the same data a pointer user sees.
//   - Panels render their content immediately; motion is additive only.
"use client";

import * as React from "react";

interface ExplorableContextValue {
  active: string | null;
  setActive: (id: string | null) => void;
  baseId: string;
}

const ExplorableContext = React.createContext<ExplorableContextValue | null>(null);

function useExplorable(component: string): ExplorableContextValue {
  // React 19: consume context with use().
  const ctx = React.use(ExplorableContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Explorable>.`);
  }
  return ctx;
}

interface ExplorableRootProps {
  children: React.ReactNode;
  /** Optionally controlled active panel id. */
  active?: string | null;
  defaultActive?: string | null;
  onActiveChange?: (id: string | null) => void;
  className?: string;
  /** Accessible label for the explorable region. */
  label?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function ExplorableRoot({
  children,
  active: controlledActive,
  defaultActive = null,
  onActiveChange,
  className,
  label,
  ref,
}: ExplorableRootProps) {
  const baseId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(defaultActive);
  const isControlled = controlledActive !== undefined;
  const active = isControlled ? controlledActive : uncontrolled;

  const setActive = React.useCallback(
    (id: string | null) => {
      if (!isControlled) setUncontrolled(id);
      onActiveChange?.(id);
    },
    [isControlled, onActiveChange],
  );

  const value = React.useMemo<ExplorableContextValue>(
    () => ({ active, setActive, baseId }),
    [active, setActive, baseId],
  );

  return (
    <ExplorableContext value={value}>
      <div
        ref={ref}
        className={className}
        role="group"
        aria-label={label}
      >
        {children}
      </div>
    </ExplorableContext>
  );
}

interface ExplorableToggleProps {
  /** Panel id this toggle controls. */
  id: string;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function ExplorableToggle({ id, children, className, ref }: ExplorableToggleProps) {
  const { active, setActive, baseId } = useExplorable("Explorable.Toggle");
  const isActive = active === id;
  return (
    <button
      ref={ref}
      type="button"
      className={className}
      aria-expanded={isActive}
      aria-controls={`${baseId}-${id}`}
      onClick={() => setActive(isActive ? null : id)}
    >
      {children}
    </button>
  );
}

interface ExplorablePanelProps {
  /** Panel id; matches its controlling toggle. */
  id: string;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function ExplorablePanel({ id, children, className, ref }: ExplorablePanelProps) {
  const { active, baseId } = useExplorable("Explorable.Panel");
  const isActive = active === id;
  return (
    <div
      ref={ref}
      id={`${baseId}-${id}`}
      className={className}
      data-active={isActive || undefined}
    >
      {children}
    </div>
  );
}

export const Explorable = Object.assign(ExplorableRoot, {
  Toggle: ExplorableToggle,
  Panel: ExplorablePanel,
});
