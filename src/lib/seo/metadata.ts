import type { Metadata } from "next";

/**
 * Shared route-metadata builder.
 *
 * Every route content module exports a `*Meta` object shaped like
 * `RouteMeta`. Passing it here produces a full Next `Metadata` object with:
 * - title (respecting `absolute` for routes whose title already contains
 *   "dPlat", so the `%s | dPlat` layout template does not double it),
 * - description,
 * - canonical alternate,
 * - per-route openGraph + twitter overrides (reusing the page's own title
 *   and description, so no route inherits the homepage OG text).
 *
 * Do this once here instead of hand-writing openGraph/twitter on 23 routes.
 */

export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  /**
   * When true, the title is emitted as `title.absolute` so the layout's
   * `%s | dPlat` template does not append a second "dPlat". Use for routes
   * whose title text already contains "dPlat".
   */
  titleAbsolute?: boolean;
}

export function buildMetadata(meta: RouteMeta): Metadata {
  const title = meta.titleAbsolute ? { absolute: meta.title } : meta.title;

  return {
    title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  };
}
