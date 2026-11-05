import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLanguage } from "@/lib/dictionaries";
import {
  isLocale,
  localizeTree,
  dateLocales,
  translate,
  languageAlternates,
} from "@/lib/i18n";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronDown,
  Code2,
  Fingerprint,
  GitBranch as Github,
  Globe2,
  Layers3,
  Mail,
  Network,
  ShieldCheck,
  Sparkles,
  Star,
  GitFork,
} from "lucide-react";
import { Network as HeroNetwork } from "@/components/network";
import { ProjectVisual } from "@/components/project-visual";
import { EngineeringLab } from "@/components/lab";
import { CopyEmail } from "@/components/interactions";
import { projects } from "@/content/projects";
import { experience, expertise } from "@/content/profile";
import { getRepositories } from "@/lib/github";
import { site } from "@/lib/site";
import snapshot from "@/content/github-snapshot.json";
export const revalidate = 3600;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
  };
}
function SectionHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="section-heading" data-reveal>
      <div className="section-kicker">
        <span>{index}</span>
        {label}
      </div>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const language = await getLanguage(locale);
  const github = await getRepositories();
  const repos = github.repositories.filter((r) =>
    [
      "ledger",
      "hookrelay",
      "witness",
      "rolecall",
      "agent-reliability-lab",
      "beacon",
    ].includes(r.name),
  );
  return localizeTree(
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.fullName,
            alternateName: site.name,
            url: site.url,
            jobTitle: site.title,
            email: site.email,
            sameAs: [site.github, site.linkedin],
            knowsAbout: [
              "Distributed systems",
              "AI infrastructure",
              "Backend engineering",
              "Scala",
              "Cloud architecture",
            ],
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "Pontifícia Universidade Católica de Goiás",
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>
            <span className="status-dot" /> OPEN TO ENGINEERING OPPORTUNITIES
          </span>
          <span className="hero-location">
            <Globe2 size={12} />
            <span>
              REMOTE · UTC−3, FULL US WORKDAY OVERLAP · OPEN TO RELOCATION
            </span>
          </span>
        </div>
        <HeroNetwork />
        <div className="hero-content">
          <p className="eyebrow hero-enter">HELLO, I’M</p>
          <p className="hero-full-name">{site.fullName}</p>
          <h1 id="hero-title">
            <span className="hero-line hero-enter">
              Engineering
              <br />
              Complex Systems.
            </span>
            <span className="hero-line hero-line-secondary hero-enter">
              Building What
              <br className="mobile-break" /> Matters
              <span className="blue-dot">.</span>
            </span>
          </h1>
          <p className="hero-description hero-enter">
            {
              "I build and ship products end to end, and I'm best at the parts that have to keep working when things go wrong. Most recently: a multi-tenant LLM security gateway, 97.4% F1 at 1% false positives on a public benchmark."
            }
          </p>
          <div className="hero-actions hero-enter">
            <Link href="#work" className="button button-primary">
              Explore my work <ArrowDown size={16} />
            </Link>
            <a href={site.resume} download className="button button-secondary">
              Download resume <ArrowDownToLine size={15} />
            </a>
          </div>
          <div className="hero-socials hero-enter">
            <span>SENIOR / LEAD SOFTWARE ENGINEER</span>
            <a href={site.github} aria-label="Marcus on GitHub">
              <Github size={17} />
            </a>
            <a href={site.linkedin} aria-label="Marcus on LinkedIn">
              <span className="linkedin-symbol">in</span>
            </a>
            <a href={`mailto:${site.email}`} aria-label="Email Marcus">
              <Mail size={17} />
            </a>
          </div>
        </div>
        <div className="hero-bottom">
          <span>97.4% F1 AT 1% FALSE POSITIVES · PUBLIC BENCHMARK</span>
          <a href="#work">
            SCROLL TO EXPLORE <ArrowDown size={12} />
          </a>
          <span>PORTFOLIO / 2026</span>
        </div>
      </section>
      <div className="domain-strip">
        <div className="shell">
          <span>
            <Network size={16} /> Distributed systems
          </span>
          <i />
          <span>
            <ShieldCheck size={16} /> AI infrastructure & security
          </span>
          <i />
          <span>
            <Braces size={16} /> Backend architecture
          </span>
          <i />
          <span>
            <Layers3 size={16} /> Engineering leadership
          </span>
        </div>
      </div>
      <section id="work" className="section shell work-section">
        <SectionHeading
          index="01"
          label="SELECTED WORK"
          title={
            <>
              Engineering with
              <br />
              <span className="muted">real consequences.</span>
            </>
          }
          description="Systems that protect, coordinate, deliver and account. A closer look at the decisions behind the code."
        />
        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              className={`project-card ${index < 2 ? "project-featured" : ""}`}
              key={project.slug}
              data-reveal
            >
              <Link
                className="project-preview-link"
                href={`/projects/${project.slug}`}
                aria-label={translate(language, "Read {name} case study", {
                  name: project.name,
                })}
              >
                <ProjectVisual type={project.type} language={language} />
                <span className="project-preview-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </Link>
              <div className="project-copy">
                <div className="project-category">
                  <span>{project.category}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>
                  <Link href={`/projects/${project.slug}`}>
                    {project.name}
                    <ArrowUpRight size={20} />
                  </Link>
                </h3>
                <p>{project.description}</p>
                {project.type === "gate" && (
                  <a className="benchmark-inline" href={site.benchmark}>
                    <span>97.4% F1</span> at 1% false-positive rate{" "}
                    <ArrowUpRight size={12} />
                    <small>
                      Public benchmark · 16 datasets · 12,111 samples
                    </small>
                  </a>
                )}
                <div className="project-tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-card-footer">
                  <span>
                    {["akibo", "arconta"].includes(project.slug) ? (
                      <>
                        <span className="private-dot" /> Private project
                      </>
                    ) : project.repo ? (
                      "Public source"
                    ) : (
                      "Professional work"
                    )}
                  </span>
                  <Link href={`/projects/${project.slug}`}>
                    Case study <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="about" className="section about-section">
        <div className="shell">
          <SectionHeading
            index="02"
            label="THE ENGINEER BEHIND THE SYSTEMS"
            title={
              <>
                Ownership, from the
                <br />
                <span className="muted">first decision onward.</span>
              </>
            }
          />
          <div className="about-layout">
            <div className="about-statement" data-reveal>
              <figure className="portrait">
                <Image
                  src="/images/marcus-vinicius-girolneto-sousa.jpg"
                  alt={site.fullName}
                  width={460}
                  loading="eager"
                  height={460}
                  sizes="(max-width: 600px) 85vw, 340px"
                />
                <figcaption>
                  <strong>{site.fullName}</strong>
                  <span>Senior / Lead Software Engineer</span>
                </figcaption>
              </figure>
              <span className="large-number">
                9<span>+</span>
              </span>
              <p>
                years in software engineering.
                <br />
                Still curious. Still hands-on.
              </p>
              <div className="location-note">
                <Globe2 size={15} /> Goiânia, Brazil
                <br />
                <span>Remote or relocation · Professional English</span>
              </div>
            </div>
            <div className="about-copy" data-reveal>
              <p className="lead-copy">
                I enjoy solving problems where correctness, performance, and
                reliability really matter.
              </p>
              <p>
                My experience spans financial technology, distributed protocols,
                AI security, and cloud infrastructure. I take ownership of
                complex systems, from the first architectural decision to
                production operations.
              </p>
              <p>
                At Constellation Network, I built an AI security gateway from
                zero and then led its engineering team. Alongside that, I worked
                on the core Scala protocol and helped resolve incidents on a
                live network.
              </p>
              <p>
                Today, that same approach shapes my independent work:{" "}
                <Link href="/projects/akibo">Akibo</Link>,{" "}
                <Link href="/projects/arconta">Arconta</Link>, and open-source
                infrastructure built around explicit guarantees.
              </p>
              <div className="about-highlights">
                <span>
                  <ShieldCheck size={16} /> AI infrastructure & security
                </span>
                <span>
                  <Network size={16} /> Consensus & state recovery
                </span>
                <span>
                  <Code2 size={16} /> Full-stack technical ownership
                </span>
                <span>
                  <Fingerprint size={16} /> Correctness under pressure
                </span>
              </div>
              <a className="inline-link" href={site.resume} download>
                Read the full resume <ArrowDownToLine size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="experience" className="section shell">
        <SectionHeading
          index="03"
          label="PROFESSIONAL EXPERIENCE"
          title={
            <>
              Built over time.
              <br />
              <span className="muted">Proven in production.</span>
            </>
          }
          description="A path through enterprise software, financial systems, distributed infrastructure and AI security."
        />
        <div className="timeline">
          {experience.map((job, index) => (
            <details
              className="experience-row"
              key={job.role + job.company}
              open={index === 0 ? true : undefined}
              data-reveal
            >
              <summary>
                <span className="timeline-year">{job.period}</span>
                <span className="timeline-marker" />
                <span className="job-heading">
                  <strong>
                    {job.company}
                    <ChevronDown
                      size={14}
                      className="experience-chevron"
                      aria-hidden="true"
                    />
                  </strong>
                  <span>{job.role}</span>
                </span>
                <span className="job-date">{job.date}</span>
              </summary>
              <div className="experience-detail">
                <p>{job.intro}</p>
                <ul>
                  {job.details.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="mono">{job.stack}</span>
              </div>
            </details>
          ))}
        </div>
        <p className="experience-note">
          Earlier: Technical Support Analyst at SIACON, Apr — Oct 2017.{" "}
          <a href={site.resume}>
            Full history in resume <ArrowUpRight size={12} />
          </a>
        </p>
      </section>
      <section id="expertise" className="section expertise-section">
        <div className="shell">
          <SectionHeading
            index="04"
            label="ENGINEERING EXPERTISE"
            title={
              <>
                Different layers.
                <br />
                <span className="muted">One systems mindset.</span>
              </>
            }
            description="Tools change. The work is understanding the boundaries, failure modes and guarantees between them."
          />
          <div className="expertise-map" aria-hidden="true">
            <span>INTERFACE</span>
            <i />
            <span>INTELLIGENCE</span>
            <i />
            <strong>APPLICATION</strong>
            <i />
            <span>DATA</span>
            <i />
            <span>INFRASTRUCTURE</span>
          </div>
          <div className="expertise-grid">
            {expertise.map((domain, index) => {
              const Icon = [
                Braces,
                Network,
                ShieldCheck,
                Layers3,
                Layers3,
                Sparkles,
              ][index];
              return (
                <details
                  className="expertise-card"
                  key={domain.name}
                  data-reveal
                >
                  <summary>
                    <div className="expertise-icon">
                      <Icon size={21} />
                      <span>{domain.number}</span>
                    </div>
                    <h3>{domain.name}</h3>
                    <p>{domain.description}</p>
                    <span className="expertise-expand">
                      Explore domain <span>+</span>
                    </span>
                  </summary>
                  <div className="expertise-details">
                    <div className="project-tags">
                      {domain.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                    <p>{domain.connection}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>
      <section id="lab" className="section shell">
        <SectionHeading
          index="05"
          label="ENGINEERING LAB"
          title={
            <>
              Don’t just read it.
              <br />
              <span className="muted">See how it works.</span>
            </>
          }
          description="Small, interactive models of the problems I like to solve. Change a condition. Follow the consequences."
        />
        <EngineeringLab />
        <p className="lab-footnote">
          <Check size={13} /> Lightweight by design. No paid APIs, accounts or
          data collection.
        </p>
      </section>
      <section id="open-source" className="section shell open-source-section">
        <div className="opensource-heading">
          <div className="section-kicker">
            <span>06</span> IN THE OPEN
          </div>
          <h2>
            Code you can inspect<span className="blue-dot">.</span>
          </h2>
          <div className="repo-source">
            <Github size={14} />
            {github.source === "live"
              ? "Public GitHub data · refreshed hourly"
              : translate(
                  language,
                  "GitHub unavailable · verified snapshot from {date}",
                  {
                    date: new Date(snapshot.verifiedAt).toLocaleDateString(
                      dateLocales[locale],
                      { timeZone: "UTC" },
                    ),
                  },
                )}
          </div>
          <a className="inline-link" href={site.github}>
            All repositories <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="repo-grid">
          {repos.map((repo) => (
            <article className="repo-card" key={repo.name}>
              <a className="repo-title" href={repo.html_url}>
                <Code2 size={17} />
                <h3>{repo.name}</h3>
                <ArrowUpRight size={16} />
              </a>
              <p>{repo.description}</p>
              <div className="repo-topics">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
              <div className="repo-meta">
                <span>
                  <i className={repo.language === "Go" ? "go-dot" : "ts-dot"} />
                  {repo.language}
                </span>
                <span>
                  <Star size={12} />
                  {repo.stargazers_count}
                </span>
                <span>
                  <GitFork size={12} />
                  {repo.forks_count}
                </span>
              </div>
              <div className="repo-footer">
                <time dateTime={repo.updated_at}>
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
                </time>
                <a href={`${repo.html_url}#readme`}>
                  Docs <ArrowUpRight size={11} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="contact" className="contact-section shell">
        <div className="contact-panel" data-reveal>
          <div className="contact-orbit" aria-hidden="true" />
          <div className="section-kicker">
            <span>07</span> WHAT’S NEXT
          </div>
          <p className="contact-pretitle">
            <span className="status-dot" /> A GOOD CONVERSATION IS A GOOD START.
          </p>
          <h2>
            Let’s build something
            <br />
            that <span>matters.</span>
          </h2>
          <p className="contact-description">
            I’m interested in challenging engineering opportunities involving
            distributed systems, AI infrastructure, backend architecture, and
            technically ambitious products.
          </p>
          <div className="contact-actions">
            <a className="button button-primary" href={`mailto:${site.email}`}>
              Get in touch <ArrowUpRight size={16} />
            </a>
            <a className="button button-secondary" href={site.linkedin}>
              Connect on LinkedIn <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="contact-email">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <CopyEmail />
          </div>
          <div className="contact-bottom">
            <span>Based in Brazil. Building for the world.</span>
            <a href={site.resume} download>
              Download resume <ArrowDownToLine size={13} />
            </a>
            <a href={site.github}>
              Explore GitHub <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>
    </main>,
    language,
  );
}
