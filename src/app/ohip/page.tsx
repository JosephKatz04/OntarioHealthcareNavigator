import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "OHIP"
};

export default function OhipPage() {
  return <PageContent page={pages.ohip} />;
}
