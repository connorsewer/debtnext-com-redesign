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

# Common scrub-encode flags (shared across MP4 and WebM).
# -g 1 -keyint_min 1 alone is NOT sufficient for libx264: scene-cut detection
# can still emit the final frame as a P-frame, producing 239/240 keyframes
# on a 240-frame source. The libx264-specific override (`-x264-params
# keyint=1:min-keyint=1:scenecut=0`) forces every frame to an I-frame.
# libvpx-vp9 honors -g 1 -keyint_min 1 directly.
KEYFRAME_FLAGS="-g 1 -keyint_min 1"
H264_KEYFRAME_PARAMS="keyint=1:min-keyint=1:scenecut=0"

encode_variant() {
  local LABEL="$1"
  local HEIGHT="$2"
  local H264_CRF="$3"
  local VP9_BV="$4"

  local MP4_OUT="$OUTDIR/homepage-hero-${LABEL}.mp4"
  local WEBM_OUT="$OUTDIR/homepage-hero-${LABEL}.webm"

  echo "-> encoding $MP4_OUT (H.264, height=$HEIGHT, crf=$H264_CRF, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libx264 -profile:v high -level 4.0 -crf "$H264_CRF" \
    $KEYFRAME_FLAGS -x264-params "$H264_KEYFRAME_PARAMS" \
    -an -movflags +faststart \
    "$MP4_OUT"

  # libvpx-vp9 in 1-pass mode does NOT honor `-b:v` as a bitrate target
  # when combined with per-frame keyframes (`-g 1`); CRF/Q dominates and
  # output bloats to ~3x the natural size. 2-pass encoding (-pass 1 to
  # null, then -pass 2) respects the bitrate target while still producing
  # 240/240 keyframes. -passlogfile keeps multi-variant runs from clashing
  # over the default ffmpeg2pass-*.log files when invocations interleave.
  local PASSLOG="$OUTDIR/.vp9-pass-${LABEL}"
  echo "-> encoding $WEBM_OUT (VP9, height=$HEIGHT, target=$VP9_BV, 2-pass, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libvpx-vp9 -b:v "$VP9_BV" \
    -row-mt 1 -tile-columns 2 \
    $KEYFRAME_FLAGS \
    -an -pass 1 -passlogfile "$PASSLOG" -f null /dev/null

  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libvpx-vp9 -b:v "$VP9_BV" \
    -row-mt 1 -tile-columns 2 \
    $KEYFRAME_FLAGS \
    -an -pass 2 -passlogfile "$PASSLOG" \
    "$WEBM_OUT"

  # Clean up the pass log file; the encoded WebM is the only artifact we
  # want on disk.
  rm -f "${PASSLOG}-0.log" "${PASSLOG}-0.log.mbtree" 2>/dev/null || true
}

# Per-variant tunings. VP9 uses 2-pass with explicit bitrate targets
# (1500k/900k/500k per RESEARCH.md) so output stays under the ladder's
# per-variant size budget while D-05 (per-frame keyframes) holds.
encode_variant "720p" 720 24 1500k
encode_variant "540p" 540 26  900k
encode_variant "360p" 360 28  500k

for f in "$OUTDIR"/homepage-hero-{720p,540p,360p}.{mp4,webm}; do
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
