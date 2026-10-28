import Link from "next/link";

export type Crumb = { href: string; label: string };

/** Хлебные крошки. Последний пункт — текущая страница, без ссылки. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap gap-x-2 gap-y-1 text-[length:var(--text-small)] text-fg-soft">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="inline-flex min-h-11 items-center text-fg">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-fg"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
