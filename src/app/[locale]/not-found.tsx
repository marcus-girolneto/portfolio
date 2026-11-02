"use client";
import { useLanguage } from "@/components/language-provider";
import { localizeTree } from "@/lib/i18n";
import Link from "next/link";
export default function NotFound() {
  const language = useLanguage();
  return localizeTree(
    <main id="main" className="shell error-page">
      <p className="section-kicker">404 / ROUTE NOT FOUND</p>
      <h1>This path ends here.</h1>
      <p>There’s more engineering to explore.</p>
      <Link className="button button-primary" href="/">
        Back to the portfolio
      </Link>
    </main>,
    language,
  );
}
