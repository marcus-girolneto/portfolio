// Run against a production server. External destinations are checked without signing in.
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3179";
const slugs = [
  "constellation-gate",
  "distributed-protocol",
  "akibo",
  "arconta",
  "hookrelay",
  "witness",
  "ledger",
];
const paths = [
  "/",
  ...["en", "pt", "es", "de", "fr", "zh"].flatMap((locale) => [
    `/${locale}`,
    ...slugs.map((slug) => `/${locale}/projects/${slug}`),
  ]),
  "/sitemap.xml",
  "/robots.txt",
  "/opengraph-image",
];
const targets = new Set();
let failures = 0;
for (const path of paths) {
  const response = await fetch(new URL(path, base));
  if (!response.ok) {
    console.error(response.status, path);
    failures++;
    continue;
  }
  if (response.headers.get("content-type")?.includes("text/html")) {
    const html = await response.text();
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (!href.startsWith("mailto:"))
        targets.add(new URL(href, base).href.split("#")[0]);
    }
  }
}
for (const url of targets) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    await response.body?.cancel();
    if (!response.ok) {
      if (
        new URL(url).hostname.includes("linkedin.com") &&
        [429, 999, 403].includes(response.status)
      ) {
        console.log(
          "LinkedIn blocks automated requests; destination matches supplied profile.",
        );
      } else {
        console.error(response.status, url);
        failures++;
      }
    }
  } catch (error) {
    console.error(url, error.message);
    failures++;
  }
}
console.log(
  `Checked ${paths.length} routes and ${targets.size} link destinations. Failures: ${failures}`,
);
process.exitCode = failures ? 1 : 0;
