import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { platformMeta } from "@/content/platform";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${platformMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: platformMeta.title });
}
