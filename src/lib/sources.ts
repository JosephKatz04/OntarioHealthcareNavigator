import sourcesData from "../../data/sources.json";

export const sourceCategories = [
  "community_services",
  "emergency_care",
  "health_coverage",
  "health_navigation",
  "home_and_community_care",
  "mental_health_addictions",
  "newcomer_support",
  "primary_care"
] as const;

export const reliabilityLevels = [
  "official_government",
  "official_health_system",
  "government_directory",
  "reputable_nonprofit"
] as const;

export type SourceCategory = (typeof sourceCategories)[number];
export type ReliabilityLevel = (typeof reliabilityLevels)[number];

export type SourceMetadata = {
  id: string;
  title: string;
  organization: string;
  url: string;
  category: SourceCategory;
  jurisdiction: string;
  language: string;
  last_checked: string;
  reliability_level: ReliabilityLevel;
  notes: string;
};

export const sources = sourcesData as SourceMetadata[];

export function getSourceById(id: string): SourceMetadata | undefined {
  return sources.find((source) => source.id === id);
}

export function getSourcesByCategory(
  category: SourceCategory
): SourceMetadata[] {
  return sources.filter((source) => source.category === category);
}
