import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ctaText, priceText, type ServicePackage } from "@/content/packages";

const label = "font-display text-[length:var(--text-small)] text-accent-ink";

/**
 * Смета пакета: состав, границы и условия — всё, что ТЗ §7 требует для каждой услуги.
 * Без заливок: блоки делят тонкие линии. `collapsible` — строка-аккордеон для /pricing:
 * в заголовке название и результат, состав открывается по клику (нативный <details>, без JS).
 */
export function PackageDetails({
  pack,
  headingLevel = "h2",
  collapsible = false,
}: {
  pack: ServicePackage;
  headingLevel?: "h2" | "h3";
  collapsible?: boolean;
}) {
  const Heading = headingLevel;
  const titleId = `package-${pack.slug}`;

  const terms = [
    { label: "Срок", value: pack.term },
    { label: "Правки", value: pack.revisions },
    { label: "Оплата", value: pack.payment },
    { label: "Для кого", value: pack.audience },
  ];

  const title = (
    <Heading
      id={titleId}
      className={`font-display font-normal uppercase leading-[1.05] tracking-[-0.01em] [overflow-wrap:anywhere] ${collapsible ? "text-[clamp(1.25rem,2.4vw,3.25rem)] transition-transform duration-300 ease-out md:group-open:translate-x-2" : "text-[length:var(--text-statement)]"}`}
    >
      {pack.title}
    </Heading>
  );

  const body = (
    <>
      <div className="grid border-t border-line md:grid-cols-2">
        <div className="p-6 md:p-8">
          <p className={label}>Что входит</p>
          <ul className="mt-4 grid gap-2">
            {pack.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-accent" />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-line p-6 md:border-l md:border-t-0 md:p-8">
          <p className={label}>Что не входит</p>
          <ul className="mt-4 grid gap-2">
            {pack.excludes.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-0.5 w-2 shrink-0 bg-fg-soft" />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
          <p className={`mt-8 ${label}`}>Можно добавить</p>
          <p className="mt-3">
            {pack.extras.join(", ")}. Оценка — до начала работ, ориентир 2 000 ₽ в час.
          </p>
        </div>
      </div>

      <div className="grid gap-8 border-t border-line p-6 md:grid-cols-12 md:p-8">
        <dl className="grid gap-6 sm:grid-cols-2 md:col-span-9 xl:grid-cols-4">
          {terms.map((t) => (
            <div key={t.label}>
              <dt className="text-[length:var(--text-small)] text-fg-soft">{t.label}</dt>
              <dd className="mt-1">{t.value}</dd>
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-4">
            <dt className="text-[length:var(--text-small)] text-fg-soft">Результат</dt>
            <dd className="mt-1 font-semibold">{pack.deliverable}</dd>
          </div>
        </dl>
        <div className="md:col-span-3 md:self-end md:text-right">
          {/* Текстовая ссылка, а не красная кнопка: на экране остаётся одно главное действие. */}
          <Link
            href={`/contacts?service=${pack.slug}#brief`}
            className="group/cta inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            <span className="min-w-0 [overflow-wrap:anywhere]">{ctaText(pack)}</span>
            <ArrowIcon className="transition-transform duration-200 group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </>
  );

  if (collapsible) {
    return (
      <details id={pack.slug} className="group border-t border-line">
        <summary className="flex cursor-pointer list-none items-center gap-6 py-6 transition-colors duration-200 hover:text-accent-ink md:py-8 [&::-webkit-details-marker]:hidden">
          <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-12 md:items-center md:gap-8">
            <div className="md:col-span-6">{title}</div>
            <p className="max-w-[48ch] text-fg md:col-span-6">{pack.outcome}</p>
          </div>
          <span
            aria-hidden="true"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-current transition-[rotate,background-color,border-color,color] duration-200 group-open:rotate-180 group-open:border-accent-strong group-open:bg-accent-strong group-open:text-white"
          >
            <svg viewBox="0 0 16 16" className="size-4">
              <path d="M2 8h12" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M8 2v12"
                stroke="currentColor"
                strokeWidth="1.6"
                className="group-open:hidden"
              />
            </svg>
          </span>
        </summary>
        <div className="mb-8 rounded-ui border border-line">{body}</div>
      </details>
    );
  }

  return (
    <article
      id={pack.slug}
      aria-labelledby={titleId}
      className="overflow-hidden rounded-ui border border-line transition-colors duration-300 hover:border-fg/30"
    >
      <div className="grid gap-6 p-6 md:grid-cols-12 md:p-8">
        <div className="md:col-span-7">
          {title}
          <p className="mt-3 max-w-[48ch]">{pack.outcome}</p>
        </div>
        <div className="md:col-span-5 md:text-right">
          <p className="font-display text-[length:var(--text-statement)] font-normal leading-none text-accent-ink">
            {priceText(pack)}
          </p>
          {pack.priceNote ? (
            <p className="mt-2 text-[length:var(--text-small)] text-fg-soft">{pack.priceNote}</p>
          ) : null}
        </div>
      </div>
      {body}
    </article>
  );
}
