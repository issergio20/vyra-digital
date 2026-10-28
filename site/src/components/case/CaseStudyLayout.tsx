import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { getAdjacentProjects, type CaseStudy } from "@/content/projects";
import { site } from "@/content/site";
import { DraftText } from "@/components/ui/DraftText";

/** Строка кейса: заголовок слева, содержание справа. Пустые секции не выводятся. */
function CaseRow({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Reveal className="grid gap-4 lg:grid-cols-12 lg:gap-8">
      <h2
        id={id}
        className="self-start text-[length:var(--text-lead)] font-semibold leading-tight lg:col-span-4"
      >
        {title}
      </h2>
      <div className="max-w-[60ch] lg:col-span-7 lg:col-start-6">{children}</div>
    </Reveal>
  );
}

export function CaseStudyLayout({ project }: { project: CaseStudy }) {
  const { prev, next } = getAdjacentProjects(project.slug);
  const facts: { label: string; value: string }[] = [
    { label: "Отрасль", value: project.industry },
    { label: "Тип работ", value: project.kind },
    ...(project.year ? [{ label: "Год", value: project.year }] : []),
  ];

  const process: { id: string; title: string; text?: string }[] = [
    { id: "research", title: "Исследование и исходные данные", text: project.research },
    { id: "architecture", title: "Сценарии и структура", text: project.architecture },
    { id: "prototyping", title: "Прототипирование", text: project.prototyping },
    { id: "ui", title: "UI-концепция", text: project.uiConcept },
    { id: "adaptive", title: "Адаптивные состояния", text: project.adaptive },
  ];

  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/projects", label: "Проекты" },
          { href: `/projects/${project.slug}`, label: project.title },
        ]}
        eyebrow="Кейс"
        title={project.title}
        lead={<p>{project.task}</p>}
        aside={
          <>
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-5">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[length:var(--text-small)] text-fg-soft">{f.label}</dt>
                  <dd className="mt-1 font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
            {project.url ? (
              <a
                href={project.url}
                className="inline-flex min-h-11 items-center mt-8 font-semibold underline decoration-2 underline-offset-[6px]"
              >
                Открыть сайт проекта
              </a>
            ) : null}
          </>
        }
      />

      <section aria-labelledby="context-title" className="py-section">
        <Container>
          <h2 id="context-title" className="visually-hidden">
            Контекст проекта
          </h2>
          <div className="grid gap-12 md:grid-cols-2 lg:gap-x-8 lg:gap-y-14">
            {[
              { title: "О компании", text: project.business },
              { title: "Задача", text: project.goal },
              { title: "Аудитория", text: project.audience },
              { title: "Проблема", text: project.problem },
              { title: "Роль исполнителя", text: project.role },
              ...(project.constraints ? [{ title: "Ограничения", text: project.constraints }] : []),
            ].map((block, i) => (
              <Reveal key={block.title} delay={(i % 2) * 80}>
                <h3 className="text-[length:var(--text-lead)] font-semibold leading-tight">
                  {block.title}
                </h3>
                <DraftText text={block.text} className="mt-3 max-w-[52ch]" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="process-case-title" className="border-t border-line py-section">
        <Container>
          <Reveal>
            <h2
              id="process-case-title"
              className="font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]"
            >
              Как решали
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-14 md:mt-16">
            {process
              .filter((row): row is typeof row & { text: string } => Boolean(row.text))
              .map((row) => (
                <CaseRow key={row.id} id={`case-${row.id}`} title={row.title}>
                  <DraftText text={row.text} />
                </CaseRow>
              ))}

            {project.decisions?.length ? (
              <CaseRow id="case-decisions" title="Ключевые решения">
                <ul className="grid gap-4">
                  {project.decisions.map((d) => (
                    <li key={d}>
                      <DraftText text={d} />
                    </li>
                  ))}
                </ul>
              </CaseRow>
            ) : null}
          </div>

          {project.images?.length ? (
            <div className="mt-16 grid gap-2 md:grid-cols-2">
              {project.images.map((img) => (
                <figure key={img.src}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                  {img.caption ? (
                    <figcaption className="mt-2 text-[length:var(--text-small)] text-fg-soft">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      <section aria-labelledby="outcome-title" className="border-t border-line py-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <h2
              id="outcome-title"
              className="font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]"
            >
              Результат
            </h2>
          </Reveal>
          <Reveal delay={90} className="grid max-w-[60ch] gap-8 lg:col-span-7 lg:col-start-6">
            <DraftText text={project.outcome} />
            {project.results?.length ? (
              <div>
                <h3 className="text-[length:var(--text-lead)] font-semibold">
                  Подтверждённые результаты
                </h3>
                <ul className="mt-3 grid gap-2">
                  {project.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.conclusions ? (
              <div>
                <h3 className="text-[length:var(--text-lead)] font-semibold">
                  Выводы и что дальше
                </h3>
                <DraftText text={project.conclusions} className="mt-3" />
              </div>
            ) : null}
          </Reveal>
        </Container>
      </section>

      <nav aria-label="Другие проекты" className="py-section">
        <Container className="grid gap-2 md:grid-cols-2">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group block rounded-ui border border-line p-6 transition-colors duration-300 hover:border-accent"
            >
              <span className="text-[length:var(--text-small)] text-fg-soft">
                Предыдущий проект
              </span>
              <span className="mt-2 block hyphens-auto break-words font-display text-[length:var(--text-statement)] font-normal leading-tight">
                {prev.title}
              </span>
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group block rounded-ui border border-line p-6 text-left transition-colors duration-300 hover:border-accent md:text-right"
            >
              <span className="text-[length:var(--text-small)] text-fg-soft">Следующий проект</span>
              <span className="mt-2 block hyphens-auto break-words font-display text-[length:var(--text-statement)] font-normal leading-tight">
                {next.title}
              </span>
            </Link>
          ) : null}
        </Container>
        <Container className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="text-[length:var(--text-lead)] font-semibold">Похожая задача?</p>
          <ButtonLink href={site.briefHref}>Обсудить проект</ButtonLink>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            Все проекты
          </Link>
        </Container>
      </nav>
    </main>
  );
}
