import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredProjects } from "@/content/projects";
import { ProjectGrid } from "./ProjectGrid";
import { SampleSitemap } from "./SampleSitemap";

/**
 * Проекты на главной. Пока ни один кейс не опубликован, вместо трёх пустых карточек —
 * образец работы с пометкой «пример» и одна строка о том, что кейсы готовятся.
 */
export function FeaturedProjects() {
  const published = featuredProjects.filter((p) => p.status === "published");

  return (
    <section aria-labelledby="projects-title" className="border-t border-line py-section">
      <Container>
        <SectionHeading id="projects-title" title="Проекты">
          <p className="text-[length:var(--text-lead)] leading-snug">
            Сайты для строительных, инженерных и промышленных компаний. Показываю задачу, структуру
            и решения — без выдуманных цифр.
          </p>
        </SectionHeading>

        <div className="mt-12 md:mt-16">
          {published.length ? (
            <ProjectGrid projects={published} />
          ) : (
            <SampleSitemap
              headingId="sample-title"
              title="Пример: карта сайта промышленного подрядчика"
            />
          )}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
          {published.length ? null : (
            <p className="text-fg-soft">Кейсы клиентов готовятся к публикации.</p>
          )}
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            Все проекты
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
