import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { locales, localizedPath, translate } from "../src/lib/i18n";
import { projects } from "../src/content/projects";
import pt from "../src/content/locales/pt.json";
import es from "../src/content/locales/es.json";
import de from "../src/content/locales/de.json";
import fr from "../src/content/locales/fr.json";
import zh from "../src/content/locales/zh.json";
describe("localization coverage", () => {
  it("provides matching nonempty messages in all five translated catalogs", () => {
    const keys = Object.keys(pt).sort();
    for (const catalog of [es, de, fr, zh])
      expect(Object.keys(catalog).sort()).toEqual(keys);
    for (const catalog of [pt, es, de, fr, zh])
      expect(
        Object.values(catalog).every((value) => value.trim().length > 0),
      ).toBe(true);
  });
  it("has a case study for every project in every locale", () => {
    for (const locale of locales)
      for (const project of projects)
        expect(
          existsSync(
            join(
              process.cwd(),
              "src/content/cases",
              locale === "en" ? "" : locale,
              `${project.slug}.mdx`,
            ),
          ),
        ).toBe(true);
  });
  it("keeps downloads, external links and already localized paths intact", () => {
    expect(localizedPath("de", "/#work")).toBe("/de#work");
    expect(localizedPath("pt", "/projects/ledger")).toBe("/pt/projects/ledger");
    expect(localizedPath("pt", "/resume/file.pdf")).toBe("/resume/file.pdf");
    expect(localizedPath("pt", "https://github.com")).toBe(
      "https://github.com",
    );
    expect(localizedPath("pt", "/de/projects/ledger")).toBe(
      "/de/projects/ledger",
    );
  });
  it("interpolates translated dynamic status without losing values", () => {
    expect(
      translate({ locale: "pt", messages: pt }, "Read {name} case study", {
        name: "Ledger",
      }),
    ).toBe("Ler estudo de caso de Ledger");
  });
});
