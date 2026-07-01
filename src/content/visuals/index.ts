/**
 * Visual payload home barrel (FND-03). Pages and the lazy archetype registry
 * import the typed schemas and per-context payloads from one place. Server-safe
 * (no "use client"); the single [CLAIMS REVIEW]-auditable home for product
 * numbers rendered inside visuals.
 */

export type {
  BarSpec,
  ConsoleHeader,
  ConsoleCallout,
  ConsoleRow,
  ConsoleData,
  DataStoryData,
  SchematicNode,
  SchematicEdge,
  SchematicData,
} from "./types";

export { handoffPlacementConsole } from "./handoff-placement";
export { handoffPerformanceConsole } from "./handoff-performance";
export { handoffIssuesConsole } from "./handoff-issues";
export { handoffReportingConsole } from "./handoff-reporting";
export { placementConsole } from "./placement";
export {
  placementVendorPools,
  placementRecall,
  placementBusinessRules,
  placementReconciliation,
  placementFlagshipConsole,
  placementFlagshipTiers,
} from "./placement-accordion";
export type { PlacementFlagshipTier } from "./placement-accordion";
export {
  optimizationBands,
  optimizationShare,
  optimizationBonus,
  optimizationHistory,
  optimizationFlagshipConsole,
  optimizationFlagshipVendors,
} from "./optimization";
export type { OptimizationFlagshipVendor } from "./optimization";
export {
  issuesAutoHandling,
  issuesWorkflows,
  issuesVendorPortal,
  issuesSla,
  issuesAudit,
  issuesFlagshipConsole,
  issuesFlagshipItems,
} from "./issues";
export type { IssuesFlagshipItem } from "./issues";
export {
  reportingInventory,
  reportingVendor,
  reportingCost,
  reportingSla,
  reportingActivity,
  reportingFlagshipConsole,
  reportingFlagshipMetrics,
} from "./reporting";
export type { ReportingFlagshipMetric } from "./reporting";
