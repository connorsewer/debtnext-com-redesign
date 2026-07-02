import { ImageResponse } from "next/og";

import { loadGeneralSans } from "./loadFont";

/**
 * Shared Open Graph card renderer for every v1 route.
 *
 * One dark-canvas treatment: the DebtNext wordmark (General Sans 600 +
 * the indigo lattice node from Wordmark.tsx, no pulse) top-left, the
 * route title bottom-left. A single subtle #5266EB accent glow anchors
 * the composition without competing with the title. Satori constraints
 * apply: inline styles only, no Tailwind, no CSS variables. Hex literals
 * mirror the DESIGN.md tokens (the sanctioned exception for Satori).
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

// DESIGN.md tokens, inlined for Satori.
const CANVAS = "#171721";
const FOREGROUND = "#EDEDF3";
const SECONDARY = "#C3C3CC";
const ACCENT = "#5266EB";

interface OgImageOptions {
  title: string;
  eyebrow?: string;
}

export async function renderOgImage({
  title,
  eyebrow,
}: OgImageOptions): Promise<ImageResponse> {
  const generalSans = await loadGeneralSans();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CANVAS,
          padding: "80px",
          fontFamily: "General Sans",
          position: "relative",
        }}
      >
        {/* Single subtle indigo accent glow, top-right. */}
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background: ACCENT,
            opacity: 0.16,
            filter: "blur(120px)",
            display: "flex",
          }}
        />

        {/* Wordmark: "DebtNext" + the indigo lattice node (static). */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              fontWeight: 600,
              color: FOREGROUND,
              letterSpacing: "-0.02em",
            }}
          >
            DebtNext
          </div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              backgroundColor: ACCENT,
              display: "flex",
            }}
          />
        </div>

        {/* Route title, bottom-left, max two lines. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: SECONDARY,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              color: FOREGROUND,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "960px",
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "General Sans",
          data: generalSans,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );
}
