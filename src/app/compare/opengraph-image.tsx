import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { compareMeta } from "@/content/compare";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${compareMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: compareMeta.title });
}
