import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { solutionsMeta } from "@/content/solutions";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${solutionsMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: solutionsMeta.title });
}
