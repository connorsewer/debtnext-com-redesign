#!/usr/bin/env bash
# Route First-Load-JS budget guard for `/`.
#
# Sums the byte sizes of the JS chunk files Next emits for the `/` route entry,
# read from `.next/app-build-manifest.json` (produced by `npm run build`), and
# fails the build if `/`'s First-Load-JS exceeds ROUTE_JS_BUDGET_BYTES.
#
# Method: manifest-parse (no new dependency). app-build-manifest.json maps each
# route key (e.g. "/page") to the list of client chunk files under `.next/`.
# We resolve each listed file to `.next/<file>` and sum `stat` byte sizes. If
# the manifest shape is not parseable (Next changed the layout), we fall back to
# grepping the captured build stdout for the "First Load JS" column on the `/`
# row. The build-stdout fallback only runs if BUILD_LOG is set to a file path.
#
# BUDGET PROVENANCE (mirrors how check-hero-assets.sh cites Phase 5.1 D-07):
#   ROUTE_JS_BUDGET_BYTES is PROVISIONAL. Pin it to the current post-5.3 `/`
#   First-Load-JS measured on a green CI build + ~10% headroom. Capture the real
#   number printed by this script on the first green CI run and replace the
#   placeholder below (and record it in the plan SUMMARY). Until pinned, the
#   conservative placeholder keeps the guard wired without false-failing.

set -euo pipefail

MANIFEST=".next/app-build-manifest.json"

# PROVISIONAL ceiling. 300 KB (base-1024) is a deliberately loose placeholder so
# the guard is wired-but-non-blocking until the first measured CI number is
# pinned here. Replace with measured post-5.3 `/` First-Load-JS + ~10% headroom.
ROUTE_JS_BUDGET_BYTES=307200

# Portable byte-size helper: macOS `stat -f %z`, Linux `stat -c %s`.
file_size() {
  if SZ=$(stat -f %z "$1" 2>/dev/null); then
    echo "$SZ"
  else
    stat -c %s "$1"
  fi
}

# --- Manifest parse path -----------------------------------------------------
if [ -f "$MANIFEST" ]; then
  # Resolve the `/` route key (Next uses "/page" for the App Router root) and
  # print its chunk file list, one path per line, via node (already a dep).
  CHUNKS=$(node -e '
    const fs = require("fs");
    const m = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const map = m.pages || m;
    const key = ["/page", "/"].find((k) => Array.isArray(map[k]));
    if (!key) { process.stderr.write("no-root-key\n"); process.exit(3); }
    process.stdout.write(map[key].join("\n"));
  ' "$MANIFEST") || {
    echo 'FAIL  could not read / chunk list from '"$MANIFEST" >&2
    exit 1
  }

  TOTAL=0
  while IFS= read -r chunk; do
    [ -z "$chunk" ] && continue
    FULL=".next/$chunk"
    if [ ! -f "$FULL" ]; then
      echo "WARN  manifest lists missing chunk: $FULL (skipping)" >&2
      continue
    fi
    SIZE=$(file_size "$FULL")
    TOTAL=$(( TOTAL + SIZE ))
  done <<< "$CHUNKS"

  if [ "$TOTAL" -gt "$ROUTE_JS_BUDGET_BYTES" ]; then
    echo "FAIL  / First-Load-JS: $TOTAL bytes > $ROUTE_JS_BUDGET_BYTES bytes budget" >&2
    exit 1
  fi

  PCT=$(( TOTAL * 100 / ROUTE_JS_BUDGET_BYTES ))
  echo "PASS  / First-Load-JS: $TOTAL bytes ($PCT% of $ROUTE_JS_BUDGET_BYTES budget)"
  echo "NOTE  budget is PROVISIONAL; pin to this measured number + ~10% headroom on first green CI."
  exit 0
fi

# --- Build-stdout fallback ---------------------------------------------------
# Only reachable when the manifest is absent. Requires BUILD_LOG to point at a
# captured `npm run build` stdout file containing the route table.
if [ -n "${BUILD_LOG:-}" ] && [ -f "$BUILD_LOG" ]; then
  echo "WARN  $MANIFEST absent; falling back to BUILD_LOG stdout parse." >&2
  # The route table row for `/` looks like: `┌ ○ /    1.2 kB    123 kB`
  # The last column is First Load JS. We extract a `<num> kB` near end-of-row.
  ROW=$(grep -E "^[┌├└].*[[:space:]]/[[:space:]]" "$BUILD_LOG" | head -1 || true)
  if [ -z "$ROW" ]; then
    echo 'FAIL  could not locate / row in BUILD_LOG ('"$BUILD_LOG"')' >&2
    exit 1
  fi
  echo "INFO  / route row: $ROW"
  echo "NOTE  stdout-parse fallback is informational only; pin the budget from the manifest path on CI." >&2
  exit 0
fi

echo "FAIL  $MANIFEST not found and no BUILD_LOG fallback set. Run 'npm run build' first." >&2
exit 1
