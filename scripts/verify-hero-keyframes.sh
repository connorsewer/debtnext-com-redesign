#!/usr/bin/env bash
# Verify every ladder variant in public/hero/ is per-frame keyframed (D-05).
# Use after build-hero-ladder.sh, or anytime to check the binaries on disk.
#
# Exits 0 if every variant has nb_key_frames == nb_frames.
# Exits 1 with a diagnostic if any variant fails.

set -euo pipefail

OUTDIR="public/hero"
VARIANTS=(
  "$OUTDIR/homepage-hero-720p.mp4"
  "$OUTDIR/homepage-hero-540p.mp4"
  "$OUTDIR/homepage-hero-360p.mp4"
)

FAIL=0
for f in "${VARIANTS[@]}"; do
  if [ ! -f "$f" ]; then
    echo "MISSING: $f (run scripts/build-hero-ladder.sh)" >&2
    FAIL=1
    continue
  fi
  TOTAL=$(ffprobe -v error -select_streams v:0 -count_packets \
    -show_entries stream=nb_read_packets -of csv=p=0 "$f")
  # See note in build-hero-ladder.sh: ffprobe csv=p=0 prints the first row
  # with a trailing field separator ("1," instead of "1"), so we anchor
  # only the leading character to count every keyframe-flagged frame.
  KEY=$(ffprobe -v error -select_streams v:0 \
    -show_entries frame=key_frame -of csv=p=0 "$f" | grep -c "^1" || true)
  if [ "$TOTAL" != "$KEY" ]; then
    echo "FAIL  $f: $KEY/$TOTAL keyframes (need all-keyframe per D-05)" >&2
    FAIL=1
  else
    echo "PASS  $f: $KEY/$TOTAL keyframes"
  fi
done

exit "$FAIL"
