import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { stageIcons } from "@/components/sections/ProcessSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { processFaq } from "@/content/home";
import { faqLd } from "@/lib/structured-data";
import { Container } from "@/components/ui/Container";
import { indexLabel, SectionTitle } from "@/components/ui/SectionTitle";
import { getPackage } from "@/content/packages";
import { approvals, matrixPackages, processStages } from "@/content/process";

export const metadata: Metadata = {
  title: "Как проходит работа",
  description:
    "Семь этапов проекта: что происходит, что нужно от вас, что вы получаете и сколько это длится. Какие этапы входят в какой пакет и как устроены согласования.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/process", label: "Процесс работы" },
        ]}
        eyebrow="Как мы работаем"
        title="Как проходит работа"
        lead={
          <p>
            Семь этапов полного проекта сайта. Сроки этапов даны для корпоративного сайта, у
            каталога структура и разработка дольше. У аудита, прототипа и AI-пилота этапов меньше —
            это видно в таблице ниже.
          </p>
        }
      />

      <section aria-label="Этапы" className="py-section">
        <Container>
          <ol className="grid gap-3">
            {processStages.map((stage, i) => (
              <li key={stage.title}>
                <Reveal delay={Math.min(i, 2) * 60}>
                  {/* Карточка в обводке: при наведении обводка и значок краснеют. */}
                  <article className="group grid gap-8 rounded-ui border border-line p-6 transition-[border-color] duration-300 ease-out hover:border-accent md:p-8 lg:grid-cols-12 lg:gap-8 lg:p-10">
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex size-12 items-center justify-center rounded-ui border border-line text-accent-ink transition-[background-color,border-color,color] duration-300 ease-out group-hover:border-accent-strong group-hover:bg-accent-strong group-hover:text-white">
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
                            {stageIcons[i]}
                          </svg>
                        </span>
                        <span
                          aria-hidden="true"
                          className="font-display text-[length:var(--text-small)] text-accent-ink"
                        >
                          {indexLabel(i)}
                        </span>
                      </div>
                      <h2 className="mt-8 font-display text-[length:var(--text-statement)] font-normal leading-tight">
                        <span className="visually-hidden">Этап {i + 1}. </span>
                        {stage.title}
                      </h2>
                      <p className="mt-4 w-fit rounded-full border border-line px-3 py-1 text-[length:var(--text-small)]">
                        {stage.duration}
                      </p>
                    </div>
                    <p className="max-w-[48ch] lg:col-span-4">{stage.detail}</p>
                    <dl className="grid content-start gap-5 lg:col-span-4">
                      <div>
                        <dt className="font-display text-[length:var(--text-small)] text-accent-ink">
                          Что нужно от вас
                        </dt>
                        <dd className="mt-2">{stage.fromClient}</dd>
                      </div>
                      <div className="border-l-2 border-accent pl-4">
                        <dt className="font-display text-[length:var(--text-small)] text-accent-ink">
                          Что вы получаете
                        </dt>
                        <dd className="mt-2 font-semibold">{stage.youGet}</dd>
                      </div>
                    </dl>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="matrix-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="matrix-title" index={0}>
              Какие этапы в каком пакете
            </SectionTitle>
          </Reveal>
          {/* На телефоне — по пакетам списком, на ≥1024 px — таблица. */}
          <ul className="mt-12 border-b border-line lg:hidden">
            {matrixPackages.map((slug) => (
              <li key={slug} className="border-t border-line py-5">
                <p className="font-display uppercase leading-tight">{getPackage(slug).title}</p>
                <p className="mt-2">
                  {processStages
                    .filter((stage) => stage.in.includes(slug))
                    .map((stage) => stage.title)
                    .join(" → ")}
                </p>
              </li>
            ))}
          </ul>
          <Reveal delay={90} className="mt-16 hidden lg:block">
            <table className="w-full border-collapse text-left">
              <caption className="visually-hidden">Этапы работы по пакетам</caption>
              <thead>
                <tr className="border-b border-fg text-[length:var(--text-small)]">
                  <th scope="col" className="py-4 pl-3 pr-4 font-semibold">
                    Этап
                  </th>
                  {matrixPackages.map((slug) => (
                    <th key={slug} scope="col" className="px-2 py-4 text-center font-semibold">
                      {getPackage(slug).shortTitle}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processStages.map((stage, i) => (
                  <tr
                    key={stage.title}
                    className="border-b border-line transition-colors duration-200 hover:bg-fg/[0.04]"
                  >
                    <th scope="row" className="py-4 pl-3 pr-4 font-semibold">
                      <span
                        aria-hidden="true"
                        className="mr-4 font-display text-[length:var(--text-small)] font-normal text-accent-ink"
                      >
                        {indexLabel(i)}
                      </span>
                      {stage.title}
                    </th>
                    {matrixPackages.map((slug) => (
                      <td key={slug} className="px-2 py-4 text-center">
                        {stage.in.includes(slug) ? (
                          <>
                            <span
                              aria-hidden="true"
                              className="inline-flex size-7 items-center justify-center rounded-full bg-accent-strong text-white"
                            >
                              <svg viewBox="0 0 16 16" className="size-3.5">
                                <path
                                  d="m3 8.5 3 3 7-7"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>
                            <span className="visually-hidden">да</span>
                          </>
                        ) : (
                          <span className="text-fg-soft">
                            <span aria-hidden="true">—</span>
                            <span className="visually-hidden">нет</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="approvals-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="approvals-title" index={1}>
              Согласования и правки
            </SectionTitle>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
            {approvals.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 70} className="h-full">
                <article className="flex h-full flex-col rounded-ui border border-line p-6 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent md:p-7">
                  <span
                    aria-hidden="true"
                    className="font-display text-[length:var(--text-small)] text-accent-ink"
                  >
                    {indexLabel(i)}
                  </span>
                  <h3 className="mt-10 text-[length:var(--text-lead)] font-semibold leading-tight">
                    {a.title}
                  </h3>
                  <p className="mt-3">{a.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="faq" aria-labelledby="process-faq-title" className="pb-section">
        <JsonLd data={faqLd(processFaq)} />
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionTitle id="process-faq-title" index={2}>
              Вопросы о работе
            </SectionTitle>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-8">
            <FAQAccordion items={processFaq} />
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </main>
  );
}
