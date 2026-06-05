"use client";

// Public archetype API (FND-02). The three explicit variant components every
// Phase 11-15 page imports: <ConsoleVisual data />, <DataStoryVisual data />,
// <SchematicVisual data />. Each is a lazy ssr:false wrapper so the heavy
// archetype (Framer + atoms) never SSRs and never enters the `/` eager chunk;
// pages stay lean and the visual hydrates client-side (T-10-12).
//
// next/dynamic options MUST be an inline object literal at the call site
// (Turbopack static-analysis requirement); they are not hoisted. The archetype
// components are imported only inside the dynamic import() thunks, so no static
// top-level import pulls them onto the shared chunk.
//
// The loading skeleton reuses the resolved-box shape so the swap is CLS-free
// (Pitfall 4): it matches the min-h / rounded / product-canvas box the archetype
// resolves to, mirroring the Fallback in index.tsx.

import * as React from "react";
import dynamic from "next/dynamic";

import type { ConsoleData, DataStoryData, SchematicData } from "@/content/visuals";

/** Resolved-box skeleton: same min height, radius, and canvas fill the
 *  archetypes settle into, so the lazy swap does not shift layout. */
function VisualSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-full min-h-[20rem] w-full rounded-[16px] bg-[var(--product-canvas)]"
    />
  );
}

// Inline-literal dynamic() options are required per call (Turbopack); each wrapper
// imports its archetype only inside the import() thunk so nothing is static at the
// module top.
const LazyConsole = dynamic(() => import("./Console").then((m) => m.Console), {
  ssr: false,
  loading: VisualSkeleton,
});

const LazyDataStory = dynamic(() => import("./DataStory").then((m) => m.DataStory), {
  ssr: false,
  loading: VisualSkeleton,
});

const LazySchematic = dynamic(() => import("./Schematic").then((m) => m.Schematic), {
  ssr: false,
  loading: VisualSkeleton,
});

/** Console archetype, lazy + client-only. Pass a ConsoleData payload. */
export function ConsoleVisual({ data }: { data: ConsoleData }) {
  return <LazyConsole data={data} />;
}

/** Data-story archetype, lazy + client-only. Pass a DataStoryData payload. */
export function DataStoryVisual({ data }: { data: DataStoryData }) {
  return <LazyDataStory data={data} />;
}

/** Schematic archetype, lazy + client-only. Pass a SchematicData payload. */
export function SchematicVisual({ data }: { data: SchematicData }) {
  return <LazySchematic data={data} />;
}
