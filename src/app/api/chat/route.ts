import { NextResponse } from "next/server";
import { getSourceById } from "@/lib/sources";

const mockSourceIdsByTopic = {
  ohip: ["ontario-ohip-application", "health811-ontario"],
  doctor: ["health-care-connect", "health811-ontario"],
  emergency: ["ontario-emergency-health-services", "health811-ontario"],
  mentalHealth: ["connexontario", "health811-ontario"],
  newcomer: ["settlement-org-health", "211-ontario", "ircc-newcomer-services-finder"],
  default: ["health811-ontario", "211-ontario"]
} as const;

function chooseTopic(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("ohip") || normalized.includes("health card")) {
    return "ohip";
  }

  if (
    normalized.includes("family doctor") ||
    normalized.includes("nurse practitioner") ||
    normalized.includes("primary care")
  ) {
    return "doctor";
  }

  if (
    normalized.includes("911") ||
    normalized.includes("emergency") ||
    normalized.includes("urgent")
  ) {
    return "emergency";
  }

  if (
    normalized.includes("mental") ||
    normalized.includes("addiction") ||
    normalized.includes("crisis")
  ) {
    return "mentalHealth";
  }

  if (
    normalized.includes("newcomer") ||
    normalized.includes("immigrant") ||
    normalized.includes("settlement")
  ) {
    return "newcomer";
  }

  return "default";
}

function buildMockAnswer(message: string, language: string) {
  const topic = chooseTopic(message);

  if (topic === "emergency") {
    return `Mock answer (${language}): If this is a medical emergency, call 911. This chat cannot decide whether symptoms are an emergency. For non-emergency navigation, future versions will answer only from retrieved official sources.`;
  }

  return `Mock answer (${language}): This is a safe placeholder response. A future RAG version should retrieve relevant Ontario healthcare sources, answer only from those sources, and cite them. If the source library does not support the answer, it should say the information was not found.`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: unknown;
    language?: unknown;
  };

  if (typeof body.message !== "string" || body.message.trim() === "") {
    return NextResponse.json(
      { error: "A message is required." },
      { status: 400 }
    );
  }

  const language = typeof body.language === "string" ? body.language : "English";
  const topic = chooseTopic(body.message);
  const sourceIds = mockSourceIdsByTopic[topic];
  const sources = sourceIds
    .map((id) => getSourceById(id))
    .filter((source) => source !== undefined)
    .map((source) => ({
      id: source.id,
      title: source.title,
      organization: source.organization,
      url: source.url,
      last_checked: source.last_checked
    }));

  return NextResponse.json({
    answer: buildMockAnswer(body.message, language),
    sources
  });
}
