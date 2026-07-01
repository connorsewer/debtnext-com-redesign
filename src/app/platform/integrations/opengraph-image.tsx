import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { integrationsMeta } from "@/content/integrations";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${integrationsMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: integrationsMeta.title });
}
