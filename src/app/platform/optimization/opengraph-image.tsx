import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { optimizationMeta } from "@/content/optimization";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${optimizationMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: optimizationMeta.title });
}
