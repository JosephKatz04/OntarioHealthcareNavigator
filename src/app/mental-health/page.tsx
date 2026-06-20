import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mental Health"
};

export default function MentalHealthPage() {
  return <PageContent page={pages["mental-health"]} />;
}
