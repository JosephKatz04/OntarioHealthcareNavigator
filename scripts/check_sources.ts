import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredFields = [
  "id",
  "title",
  "organization",
  "url",
  "category",
  "jurisdiction",
  "language",
  "last_checked",
  "reliability_level",
  "notes"
] as const;

const allowedReliabilityLevels = new Set([
  "official_government",
  "official_health_system",
  "government_directory",
  "reputable_nonprofit"
]);

const allowedCategories = new Set([
  "community_services",
  "emergency_care",
  "health_coverage",
  "health_navigation",
  "home_and_community_care",
  "mental_health_addictions",
  "newcomer_support",
  "primary_care"
]);

type SourceRecord = Record<(typeof requiredFields)[number], string>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateSource(value: unknown, index: number): SourceRecord {
  if (!isRecord(value)) {
    throw new Error(`Source at index ${index} must be an object.`);
  }

  for (const field of requiredFields) {
    if (typeof value[field] !== "string" || value[field].trim() === "") {
      throw new Error(
        `Source at index ${index} is missing required string field "${field}".`
      );
    }
  }

  const source = value as SourceRecord;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)) {
    throw new Error(
      `Source "${source.id}" must use kebab-case lowercase letters and numbers.`
    );
  }

  if (!source.url.startsWith("https://")) {
    throw new Error(`Source "${source.id}" must use an https:// URL.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(source.last_checked)) {
    throw new Error(
      `Source "${source.id}" last_checked must use YYYY-MM-DD format.`
    );
  }

  if (!allowedCategories.has(source.category)) {
    throw new Error(
      `Source "${source.id}" has unsupported category "${source.category}".`
    );
  }

  if (!allowedReliabilityLevels.has(source.reliability_level)) {
    throw new Error(
      `Source "${source.id}" has unsupported reliability_level "${source.reliability_level}".`
    );
  }

  return source;
}

const sourcesPath = resolve(process.cwd(), "data", "sources.json");
const parsed = JSON.parse(readFileSync(sourcesPath, "utf8")) as unknown;

if (!Array.isArray(parsed)) {
  throw new Error("data/sources.json must contain an array of source records.");
}

const ids = new Set<string>();
const sources = parsed.map(validateSource);

for (const source of sources) {
  if (ids.has(source.id)) {
    throw new Error(`Duplicate source id "${source.id}".`);
  }

  ids.add(source.id);
}

console.log(`Validated ${sources.length} source metadata entries.`);
