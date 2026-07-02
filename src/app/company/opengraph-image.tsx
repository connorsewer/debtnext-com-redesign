import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { companyMeta } from "@/content/company";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${companyMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: companyMeta.title });
}
