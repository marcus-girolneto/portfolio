"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Languages,
  Monitor,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { localeNames, locales, translate, type Locale } from "@/lib/i18n";
import { LocaleFlag } from "./locale-flag";
import { useLanguage } from "./language-provider";
type Theme = "system" | "light" | "dark";
const subscribe = (listener: () => void) => {
  window.addEventListener("portfolio-theme", listener);
  return () => window.removeEventListener("portfolio-theme", listener);
};
function getTheme(): Theme {
  return (
    (document.documentElement.dataset.themePreference as Theme) || "system"
  );
}
function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.themePreference = theme;
  root.dataset.theme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  root.style.colorScheme = root.dataset.theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      "content",
      root.dataset.theme === "light" ? "#f5f7fb" : "#080a0e",
    );
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {}
  window.dispatchEvent(new Event("portfolio-theme"));
}
function saveLocalePreference(target: Locale) {
  document.cookie = `portfolio-locale=${target};path=/;max-age=31536000;SameSite=Lax`;
}
type Menu = "language" | "theme";
const themes = ["light", "dark", "system"] as const;
const themeLabels: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};
const themeIcons = { light: Sun, dark: Moon, system: Monitor };

export function Preferences() {
  const language = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Menu | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const themeButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => "system" as Theme,
  );
  const Icon = themeIcons[theme];
  const label = (text: string) => translate(language, text);
  const trigger = (kind: Menu) =>
    kind === "language" ? languageButton.current : themeButton.current;
  function close(restoreFocus = false) {
    if (restoreFocus && open) trigger(open)?.focus();
    setOpen(null);
  }
  useEffect(() => {
    if (!open) return;
    menu.current
      ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ?.focus();
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(null);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  function menuKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === "Tab") {
      if (open) trigger(open)?.focus();
      setOpen(null);
      return;
    }
    const items = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ),
    ];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "ArrowDown"
        ? (index + 1) % items.length
        : event.key === "ArrowUp"
          ? (index + items.length - 1) % items.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : -1;
    if (next >= 0) {
      event.preventDefault();
      items[next]?.focus();
    } else if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.key !== " "
    ) {
      const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
      const match = ordered.find((item) =>
        item.textContent
          ?.trim()
          .toLocaleLowerCase()
          .startsWith(event.key.toLocaleLowerCase()),
      );
      if (match) {
        event.preventDefault();
        match.focus();
      }
    }
  }
  function triggerKeys(
    event: React.KeyboardEvent<HTMLButtonElement>,
    kind: Menu,
  ) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(kind);
    }
  }
  function changeLanguage(target: Locale) {
    close(true);
    if (target === language.locale) return;
    const suffix = pathname.replace(/^\/(en|pt|es|de|fr|zh)(?=\/|$)/, "");
    saveLocalePreference(target);
    router.push(
      `/${target}${suffix}${window.location.search}${window.location.hash}`,
    );
  }
  return (
    <div className="preferences" ref={root}>
      <div className="preference-control">
        <button
          ref={languageButton}
          className="preference-trigger"
          aria-label={label("Language")}
          aria-haspopup="menu"
          aria-expanded={open === "language"}
          aria-controls={open === "language" ? `${id}-languages` : undefined}
          disabled={!hydrated}
          onClick={() => setOpen(open === "language" ? null : "language")}
          onKeyDown={(event) => triggerKeys(event, "language")}
        >
          <LocaleFlag locale={language.locale} />
          <span className="preference-code">
            {language.locale.toUpperCase()}
          </span>
          <ChevronDown size={12} className="preference-chevron" />
        </button>
        {open === "language" && (
          <div
            className="preference-popover language-popover"
            ref={menu}
            onKeyDown={menuKeys}
          >
            <div className="preference-heading">
              <Languages size={13} />
              {label("Language")}
            </div>
            <div
              role="menu"
              id={`${id}-languages`}
              aria-label={label("Language")}
            >
              {locales.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  role="menuitemradio"
                  aria-checked={locale === language.locale}
                  className="preference-option"
                  tabIndex={-1}
                  onClick={() => changeLanguage(locale)}
                >
                  <LocaleFlag locale={locale} />
                  <span className="preference-option-name" lang={locale}>
                    {localeNames[locale]}
                  </span>
                  <span className="preference-option-code" aria-hidden="true">
                    {locale.toUpperCase()}
                  </span>
                  {locale === language.locale && (
                    <Check size={14} className="preference-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="preference-control">
        <button
          ref={themeButton}
          className="preference-trigger theme-trigger"
          aria-label={label("Color theme")}
          aria-haspopup="menu"
          aria-expanded={open === "theme"}
          aria-controls={open === "theme" ? `${id}-themes` : undefined}
          disabled={!hydrated}
          onClick={() => setOpen(open === "theme" ? null : "theme")}
          onKeyDown={(event) => triggerKeys(event, "theme")}
        >
          <Icon size={15} />
          <span className="preference-theme-label">
            {label(themeLabels[theme])}
          </span>
          <ChevronDown size={12} className="preference-chevron" />
        </button>
        {open === "theme" && (
          <div
            className="preference-popover theme-popover"
            ref={menu}
            onKeyDown={menuKeys}
          >
            <div className="preference-heading">
              <Palette size={13} />
              {label("Color theme")}
            </div>
            <div
              role="menu"
              id={`${id}-themes`}
              aria-label={label("Color theme")}
            >
              {themes.map((value) => {
                const ThemeIcon = themeIcons[value];
                return (
                  <button
                    key={value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={value === theme}
                    className="preference-option theme-option"
                    tabIndex={-1}
                    onClick={() => {
                      setTheme(value);
                      close(true);
                    }}
                  >
                    <span
                      className={`theme-swatch swatch-${value}`}
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="preference-option-name">
                      {label(themeLabels[value])}
                    </span>
                    <ThemeIcon size={14} className="theme-option-icon" />
                    {value === theme && (
                      <Check size={14} className="preference-check" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
