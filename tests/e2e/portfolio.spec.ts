import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("responsive home, semantic content, accessibility and downloads", async ({
  page,
  request,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Engineering",
  );
  await expect(page.getByText("Private project", { exact: true })).toHaveCount(
    2,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-hero.png`,
    animations: "disabled",
  });
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-home.png`,
    fullPage: true,
    animations: "disabled",
  });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ html: n.html, summary: n.failureSummary })),
    })),
  ).toEqual([]);
  const pdf = await request.get("/resume/Marcus_Girolneto_Sousa_Resume.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("pdf");
  expect(errors).toEqual([]);
});
test("lab handles timeout, blocked input, dead letters and replay", async ({
  page,
}) => {
  await page.goto("/#lab");
  const lab = page.getByRole("tabpanel");
  await page.getByLabel("Simulate one validator timeout").check();
  await lab.getByRole("button", { name: "Start simulation" }).click();
  await lab.getByRole("button", { name: "Next step" }).click();
  await lab.getByRole("button", { name: "Next step" }).click();
  await expect(lab.getByRole("status")).toContainText("4 of 5");
  await page.getByRole("tab", { name: "AI security pipeline" }).click();
  await page.getByLabel("Example", { exact: true }).selectOption("blocked");
  await lab.getByRole("button", { name: "Start simulation" }).click();
  await lab.getByRole("button", { name: "Next step" }).click();
  await lab.getByRole("button", { name: "Next step" }).click();
  await expect(lab.getByRole("status")).toContainText(
    "Blocked. Provider is never called",
  );
  await page.getByRole("tab", { name: "Webhook reliability" }).click();
  await page.getByLabel("Receiver", { exact: true }).selectOption("persistent");
  await lab.getByRole("button", { name: "Start simulation" }).click();
  for (let i = 0; i < 3; i++)
    await lab.getByRole("button", { name: "Next step" }).click();
  await expect(lab.getByRole("status")).toContainText("dead-letter queue");
  await expect(lab.locator(".pipeline-node.is-done")).toHaveCount(5);
  await lab.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(
    lab.getByRole("button", { name: "Start simulation" }),
  ).toBeEnabled();
});
test("all seven case studies, Merkle integrity and ledger idempotency", async ({
  page,
}) => {
  for (const slug of [
    "constellation-gate",
    "distributed-protocol",
    "akibo",
    "arconta",
    "hookrelay",
    "witness",
    "ledger",
  ]) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Post deposit" }).click();
  await page.getByRole("button", { name: "Replay same request" }).click();
  await expect(page.getByRole("status")).toContainText("Transaction count: 1");
  await page.goto("/projects/witness");
  await expect(page.locator(".root-hash code")).not.toHaveText("computing…");
  const root = await page.locator(".root-hash code").textContent();
  await page.getByLabel("Modify entry 2 and recompute").check();
  await expect(page.locator(".root-hash code")).not.toHaveText(root!);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
});
test("keyboard navigation, reduced motion and narrow viewport", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
  }
  await page.setViewportSize({ width: 320, height: 740 });
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-320.png`,
    animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
