"use client";

// Schematic archetype (FND-02). Renders a SchematicData payload (10-04) by laying
// out data.nodes via FlowNode and data.edges via FlowEdge. Edge flow animates via
// strokeDashoffset when edge.flow is set and motion is allowed; it renders static
// under reduced motion (inherited from FlowEdge). Zero baked product numbers.
//
// Edge geometry is measured from the live DOM (ResizeObserver + getBoundingClientRect)
// rather than assumed from a percent grid: node boxes can be any height (a long
// sub-label wraps to two lines), so a fixed-percent viewBox cannot know where a
// box's real edge sits. Each edge is drawn from the source node's right-boundary
// midpoint to the target node's left-boundary midpoint, inset a few px into the
// gutter between columns, so it can never cross into a node's interior or its
// text (fixes the through-label rendering the geometry previously produced).
//
// A11y: the diagram is a meaningful image, so role="img" + aria-label fed by
// data.ariaSummary (Pitfall 8 / T-10-14). No GSAP import (strokeDashoffset is the
// CSS-side flow engine; engine-per-job).

import * as React from "react";

import { RevealItem, RevealStagger } from "@/components/motion";
import { FlowEdge, FlowNode, ProductCanvas } from "@/components/product/primitives";
import type { SchematicData } from "@/content/visuals";

/** Horizontal gap (px) an edge keeps clear of a node's boundary. */
const EDGE_INSET = 6;

export interface SchematicProps {
  data: SchematicData;
  className?: string;
}

interface EdgeGeometry {
  key: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  label?: string;
  flow?: boolean;
}

/**
 * Schematic archetype. `<Schematic data={...} />` renders the node graph the
 * payload describes. Nodes are grouped by `kind` into columns (source → engine →
 * vendor → sink) for a left-to-right routing read; edges draw between the
 * measured node boundaries (never their interiors) and animate flow when the
 * payload marks them.
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

  const gridRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const nodeRefs = React.useRef(new Map<string, HTMLDivElement>());
  const [edges, setEdges] = React.useState<EdgeGeometry[]>([]);

  const setNodeRef = React.useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const measure = React.useCallback(() => {
    // Edge coordinates are relative to the <svg>'s own box, not the grid's: the
    // svg is `absolute inset-0` against their shared parent, so anchoring to its
    // rect keeps edges aligned even though the grid measures its own content.
    const svg = svgRef.current;
    const grid = gridRef.current;
    if (!svg || !grid) return;
    const gridBox = svg.getBoundingClientRect();
    if (gridBox.width === 0 || gridBox.height === 0) return;

    const boxes = new Map<string, DOMRect>();
    for (const node of data.nodes) {
      const el = nodeRefs.current.get(node.id);
      if (el) boxes.set(node.id, el.getBoundingClientRect());
    }

    const next: EdgeGeometry[] = [];
    for (const [i, edge] of data.edges.entries()) {
      const fromBox = boxes.get(edge.from);
      const toBox = boxes.get(edge.to);
      if (!fromBox || !toBox) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `Schematic edge references unknown node id: ${edge.from} -> ${edge.to}`,
          );
        }
        continue;
      }
      // Anchor to each box's real boundary (relative to the grid), inset a few
      // px into the gutter so the stroke never touches a border. Direction
      // (left-to-right vs right-to-left) follows which box actually sits to
      // which side, so a "status back" edge pointing right-to-left still
      // terminates at boundaries instead of centers.
      const fromLeft = fromBox.left - gridBox.left;
      const fromRight = fromBox.right - gridBox.left;
      const toLeft = toBox.left - gridBox.left;
      const toRight = toBox.right - gridBox.left;
      const fromCenterY = fromBox.top - gridBox.top + fromBox.height / 2;
      const toCenterY = toBox.top - gridBox.top + toBox.height / 2;

      const goesRight = toLeft >= fromLeft;
      const fromX = goesRight ? fromRight + EDGE_INSET : fromLeft - EDGE_INSET;
      const toX = goesRight ? toLeft - EDGE_INSET : toRight + EDGE_INSET;

      next.push({
        key: `${edge.from}-${edge.to}-${i}`,
        from: { x: fromX, y: fromCenterY },
        to: { x: toX, y: toCenterY },
        label: edge.label,
        flow: edge.flow,
      });
    }
    setEdges(next);
  }, [data.nodes, data.edges]);

  React.useLayoutEffect(() => {
    measure();
    const grid = gridRef.current;
    const svg = svgRef.current;
    if (!grid || !svg || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(grid);
    observer.observe(svg);
    for (const el of nodeRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <ProductCanvas
      role="img"
      aria-label={data.ariaSummary}
      className={`flex flex-col text-[var(--product-text)] ${className ?? ""}`}
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

      <div className="relative flex flex-1 flex-col justify-center">
        {/* Edge layer: spans the node grid in real pixel space; renders behind
            the nodes. Coordinates come from measure() above, not a static
            percent grid, so they track the nodes' actual rendered boundaries. */}
        <svg
          ref={svgRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {edges.map((edge) => (
            <FlowEdge
              key={edge.key}
              from={edge.from}
              to={edge.to}
              label={edge.label}
              flow={edge.flow}
            />
          ))}
        </svg>

        {/* Node layer: columns laid left to right by kind. */}
        <RevealStagger
          ref={gridRef}
          className="relative grid items-stretch gap-x-8 gap-y-4"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col justify-around gap-4">
              {col.map((node) => (
                <RevealItem key={node.id}>
                  <FlowNode
                    ref={(el) => setNodeRef(node.id, el)}
                    label={node.label}
                    sub={node.sub}
                    kind={node.kind}
                  />
                </RevealItem>
              ))}
            </div>
          ))}
        </RevealStagger>
      </div>
    </ProductCanvas>
  );
}
