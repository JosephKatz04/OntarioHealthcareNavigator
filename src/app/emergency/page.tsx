import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Emergency Care"
};

export default function EmergencyPage() {
  return <PageContent page={pages.emergency} />;
}
