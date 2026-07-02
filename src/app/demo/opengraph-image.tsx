import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { demoMeta } from "@/content/demo";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${demoMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: demoMeta.title });
}
