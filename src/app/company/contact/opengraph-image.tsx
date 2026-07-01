import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { contactMeta } from "@/content/company-contact";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${contactMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: contactMeta.title });
}
