"use client";

import * as React from "react";

import {
  issuesFlagshipConsole,
  optimizationFlagshipConsole,
  placementFlagshipConsole,
  reportingFlagshipConsole,
} from "@/content/visuals";

import { Console } from "./Console";

/**
 * Homepage FeatureAccordion visuals: the Console half of each platform
 * flagship, WITHOUT the Explorable inspect panel. The full *Flagship
 * components stay on their /platform/* deep-dive pages; stacking the
 * inspect panel under the Console inside the accordion double-framed the
 * section and broke its rhythm (Connor, 2026-07-02 preview review).
 */
export function PlacementAccordionConsole() {
  return <Console data={placementFlagshipConsole} />;
}

export function OptimizationAccordionConsole() {
  return <Console data={optimizationFlagshipConsole} />;
}

export function IssuesAccordionConsole() {
  return <Console data={issuesFlagshipConsole} />;
}

export function ReportingAccordionConsole() {
  return <Console data={reportingFlagshipConsole} />;
}
