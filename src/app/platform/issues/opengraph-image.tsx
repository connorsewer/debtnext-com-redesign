import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { issuesMeta } from "@/content/issues";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${issuesMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: issuesMeta.title });
}
