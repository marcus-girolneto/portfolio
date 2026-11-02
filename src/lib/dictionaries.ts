import "server-only";
import type { Language, Locale } from "./i18n";
const loaders = {
  en: async () => ({}),
  pt: () => import("@/content/locales/pt.json").then((m) => m.default),
  es: () => import("@/content/locales/es.json").then((m) => m.default),
  de: () => import("@/content/locales/de.json").then((m) => m.default),
  fr: () => import("@/content/locales/fr.json").then((m) => m.default),
  zh: () => import("@/content/locales/zh.json").then((m) => m.default),
};
export async function getLanguage(locale: Locale): Promise<Language> {
  return { locale, messages: await loaders[locale]() };
}
