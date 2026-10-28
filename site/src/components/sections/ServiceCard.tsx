import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { indexLabel } from "@/components/ui/SectionTitle";
import { getPackage, priceText } from "@/content/packages";
import type { Service } from "@/content/services";

/**
 * Строка услуги на /services — в духе строк на главной: номер, название прописными, цена;
 * справа проблема и результат, состав и действия. Без заливки, строки делит линия.
 * При наведении название сдвигается и краснеет, круглая стрелка заливается красным.
 */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const pack = getPackage(service.packageSlug);
  const titleId = `service-${service.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      className="group grid gap-8 border-t border-line py-10 md:grid-cols-12 md:gap-8 md:py-14"
    >
      <div className="md:col-span-5">
        <p
          aria-hidden="true"
          className="font-display text-[length:var(--text-small)] leading-none text-accent-ink"
        >
          {indexLabel(index, 3)}
        </p>
        <h3
          id={titleId}
          className="mt-5 font-display text-[clamp(1.375rem,2.8vw,3.75rem)] font-normal uppercase leading-[1] tracking-[-0.01em] transition-[translate,color] duration-300 ease-out [overflow-wrap:anywhere] md:group-hover:translate-x-2 md:group-hover:text-accent-ink"
        >
          <Link href={`/services/${service.slug}`}>{service.title}</Link>
        </h3>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <p className="font-display text-[length:var(--text-statement)] font-normal leading-none">
            {priceText(pack)}
          </p>
          <p className="rounded-full border border-line px-3 py-1 text-[length:var(--text-small)]">
            {pack.term}
          </p>
        </div>
      </div>

      <dl className="grid content-start gap-6 md:col-span-4">
        <div>
          <dt className="font-display text-[length:var(--text-small)] text-accent-ink">Проблема</dt>
          <dd className="mt-2">{service.problem}</dd>
        </div>
        <div>
          <dt className="font-display text-[length:var(--text-small)] text-accent-ink">Результат</dt>
          <dd className="mt-2 font-semibold">{service.result}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-6 md:col-span-3">
        <ul className="grid gap-2 text-[length:var(--text-small)]">
          {service.scope.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 bg-accent" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 font-semibold">
          <Link
            href={`/services/${service.slug}`}
            aria-label={`Подробнее: ${service.title}`}
            className="inline-flex min-h-11 items-center gap-3"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-fg/40 transition-[background-color,border-color,color,translate] duration-200 ease-out group-hover:border-accent-strong group-hover:bg-accent-strong group-hover:text-white">
              <ArrowIcon />
            </span>
            Подробнее
          </Link>
          <Link
            href={`/contacts?service=${service.packageSlug}#brief`}
            className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            Обсудить задачу
          </Link>
        </div>
      </div>
    </article>
  );
}
