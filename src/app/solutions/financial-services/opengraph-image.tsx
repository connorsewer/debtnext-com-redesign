import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { financialServicesMeta } from "@/content/solutions-financial-services";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${financialServicesMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: financialServicesMeta.title });
}
