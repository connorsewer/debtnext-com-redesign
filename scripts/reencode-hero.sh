#!/usr/bin/env bash
# Re-encode the homepage hero MP4 with per-frame keyframes so video.currentTime
# binding stays smooth during scroll scrubbing. See:
#   /Users/connorlaughlin/Downloads/mercury-hero-claude-code-brief.md §"Re-encode the video"
#
# Usage:
#   ./scripts/reencode-hero.sh <input.mp4>
#
# Output goes to public/hero/homepage-hero.mp4. File size grows ~3x but scrub
# becomes smooth across browsers. Without this, sparse keyframes cause visible
# stutter when GSAP tweens currentTime.

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <input.mp4>" >&2
  exit 1
fi

INPUT="$1"
OUTPUT="public/hero/homepage-hero.mp4"

if [ ! -f "$INPUT" ]; then
  echo "input not found: $INPUT" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

echo "re-encoding $INPUT → $OUTPUT (per-frame keyframes)"
ffmpeg -y -i "$INPUT" \
  -c:v libx264 -profile:v high -level 4.0 -crf 22 \
  -g 1 -keyint_min 1 -an \
  -movflags +faststart \
  "$OUTPUT"

echo "done. size:"
ls -lh "$OUTPUT"
