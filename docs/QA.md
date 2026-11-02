# Quality assurance

Validated November 2, 2026 against a local production build of Next.js 16.4.4 on Node.js 22.22.0. Measurements are local lab results, not field guarantees.

## Current release

- Six languages: English, Brazilian Portuguese, Spanish, German, French and Simplified Chinese. Home and all seven case studies are available in each language: 48 content pages.
- Corrected full name: **Marcus Vinicius Girolneto Sousa**, including visible identity, portrait caption, author metadata and structured data.
- Real portrait downloaded from the supplied public GitHub profile, stored locally and optimized with Next.js Image.
- Light, dark and system themes, with pre-paint preference application and local persistence. Language preference redirects preserve explicit locale routes, projects and anchors.

## Verification

- Strict TypeScript, ESLint and production build pass.
- 13 unit tests pass: external-data failure handling, integrity models, translation-key coverage, localized case-file coverage, dynamic interpolation and internal/external path handling.
- 16 Chrome desktop/mobile browser tests pass against `next start`. Includes all six locales, portrait loading, case studies, language switching, saved-language redirects, light/dark persistence, system color changes, accessibility, keyboard navigation, narrow-screen layout and all engineering demos.
- axe found no WCAG 2 A/AA or 2.1 AA violations in the tested home and Witness flows, including the light theme. Automated testing does not replace a complete human accessibility audit.
- Link validation: 52 routes and 64 unique destinations; zero failures.
- Original English resume served unchanged with application/pdf. Its two pages were visually verified with PyMuPDF; the local Poppler renderer produced a blank raster for this supplied file.
- No private project code, credentials or infrastructure details were introduced.

## Latest Lighthouse audit — Portuguese production page

| Profile | Performance | Accessibility | Best practices | SEO | LCP   | CLS | TBT   |
| ------- | ----------- | ------------- | -------------- | --- | ----- | --- | ----- |
| Mobile  | 100         | 100           | 100            | 100 | 1.1 s | 0   | 10 ms |
| Desktop | 100         | 100           | 100            | 100 | 0.3 s | 0   | 0 ms  |

Timestamped summaries are in docs/qa/lighthouse-mobile.json and lighthouse-desktop.json. Remaining opportunities include approximately 62 KiB of unused JavaScript and 11 KiB of unused desktop CSS. Field INP requires real production traffic; TBT is a separate lab indicator.

## Limits and preview

Testing uses installed Chrome with desktop 1440×1000 and Chromium iPhone 13 emulation, plus a 320px check. This is not a physical iOS/Safari, Firefox or low-powered-device test. The native preview browser host was unavailable, so verification used automated Chrome and screenshots.

The development HMR connection initially rejected requests from 127.0.0.1. Configuring the documented allowedDevOrigins for localhost and 127.0.0.1 resolved it; the development theme-persistence/accessibility smoke test now also passes. Production next start passes all 16 browser tests and serves the working preview. Production CSP omits unsafe-eval; development alone permits it for React debugging.

## Deployment

Vercel deployment and custom-domain registration/DNS remain pending. Set the final NEXT_PUBLIC_SITE_URL, deploy and repeat HTTPS audits. The domain guide contains preliminary RDAP and standard renewal checks; exact availability and renewal quote must be reconfirmed before purchase.

## Custom preference menus

Replaced native selects with styled menus, local SVG country flags, theme preview swatches and selected-state checks. All 16 production browser tests pass, including keyboard navigation, Home/End, Escape/focus restoration, Tab dismissal, outside clicks, language persistence and theme changes. Menu accessibility passes axe in light and dark themes; dropdown bounds also pass at 320px. TypeScript, ESLint and the production build pass.
