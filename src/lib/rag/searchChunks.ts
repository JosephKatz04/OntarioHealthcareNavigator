import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type RagChunk = {
  chunk_id: string;
  source_id: string;
  title: string;
  organization: string;
  url: string;
  category: string;
  language: string;
  last_checked: string;
  text: string;
};

export type RagSearchResult = RagChunk & {
  score: number;
};

let cachedChunks: RagChunk[] | undefined;

const stopwords = new Set([
  "a",
  "about",
  "and",
  "are",
  "can",
  "do",
  "for",
  "get",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "when",
  "where",
  "with"
]);

const synonymMap: Record<string, string[]> = {
  "911": ["emergency", "urgent"],
  addiction: ["connexontario", "mental"],
  addictions: ["connexontario", "mental"],
  doctor: ["physician", "practitioner", "primary"],
  emergency: ["911", "urgent"],
  family: ["doctor", "physician"],
  health811: ["health", "811"],
  immigrant: ["newcomer", "settlement"],
  immigrants: ["newcomer", "settlement"],
  newcomer: ["settlement", "immigrant"],
  newcomers: ["settlement", "immigrant"],
  ohip: ["health", "card", "coverage"],
  support: ["services", "help"]
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopwords.has(token));
}

function expandTokens(tokens: string[]): Set<string> {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const synonym of synonymMap[token] ?? []) {
      expanded.add(synonym);
    }
  }

  return expanded;
}

function scoreChunk(queryTokens: Set<string>, chunk: RagChunk): number {
  const searchableText = [
    chunk.source_id,
    chunk.title,
    chunk.organization,
    chunk.category,
    chunk.text
  ].join(" ");
  const chunkTokens = new Set(tokenize(searchableText));
  let score = 0;

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) {
      score += 1;
    }

    if (chunk.source_id.toLowerCase().includes(token)) {
      score += 2;
    }

    if (chunk.title.toLowerCase().includes(token)) {
      score += 2;
    }

    if (chunk.category.toLowerCase().includes(token)) {
      score += 1;
    }
  }

  return score;
}

export function searchChunks(query: string, limit = 5): RagSearchResult[] {
  const chunks = loadChunks();
  const queryTokens = expandTokens(tokenize(query));

  if (queryTokens.size === 0) {
    return [];
  }

  return chunks
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(queryTokens, chunk)
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk_id.localeCompare(b.chunk_id))
    .slice(0, limit);
}

function loadChunks(): RagChunk[] {
  if (!cachedChunks) {
    const chunksPath = resolve(
      process.cwd(),
      "data",
      "processed_chunks",
      "chunks.json"
    );
    cachedChunks = JSON.parse(readFileSync(chunksPath, "utf8")) as RagChunk[];
  }

  return cachedChunks;
}
