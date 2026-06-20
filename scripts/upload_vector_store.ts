import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type ProcessedChunk = {
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

type VectorStoreResponse = {
  id: string;
};

type FileResponse = {
  id: string;
  filename?: string;
};

type VectorStoreFileResponse = {
  id: string;
  status?: string;
};

type VectorStoreManifest = {
  vector_store_id: string;
  created_at: string;
  files: Array<{
    file_id: string;
    vector_store_file_id: string;
    filename: string;
    chunk_id: string;
    source_id: string;
    title: string;
    organization: string;
    url: string;
    category: string;
    language: string;
    last_checked: string;
  }>;
};

const envLocalPath = resolve(process.cwd(), ".env.local");
const envPath = resolve(process.cwd(), ".env");
const chunksPath = resolve(process.cwd(), "data", "processed_chunks", "chunks.json");
const manifestPath = resolve(
  process.cwd(),
  "data",
  "source_metadata",
  "vector_store_manifest.json"
);

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function updateEnvLocal(key: string, value: string) {
  const existing = existsSync(envLocalPath)
    ? readFileSync(envLocalPath, "utf8")
    : "";
  const lines = existing.split(/\r?\n/);
  let replaced = false;
  const nextLines = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      replaced = true;
      return `${key}=${value}`;
    }

    return line;
  });

  if (!replaced) {
    if (nextLines.length > 0 && nextLines[nextLines.length - 1] !== "") {
      nextLines.push("");
    }

    nextLines.push(`${key}=${value}`);
  }

  writeFileSync(envLocalPath, `${nextLines.filter(Boolean).join("\n")}\n`);
}

async function openaiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required in .env.local or the shell environment.");
  }

  const response = await fetch(`https://api.openai.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${path} failed with ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
}

function chunkToMarkdown(chunk: ProcessedChunk) {
  return `---
chunk_id: ${chunk.chunk_id}
source_id: ${chunk.source_id}
title: ${chunk.title}
organization: ${chunk.organization}
url: ${chunk.url}
category: ${chunk.category}
language: ${chunk.language}
last_checked: ${chunk.last_checked}
---

${chunk.text}
`;
}

async function createVectorStore() {
  return openaiFetch<VectorStoreResponse>("/vector_stores", {
    method: "POST",
    body: JSON.stringify({
      name: `Ontario Health Navigator sources ${new Date().toISOString()}`
    })
  });
}

async function uploadChunkFile(chunk: ProcessedChunk) {
  const filename = `${chunk.chunk_id}.md`;
  const form = new FormData();
  const file = new File([chunkToMarkdown(chunk)], filename, {
    type: "text/markdown"
  });

  form.append("purpose", "assistants");
  form.append("file", file);

  const uploaded = await openaiFetch<FileResponse>("/files", {
    method: "POST",
    body: form
  });

  return {
    ...uploaded,
    filename
  };
}

async function attachFileToVectorStore(
  vectorStoreId: string,
  fileId: string,
  chunk: ProcessedChunk
) {
  return openaiFetch<VectorStoreFileResponse>(
    `/vector_stores/${vectorStoreId}/files`,
    {
      method: "POST",
      body: JSON.stringify({
        file_id: fileId,
        attributes: {
          chunk_id: chunk.chunk_id,
          source_id: chunk.source_id,
          title: chunk.title,
          organization: chunk.organization,
          url: chunk.url,
          category: chunk.category,
          language: chunk.language,
          last_checked: chunk.last_checked
        }
      })
    }
  );
}

loadEnvFile(envLocalPath);
loadEnvFile(envPath);

const chunks = JSON.parse(readFileSync(chunksPath, "utf8")) as ProcessedChunk[];

if (chunks.length === 0) {
  throw new Error("No chunks found. Run npm run ingest before uploading.");
}

const vectorStore = await createVectorStore();
const manifest: VectorStoreManifest = {
  vector_store_id: vectorStore.id,
  created_at: new Date().toISOString(),
  files: []
};

for (const chunk of chunks) {
  const uploadedFile = await uploadChunkFile(chunk);
  const vectorStoreFile = await attachFileToVectorStore(
    vectorStore.id,
    uploadedFile.id,
    chunk
  );

  manifest.files.push({
    file_id: uploadedFile.id,
    vector_store_file_id: vectorStoreFile.id,
    filename: uploadedFile.filename,
    chunk_id: chunk.chunk_id,
    source_id: chunk.source_id,
    title: chunk.title,
    organization: chunk.organization,
    url: chunk.url,
    category: chunk.category,
    language: chunk.language,
    last_checked: chunk.last_checked
  });

  console.log(`Uploaded ${uploadedFile.filename} -> ${uploadedFile.id}`);
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
updateEnvLocal("OPENAI_VECTOR_STORE_ID", vectorStore.id);

console.log(`Created vector store: ${vectorStore.id}`);
console.log(`Updated .env.local with OPENAI_VECTOR_STORE_ID=${vectorStore.id}`);
console.log(`Wrote manifest: ${manifestPath}`);
