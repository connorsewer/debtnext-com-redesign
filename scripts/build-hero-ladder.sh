#!/usr/bin/env bash
# Build the responsive hero asset ladder from public/hero/homepage-hero.mp4.
# Source: 1 + 2 of .planning/phases/05-hero-performance/05-RESEARCH.md
#
# Reads:  public/hero/homepage-hero.mp4 (the 11.65 MB scrub-encoded 1280x720 master)
# Writes:
#   public/hero/homepage-hero-{720p,540p,360p}.mp4    (H.264, scrub-encoded)
#   public/hero/homepage-hero-{720p,540p,360p}.webm   (VP9, scrub-encoded)
#
# Every variant is per-frame-keyframed (-g 1 -keyint_min 1) per D-05 so that
# whichever variant the browser picks, GSAP scrub stays smooth.
#
# Security (per 05-RESEARCH.md T-TAMP-01): no user arguments accepted; INPUT
# path is hardcoded; no path interpolation from external sources.

set -euo pipefail

INPUT="public/hero/homepage-hero.mp4"
OUTDIR="public/hero"

if [ ! -f "$INPUT" ]; then
  echo "Missing input: $INPUT" >&2
  exit 1
fi

# Common scrub-encode flags (shared across MP4 and WebM)
KEYFRAME_FLAGS="-g 1 -keyint_min 1"

encode_variant() {
  local LABEL="$1"
  local HEIGHT="$2"
  local H264_CRF="$3"
  local VP9_CRF="$4"
  local VP9_BV="$5"

  local MP4_OUT="$OUTDIR/homepage-hero-${LABEL}.mp4"
  local WEBM_OUT="$OUTDIR/homepage-hero-${LABEL}.webm"

  echo "-> encoding $MP4_OUT (H.264, height=$HEIGHT, crf=$H264_CRF, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libx264 -profile:v high -level 4.0 -crf "$H264_CRF" \
    $KEYFRAME_FLAGS \
    -an -movflags +faststart \
    "$MP4_OUT"

  echo "-> encoding $WEBM_OUT (VP9, height=$HEIGHT, crf=$VP9_CRF, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libvpx-vp9 -crf "$VP9_CRF" -b:v "$VP9_BV" \
    -row-mt 1 -tile-columns 2 -frame-parallel 1 \
    $KEYFRAME_FLAGS \
    -an \
    "$WEBM_OUT"
}

encode_variant "720p" 720 24 33 1500k
encode_variant "540p" 540 26 35 900k
encode_variant "360p" 360 28 37 500k

for f in "$OUTDIR"/homepage-hero-{720p,540p,360p}.{mp4,webm}; do
  TOTAL=$(ffprobe -v error -select_streams v:0 -count_packets \
    -show_entries stream=nb_read_packets -of csv=p=0 "$f")
  KEY=$(ffprobe -v error -select_streams v:0 \
    -show_entries frame=key_frame -of csv=p=0 "$f" | grep -c "^1$" || true)
  if [ "$TOTAL" != "$KEY" ]; then
    echo "ERROR: $f has $KEY/$TOTAL keyframes (expected all-keyframe per D-05)" >&2
    exit 1
  fi
  echo "PASS $f ($KEY/$TOTAL keyframes)  $(du -h "$f" | cut -f1)"
done

echo "ladder built."
