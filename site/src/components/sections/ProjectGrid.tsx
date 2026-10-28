import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

/**
 * С обложками: первый проект крупно слева, два — колонкой справа, остальные по два в ряд.
 * Пока скриншотов нет — равные карточки в ряд, без пустых «героев».
 */
export function ProjectGrid({ projects }: { projects: readonly CaseStudy[] }) {
  const [first, ...rest] = projects;
  if (!first) return null;

  if (!projects.some((p) => p.images?.length)) {
    return (
      <ul className="grid gap-3 md:grid-cols-3">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Reveal delay={(i % 3) * 80} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    );
  }
  const side = rest.slice(0, 2);
  const more = rest.slice(2);

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <ProjectCard project={first} large />
        </Reveal>
        {side.length ? (
          <div className="grid gap-3 lg:col-span-5">
            {side.map((project, i) => (
              <Reveal key={project.slug} delay={(i + 1) * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
      {more.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {more.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 80}>
              <ProjectCard project={project} large />
            </Reveal>
          ))}
        </div>
      ) : null}
    </div>
  );
}
