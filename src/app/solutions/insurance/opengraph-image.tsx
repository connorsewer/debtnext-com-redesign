import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { insuranceMeta } from "@/content/solutions-insurance";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${insuranceMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: insuranceMeta.title });
}
