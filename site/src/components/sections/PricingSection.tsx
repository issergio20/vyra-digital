import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { pricingTiers } from "@/content/home";
import { ctaText, extraPackages, mainPackages, priceText } from "@/content/packages";
import { packageHref, serviceForPackage } from "@/content/services";
import { HoverAccordion } from "./HoverAccordion";

const includesFor = (slug: string) => pricingTiers.find((t) => t.slug === slug)?.includes ?? [];
const index = (i: number) => `/ ${String(i + 1).padStart(3, "0")} /`;
// Четыре основных пакета и пятая строка «Дополнительно».
const rowCount = mainPackages.length + 1;

// Действия в раскрытой (красной) строке: тёмная кнопка и круглая ссылка в белой обводке.
const darkButton =
  "inline-flex min-h-12 items-center justify-center rounded-ui bg-night px-6 py-2 text-center font-semibold text-white transition-[scale,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97]";
const ringLink =
  "inline-flex size-28 items-center justify-center rounded-full border border-white text-center text-[length:var(--text-small)] font-semibold transition-[background-color,color,scale] duration-200 ease-out hover:bg-white hover:text-accent-strong active:scale-[0.97]";

/**
 * Услуги и цены на главной — по образцу mos-digital.com: огромное «Услуги.» и строки-аккордеоны
 * / 001 / … / 005 /. Строки свёрнуты; на компьютере раскрываются по наведению мыши, на телефоне
 * и с клавиатуры — нажатием. Раскрытая строка — красная (accent-strong) с белым текстом:
 * белый на ней проходит контраст AA и для обычного текста.
 */
export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="bg-ground pb-section pt-16">
      <Container>
        <Reveal>
          <p className="flex items-center gap-3 font-semibold">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-accent-ink">
              <circle cx="8" cy="8" r="8" fill="currentColor" />
              <path d="M8 4v8M4 8h8" stroke="var(--color-ground)" strokeWidth="1.8" />
            </svg>
            Что мы делаем
          </p>
          <h2
            id="pricing-title"
            className="mt-4 text-center text-[clamp(3.25rem,11vw,14rem)] font-medium leading-[0.85] tracking-[-0.04em]"
          >
            Услуги.
            <sup
              aria-hidden="true"
              className="ml-1 align-top text-[0.18em] font-normal tracking-normal text-accent-ink"
            >
              {rowCount}
            </sup>
            <span className="visually-hidden">
              {" "}
              {mainPackages.length} основных пакета и дополнительные услуги
            </span>
          </h2>
        </Reveal>
      </Container>

      <HoverAccordion className="mt-10 md:mt-14">
        {mainPackages.map((pack, i) => {
          const service = serviceForPackage(pack.slug);
          return (
            <ServiceRow key={pack.slug} i={i} title={pack.title}>
              <div className="md:col-span-6 md:col-start-2">
                <p className="max-w-[52ch] leading-snug">{service?.lead ?? pack.outcome}</p>
                <ul className="mt-6 grid gap-1.5">
                  {includesFor(pack.slug).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-1.5 shrink-0 bg-current"
                      />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-6 md:col-span-4 md:col-start-9">
                <div>
                  <p className="font-display text-[length:var(--text-statement)] leading-none">
                    {priceText(pack)}
                  </p>
                  <p className="mt-2">{pack.term}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link href={`/contacts?service=${pack.slug}#brief`} className={darkButton}>
                    {ctaText(pack)}
                  </Link>
                  <Link href={packageHref(pack.slug)} className={ringLink}>
                    Подробнее
                  </Link>
                </div>
              </div>
            </ServiceRow>
          );
        })}

        <ServiceRow i={mainPackages.length} title="Дополнительно">
          <ul className="grid gap-px overflow-hidden rounded-ui md:col-span-10 md:col-start-2 md:grid-cols-3">
            {extraPackages.map((p) => (
              <li key={p.slug} className="flex flex-col gap-4 bg-black/15 p-5 md:p-6">
                <p className="text-[length:var(--text-lead)] font-semibold leading-tight">
                  {p.title}
                </p>
                <p className="leading-snug">{p.outcome}</p>
                <div className="mt-auto pt-2">
                  <p className="font-display text-[length:var(--text-lead)] leading-none">
                    {priceText(p)}
                  </p>
                  <p className="mt-1 text-[length:var(--text-small)]">{p.term}</p>
                </div>
                <Link
                  href={packageHref(p.slug)}
                  className="inline-flex min-h-11 w-fit items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px]"
                >
                  Подробнее
                  <ArrowIcon />
                </Link>
              </li>
            ))}
          </ul>
        </ServiceRow>
        <div className="border-t border-line" />
      </HoverAccordion>

      <Container>
        <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/contacts#brief">Запросить оценку</ButtonLink>
          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            Что входит в каждый пакет и от чего зависит цена
            <ArrowIcon />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

/** Строка-аккордеон: номер, название прописными и «+/−»; содержимое — в красной заливке. */
function ServiceRow({ i, title, children }: { i: number; title: string; children: ReactNode }) {
  return (
    <details
      name="home-services"
      className="group border-t border-line transition-colors duration-300 open:border-transparent open:bg-accent-strong open:text-white"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 px-gutter py-5 md:gap-10 md:py-6 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:gap-10">
          <span className="whitespace-nowrap font-display text-[length:var(--text-small)] leading-none md:w-24 md:shrink-0 md:text-[length:var(--text-body)]">
            {index(i)}
          </span>
          <span className="min-w-0 font-display text-[clamp(1.25rem,3.4vw,5rem)] uppercase leading-[1] tracking-[-0.01em] transition-transform duration-300 ease-out [overflow-wrap:anywhere] md:group-open:translate-x-3">
            {title}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-current transition-transform duration-200 group-open:rotate-180"
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

      <div className="grid gap-8 px-gutter pb-8 md:grid-cols-12 md:gap-10 md:pb-10">{children}</div>
    </details>
  );
}
