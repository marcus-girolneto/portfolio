import { cloneElement, isValidElement, type ReactNode } from "react";
export const locales = ["en", "pt", "es", "de", "fr", "zh"] as const;
export type Locale = (typeof locales)[number];
export type Messages = Record<string, string>;
export type Language = { locale: Locale; messages: Messages };
export const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  zh: "简体中文",
};
export const dateLocales: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
  zh: "zh-CN",
};
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  pt: "pt_BR",
  es: "es_ES",
  de: "de_DE",
  fr: "fr_FR",
  zh: "zh_CN",
};
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
export function translate(
  language: Language,
  text: string,
  values: Record<string, string | number> = {},
) {
  const key = text.replace(/\s+/g, " ").trim();
  const translated = language.messages[key] ?? key;
  const result = translated.replace(/\{(\w+)\}/g, (match, key) =>
    String(values[key] ?? match),
  );
  return text.startsWith(" ")
    ? ` ${result}${text.endsWith(" ") ? " " : ""}`
    : text.endsWith(" ")
      ? `${result} `
      : result;
}
export function localizedPath(locale: Locale, href: string) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    /^\/(?:_next|images|resume|icon|opengraph-image|robots|sitemap)/.test(href)
  )
    return href;
  if (
    locales.some(
      (l) =>
        href === `/${l}` ||
        href.startsWith(`/${l}/`) ||
        href.startsWith(`/${l}#`),
    )
  )
    return href;
  return `/${locale}${href === "/" ? "" : href.replace(/^\/#/, "#")}`;
}
// Localize the rendered presentation tree on the server; client islands use the
// same pure function through LanguageProvider. External data and source names stay intact.
export function localizeTree(node: ReactNode, language: Language): ReactNode {
  if (typeof node === "string") return translate(language, node);
  if (Array.isArray(node))
    return node.map((child, index) => {
      const value = localizeTree(child, language);
      return isValidElement(value) && value.key === null
        ? cloneElement(value, { key: `localized-${index}` })
        : value;
    });
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  const props: Record<string, unknown> = {};
  for (const key of [
    "children",
    "title",
    "label",
    "description",
    "aria-label",
    "alt",
  ]) {
    const value = node.props[key];
    if (value !== undefined)
      props[key] =
        typeof value === "string"
          ? translate(language, value)
          : localizeTree(value as ReactNode, language);
  }
  if (typeof node.props.href === "string")
    props.href = localizedPath(language.locale, node.props.href);
  return cloneElement(node, props);
}
export function languageAlternates(path = "") {
  return Object.fromEntries([
    ...locales.map((locale) => [locale, `/${locale}${path}`]),
    ["x-default", `/en${path}`],
  ]);
}
