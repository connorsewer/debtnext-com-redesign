import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { fintechMeta } from "@/content/solutions-fintech";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${fintechMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: fintechMeta.title });
}
