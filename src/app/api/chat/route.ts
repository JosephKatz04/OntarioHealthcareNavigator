import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import { evaluateChatGuardrails } from "@/lib/chat/guardrails";
import {
  appendTranslationNote,
  normalizeSupportedLanguage
} from "@/lib/chat/languages";
import { searchChunks, type RagSearchResult } from "@/lib/rag/searchChunks";

type ConfidenceState = "emergency" | "low" | "medium" | "high";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    search_results?: FileSearchResult[];
    results?: FileSearchResult[];
    content?: Array<{
      type?: string;
      text?: string;
      annotations?: FileCitation[];
    }>;
  }>;
};

type ChatSource = {
  id: string;
  title: string;
  organization: string;
  url: string;
  last_checked: string;
};

type FileCitation = {
  type?: string;
  file_id?: string;
  filename?: string;
};

type FileSearchResult = {
  file_id?: string;
  filename?: string;
  attributes?: Record<string, unknown>;
};

type VectorStoreManifest = {
  vector_store_id: string;
  files: Array<{
    file_id: string;
    filename: string;
    source_id: string;
    title: string;
    organization: string;
    url: string;
    last_checked: string;
  }>;
};

const systemPrompt = `You are Ontario Health Navigator.
Help newcomers navigate Ontario healthcare.
Do not diagnose.
Do not give treatment plans.
If emergency, tell user to call 911.
If unsupported by retrieved source material, say: "I could not find that in the current Ontario source library."
Keep answers plain-language and concise.
Answer in the selected language. Keep official organization names recognizable. Keep the emergency number 911 unchanged.

Answer only using retrieved source material. Do not use general knowledge. Do not claim that unverified placeholder chunks contain official guidance. Do not invent eligibility rules, fees, deadlines, required documents, service availability, wait times, or legal requirements.`;

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

function buildNotFoundAnswer() {
  return "I could not find that in the current Ontario source library.";
}

function buildSources(chunks: RagSearchResult[]) {
  const sourcesById = new Map<
    string,
    {
      id: string;
      title: string;
      organization: string;
      url: string;
      last_checked: string;
    }
  >();

  for (const chunk of chunks) {
    sourcesById.set(chunk.source_id, {
      id: chunk.source_id,
      title: chunk.title,
      organization: chunk.organization,
      url: chunk.url,
      last_checked: chunk.last_checked
    });
  }

  return Array.from(sourcesById.values());
}

function loadVectorStoreManifest(): VectorStoreManifest | undefined {
  const manifestPath = resolve(
    process.cwd(),
    "data",
    "source_metadata",
    "vector_store_manifest.json"
  );

  if (!existsSync(manifestPath)) {
    return undefined;
  }

  return JSON.parse(readFileSync(manifestPath, "utf8")) as VectorStoreManifest;
}

function buildVectorSources(response: OpenAIResponse): ChatSource[] {
  const manifest = loadVectorStoreManifest();

  if (!manifest) {
    return [];
  }

  const manifestByFileId = new Map(
    manifest.files.map((file) => [file.file_id, file])
  );
  const manifestByFilename = new Map(
    manifest.files.map((file) => [file.filename, file])
  );
  const sourceMap = new Map<string, ChatSource>();

  function addSource(fileId?: string, filename?: string) {
    const file =
      (fileId ? manifestByFileId.get(fileId) : undefined) ??
      (filename ? manifestByFilename.get(filename) : undefined);

    if (!file) {
      return;
    }

    sourceMap.set(file.source_id, {
      id: file.source_id,
      title: file.title,
      organization: file.organization,
      url: file.url,
      last_checked: file.last_checked
    });
  }

  for (const output of response.output ?? []) {
    for (const result of output.search_results ?? output.results ?? []) {
      addSource(result.file_id, result.filename);
    }

    for (const content of output.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        if (annotation.type === "file_citation") {
          addSource(annotation.file_id, annotation.filename);
        }
      }
    }
  }

  return Array.from(sourceMap.values());
}

