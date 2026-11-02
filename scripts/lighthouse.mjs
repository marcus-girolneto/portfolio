import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3179";
await mkdir("docs/qa", { recursive: true });
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--disable-gpu", "--no-first-run"],
});
try {
  for (const profile of ["mobile", "desktop"]) {
    const result = await lighthouse(base, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(profile === "desktop"
        ? {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
          }
        : {}),
    });
    if (!result) throw new Error("Lighthouse did not return a report");
    const { lhr } = result;
    const summary = {
      url: lhr.finalDisplayedUrl,
      fetchedAt: lhr.fetchTime,
      profile,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([k, v]) => [
          k,
          Math.round((v.score || 0) * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "cumulative-layout-shift",
          "total-blocking-time",
          "speed-index",
        ].map((k) => [k, lhr.audits[k]?.displayValue]),
      ),
      opportunities: Object.values(lhr.audits)
        .filter(
          (a) =>
            a.score !== null &&
            a.score < 1 &&
            a.details?.type === "opportunity",
        )
        .map((a) => ({
          id: a.id,
          title: a.title,
          displayValue: a.displayValue,
        })),
    };
    await writeFile(
      `docs/qa/lighthouse-${profile}.json`,
      JSON.stringify(summary, null, 2) + "\n",
    );
    console.log(summary);
  }
} finally {
  await chrome.kill();
}
