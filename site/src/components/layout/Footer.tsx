import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { services } from "@/content/services";
import { site, socialLinks } from "@/content/site";
import { CurrentYear } from "./CurrentYear";
import { Wordmark } from "./Wordmark";

const agencyLinks = [
  { href: "/projects", label: "Проекты" },
  { href: "/pricing", label: "Цены и пакеты" },
  { href: "/process", label: "Процесс работы" },
  { href: "/about", label: "Об агентстве" },
  { href: "/contacts", label: "Контакты" },
];

const linkClass =
  "group inline-flex min-h-11 items-center gap-2 transition-colors duration-150 hover:text-accent-ink";

/**
 * Подвал в три яруса: бренд и колонки ссылок; название во всю ширину; нижняя строка.
 * Без серых плашек — только тонкие линии и контраст. Мессенджеры — если заданы адреса;
 * контактов владелец ещё не дал (CONTENT_REQUIREMENTS.md §3).
 */
export function Footer() {
  return (
    <footer className="surface-dark overflow-hidden border-t border-line bg-ground-deep text-fg">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 px-gutter pb-14 pt-16 md:pt-24 lg:grid-cols-12 lg:gap-8">
        <div className="col-span-2 lg:col-span-5">
          <Wordmark />
          <p className="mt-6 max-w-[34ch] text-[length:var(--text-lead)] leading-snug">
            Независимое digital-агентство: сайты и каталоги для B2B-компаний со сложным продуктом.
          </p>
          <Link
            href={site.briefHref}
            className="group mt-8 inline-flex min-h-11 items-center gap-3 font-semibold"
          >
            <span className="underline decoration-accent decoration-2 underline-offset-[6px]">
              Обсудить проект
            </span>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-strong text-white transition-transform duration-200 ease-out group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
          {socialLinks.length ? (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Услуги" className="lg:col-span-3 lg:col-start-7">
          <p className="font-display text-[length:var(--text-small)] text-accent-ink">Услуги</p>
          <ul className="mt-4 grid">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={linkClass}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Агентство" className="lg:col-span-3">
          <p className="font-display text-[length:var(--text-small)] text-accent-ink">Агентство</p>
          <ul className="mt-4 grid">
            {agencyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Название во всю ширину — подпись подвала, для программ чтения экрана лишнее. */}
      <div aria-hidden="true" className="border-t border-line px-gutter pt-8 md:pt-12">
        <p className="whitespace-nowrap font-display text-[10.7vw] leading-[0.82] tracking-[-0.02em]">
          VYRA DIGITAL<span className="text-accent-ink">.</span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line px-gutter py-5 text-[length:var(--text-small)] md:mt-12">
        <p>
          © <CurrentYear /> {site.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <Link href="/privacy" className={linkClass}>
            Политика конфиденциальности
          </Link>
          <a href="#content" className={linkClass}>
            Наверх
            <ArrowIcon className="-rotate-90 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
