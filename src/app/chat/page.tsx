import type { Metadata } from "next";
import { ChatInterface } from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "Chat"
};

export default function ChatPage() {
  return <ChatInterface />;
}
