import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy"
};

export default function PrivacyPage() {
  return <PageContent page={pages.privacy} />;
}
