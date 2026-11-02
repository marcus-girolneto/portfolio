# Production deployment

## Vercel

This repository uses Next.js App Router, static generation and hourly GitHub revalidation. It needs no database. Use Node.js 22 LTS. Import this checkout into a Vercel project with the Next.js framework preset; install with `npm ci`, build with `npm run build`, and keep the default output directory. Alternatively run the Vercel CLI from this directory and follow its project-linking flow.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before the production build. The default is the preferred domain, `https://marcus-girolneto.dev`, which is not yet registered or connected by this task. For a preview audit, set it to the assigned Vercel origin to avoid preview canonicals pointing at an unowned domain.

`GITHUB_TOKEN` is optional and server-only. Public repository requests work without it; a token may raise the rate limit. Use minimal access and never prefix it with NEXT_PUBLIC or commit it. The site does not need private repository access at runtime. Never configure a private-repository token solely to display public metadata.

All case-study MDX files are local trusted content. The MDX compiler must not be connected to untrusted user input. Vercel’s Next.js output tracing includes the files read during static generation.

## Domain checks before purchase

Preliminary check on November 2, 2026:

| Preferred domain      | RDAP result                          | Porkbun standard renewal / year (USD) | Listed first-year registration (USD) |
| --------------------- | ------------------------------------ | ------------------------------------- | ------------------------------------ |
| marcus-girolneto.dev  | 404, no registration record returned | $12.87                                | $8.75                                |
| marcus-girolneto.io   | 404, no registration record returned | $51.80                                | $28.12                               |
| marcus-girolneto.tech | 404, no registration record returned | $50.98                                | $6.99                                |

Sources: `https://rdap.org/domain/<domain>` and Porkbun’s public pricing API at `https://api.porkbun.com/api/json/v3/pricing/get`. These are TLD list prices, not a binding quote for these exact names. A missing RDAP record is preliminary evidence only: registrar availability, premium designation, taxes and the actual renewal quote must be verified at checkout immediately before registration. No purchase or registration was performed. `.dev` is the preferred choice and uses HSTS preloading, so functioning HTTPS is required.

## DNS and HTTPS

1. Add the selected apex domain and `www` in Vercel Project → Settings → Domains.
2. Vercel will return the exact DNS records for that project. At the registrar, set the apex A/ALIAS and `www` CNAME to those returned targets. Do not assume a shared historical Vercel IP is correct for every project.
3. Remove conflicting apex or `www` records only after reviewing existing services. Preserve email MX/TXT and verification records.
4. Choose one canonical host. Redirect the other host to it with Vercel’s domain configuration. Update NEXT_PUBLIC_SITE_URL to match and redeploy.
5. Wait for Vercel’s DNS verification and automatic TLS issuance. Check apex, www, canonical tags, OG image, robots and sitemap over HTTPS.

No DNS changes were made. DNS propagation and certificate issuance can only be verified after a real deployment and domain connection.

## Cache, security and analytics

- GitHub: one public-list endpoint, Next.js fetch cache and hourly ISR; validated fallback snapshot on rate limiting, invalid data or timeouts.
- Content and six-plus-one case-study routes: prerendered. Metadata and sharing image generated server-side.
- Security headers are configured in next.config.ts. The CSP permits inline scripts/styles required by the current static Next.js output, but no third-party script or connection origins. A future strict nonce CSP would change static-rendering tradeoffs.
- No tracking or analytics by default. If adding analytics, select a privacy-conscious service, document its collection and explicitly update the CSP for the required endpoints.
- Keep package-lock.json committed and use npm ci. `npm audit --omit=dev` found no runtime advisories during validation. Development-only tooling may have separate advisories; review them before changing dependency majors.

## Release verification

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Start production with `npm start -- --port 3179`, then run `npm run test:e2e`, `npm run check:links`, and `npm run audit:performance`. Automated browser tests use installed Google Chrome. Override TEST_BASE_URL for the link and Lighthouse scripts; Playwright baseURL is in its config.

Review docs/QA.md for measured results and limitations. Run Lighthouse again on the deployed URL. Field INP and real-user LCP require production traffic; local lab scores are not field data.

## Localized routes and theme preferences

The app now prerenders six languages and seven case studies per language. `src/proxy.ts` redirects only `/` and legacy `/projects/*` URLs. Explicit locale routes remain static and cacheable. A saved locale cookie takes precedence over Accept-Language for redirects; it does not control access or collect analytics. Translation dictionaries and MDX ship with the application.

Theme preferences use localStorage and `prefers-color-scheme`. The pre-paint inline script is permitted by the existing production CSP. Development alone permits `unsafe-eval` for React debugging; the production policy omits it. The profile photo is local, so the website does not contact GitHub for visitors' image loads.
