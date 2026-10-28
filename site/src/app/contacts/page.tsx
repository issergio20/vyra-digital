import type { Metadata } from "next";
import Link from "next/link";
import { ProjectBriefForm } from "@/components/forms/ProjectBriefForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { nextSteps } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { DraftText } from "@/components/ui/DraftText";
import { indexLabel, SectionTitle } from "@/components/ui/SectionTitle";
import { ask } from "@/content/draft";
import { estimateInputs } from "@/content/home";
import { site, socialLinks } from "@/content/site";

export const metadata: Metadata = {
  title: "Обсудить проект",
  description:
    "Расскажите о задаче: сайт, каталог, UX-аудит или автоматизация. Предварительная оценка состава, срока и стоимости после короткого созвона.",
  alternates: { canonical: "/contacts" },
};

// Контакты владелец не предоставил (CONTENT_REQUIREMENTS.md §3). E-mail и мессенджеры — из окружения.
const channels = [
  ...(site.contactEmail ? [] : [ask("E-mail для заявок.")]),
  ...(socialLinks.length
    ? []
    : [ask("Telegram или другой мессенджер — если владелец готов его публиковать.")]),
  ask("Срок ответа, который владелец готов обещать, например «в течение рабочего дня»."),
];

const inlineLink = "font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink";
const linkClass =
  "inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink";

export default function ContactsPage() {
  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/contacts", label: "Контакты" },
        ]}
        eyebrow="Новый проект"
        title="Обсудить проект"
        lead={
          <p>
            Опишите задачу — пришлю предварительную оценку: состав работ, срок и стоимость. Это ни к
            чему не обязывает.
          </p>
        }
      />

      <section id="brief" aria-labelledby="brief-title" className="py-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <SectionTitle id="brief-title" index={0}>
              Заявка
            </SectionTitle>
            <p className="mt-6 max-w-[40ch]">Чтобы оценка была точнее, напишите в заявке:</p>
            <ol className="mt-6 border-b border-line">
              {estimateInputs.map((item, i) => (
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

            <div className="mt-10">
              <h3 className="font-display text-[length:var(--text-small)] font-normal text-accent-ink">
                Прямые контакты
              </h3>
              <ul className="mt-4 grid gap-3">
                {site.contactEmail ? (
                  <li>
                    <a href={`mailto:${site.contactEmail}`} className={linkClass}>
                      {site.contactEmail}
                    </a>
                  </li>
                ) : null}
                {socialLinks.map((s) => (
                  <li key={s.id}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {s.label}
                    </a>
                  </li>
                ))}
                {channels.map((c) => (
                  <li key={c}>
                    <DraftText text={c} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-7">
            <ProjectBriefForm />
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="after-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="after-title" index={1}>
              Что дальше
            </SectionTitle>
          </Reveal>
          <ol className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3">
            {nextSteps.map((step, i) => (
              <li key={step}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col rounded-ui border border-line p-6 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent md:min-h-[14rem] md:p-8">
                    <span
                      aria-hidden="true"
                      className="font-display text-[length:var(--text-small)] text-accent-ink"
                    >
                      {indexLabel(i)}
                    </span>
                    <p className="mt-auto pt-10 text-[length:var(--text-lead)] leading-snug">
                      {step}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mt-10">
            <p className="max-w-[52ch]">
              А пока можно посмотреть{" "}
              <Link href="/pricing" className={inlineLink}>
                цены и состав пакетов
              </Link>{" "}
              или{" "}
              <Link href="/process" className={inlineLink}>
                как проходит работа
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
