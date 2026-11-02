# Systems, made visible

## Brand and visual direction

A portfolio that reads like a thoughtful engineering publication and feels like a precision instrument. Lead with “Engineering Complex Systems. Building What Matters.” It combines a clear technical focus with a human reason to build. Alternatives considered: “Correct under pressure” (too narrow for the full career) and “Architecture to operation” (better as supporting copy).

Near-black #080a0e, soft white #f1f3f8, slate #9aa3b5, signal blue #6896ff, pale cyan #83dfdc. Violet appears only within atmospheric diagrams. Geist for editorial typography, Geist Mono for indexes and system annotations. Large type, generous negative space, hairline separators, asymmetric project compositions. No stock photographs or decorative logo wall.

The hero is an original SVG network: connected concentric orbits, restrained traveling signals and a central coordination point. It is crisp, lightweight, readable without JavaScript and responds to pointer movement on desktop. Project previews are conceptual interfaces built with HTML/SVG and explicitly labeled; they are not product screenshots.

Motion: a short CSS entrance sequence; compositor-only signals; native scrolling; one Intersection Observer for optional reveals. Content stays visible when scripting or motion is disabled. Hover uses local pointer coordinates only, never continuous page scroll work. Touch receives the same information without hover.

Mobile: one editorial column, compact navigation with an accessible disclosure, contained diagrams, stacked CTAs and larger tap targets. Avoid tiny desktop dashboards compressed to phone widths.

## Architecture

Next.js App Router + strict TypeScript; server components for content and metadata. Six statically generated /projects/[slug] pages use locally maintained MDX. Client islands handle navigation, copy email, viewport reveals and educational simulations. No application database or paid AI calls.

Content: src/content contains typed project summaries, experience, expertise and original case-study MDX. Public source snapshots in docs/sources support the editorial work. GitHub REST is called once for public repositories with hourly Next.js revalidation and a server-only optional token. Zod validates external data. Verified repository snapshots are dated fallback data; unavailable live data never becomes invented statistics.

SEO: per-page metadata and canonical URLs, dynamic server-generated Open Graph artwork, sitemap, robots and Person/CreativeWork JSON-LD. Production URL is configured by environment. No analytics or trackers by default.

Validation: strict types, ESLint, production build, API fallback and state-machine unit tests, keyboard/mobile/browser checks, axe accessibility and Lighthouse against a production server. Performance scores are recorded measurements, never promises.

## Delivery boundary

This checkout targets the explicitly requested Next.js/Vercel deployment. No Sites hosting registration, domain purchase or DNS mutation is needed to prepare it for deployment. Domain availability and current renewal prices remain a registration-time check; do not assume ownership of the preferred domain.
