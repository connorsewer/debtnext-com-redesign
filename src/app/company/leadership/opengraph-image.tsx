import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/lib/og/template";
import { leadershipMeta } from "@/content/company-leadership";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${leadershipMeta.title} | dPlat`;

export default function Image() {
  return renderOgImage({ title: leadershipMeta.title });
}
