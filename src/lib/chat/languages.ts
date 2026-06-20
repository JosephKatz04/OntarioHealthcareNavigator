export const supportedLanguages = [
  "English",
  "French",
  "Mandarin Chinese",
  "Punjabi",
  "Arabic",
  "Hindi",
  "Urdu",
  "Spanish",
  "Tagalog"
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export function normalizeSupportedLanguage(value: unknown): SupportedLanguage {
  if (
    typeof value === "string" &&
    supportedLanguages.includes(value as SupportedLanguage)
  ) {
    return value as SupportedLanguage;
  }

  return "English";
}

export function isEnglish(language: SupportedLanguage) {
  return language === "English";
}

export function appendTranslationNote(
  answer: string,
  language: SupportedLanguage
) {
  if (isEnglish(language)) {
    return answer;
  }

  return `${answer}\n\nThis answer was generated from Ontario source documents and translated for convenience.`;
}
