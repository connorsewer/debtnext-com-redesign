"use client";

// PROVISIONAL (A2): schema + atoms harden in Phase 11 against real "how it works"
// data. There is no existing schematic implementation to validate against, so the
// node/edge layout here is the first concrete read of SchematicData. Treat the
// geometry (the auto-laid grid + straight edges) as a starting point to refine
// against PlatformSystemMap.tsx and the real routing data before locking.
//
// Schematic archetype (FND-02). Renders a SchematicData payload (10-04) by laying
// out data.nodes via FlowNode and data.edges via FlowEdge. Edge flow animates via
// strokeDashoffset when edge.flow is set and motion is allowed; it renders static
// under reduced motion (inherited from FlowEdge). Zero baked product numbers.
//
// A11y: the diagram is a meaningful image, so role="img" + aria-label fed by
// data.ariaSummary (Pitfall 8 / T-10-14). No GSAP import (strokeDashoffset is the
// CSS-side flow engine; engine-per-job).

import * as React from "react";

import { RevealItem, RevealStagger } from "@/components/motion";
import { FlowEdge, FlowNode, ProductCanvas } from "@/components/product/primitives";
import type { SchematicData } from "@/content/visuals";

// Viewbox geometry for the edge layer. Nodes lay out on a simple column grid and
// edges connect node centers; PROVISIONAL until real geometry lands in Phase 11.
const VIEW_W = 100;
const VIEW_H = 100;

/** Even vertical center for a node index within a column of `count` nodes. */
function centerY(index: number, count: number): number {
  return ((index + 1) / (count + 1)) * VIEW_H;
}

export interface SchematicProps {
  data: SchematicData;
  className?: string;
}

/**
 * Schematic archetype. `<Schematic data={...} />` renders the node graph the
 * payload describes. Nodes are grouped by `kind` into columns (source → engine →
 * vendor → sink) for a left-to-right routing read; edges draw between the node
 * centers and animate flow when the payload marks them.
 */
export function Schematic({ data, className }: SchematicProps) {
  const order: NonNullable<SchematicData["nodes"][number]["kind"]>[] = [
    "source",
    "engine",
    "vendor",
    "sink",
  ];

  // Group nodes into columns by kind (unknown/undefined kinds fall to the front).
  const columns = order
    .map((kind) => data.nodes.filter((n) => (n.kind ?? "source") === kind))
    .filter((col) => col.length > 0);

  // Resolve each node id to its column/row center for edge geometry.
  const pos = new Map<string, { x: number; y: number }>();
  columns.forEach((col, colIndex) => {
    const x = ((colIndex + 1) / (columns.length + 1)) * VIEW_W;
    col.forEach((node, rowIndex) => {
      pos.set(node.id, { x, y: centerY(rowIndex, col.length) });
    });
  });

  return (
    <ProductCanvas
      role="img"
      aria-label={data.ariaSummary}
      className={`text-[var(--product-text)] ${className ?? ""}`}
      bloom="dual"
    >
      {data.eyebrow ? (
        <p className="mb-3 text-[10.5px] font-[500] uppercase tracking-[0.12em] text-[var(--status-focus)]">
          {data.eyebrow}
        </p>
      ) : null}
      <p className="mb-4 text-[15px] font-[500] tracking-[-0.02em] text-[var(--product-text)]">
        {data.title}
      </p>

      <div className="relative">
        {/* Edge layer: spans the node grid; renders behind the nodes. */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {data.edges.map((edge, i) => {
            const from = pos.get(edge.from);
            const to = pos.get(edge.to);
            if (!from || !to) {
              if (process.env.NODE_ENV !== "production") {
                console.warn(
                  `Schematic edge references unknown node id: ${edge.from} -> ${edge.to}`,
                );
              }
              return null;
            }
            return (
              <FlowEdge
                key={`${edge.from}-${edge.to}-${i}`}
                from={from}
                to={to}
                label={edge.label}
                flow={edge.flow}
              />
            );
          })}
        </svg>

        {/* Node layer: columns laid left to right by kind. */}
        <RevealStagger className="relative grid gap-x-6" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col items-center justify-around gap-4">
              {col.map((node) => (
                <RevealItem key={node.id}>
                  <FlowNode label={node.label} sub={node.sub} kind={node.kind} />
                </RevealItem>
              ))}
            </div>
          ))}
        </RevealStagger>
      </div>
    </ProductCanvas>
  );
}
