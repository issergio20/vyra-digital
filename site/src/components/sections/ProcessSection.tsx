import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Container } from "@/components/ui/Container";
import { getPackage } from "@/content/packages";
import { processStages } from "@/content/process";

// Линейные значки этапов: штрих 1.6, скругления — как у остальных значков сайта.
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const stageIcons: readonly ReactNode[] = [
  // Знакомство и бриф — разговор
  <g key="brief" {...stroke}>
    <path d="M4 5h11v8H9l-4 3v-3H4z" />
    <path d="M15 9h5v8h-1v3l-4-3h-4v-2" />
  </g>,
  // Анализ задачи — лупа
  <g key="analysis" {...stroke}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5 5M8 10.5h5M10.5 8v5" />
  </g>,
  // Структура и прототип — карта страниц
  <g key="structure" {...stroke}>
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <rect x="3" y="16" width="6" height="5" rx="1" />
    <rect x="15" y="16" width="6" height="5" rx="1" />
    <path d="M12 7v4M6 16v-3h12v3" />
  </g>,
  // Дизайн — перо
  <g key="design" {...stroke}>
    <path d="M12 3 5 10l3 8h8l3-8z" />
    <path d="M12 3v8" />
    <circle cx="12" cy="12.5" r="1.5" />
    <path d="M8 21h8" />
  </g>,
  // Разработка — код
  <g key="dev" {...stroke}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  </g>,
  // Тестирование — щит с галочкой
  <g key="qa" {...stroke}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </g>,
  // Передача и поддержка — ракета
  <g key="launch" {...stroke}>
    <path d="M14 4c3-1 5-1 6 0 1 1 1 3 0 6l-6 6-6-6z" />
    <path d="M8 10 5 9l-2 3 4 1M14 16l1 3-3 2-1-4" />
    <circle cx="15.5" cy="8.5" r="1.5" />
    <path d="M5 19c0-1.5 1-3 2.5-3" />
  </g>,
];

/**
 * Процесс на главной — семь карточек этапов в обводке: значок, номер, название и срок;
 * при наведении мышью вместо срока — суть этапа. Восьмая, красная, — итоговый срок.
 */
export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="py-section">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <h2
              id="process-title"
              className="font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]"
            >
              Как идёт работа
            </h2>
          </Reveal>
          <Reveal delay={90} className="max-w-[48ch] lg:col-span-5 lg:col-start-8">
            <p>
              Семь этапов полного проекта сайта. У аудита, прототипа и AI-пилота их меньше. Каждый
              этап заканчивается показом и вашим «да».
            </p>
          </Reveal>
        </div>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {processStages.map((stage, i) => (
            <li key={stage.title}>
              <Reveal delay={(i % 4) * 70} className="h-full">
                {/* Обычное состояние — название и срок; при наведении мышью вместо срока
                    проявляется суть этапа. Без мыши (телефон, планшет) видно всё сразу. */}
                <article className="group relative flex h-full flex-col rounded-ui border border-line p-6 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent sm:min-h-[16rem] md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-12 items-center justify-center rounded-ui border border-line text-accent-ink transition-[background-color,border-color,color] duration-300 ease-out group-hover:border-accent-strong group-hover:bg-accent-strong group-hover:text-white">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
                        {stageIcons[i]}
                      </svg>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-[length:var(--text-small)] text-accent-ink"
                    >
                      / {String(i + 1).padStart(2, "0")} /
                    </span>
                  </div>
                  <h3 className="mt-auto pt-8 text-[length:var(--text-lead)] font-semibold leading-tight sm:pt-12">
                    <span className="visually-hidden">Этап {i + 1}. </span>
                    {stage.title}
                  </h3>
                  {/* С мышью оба абзаца лежат в одной ячейке и сменяют друг друга; без мыши — друг под другом. */}
                  <div className="mt-4 grid gap-3">
                    <p className="text-[length:var(--text-small)] leading-snug transition-[opacity,translate] duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:[grid-area:1/1] [@media(hover:hover)_and_(pointer:fine)]:translate-y-2 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100">
                      {stage.text}
                    </p>
                    <p className="w-fit self-start rounded-full border border-line px-3 py-1 text-[length:var(--text-small)] transition-[opacity,translate] duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:[grid-area:1/1] [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-0">
                      {stage.duration}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={210} className="h-full">
              <Link
                href="/process"
                className="group flex h-full min-h-[12rem] flex-col rounded-ui bg-accent-strong p-6 text-white transition-[translate,background-color] duration-300 ease-out hover:-translate-y-1 hover:bg-accent-strong-pressed sm:min-h-[16rem] md:p-7"
              >
                <span className="font-display text-[length:var(--text-statement)] leading-tight">
                  {getPackage("corporate").term}
                </span>
                <span className="mt-2">корпоративный сайт целиком</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-10 font-semibold">
                  Что происходит на каждом этапе
                  <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          </li>
        </ol>
      </Container>
    </section>
  );
}
