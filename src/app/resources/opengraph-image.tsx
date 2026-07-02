import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { resourcesMeta } from "@/content/resources";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${resourcesMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: resourcesMeta.title });
}
