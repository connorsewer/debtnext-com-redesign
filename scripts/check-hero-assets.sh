#!/usr/bin/env bash
# Asset size budget guard for public/hero/.
# Exits 0 if every asset is under its budget; non-zero (with diagnostic)
# if any asset blows past.
#
# Budgets are derived from Phase 5.1 D-07 (CONTEXT.md) with the
# researcher recommendation in 05.1-RESEARCH.md Implementation Approach
# section F: 3 MP4 budgets only. AVIF is enforced by
# tests/hero/poster-avif-negotiation.spec.ts; the raw PNG is the AVIF
# source (not on the LCP path) so a raw-file size budget would force
# AVIF degradation.

set -euo pipefail

DIR="public/hero"

# Budgets in bytes. Base-1024 (binary MB) because that's what `stat`
# reports: 10 MB = 10485760, 6 MB = 6291456, 3 MB = 3145728.
declare -a BUDGETS=(
  "homepage-hero-720p.mp4:10485760"
  "homepage-hero-540p.mp4:6291456"
  "homepage-hero-360p.mp4:3145728"
)

FAIL=0
for entry in "${BUDGETS[@]}"; do
  FILE="${entry%%:*}"
  BUDGET="${entry##*:}"
  FULL="$DIR/$FILE"

  if [ ! -f "$FULL" ]; then
    echo "MISSING: $FULL" >&2
    FAIL=1
    continue
  fi

  # macOS `stat -f %z`, Linux `stat -c %s`. Use a portable fallback.
  if SIZE=$(stat -f %z "$FULL" 2>/dev/null); then
    :
  else
    SIZE=$(stat -c %s "$FULL")
  fi

  if [ "$SIZE" -gt "$BUDGET" ]; then
    echo "FAIL  $FILE: $SIZE bytes > $BUDGET bytes budget" >&2
    FAIL=1
  else
    PCT=$(( SIZE * 100 / BUDGET ))
    echo "PASS  $FILE: $SIZE bytes ($PCT% of budget)"
  fi
done

exit "$FAIL"
