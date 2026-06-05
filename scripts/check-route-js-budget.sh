#!/usr/bin/env bash
# Route First-Load-JS budget guard for `/`.
#
# Sums the byte sizes of the JS chunk files the `/` route loads on first paint
# and fails the build if that total exceeds ROUTE_JS_BUDGET_BYTES.
#
# Method: manifest-parse (no new dependency). Next 16 builds with Turbopack and
# does NOT emit the legacy `.next/app-build-manifest.json`, and its build-output
# route table no longer prints a "First Load JS" column. The App Router per-route
# client chunk list now lives in the route's client-reference-manifest:
#   .next/server/app/page_client-reference-manifest.js
# which assigns `self.__RSC_MANIFEST["/page"].entryJSFiles` (the page, layout, and
# error-boundary client entries). First-Load-JS for `/` is the union of those
# entry chunks plus the shared App Router runtime chunks listed in
# `.next/build-manifest.json` -> `rootMainFiles`. We resolve each file to
# `.next/<file>` and sum `stat` byte sizes.
#
# BUDGET PROVENANCE (mirrors how check-hero-assets.sh cites Phase 5.1 D-07):
#   ROUTE_JS_BUDGET_BYTES is pinned to the measured `/` First-Load-JS from the
#   green CI build + ~10% headroom. See FND-05/FND-06 in the Phase 10 SUMMARY.
#   The script prints the live measured total on every run; if `/` grows past the
#   ceiling, re-measure and re-pin deliberately (do not silently bump).

set -euo pipefail

# Root-page client-reference manifest (Next 16 / Turbopack). This file defines
# `self.__RSC_MANIFEST["/page"]` when require()d.
RSC_MANIFEST=".next/server/app/page_client-reference-manifest.js"
# Shared App Router runtime chunks (framework + turbopack runtime).
BUILD_MANIFEST=".next/build-manifest.json"

# Pinned ceiling. Measured `/` First-Load-JS on the first green CI build was
# 786,643 bytes; pinned to that + ~10% headroom (865,308) to absorb routine
# chunk drift and cross-platform build variance without false failures.
ROUTE_JS_BUDGET_BYTES=865308

# Portable byte-size helper: macOS `stat -f %z`, Linux `stat -c %s`.
file_size() {
  if SZ=$(stat -f %z "$1" 2>/dev/null); then
    echo "$SZ"
  else
    stat -c %s "$1"
  fi
}

if [ ! -f "$RSC_MANIFEST" ]; then
  echo "FAIL  $RSC_MANIFEST not found. Run 'npm run build' first." >&2
  echo "      (Next 16 + Turbopack emits no .next/app-build-manifest.json; the" >&2
  echo "       per-route client chunk list lives in the client-reference manifest.)" >&2
  exit 1
fi
if [ ! -f "$BUILD_MANIFEST" ]; then
  echo "FAIL  $BUILD_MANIFEST not found. Run 'npm run build' first." >&2
  exit 1
fi

# Resolve the `/` route's first-load JS chunk list (deduped) via node (a dep
# already). Combines every entryJSFiles array for "/page" with rootMainFiles.
CHUNKS=$(node -e '
  global.self = global;
  require("./" + process.argv[1]);
  const rsc = (self.__RSC_MANIFEST && self.__RSC_MANIFEST["/page"]) || null;
  if (!rsc || !rsc.entryJSFiles) {
    process.stderr.write("no-rsc-page-entry\n");
    process.exit(3);
  }
  const set = new Set();
  for (const arr of Object.values(rsc.entryJSFiles)) {
    if (Array.isArray(arr)) arr.forEach((f) => set.add(f));
  }
  const bm = JSON.parse(require("fs").readFileSync(process.argv[2], "utf8"));
  (bm.rootMainFiles || []).forEach((f) => set.add(f));
  process.stdout.write([...set].join("\n"));
' "$RSC_MANIFEST" "$BUILD_MANIFEST") || {
  echo "FAIL  could not read / chunk list from $RSC_MANIFEST" >&2
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

if [ "$TOTAL" -le 0 ]; then
  echo "FAIL  resolved 0 bytes of / chunks; manifest shape may have changed." >&2
  exit 1
fi

if [ "$TOTAL" -gt "$ROUTE_JS_BUDGET_BYTES" ]; then
  echo "FAIL  / First-Load-JS: $TOTAL bytes > $ROUTE_JS_BUDGET_BYTES bytes budget" >&2
  exit 1
fi

PCT=$(( TOTAL * 100 / ROUTE_JS_BUDGET_BYTES ))
echo "PASS  / First-Load-JS: $TOTAL bytes ($PCT% of $ROUTE_JS_BUDGET_BYTES budget)"
exit 0
