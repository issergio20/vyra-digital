import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { indexLabel } from "@/components/ui/SectionTitle";
import { site } from "@/content/site";

export const nextSteps = [
  "Вы коротко описываете задачу в форме — 2–3 минуты.",
  "Созваниваемся на 30–40 минут, уточняю детали.",
  "Присылаю предварительную оценку: состав, срок, стоимость.",
];

/**
 * Финальный призыв — красный блок во всю ширину, как раскрытая строка услуг: белый текст
 * на accent-strong проходит AA. `briefHref` — с предвыбранной услугой, `pricesHref` — null,
 * если страница сама про цены.
 */
export function CTASection({
  briefHref = site.briefHref,
  pricesHref = "/pricing",
}: {
  briefHref?: string;
  pricesHref?: string | null;
}) {
  return (
    <section
      aria-labelledby="cta-title"
      className="surface-dark overflow-hidden bg-accent-strong py-section text-white [--focus:#fff]"
    >
      <Container>
        <Reveal>
          <h2
            id="cta-title"
            className="max-w-[14ch] font-display text-[clamp(2.25rem,7.4vw,9.5rem)] font-normal leading-[0.92] tracking-[-0.02em]"
          >
            Расскажите о задаче
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 border-t border-white/35 pt-10 md:mt-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <p className="max-w-[40ch] text-[length:var(--text-lead)] leading-snug">
              Оценка ни к чему не обязывает. Если задача не моя — скажу сразу.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href={briefHref} variant="night">
                Обсудить проект
              </ButtonLink>
              {pricesHref ? (
                <Link
                  href={pricesHref}
                  className="group inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px]"
                >
                  Сначала посмотреть цены
                  <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
            <h3 className="font-display text-[length:var(--text-small)]">Что будет после заявки</h3>
            <ol className="mt-6 grid gap-px overflow-hidden rounded-ui border border-white/35 sm:grid-cols-3">
              {nextSteps.map((step, i) => (
                <li
                  key={step}
                  className="flex flex-col gap-6 border-white/35 p-5 max-sm:not-first:border-t sm:not-first:border-l"
                >
                  <span aria-hidden="true" className="font-display text-[length:var(--text-small)]">
                    {indexLabel(i)}
                  </span>
                  <span className="mt-auto leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
