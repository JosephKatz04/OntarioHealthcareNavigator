"use client";

import { FormEvent, useMemo, useState } from "react";
import { supportedLanguages } from "@/lib/chat/languages";

type ChatSource = {
  id: string;
  title: string;
  organization: string;
  url: string;
  last_checked: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: ChatSource[];
  confidence?: "emergency" | "low" | "medium" | "high";
};

const starterQuestions = [
  "How do I apply for OHIP?",
  "I do not have a family doctor. What should I do?",
  "When should I call 911?",
  "Where can I get mental health support?",
  "What services are available for newcomers?"
];

function makeMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello. I can help you find newcomer-friendly Ontario healthcare information. Answers must be grounded in Ontario source documents and are not medical advice."
    }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isSending, setIsSending] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  );

  async function sendMessage(text: string) {
    const trimmed = text.trim();

    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: makeMessageId(),
      role: "user",
      text: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed,
          language
        })
      });

      const data = (await response.json()) as {
        answer: string;
        sources: ChatSource[];
        confidence: "emergency" | "low" | "medium" | "high";
      };

      if (!data.answer) {
        throw new Error("Chat response did not include an answer.");
      }

      setMessages((current) => [
        ...current,
        {
          id: makeMessageId(),
          role: "assistant",
          text: data.answer,
          sources: data.sources,
          confidence: data.confidence
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: makeMessageId(),
          role: "assistant",
          text: "Sorry, the chat could not respond safely right now. Please verify information with official Ontario sources. If this is a medical emergency, call 911.",
          confidence: "low"
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <main id="main-content" className="bg-slate-50">
      <section className="border-b border-red-200 bg-red-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-base font-bold text-brand-red">
            If this is a medical emergency, call 911.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div className="min-h-[34rem] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Guided help
            </p>
            <h1 className="mt-2 text-3xl font-bold text-brand-ink">
              Healthcare Navigation Chat
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              Ask a general navigation question. This MVP uses a mock response
              only when source retrieval or the AI service is unavailable.
            </p>
          </div>

          <div
            aria-live="polite"
            className="flex max-h-[34rem] flex-col gap-5 overflow-y-auto px-5 py-6"
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={`max-w-3xl rounded-lg px-5 py-4 ${
                  message.role === "user"
                    ? "ml-auto bg-brand-blue text-white"
                    : "mr-auto border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <p className="text-sm font-bold">
                  {message.role === "user" ? "You" : "Ontario Health Navigator"}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-base leading-7">
                  {message.text}
                </p>

                {message.role === "assistant" && message.confidence ? (
                  <p className="mt-3 inline-flex rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                    Confidence: {message.confidence}
                  </p>
                ) : null}

                {message.sources && message.sources.length > 0 ? (
                  <div className="mt-4 grid gap-3">
                    {message.sources.map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-slate-200 bg-white p-4 text-slate-800 shadow-sm hover:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
                          {source.organization}
                        </p>
                        <h2 className="mt-1 text-base font-bold">
                          {source.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Last checked: {source.last_checked}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white px-5 py-5"
          >
            <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">
              Do not enter your health card number, immigration document number,
              address, or private medical details.
            </p>
            <label
              htmlFor="chat-message"
              className="text-sm font-semibold text-slate-800"
            >
              Your question
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <textarea
                id="chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                className="min-h-24 flex-1 rounded-md border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                placeholder="Ask a general healthcare navigation question"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex items-center justify-center rounded-md bg-brand-blue px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-slate-400 sm:self-end"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <label
              htmlFor="chat-language"
              className="text-sm font-semibold text-slate-800"
            >
              Language
            </label>
            <select
              id="chat-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            >
              {supportedLanguages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-brand-ink">
              Suggested questions
            </h2>
            <div className="mt-4 grid gap-3">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="rounded-md border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-800 hover:border-brand-blue hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {question}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-brand-ink">Chat limits</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              This mock chat does not diagnose conditions, recommend treatment,
              decide eligibility, or make emergency decisions. Future AI answers
              must be grounded in retrieved sources.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
