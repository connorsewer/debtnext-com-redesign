import * as React from "react";

/**
 * Small token-style icons for the homepage IntegrationStrip.
 * Stroke 1.5, currentColor, 24x24. No fill, calm fintech feel.
 */
const baseProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type IntegrationIconKey = "billing" | "vendors" | "data" | "bi";

export function IntegrationIcon({ name }: { name: IntegrationIconKey }) {
  switch (name) {
    case "billing":
      return (
        <svg {...baseProps} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h4" />
        </svg>
      );
    case "vendors":
      return (
        <svg {...baseProps} aria-hidden="true">
          <circle cx="7" cy="9" r="3" />
          <circle cx="17" cy="9" r="3" />
          <path d="M2 20c.8-3 3-4.5 5-4.5s4.2 1.5 5 4.5" />
          <path d="M12 20c.8-3 3-4.5 5-4.5s4.2 1.5 5 4.5" />
        </svg>
      );
    case "data":
      return (
        <svg {...baseProps} aria-hidden="true">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      );
    case "bi":
      return (
        <svg {...baseProps} aria-hidden="true">
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-8" />
          <path d="M22 20H2" />
        </svg>
      );
  }
}
