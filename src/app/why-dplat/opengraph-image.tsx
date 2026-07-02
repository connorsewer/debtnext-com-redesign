import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { whyDplatMeta } from "@/content/why-dplat";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${whyDplatMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: whyDplatMeta.title });
}
