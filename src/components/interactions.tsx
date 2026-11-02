"use client";
import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "./language-provider";
import { localizeTree } from "@/lib/i18n";
import { site } from "@/lib/site";
export function PageInteractions() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    const surfaces = [
      ...document.querySelectorAll<HTMLElement>(
        ".project-card, .expertise-card",
      ),
    ];
    const buttons = [
      ...document.querySelectorAll<HTMLElement>(
        ".hero-actions .button-primary, .contact-actions .button-primary",
      ),
    ];
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    function glow(event: PointerEvent) {
      if (!fine.matches) return;
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    }
    function magnet(event: PointerEvent) {
      if (!fine.matches) return;
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      el.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.06}px, ${(event.clientY - rect.top - rect.height / 2) * 0.08}px)`;
    }
    function reset(event: PointerEvent) {
      (event.currentTarget as HTMLElement).style.transform = "";
    }
    surfaces.forEach((el) => el.addEventListener("pointermove", glow));
    buttons.forEach((el) => {
      el.addEventListener("pointermove", magnet);
      el.addEventListener("pointerleave", reset);
    });
    return () => {
      observer.disconnect();
      surfaces.forEach((el) => el.removeEventListener("pointermove", glow));
      buttons.forEach((el) => {
        el.removeEventListener("pointermove", magnet);
        el.removeEventListener("pointerleave", reset);
      });
    };
  }, []);
  return null;
}
export function CopyEmail() {
  const language = useLanguage();
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 4000);
    return () => clearTimeout(timer);
  }, [status]);
  return localizeTree(
    <div className="email-copy">
      <button
        className="copy-button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setStatus("Email copied");
          } catch {
            setStatus("Copy unavailable. Use the email link.");
          }
        }}
        aria-label="Copy email address"
      >
        {status === "Email copied" ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <span role="status">{status}</span>
    </div>,
    language,
  );
}
