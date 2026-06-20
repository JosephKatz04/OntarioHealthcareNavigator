import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return <PageContent page={pages.about} />;
}
