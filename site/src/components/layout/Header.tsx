import Link from "next/link";
import { mainNav, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

/** Шапка поверх первого экрана (поле синьки). Контакты в меню — по ТЗ §10, блок 1. */
export function Header() {
  return (
    <header className="surface-dark absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-gutter pt-5 text-fg">
      <Wordmark />
      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex gap-6 xl:gap-7">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="py-2 text-[length:var(--text-small)] underline-offset-[6px] decoration-2 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <div className="hidden sm:block">
          <ButtonLink href={site.briefHref} variant="outline">
            Обсудить проект
          </ButtonLink>
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}
