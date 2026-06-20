import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chat"
};

export default function ChatPage() {
  return <PageContent page={pages.chat} />;
}
