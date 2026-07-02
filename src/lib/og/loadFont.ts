import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Loads the self-hosted General Sans SemiBold for Satori (next/og).
 *
 * Satori can't read next/font's hashed CSS variable, so the OG route
 * hands it the raw font bytes. Satori also can't decode woff2 (it errors
 * with "Unsupported OpenType signature wOF2"), so we ship a TrueType copy
 * of the exact same face (decompressed from GeneralSans-Semibold.woff2,
 * the file that backs the site wordmark) alongside it. The card
 * typography matches the live surface; there is no second typeface.
 * Node runtime only.
 */
export async function loadGeneralSans(): Promise<ArrayBuffer> {
  const fontPath = path.join(
    process.cwd(),
    "src/app/fonts/GeneralSans-Semibold.ttf"
  );
  const buffer = await readFile(fontPath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}
