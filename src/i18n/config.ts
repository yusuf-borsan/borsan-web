export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
};

/** A string that exists in every supported locale. */
export type Localized = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
