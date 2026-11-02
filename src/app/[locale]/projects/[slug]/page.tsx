import type { Metadata } from "next";
import Link from "next/link";
import { getLanguage } from "@/lib/dictionaries";
import {
  isLocale,
  localizeTree,
  dateLocales,
  translate,
  languageAlternates,
} from "@/lib/i18n";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GitFork,
  GitBranch as Github,
  Star,
} from "lucide-react";
import { projects } from "@/content/projects";
import { ProjectVisual } from "@/components/project-visual";
import { EngineeringLab } from "@/components/lab";
import { LedgerDemo, MerkleDemo } from "@/components/project-demos";
import { getRepositories } from "@/lib/github";
import { site } from "@/lib/site";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const language = await getLanguage(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: translate(language, project.description),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: languageAlternates(`/projects/${slug}`),
    },
    openGraph: {
      title: `${project.name} — Marcus Girolneto`,
      description: translate(language, project.description),
      url: `/${locale}/projects/${slug}`,
      images: ["/opengraph-image"],
    },
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const language = await getLanguage(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const content = await readFile(
    path.join(
      process.cwd(),
      "src/content/cases",
      ...(locale === "en" ? [] : [locale]),
      `${project.slug}.mdx`,
    ),
    "utf8",
  );
  const github = await getRepositories();
  const repo = github.repositories.find((r) => project.repo === r.html_url);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return localizeTree(
    <main id="main" className="case-main shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.name,
            description: translate(language, project.description),
            url: `${site.url}/${locale}/projects/${slug}`,
            author: { "@type": "Person", name: site.fullName },
            keywords: project.tags.join(", "),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/#work" className="back-link">
        <ArrowLeft size={14} /> Selected work
      </Link>
      <div className="case-heading">
        <p className="section-kicker">{project.category}</p>
        <h1>
          {project.name}
          <span className="blue-dot">.</span>
        </h1>
        <p className="case-tagline">{project.title}</p>
        <p className="case-intro">{project.description}</p>
        <div className="case-scope">{project.scope}</div>
        <div className="project-tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <div className="case-preview">
        <ProjectVisual type={project.type} language={language} />
      </div>
      <div className="case-architecture">
        <div className="section-kicker">CONCEPTUAL ARCHITECTURE</div>
        <ol>
          {project.architecture.map((step, i) => (
            <li key={step}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              {i < project.architecture.length - 1 && <ArrowRight size={14} />}
            </li>
          ))}
        </ol>
      </div>
      <div className="case-layout">
        <aside className="case-sidebar">
          <span className="mono">ENGINEERING NOTES</span>
          <a href={project.source}>
            {project.sourceLabel}
            <ArrowUpRight size={13} />
          </a>
          {project.repo && (
            <a href={project.repo}>
              <Github size={14} /> Explore source <ArrowUpRight size={13} />
            </a>
          )}
          {repo && (
            <div className="case-repo-meta">
              <span>{repo.language}</span>
              <span>
                <Star size={12} />
                {repo.stargazers_count} stars
              </span>
              <span>
                <GitFork size={12} />
                {repo.forks_count} forks
              </span>
              <span>
                Updated{" "}
                {new Date(repo.updated_at).toLocaleDateString(
                  dateLocales[locale],
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  },
                )}
              </span>
              <small>
                {github.source === "live"
                  ? "GitHub API · hourly cache"
                  : "Verified snapshot · Nov 2, 2026"}
              </small>
            </div>
          )}
          <a href={`mailto:${site.email}`}>
            Discuss the architecture <ArrowUpRight size={13} />
          </a>
        </aside>
        <article className="case-prose">
          <MDXRemote source={content} />
        </article>
      </div>
      {["hookrelay", "witness", "ledger"].includes(project.type) && (
        <section className="case-interactive">
          <h2>
            Make the model tangible<span className="blue-dot">.</span>
          </h2>
          {project.type === "hookrelay" ? (
            <EngineeringLab initialTab="webhook" compact />
          ) : project.type === "witness" ? (
            <MerkleDemo />
          ) : (
            <LedgerDemo />
          )}
        </section>
      )}
      <div className="case-next">
        <div>
          <span className="section-kicker">CONTINUE EXPLORING</span>
          <Link href={`/projects/${next.slug}`}>
            {next.name}
            <ArrowUpRight size={28} />
          </Link>
        </div>
        <Link className="inline-link" href="/#work">
          All selected work <ArrowRight size={14} />
        </Link>
      </div>
    </main>,
    language,
  );
}
