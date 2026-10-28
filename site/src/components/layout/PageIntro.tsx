import type { CSSProperties, ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { breadcrumbLd } from "@/lib/structured-data";

// Кегль H1 — по самому длинному слову: Benzin широкий, «конфиденциальности» в 9vw не влезет в телефон.
function titleSize(title: string) {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  if (longest <= 10) return "text-[clamp(2.5rem,9vw,11rem)]";
  if (longest <= 14) return "text-[clamp(2rem,6.4vw,8rem)]";
  return "text-[clamp(1.5rem,4.8vw,6rem)]";
}

/**
 * Вступление внутренней страницы — как «Услуги.» на главной: подпись с красным плюсом,
 * огромный H1 Benzin с красной точкой, под линией — вводный текст и `aside` (факты, действие).
 */
export function PageIntro({
  crumbs,
  eyebrow,
  title,
  lead,
  aside,
}: {
  crumbs: readonly Crumb[];
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="surface-dark bg-ground px-gutter pb-14 pt-28 text-fg md:pb-20 md:pt-36"
    >
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      {eyebrow ? (
        <p className="enter mt-8 flex items-center gap-3 font-semibold md:mt-12">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-accent-ink">
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <path d="M8 4v8M4 8h8" stroke="var(--color-ground)" strokeWidth="1.8" />
          </svg>
          {eyebrow}
        </p>
      ) : null}
      <h1
        id="page-title"
        className={`enter mt-5 max-w-[16ch] font-display font-normal leading-[0.92] tracking-[-0.02em] ${titleSize(title)}`}
        style={{ "--enter-delay": "60ms" } as CSSProperties}
      >
        {title}
        <span aria-hidden="true" className="text-accent-ink">
          .
        </span>
      </h1>

      {lead || aside ? (
        <div
          className="enter mt-12 grid gap-10 border-t border-line pt-8 md:mt-16 md:pt-10 lg:grid-cols-12 lg:gap-8"
          style={{ "--enter-delay": "150ms" } as CSSProperties}
        >
          {lead ? (
            <div className="max-w-[52ch] text-[length:var(--text-lead)] leading-snug lg:col-span-6">
              {lead}
            </div>
          ) : null}
          {aside ? <div className="lg:col-span-4 lg:col-start-9">{aside}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
