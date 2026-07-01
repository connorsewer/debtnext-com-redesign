import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { homepageMeta } from "@/content/homepage";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${homepageMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: homepageMeta.title });
}