function hasFileSearchResults(response: OpenAIResponse) {
  for (const output of response.output ?? []) {
    const results = output.search_results ?? output.results;

    if (Array.isArray(results) && results.length > 0) {
      return true;
    }

    for (const content of output.content ?? []) {
      if (
        content.annotations?.some(
          (annotation) => annotation.type === "file_citation"
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function buildChunkContext(chunks: RagSearchResult[]) {
  return chunks
    .map(
      (chunk, index) => `Source chunk ${index + 1}
source_id: ${chunk.source_id}
title: ${chunk.title}
organization: ${chunk.organization}
url: ${chunk.url}
last_checked: ${chunk.last_checked}
text:
${chunk.text}`
    )
    .join("\n\n---\n\n");
}

async function getOpenAIAnswer(
  message: string,
  language: string,
  chunks: RagSearchResult[]
) {
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
          content: `Selected language: ${language}

Retrieved source chunks:
${buildChunkContext(chunks)}

User message: ${message}

Answer in ${language}. Keep official organization names recognizable. Keep source URLs unchanged. Keep 911 unchanged. Answer only from the retrieved source chunks. If the chunks do not support the answer, say exactly: "${buildNotFoundAnswer()}"`
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

async function getOpenAIFileSearchAnswer(message: string, language: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!vectorStoreId) {
    throw new Error("OPENAI_VECTOR_STORE_ID is not configured.");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";
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
          content: `Selected language: ${language}

User message: ${message}

If the user message is not English, first reformulate the user's healthcare navigation question into English for file_search. Use file_search to retrieve relevant Ontario Health Navigator source material. Answer in ${language}. Keep official organization names recognizable. Keep source URLs unchanged. Keep 911 unchanged. If the retrieved source material does not support the answer, say exactly: "${buildNotFoundAnswer()}"`
        }
      ],
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
          max_num_results: 5
        }
      ],
      include: ["file_search_call.results"]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OpenAIResponse;

  if (!hasFileSearchResults(data)) {
    return {
      answer: buildNotFoundAnswer(),
      sources: [],
      state: "not_found" as const
    };
  }

  const answer = extractOpenAIText(data);

  if (!answer) {
    throw new Error("OpenAI response did not include text.");
  }

  return {
    answer,
    sources: buildVectorSources(data),
    state: "answered" as const
  };
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

  const language = normalizeSupportedLanguage(body.language);
  const guardrail = evaluateChatGuardrails(body.message, language);

  if (guardrail.triggered) {
    return NextResponse.json({
      answer: appendTranslationNote(guardrail.answer ?? buildSafeErrorAnswer(), language),
      sources: [],
      confidence: (guardrail.confidence ?? "low") satisfies ConfidenceState,
      state: guardrail.state
    });
  }

  if (process.env.OPENAI_VECTOR_STORE_ID) {
    try {
      const result = await getOpenAIFileSearchAnswer(
        body.message.trim(),
        language
      );

      return NextResponse.json({
        answer: appendTranslationNote(result.answer, language),
        sources: result.sources,
        confidence:
          result.state === "answered"
            ? ("medium" satisfies ConfidenceState)
            : ("low" satisfies ConfidenceState),
        state: result.state
      });
    } catch (error) {
      console.error("Vector file search chat error:", error);

      return NextResponse.json(
        {
          answer: buildSafeErrorAnswer(),
          sources: [],
          confidence: "low" satisfies ConfidenceState,
          state: "error"
        },
        { status: 503 }
      );
    }
  }

  const retrievedChunks = searchChunks(body.message, 5);
  const sources = buildSources(retrievedChunks);

  if (retrievedChunks.length === 0) {
    return NextResponse.json({
      answer: appendTranslationNote(buildNotFoundAnswer(), language),
      sources: [],
      confidence: "low" satisfies ConfidenceState,
      state: "not_found"
    });
  }

  try {
    const answer = await getOpenAIAnswer(
      body.message.trim(),
      language,
      retrievedChunks
    );

    return NextResponse.json({
      answer: appendTranslationNote(answer, language),
      sources,
      confidence: "medium" satisfies ConfidenceState,
      state: "answered"
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
