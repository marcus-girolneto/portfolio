import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("custom menus support flags, keyboard selection, dismissal and both themes", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt");
  const language = page.getByRole("button", { name: "Idioma", exact: true });
  await expect(language).toBeEnabled();
  await language.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menu", { name: "Idioma", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("menuitemradio")).toHaveCount(6);
  await expect(
    page.getByRole("menuitemradio", { name: "Português", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".language-popover .locale-flag svg")).toHaveCount(
    6,
  );
  expect(
    await page.locator(".language-popover").evaluate((el) => {
      const box = el.getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth;
    }),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-language-menu.png`,
    animations: "disabled",
  });
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.failureSummary),
    })),
  ).toEqual([]);
  await page.keyboard.press("End");
  await expect(
    page.getByRole("menuitemradio", { name: "简体中文", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("menuitemradio", { name: "English", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(language).toBeFocused();
  await expect(page.getByRole("menu")).toHaveCount(0);
  await language.click();
  await page.locator(".hero-topline").click({ position: { x: 0, y: 0 } });
  await expect(page.getByRole("menu")).toHaveCount(0);
  const theme = page.getByRole("button", {
    name: "Tema de cores",
    exact: true,
  });
  await theme.click();
  await expect(page.getByRole("menuitemradio")).toHaveCount(3);
  await page
    .getByRole("menuitemradio", { name: "Escuro", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(theme).toBeFocused();
  await theme.click();
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-theme-menu.png`,
    animations: "disabled",
  });
  const darkAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(darkAxe.violations.map((v) => v.id)).toEqual([]);
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await theme.click();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Vamos conversar/ }),
  ).toBeFocused();
  await page.setViewportSize({ width: 320, height: 740 });
  await language.click();
  expect(
    await page.locator(".language-popover").evaluate((el) => {
      const box = el.getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth;
    }),
  ).toBe(true);
});
