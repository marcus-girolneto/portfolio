import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function choosePreference(page: Page, label: string, option: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.getByRole("menuitemradio", { name: option, exact: true }).click();
}
test("six server-rendered languages, corrected identity and a real portrait", async ({
  page,
  request,
}) => {
  const headings = {
    en: "Engineering",
    pt: "Engenharia",
    es: "Ingeniería",
    de: "Komplexe",
    fr: "Concevoir",
    zh: "构建",
  };
  for (const [locale, heading] of Object.entries(headings)) {
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      heading,
    );
    await expect(page.locator(".hero-full-name")).toHaveText(
      "Marcus Vinicius Girolneto Sousa",
    );
    const image = page.getByAltText("Marcus Vinicius Girolneto Sousa");
    await expect(image).toHaveCount(1);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto(`/${locale}/projects/arconta`);
    await expect(page.locator("article.case-prose h2").first()).not.toBeEmpty();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const response = await request.get("/de");
  const html = await response.text();
  expect(html).toContain('hrefLang="pt"');
  expect(html).toContain("Marcus Vinicius Girolneto Sousa");
});
test("language switch preserves the case-study destination and changes html language", async ({
  page,
}) => {
  await page.goto("/en/projects/ledger");
  await choosePreference(page, "Language", "Português");
  await expect(page).toHaveURL(/\/pt\/projects\/ledger$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
  await expect(
    page.getByRole("heading", { name: "O problema de engenharia" }),
  ).toBeVisible();
  await choosePreference(page, "Idioma", "Deutsch");
  await expect(page).toHaveURL(/\/de\/projects\/ledger$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await page.goto("/");
  await expect(page).toHaveURL(/\/de$/);
});
test("light and dark preferences persist, support system changes, and remain accessible", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await choosePreference(page, "Color theme", "Light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-light.png`,
    fullPage: true,
    animations: "disabled",
  });
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ html: n.html, summary: n.failureSummary })),
    })),
  ).toEqual([]);
  await choosePreference(page, "Color theme", "Dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await choosePreference(page, "Color theme", "System");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
