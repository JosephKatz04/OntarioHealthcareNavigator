import { NextResponse } from "next/server";
import { getSourceById } from "@/lib/sources";

type ConfidenceState = "low" | "medium" | "high";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const mockSourceIdsByTopic = {
  ohip: ["ontario-ohip-application", "health811-ontario"],
  doctor: ["health-care-connect", "health811-ontario"],
  emergency: ["ontario-emergency-health-services", "health811-ontario"],
  mentalHealth: ["connexontario", "health811-ontario"],
  newcomer: ["settlement-org-health", "211-ontario", "ircc-newcomer-services-finder"],
  default: ["health811-ontario", "211-ontario"]
} as const;

const systemPrompt = `You are Ontario Health Navigator.
Help newcomers navigate Ontario healthcare.
Do not diagnose.
Do not give treatment plans.
If emergency, tell user to call 911.
If unsupported, say the answer needs to be verified with official sources.
Keep answers plain-language and concise.

Important: There is no vector search connected yet. Do not claim that you retrieved or verified detailed healthcare rules. Do not invent eligibility rules, fees, deadlines, required documents, service availability, wait times, or legal requirements.`;

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

function extractOpenAIText(data: OpenAIResponse): string | undefined {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  for (const output of data.output ?? []) {
    for (const content of output.content ?? []) {
      if (typeof content.text === "string" && content.text.trim()) {
        return content.text.trim();
      }
    }
  }

  return undefined;
}

function buildSafeErrorAnswer() {
  return "I could not answer that safely right now. Please verify the information with official Ontario sources. If this is a medical emergency, call 911.";
}

function getSourcesForMessage(message: string) {
  const topic = chooseTopic(message);
  const sourceIds = mockSourceIdsByTopic[topic];

  return sourceIds
    .map((id) => getSourceById(id))
    .filter((source) => source !== undefined)
    .map((source) => ({
      id: source.id,
      title: source.title,
      organization: source.organization,
      url: source.url,
      last_checked: source.last_checked
    }));
}

async function getOpenAIAnswer(message: string, language: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5.5";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "developer",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Selected language: ${language}\n\nUser message: ${message}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const answer = extractOpenAIText(data);

  if (!answer) {
    throw new Error("OpenAI response did not include text.");
  }

  return answer;
}

export async function POST(request: Request) {
  let body: {
    message?: unknown;
    language?: unknown;
  };

  try {
    body = (await request.json()) as {
      message?: unknown;
      language?: unknown;
    };
  } catch {
    return NextResponse.json(
      {
        answer: buildSafeErrorAnswer(),
        sources: [],
        confidence: "low" satisfies ConfidenceState
      },
      { status: 400 }
    );
  }

  if (typeof body.message !== "string" || body.message.trim() === "") {
    return NextResponse.json(
      {
        answer: "Please enter a healthcare navigation question.",
        sources: [],
        confidence: "low" satisfies ConfidenceState
      },
      { status: 400 }
    );
  }

  const language = typeof body.language === "string" ? body.language : "English";
  const sources = getSourcesForMessage(body.message);

  try {
    const answer = await getOpenAIAnswer(body.message.trim(), language);

    return NextResponse.json({
      answer,
      sources,
      confidence: "low" satisfies ConfidenceState
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        answer: buildSafeErrorAnswer(),
        sources,
        confidence: "low" satisfies ConfidenceState
      },
      { status: 503 }
    );
  }
}
