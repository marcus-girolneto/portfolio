"use client";
import Link from "next/link";
import { useLanguage } from "./language-provider";
import { localizeTree } from "@/lib/i18n";
import { Preferences } from "./preferences";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const links = [
  ["Work", "/#work"],
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Lab", "/#lab"],
];
export function Navigation() {
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return localizeTree(
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link href="/" className="wordmark" aria-label="Marcus Girolneto home">
          <span className="brand-symbol">
            m<span>g</span>
            <i />
          </span>
          <span>
            marcus girolneto<span className="wordmark-dot">.</span>
          </span>
        </Link>
        <div className="desktop-nav">
          {links.map(([name, href]) => (
            <Link href={href} key={name}>
              {name}
            </Link>
          ))}
        </div>
        <Preferences />
        <Link className="nav-contact" href="/#contact">
          Let’s talk <ArrowUpRight size={14} />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        {open && (
          <div className="mobile-nav" id="mobile-navigation">
            {[...links, ["Contact", "/#contact"]].map(([name, href]) => (
              <Link href={href} key={name} onClick={() => setOpen(false)}>
                {name}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>,
    language,
  );
}
