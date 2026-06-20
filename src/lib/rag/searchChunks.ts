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

const multilingualRetrievalTerms: Record<string, string[]> = {
  "健康卡": ["ohip", "health", "card"],
  "医疗卡": ["ohip", "health", "card"],
  "申请": ["apply", "application"],
  "家庭医生": ["family", "doctor", "primary", "care"],
  "医生": ["doctor", "physician"],
  "急诊": ["emergency", "911"],
  "心理健康": ["mental", "health", "support"],
  "新移民": ["newcomer", "settlement"],
  "carte santé": ["ohip", "health", "card"],
  "médecin de famille": ["family", "doctor"],
  "urgence": ["emergency", "911"],
  "santé mentale": ["mental", "health"],
  "tarjeta de salud": ["ohip", "health", "card"],
  "médico de familia": ["family", "doctor"],
  "emergencia": ["emergency", "911"],
  "salud mental": ["mental", "health"],
  "بطاقة صحية": ["ohip", "health", "card"],
  "طبيب الأسرة": ["family", "doctor"],
  "طوارئ": ["emergency", "911"],
  "الصحة النفسية": ["mental", "health"],
  "स्वास्थ्य कार्ड": ["ohip", "health", "card"],
  "फैमिली डॉक्टर": ["family", "doctor"],
  "आपातकाल": ["emergency", "911"],
  "मानसिक स्वास्थ्य": ["mental", "health"],
  "ہیلتھ کارڈ": ["ohip", "health", "card"],
  "فیملی ڈاکٹر": ["family", "doctor"],
  "ایمرجنسی": ["emergency", "911"],
  "دماغی صحت": ["mental", "health"],
  "ਸਿਹਤ ਕਾਰਡ": ["ohip", "health", "card"],
  "ਫੈਮਿਲੀ ਡਾਕਟਰ": ["family", "doctor"],
  "ਐਮਰਜੈਂਸੀ": ["emergency", "911"],
  "ਮਾਨਸਿਕ ਸਿਹਤ": ["mental", "health"],
  "health card": ["ohip", "health", "card"],
  "family doctor": ["family", "doctor"],
  "mental health": ["mental", "health"],
  "doktor ng pamilya": ["family", "doctor"],
  "emerhensiya": ["emergency", "911"],
  "kalusugang pangkaisipan": ["mental", "health"]
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
  const queryTokens = expandTokens(tokenize(buildEnglishRetrievalQuery(query)));

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

export function buildEnglishRetrievalQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  const expandedTerms: string[] = [];

  for (const [term, englishTerms] of Object.entries(multilingualRetrievalTerms)) {
    if (lowerQuery.includes(term.toLowerCase())) {
      expandedTerms.push(...englishTerms);
    }
  }

  return [query, ...expandedTerms].join(" ");
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
