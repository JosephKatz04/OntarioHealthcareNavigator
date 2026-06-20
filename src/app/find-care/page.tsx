import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find Care"
};

export default function FindCarePage() {
  return <PageContent page={pages["find-care"]} />;
}
