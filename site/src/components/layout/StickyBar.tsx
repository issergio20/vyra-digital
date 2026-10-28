"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

/**
 * Липкая шапка: появляется сверху после первого экрана — вордмарк, ссылки и одно действие.
 * Сверху, а не плашкой внизу: плавающая плашка закрывала заголовки и текст секций.
 * На /contacts не нужна — форма уже на странице; на /pricing вторая ссылка ведёт к сравнению.
 * `servicePackages` — услуга → пакет: со страницы услуги форма откроется с выбранным пакетом.
 */
export function StickyBar({
  servicePackages,
}: {
  servicePackages: Readonly<Record<string, string>>;
}) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const onPricing = pathname === "/pricing";
  const servicePackage = servicePackages[pathname.replace(/^\/services\//, "")];
  const briefHref =
    pathname.startsWith("/services/") && servicePackage
      ? `/contacts?service=${servicePackage}#brief`
      : site.briefHref;

  useEffect(() => {
    if (pathname.startsWith("/contacts")) return;
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.9);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  if (pathname.startsWith("/contacts")) return null;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`surface-dark fixed inset-x-0 top-0 z-20 bg-surface text-fg transition-[translate,opacity] ease-out ${
        visible
          ? "translate-y-0 opacity-100 duration-240"
          : "pointer-events-none -translate-y-full opacity-0 duration-160"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-gutter py-2">
        <Wordmark />
        <div className="flex items-center gap-2 sm:gap-7">
          <nav aria-label="Навигация в липкой шапке" className="hidden lg:block">
            <ul className="flex gap-6 xl:gap-7">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[length:var(--text-small)] decoration-2 underline-offset-[6px] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href={onPricing ? "#compare" : "/pricing"}
            className="hidden min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px] sm:inline-flex lg:hidden"
          >
            {onPricing ? "Сравнение" : "Цены"}
          </Link>
          <ThemeToggle compactLabel />
          <Link
            href={briefHref}
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-ui bg-accent-strong px-4 text-[length:var(--text-button)] font-semibold text-white sm:px-5 transition-[background-color,scale] duration-150 ease-out hover:bg-accent-strong-pressed active:scale-[0.97]"
          >
            <span className="min-[360px]:hidden">Обсудить</span>
            <span className="hidden min-[360px]:inline">Обсудить проект</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
