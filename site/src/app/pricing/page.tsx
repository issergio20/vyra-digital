import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PackageDetails } from "@/components/sections/PackageDetails";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { DraftText } from "@/components/ui/DraftText";
import { OpenOnHash } from "@/components/ui/OpenOnHash";
import { indexLabel, SectionTitle } from "@/components/ui/SectionTitle";
import { estimateInputs, priceFactors } from "@/content/home";
import { commonTerms, extraPackages, mainPackages, packages, priceText } from "@/content/packages";
import { site } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Цены и пакеты",
  description:
    "Стартовые цены, сроки и состав пакетов: корпоративный сайт, каталог, UX-аудит, посадочная страница, дизайн в Figma, AI-автоматизация и поддержка.",
  alternates: { canonical: "/pricing" },
};

const pricingFaq = [
  {
    question: "Почему цена «от»?",
    answer:
      "Пакет описывает типовой объём. Цена растёт, если шаблонов больше, нужны интеграции или срочный запуск. Итоговая сумма фиксируется в договоре до начала работы.",
  },
  {
    question: "Можно ли платить частями?",
    answer:
      "Да: оплата привязана к этапам. Для сайтов — 30 % на старте, 40 % после дизайна, 30 % после запуска; для небольших работ — 50/50.",
  },
  {
    question: "Что, если в процессе понадобится что-то ещё?",
    answer: "Сначала оценка, потом работа. Без вашего согласия объём и стоимость не меняются.",
  },
  {
    question: "Работаете ли вы с НДС?",
    answer: "[ЧЕРНОВИК] Зависит от юридической формы исполнителя — уточняется владельцем.",
  },
];

const groups = [
  { label: "Основные", items: mainPackages },
  { label: "Дополнительно", items: extraPackages },
];

const checklists = [
  { id: "factors-title", title: "От чего зависит цена", items: priceFactors },
  { id: "inputs-title", title: "Что нужно для оценки", items: estimateInputs },
];

