import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import type { CaseStudy } from "@/content/projects";

/**
 * Карточка проекта. Опубликованный кейс — целиком ссылка; черновой — просто описание
 * без ссылки: отдельной страницы у него нет, пока нет данных и согласия клиента.
 * Черновые карточки показываются только на /projects, под плашкой «Кейсы готовятся».
 * Обложка — только настоящий скриншот, без пустых заглушек.
 */
export function ProjectCard({ project, large = false }: { project: CaseStudy; large?: boolean }) {
  const titleId = `project-${project.slug}`;
  const isDraft = project.status === "draft";
  const cover = project.images?.[0];

  const body: ReactNode = (
    <>
      {large && cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <div className="flex h-full flex-col p-6 md:p-8">
        <h3
          id={titleId}
          className={`font-display font-normal leading-[1.1] ${isDraft ? "" : "group-hover:text-accent-ink"} ${large ? "text-[length:var(--text-lead)] md:text-[length:var(--text-statement)]" : "text-[length:var(--text-lead)]"}`}
        >
          {project.title}
        </h3>
        <p className="mt-3 text-[length:var(--text-small)] text-accent-ink">
          {project.industry} · {project.kind}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <p className="mt-4 max-w-[52ch]">{project.task}</p>
        {/* У черновика подписи нет: на /projects над сеткой одна плашка «Кейсы готовятся». */}
        {isDraft ? null : (
          <p className="mt-auto inline-flex items-center gap-3 pt-6 text-[length:var(--text-small)] font-semibold">
            <span className="inline-flex size-10 items-center justify-center rounded-full border border-fg/40 transition-colors duration-200 group-hover:border-accent-strong group-hover:bg-accent-strong group-hover:text-white">
              <ArrowIcon />
            </span>
            Смотреть кейс
          </p>
        )}
      </div>
    </>
  );

  return (
    <article
      aria-labelledby={titleId}
      className="h-full overflow-hidden rounded-ui border border-line transition-[border-color,translate] duration-300 ease-out has-[a:hover]:-translate-y-1 has-[a:hover]:border-accent"
    >
      {isDraft ? (
        body
      ) : (
        <Link
          href={`/projects/${project.slug}`}
          className="group block h-full"
        >
          {body}
        </Link>
      )}
    </article>
  );
}
