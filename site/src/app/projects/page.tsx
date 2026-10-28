import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { CTASection } from "@/components/sections/CTASection";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SampleSitemap } from "@/components/sections/SampleSitemap";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Проекты",
  description:
    "Сайты для строительных, инженерных и промышленных компаний: задача, структура, решения и результат каждого проекта.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const drafts = projects.filter((p) => p.status === "draft").length;

  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/projects", label: "Проекты" },
        ]}
        eyebrow="Работы"
        title="Проекты"
        lead={
          <p>
            Корпоративные сайты и каталоги для строительства, испытаний и поставки оборудования.
            Кейсы публикуются только с согласия клиента и без выдуманных цифр.
          </p>
        }
        aside={
          <div>
            <p className="font-semibold">Похожая задача?</p>
            <p className="mt-2">
              Расскажите о ней — пришлю предварительную оценку: состав, срок и стоимость.
            </p>
            <ButtonLink href={site.briefHref} className="mt-6">
              Обсудить проект
            </ButtonLink>
          </div>
        }
      />

      <section aria-label="Список проектов" className="py-section">
        <Container>
          {drafts ? (
            <p className="mb-10 max-w-[70ch] rounded-ui border border-draft/60 px-4 py-3 text-[length:var(--text-small)]">
              <span className="font-semibold">Кейсы готовятся к публикации.</span> Материалы и цифры
              показываю только с согласия клиента.
            </p>
          ) : null}
          <ProjectGrid projects={projects} />
        </Container>
      </section>

      {drafts ? (
        <section aria-label="Пример результата работы" className="pb-section">
          <Container>
            <SampleSitemap
              headingId="sample-title"
              title="Пример: карта сайта подрядчика"
              headingLevel="h2"
            />
          </Container>
        </section>
      ) : null}

      <CTASection />
    </main>
  );
}
