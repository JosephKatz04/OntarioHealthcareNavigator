import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Healthcare Works"
};

export default function HowHealthcareWorksPage() {
  return <PageContent page={pages["how-healthcare-works"]} />;
}
