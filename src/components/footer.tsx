import Link from "next/link";
import { localizeTree, type Language } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
export function Footer({ language }: { language: Language }) {
  return localizeTree(
    <footer className="footer shell">
      <Link className="footer-name" href="/">
        Marcus Girolneto<span>.</span>
      </Link>
      <p>Thoughtfully engineered. Built with purpose.</p>
      <div>
        <a href={site.github}>
          GitHub <ArrowUpRight size={12} />
        </a>
        <a href={site.linkedin}>
          LinkedIn <ArrowUpRight size={12} />
        </a>
        <a href={`mailto:${site.email}`}>
          Email <ArrowUpRight size={12} />
        </a>
      </div>
      <span className="footer-copy">
        © {new Date().getFullYear()} {site.fullName}
      </span>
    </footer>,
    language,
  );
}
