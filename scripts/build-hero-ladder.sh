#!/usr/bin/env bash
# Build the responsive hero asset ladder from public/hero/homepage-hero.mp4.
# Source: 1 + 2 of .planning/phases/05-hero-performance/05-RESEARCH.md.
# Phase 5.1 D-01 + D-02 dropped the VP9 encode block; the ladder now ships
# MP4 only. VP9 with per-frame keyframes (D-05) could not hit bitrate
# targets and produced files 1.85x to 4.46x their MP4 counterparts.
#
# Reads:  public/hero/homepage-hero.mp4 (the 11.65 MB scrub-encoded 1280x720 master)
# Writes:
#   public/hero/homepage-hero-{720p,540p,360p}.mp4    (H.264, scrub-encoded)
#
# Every variant is per-frame-keyframed (-g 1 -keyint_min 1) per D-05 so that
# GSAP scrub stays smooth across the picked variant.
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

# Common scrub-encode flags for libx264.
# -g 1 -keyint_min 1 alone is NOT sufficient for libx264: scene-cut detection
# can still emit the final frame as a P-frame, producing 239/240 keyframes
# on a 240-frame source. The libx264-specific override (`-x264-params
# keyint=1:min-keyint=1:scenecut=0`) forces every frame to an I-frame.
KEYFRAME_FLAGS="-g 1 -keyint_min 1"
H264_KEYFRAME_PARAMS="keyint=1:min-keyint=1:scenecut=0"

encode_variant() {
  local LABEL="$1"
  local HEIGHT="$2"
  local H264_CRF="$3"

  local MP4_OUT="$OUTDIR/homepage-hero-${LABEL}.mp4"

  echo "-> encoding $MP4_OUT (H.264, height=$HEIGHT, crf=$H264_CRF, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libx264 -profile:v high -level 4.0 -crf "$H264_CRF" \
    $KEYFRAME_FLAGS -x264-params "$H264_KEYFRAME_PARAMS" \
    -an -movflags +faststart \
    "$MP4_OUT"
}

# Per-variant tunings. H.264 CRF-only across the three tiers; per-frame
# keyframes preserved so scroll-scrub stays smooth.
encode_variant "720p" 720 24
encode_variant "540p" 540 26
encode_variant "360p" 360 28

for f in "$OUTDIR"/homepage-hero-{720p,540p,360p}.mp4; do
  TOTAL=$(ffprobe -v error -select_streams v:0 -count_packets \
    -show_entries stream=nb_read_packets -of csv=p=0 "$f")
  # ffprobe csv=p=0 emits the first row with a trailing field separator (e.g.
  # "1,") because csv=p=0 still shows comma separators when -show_entries
  # has multiple sections enabled. Anchor only the leading "1" to count
  # every keyframe-flagged frame; the all-keyframe case lands on a count
  # of TOTAL.
  KEY=$(ffprobe -v error -select_streams v:0 \
    -show_entries frame=key_frame -of csv=p=0 "$f" | grep -c "^1" || true)
  if [ "$TOTAL" != "$KEY" ]; then
    echo "ERROR: $f has $KEY/$TOTAL keyframes (expected all-keyframe per D-05)" >&2
    exit 1
  fi
  echo "PASS $f ($KEY/$TOTAL keyframes)  $(du -h "$f" | cut -f1)"
done

echo "ladder built."
