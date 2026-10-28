"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

// Тема живёт в атрибуте <html data-theme>: все переключатели на странице читают его
// и обновляются вместе, без общего состояния React.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

/**
 * Переключатель темы: значок в круглой обводке и подпись текущей темы — «Темно» / «Светло».
 * `compactLabel` — подпись прячется на узких экранах (липкая шапка на телефоне).
 */
export function ThemeToggle({
  className = "",
  compactLabel = false,
}: {
  className?: string;
  compactLabel?: boolean;
}) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    if (next === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Приватный режим: тема переключится, но не запомнится.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={next === "light" ? "Светлая тема" : "Тёмная тема"}
      className={`group inline-flex min-h-11 shrink-0 items-center gap-2.5 text-[length:var(--text-small)] font-semibold transition-[scale] duration-150 ease-out active:scale-[0.96] ${className}`}
    >
      <span className="inline-flex size-9 items-center justify-center rounded-full border border-fg/50 transition-colors duration-150 group-hover:border-fg group-hover:bg-fg/10">
        {theme === "dark" ? (
          // Солнце: в тёмной теме кнопка предлагает свет.
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem]">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Месяц: в светлой — возврат к тёмной.
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem]">
            <path
              d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {/* Видимая подпись входит в имя кнопки (WCAG 2.5.3), действие — скрытым текстом. */}
      <span className={compactLabel ? "max-sm:sr-only" : ""}>
        {theme === "dark" ? "Темно" : "Светло"}
      </span>
      <span className="sr-only">
        {next === "light" ? ": включить светлую тему" : ": включить тёмную тему"}
      </span>
    </button>
  );
}
