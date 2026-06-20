import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer"
};

export default function DisclaimerPage() {
  return <PageContent page={pages.disclaimer} />;
}
