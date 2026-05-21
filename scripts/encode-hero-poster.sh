#!/usr/bin/env bash
# Regenerate the hero LCP poster as AVIF from the 720p MP4's first frame.
#
# Why this exists:
# Phase 5.2 swapped the static PNG poster (2.55 MB) for AVIF (~110 KB).
# The raw PNG was the only artifact and has been removed; the MP4 ladder
# carries the same first frame, so we re-derive the poster from there
# when the cinematic asset itself changes.
#
# The output drives two consumers in src/components/sections/HomepageHero.tsx:
#   1. <Image src={startFrame} priority>  (Next/Image, transcodes per viewport)
#   2. <video poster={startFrame}>        (raw fetch; this is the LCP path)
#
# Usage: scripts/encode-hero-poster.sh
# Requires: ffmpeg with libsvtav1 + avif muxer (Homebrew default).

set -euo pipefail

SOURCE_MP4="public/hero/homepage-hero-720p.mp4"
OUT_AVIF="public/hero/homepage-hero-start.avif"
TMP_PNG="$(mktemp -t hero-poster-XXXXXX).png"
TMP_AVIF="$(mktemp -t hero-poster-XXXXXX).avif"

trap 'rm -f "$TMP_PNG" "$TMP_AVIF"' EXIT

if [ ! -f "$SOURCE_MP4" ]; then
  echo "missing source: $SOURCE_MP4" >&2
  echo "run scripts/build-hero-ladder.sh first." >&2
  exit 1
fi

echo "extract first frame from $SOURCE_MP4"
ffmpeg -hide_banner -loglevel error -y \
  -i "$SOURCE_MP4" \
  -frames:v 1 \
  "$TMP_PNG"

echo "encode AVIF (libsvtav1, CRF 30, preset 5)"
ffmpeg -hide_banner -loglevel error -y \
  -i "$TMP_PNG" \
  -c:v libsvtav1 -crf 30 -preset 5 -frames:v 1 \
  "$TMP_AVIF"

# Refuse to ship if the file blows past the HERO-03 poster budget
# enforced by tests/hero/poster-avif-negotiation.spec.ts (200 KB).
if SIZE=$(stat -f %z "$TMP_AVIF" 2>/dev/null); then
  :
else
  SIZE=$(stat -c %s "$TMP_AVIF")
fi
BUDGET=200000
if [ "$SIZE" -gt "$BUDGET" ]; then
  echo "FAIL: $TMP_AVIF is $SIZE bytes > $BUDGET budget" >&2
  echo "raise CRF (smaller file, lower quality) and rerun." >&2
  exit 1
fi

mv "$TMP_AVIF" "$OUT_AVIF"
echo "wrote $OUT_AVIF ($SIZE bytes, $((SIZE * 100 / BUDGET))% of budget)"
