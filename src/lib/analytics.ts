/**
 * Analytics — DESIGN.md §13 + CLAUDE.md §13.
 * Events fire through window.dataLayer (GTM picks them up).
 *
 * v1 events:
 *   cta_primary_click, cta_secondary_click,
 *   form_start, form_submit, form_error,
 *   accordion_toggle, scroll_depth, video_play
 */

type DataLayerEvent =
  | { event: "cta_primary_click"; location: string; label: string }
  | { event: "cta_secondary_click"; location: string; label: string }
  | { event: "form_start"; form_id: string }
  | { event: "form_submit"; form_id: string }
  | {
      event: "form_error";
      form_id: string;
      field?: string;
      error_type: string;
    }
  | { event: "accordion_toggle"; section: string; item: string }
  | { event: "scroll_depth"; depth: 25 | 50 | 75 | 100 }
  | { event: "video_play"; video_id: string };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}