export default function PricingPage() {
  return (
    <main>
      <JsonLd data={faqLd(pricingFaq)} />
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/pricing", label: "Цены и пакеты" },
        ]}
        eyebrow="Стоимость"
        title="Цены и пакеты"
        lead={
          <p>
            Стартовые цены и состав каждого пакета — до первого звонка. Точная смета появляется
            после брифа и фиксируется в договоре.
          </p>
        }
        aside={
          <div className="grid gap-5">
            <p>Опишите задачу в брифе — в ответ пришлю смету и срок.</p>
            <div>
              <ButtonLink href={site.briefHref}>Запросить оценку</ButtonLink>
            </div>
          </div>
        }
      />
      <OpenOnHash />

      <section id="compare" aria-labelledby="compare-title" className="py-section">
        <Container>
          <Reveal>
            <SectionTitle id="compare-title" index={0}>
              Сравнение пакетов
            </SectionTitle>
          </Reveal>
          {/* На телефоне — список, на ≥768 px — таблица: без горизонтальной прокрутки. */}
          {groups.map((group) => (
            <div key={group.label} className="mt-12 md:hidden">
              <h3 className="font-display text-[length:var(--text-small)] font-normal text-accent-ink">
                {group.label}
              </h3>
              <ul className="mt-4 border-b border-line">
                {group.items.map((p) => (
                  <li key={p.slug} className="border-t border-line">
                    <a href={`#${p.slug}`} className="group flex items-center gap-4 py-5">
                      <span className="min-w-0 flex-1">
                        <span className="block font-display uppercase leading-tight group-hover:text-accent-ink">
                          {p.title}
                        </span>
                        <span className="mt-2 block font-semibold">
                          {priceText(p)} · {p.term}
                        </span>
                        {p.priceNote ? (
                          <span className="mt-1 block text-[length:var(--text-small)] text-fg-soft">
                            {p.priceNote}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-[length:var(--text-small)] text-fg-soft">
                          Правки: {p.revisions}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line"
                      >
                        <ArrowIcon className="rotate-90" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Reveal delay={90} className="mt-16 hidden md:block">
            <table className="w-full border-collapse text-left">
              <caption className="visually-hidden">
                Пакеты: стартовая цена, срок, правки и оплата
              </caption>
              <thead>
                <tr className="border-b border-fg text-[length:var(--text-small)] text-fg-soft">
                  <th scope="col" className="py-4 pl-3 pr-6 font-semibold">
                    Пакет
                  </th>
                  <th scope="col" className="py-4 pr-6 font-semibold">
                    Стоимость
                  </th>
                  <th scope="col" className="py-4 pr-6 font-semibold">
                    Срок
                  </th>
                  <th scope="col" className="py-4 pr-3 font-semibold">
                    Правки
                  </th>
                </tr>
              </thead>
              {groups.map((group) => (
                <tbody key={group.label}>
                  <tr>
                    <th
                      scope="rowgroup"
                      colSpan={4}
                      className="pb-3 pl-3 pt-10 font-display text-[length:var(--text-small)] font-normal text-accent-ink"
                    >
                      {group.label}
                    </th>
                  </tr>
                  {/* Строка при наведении — красная с белым текстом, как строки услуг на главной. */}
                  {group.items.map((p) => (
                    <tr
                      key={p.slug}
                      className="group border-t border-line align-top transition-colors duration-200 hover:bg-accent-strong hover:text-white"
                    >
                      <th scope="row" className="py-5 pl-3 pr-6 font-normal">
                        <a
                          href={`#${p.slug}`}
                          className="font-display uppercase leading-tight underline-offset-4 hover:underline"
                        >
                          {p.title}
                        </a>
                      </th>
                      <td className="py-5 pr-6">
                        <span className="block whitespace-nowrap font-semibold">{priceText(p)}</span>
                        {p.priceNote ? (
                          <span className="mt-1 block max-w-[28ch] text-[length:var(--text-small)] text-fg-soft group-hover:text-white">
                            {p.priceNote}
                          </span>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap py-5 pr-6">{p.term}</td>
                      <td className="py-5 pr-3">{p.revisions}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="details-title" className="pb-section">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <SectionTitle id="details-title" index={1} className="lg:col-span-7">
              Что входит в каждый пакет
            </SectionTitle>
            <p className="max-w-[44ch] lg:col-span-4 lg:col-start-9">
              Нажмите на пакет, чтобы открыть состав, границы и условия.
            </p>
          </Reveal>
          <div className="mt-12 border-b border-line md:mt-16">
            {packages.map((p) => (
              <PackageDetails key={p.slug} pack={p} headingLevel="h3" collapsible />
            ))}
          </div>
        </Container>
      </section>

      <section aria-label="Цена и оценка" className="pb-section">
        <Container className="grid gap-3 md:grid-cols-2">
          {checklists.map((block, b) => (
            <Reveal
              key={block.id}
              delay={b * 90}
              className="h-full rounded-ui border border-line p-6 md:p-10"
            >
              <SectionTitle id={block.id} index={2 + b}>
                {block.title}
              </SectionTitle>
              <ol className="mt-10 border-b border-line">
                {block.items.map((item, i) => (
                  <li key={item} className="flex gap-5 border-t border-line py-4">
                    <span
                      aria-hidden="true"
                      className="w-16 shrink-0 whitespace-nowrap pt-[0.2em] font-display text-[length:var(--text-small)] text-accent-ink"
                    >
                      {indexLabel(i)}
                    </span>
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </Container>
      </section>

      <section aria-labelledby="terms-title" className="pb-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionTitle id="terms-title" index={4}>
              Общие условия
            </SectionTitle>
          </Reveal>
          <ul className="border-b border-line lg:col-span-7 lg:col-start-6">
            {commonTerms.map((term) => (
              <li key={term} className="border-t border-line py-5">
                <Reveal>
                  <DraftText text={term} className="max-w-[60ch]" />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="pricing-faq-title" className="pb-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionTitle id="pricing-faq-title" index={5}>
              Вопросы о цене
            </SectionTitle>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-8">
            <FAQAccordion items={pricingFaq} />
          </Reveal>
        </Container>
      </section>

      <CTASection pricesHref={null} />
    </main>
  );
}
