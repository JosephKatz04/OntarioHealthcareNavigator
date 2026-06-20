import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const requiredFrontmatterFields = [
  "source_id",
  "title",
  "organization",
  "url",
  "category",
  "language",
  "last_checked"
] as const;

type SourceFrontmatter = Record<
  (typeof requiredFrontmatterFields)[number],
  string
>;

type ProcessedChunk = SourceFrontmatter & {
  chunk_id: string;
  text: string;
};

const rawSourcesDir = resolve(process.cwd(), "data", "raw_sources");
const chunksDir = resolve(process.cwd(), "data", "processed_chunks");
const chunksPath = join(chunksDir, "chunks.json");

function parseFrontmatter(fileName: string, content: string): {
  frontmatter: SourceFrontmatter;
  body: string;
} {
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    throw new Error(
      `${fileName} is missing YAML frontmatter. Add a --- block at the top.`
    );
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(
      `${fileName} has invalid frontmatter. Expected opening and closing --- lines.`
    );
  }

  const [, frontmatterText, body] = match;
  const parsed: Record<string, string> = {};

  for (const line of frontmatterText.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(
        `${fileName} has invalid frontmatter line "${line}". Use key: value.`
      );
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    parsed[key] = value.replace(/^["']|["']$/g, "");
  }

  for (const field of requiredFrontmatterFields) {
    if (!parsed[field]) {
      throw new Error(
        `${fileName} is missing required frontmatter field "${field}".`
      );
    }
  }

  if (!parsed.url.startsWith("https://")) {
    throw new Error(`${fileName} frontmatter url must start with https://.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed.last_checked)) {
    throw new Error(
      `${fileName} frontmatter last_checked must use YYYY-MM-DD format.`
    );
  }

  return {
    frontmatter: parsed as SourceFrontmatter,
    body: body.trim()
  };
}

function splitIntoChunks(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");

  if (normalized.trim() === "") {
    return [];
  }

  const minLength = 1800;
  const maxLength = 3600;
  const paragraphs = normalized.split(/\n\s*\n/).map((part) => part.trim());
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      continue;
    }

    const next = current ? `${current}\n\n${paragraph}` : paragraph;

    if (next.length <= maxLength) {
      current = next;
      continue;
    }

    if (current.length >= minLength) {
      chunks.push(current);
      current = paragraph;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    current = paragraph;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function makeChunkId(sourceId: string, index: number): string {
  return `${sourceId}__chunk_${String(index + 1).padStart(3, "0")}`;
}

const markdownFiles = readdirSync(rawSourcesDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .sort();

if (markdownFiles.length === 0) {
  throw new Error("No markdown files found in data/raw_sources.");
}

const chunks: ProcessedChunk[] = [];

for (const fileName of markdownFiles) {
  const filePath = join(rawSourcesDir, fileName);
  const content = readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(fileName, content);
  const textChunks = splitIntoChunks(body);

  if (textChunks.length === 0) {
    throw new Error(`${fileName} does not contain any body text to chunk.`);
  }

  textChunks.forEach((text, index) => {
    chunks.push({
      chunk_id: makeChunkId(frontmatter.source_id, index),
      ...frontmatter,
      text
    });
  });
}

mkdirSync(chunksDir, { recursive: true });
writeFileSync(chunksPath, `${JSON.stringify(chunks, null, 2)}\n`);

console.log(
  `Created ${chunks.length} chunks from ${markdownFiles.length} source documents at ${chunksPath}.`
);
console.log(
  `Sources: ${markdownFiles.map((fileName) => basename(fileName)).join(", ")}`
);
