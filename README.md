# Marcus Girolneto — Engineering portfolio

An editorial dark portfolio built with Next.js App Router, strict TypeScript, Tailwind CSS, Motion and original SVG system diagrams. Seven MDX case studies cover AI security, distributed protocols, private products Akibo and Arconta, webhook delivery, transparency logs and financial accounting.

## Local development

Requires Node.js 22+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev -- --port 3179
```

Open http://localhost:3179. Set NEXT_PUBLIC_SITE_URL to the intended production origin before deploying. GITHUB_TOKEN is optional, server-only and used only for public repository metadata.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start -- --port 3179
```

In a second terminal, run `npm run test:e2e`, `npm run check:links`, and `npm run audit:performance`. Browser tests use Google Chrome; install Chrome or change the Playwright channel to an installed browser.

## Structure

- `src/app`: server-rendered routes, metadata, sitemap, robots and social artwork.
- `src/content`: typed profile/project content, original MDX and dated public GitHub fallback.
- `src/components`: presentation components and small client islands for demos and interactions.
- `src/lib`: external-data validation, site configuration, deterministic models and Merkle hashing.
- `public/resume`: supplied resume, unchanged and downloadable.
- `tests`: failure handling, integrity models, responsive flows, accessibility and keyboard behavior.

The Engineering Lab is educational. It does not implement Constellation’s actual consensus protocol or call any paid model API. Project previews are conceptual views, not product screenshots. Private project code and deployment details are excluded.

Read [creative direction and architecture](docs/CREATIVE-DIRECTION.md), [content inventory](docs/CONTENT-INVENTORY.md), [quality assurance](docs/QA.md), and [Vercel/DNS instructions](docs/DEPLOYMENT.md).

## Languages, identity and appearance

The portfolio is available at `/en`, `/pt`, `/es`, `/de`, `/fr` and `/zh` (Simplified Chinese). Each locale includes the home page and all seven case studies. `/` and legacy `/projects/*` URLs redirect using the saved language or the browser's language preference. Switching languages keeps the current project and anchor. Canonical URLs, hreflang links and the sitemap cover all 48 content pages.

Translations are reviewed local JSON catalogs in `src/content/locales`, with localized MDX in `src/content/cases/<locale>`. Product names, technology identifiers and upstream GitHub descriptions keep their original form. No translation service or API is called at runtime. The supplied resume remains the original English PDF.

The full identity is **Marcus Vinicius Girolneto Sousa**. The photo in `public/images` was obtained from Marcus's public GitHub profile and is served locally through Next.js Image. The shorter display brand remains Marcus Girolneto.

The header offers light, dark and system themes. The default follows the operating system; a manual choice persists locally. A small pre-paint script applies the stored preference to avoid flashing the wrong theme. No account or tracking is involved.

Language and appearance preferences use custom glass menus with local SVG flags, theme preview swatches and active-state indicators. Keyboard support includes arrow keys, Home/End, type-ahead, Escape with focus restoration, and Tab dismissal; menus also close when clicking outside. No external flag assets or dropdown library are required.
