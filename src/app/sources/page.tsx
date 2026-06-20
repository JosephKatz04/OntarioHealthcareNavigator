import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sources"
};

export default function SourcesPage() {
  return <PageContent page={pages.sources} />;
}
