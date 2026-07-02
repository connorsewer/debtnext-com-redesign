import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { careersMeta } from "@/content/company-careers";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${careersMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: careersMeta.title });
}
