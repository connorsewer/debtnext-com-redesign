import type { Metadata } from "next";

import { Hero } from "@/components/sections/Hero";
import { homepageMeta } from "@/content/homepage";

export const metadata: Metadata = {
  title: homepageMeta.title,
  description: homepageMeta.description,
  alternates: { canonical: homepageMeta.canonical },
};

export default function HomePage() {
  return <Hero />;
}
