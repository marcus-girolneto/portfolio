import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageInteractions } from "@/components/interactions";
import { site } from "@/lib/site";
import "../globals.css";
import { notFound } from "next/navigation";
import { getLanguage } from "@/lib/dictionaries";
import {
  isLocale,
  locales,
  languageAlternates,
  ogLocales,
  translate,
} from "@/lib/i18n";
import { LanguageProvider } from "@/components/language-provider";
import { themeInitialization } from "@/lib/theme";
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Marcus Vinicius Girolneto Sousa — Senior / Lead Software Engineer",
    template: "%s — Marcus Girolneto",
  },
  description:
    "Marcus Vinicius Girolneto Sousa. Senior / Lead Software Engineer with 9+ years building distributed systems, AI security infrastructure and reliable backend services.",
  keywords: [
    "Marcus Girolneto",
    "Marcus Vinicius Girolneto Sousa",
    "Senior Software Engineer",
    "Lead Software Engineer",
    "Distributed Systems Engineer",
    "AI Infrastructure Engineer",
    "Backend Engineer",
    "Scala Engineer",
  ],
  authors: [{ name: site.fullName }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: "Engineering Complex Systems. Building What Matters.",
    description:
      "Distributed systems, AI infrastructure and backend engineering. Explore the work of Marcus Girolneto.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcus Girolneto — Software Engineer",
    images: ["/opengraph-image"],
  },
};
export const viewport: Viewport = {
  themeColor: "#080a0e",
  colorScheme: "light dark",
};
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const language = await getLanguage(locale);
  return {
    ...baseMetadata,
    title: {
      default: `${site.fullName} — ${translate(language, site.title)}`,
      template: `%s — ${site.name}`,
    },
    description: translate(language, String(baseMetadata.description)),
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
    openGraph: {
      ...baseMetadata.openGraph,
      locale: ogLocales[locale],
      title: `${site.fullName} — ${translate(language, site.title)}`,
      description: translate(language, String(baseMetadata.description)),
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocales[l]),
    },
  };
}
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const language = await getLanguage(locale);
  return (
    <html
      lang={locale}
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitialization }} />
      </head>
      <body>
        <LanguageProvider language={language}>
          <a href="#main" className="skip-link">
            {translate(language, "Skip to content")}
          </a>
          <Navigation />
          {children}
          <Footer language={language} />
          <PageInteractions />
        </LanguageProvider>
      </body>
    </html>
  );
}
