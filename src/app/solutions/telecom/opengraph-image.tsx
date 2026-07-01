import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { telecomMeta } from "@/content/solutions-telecom";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${telecomMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: telecomMeta.title });
}
