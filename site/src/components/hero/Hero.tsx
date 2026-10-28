import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { services } from "@/content/services";
import { site } from "@/content/site";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

// Бегущая строка внизу первого экрана — названия услуг; дублируется, чтобы лента была бесшовной.
const ticker = services.map((s) => s.heading);

/**
 * Первый экран на всю высоту окна. Движение — фоном: медленно вращаются орбиты, по внешней
 * бежит красная точка; внизу — лента услуг. Заголовок не анимируется (LCP).
 * При «меньше движения» орбиты и лента стоят.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="surface-dark relative isolate flex min-h-svh flex-col overflow-hidden bg-ground text-fg"
    >
      <HeroOrbits />

      <div className="flex flex-1 flex-col justify-center gap-8 px-gutter pb-12 pt-[calc(5.5rem+clamp(1rem,5vh,4rem))] md:gap-10">
        {/* Без анимации входа: иначе Chrome не засчитывает заголовок как LCP до конца анимации. */}
        <h1
          id="hero-title"
          className="font-display text-[clamp(1.625rem,8.4vw,6.5rem)] font-normal leading-[1.02] tracking-[-0.015em] md:text-[min(5.6vw,10rem)]"
        >
          <span className="block md:whitespace-nowrap">B2B-компании </span>
          <span className="block md:whitespace-nowrap">со сложным продуктом</span>
        </h1>

        <p
          style={delay(90)}
          className="enter max-w-[46ch] leading-snug md:text-[length:var(--text-lead)]"
        >
          Проектирую структуру, дизайн и разработку корпоративных сайтов и каталогов для
          промышленности, строительства и технических услуг. Фиксированные пакеты, работа напрямую с
          исполнителем.
        </p>
        <div style={delay(180)} className="enter">
          <ButtonLink href={site.briefHref}>Обсудить проект</ButtonLink>
        </div>
      </div>

      {/* Лента дублирует названия услуг из меню — для программ чтения экрана скрыта. */}
      <div aria-hidden="true" className="overflow-hidden border-t border-line py-5">
        <div className="hero-ticker flex w-max gap-10 whitespace-nowrap font-display text-[clamp(1.125rem,2.2vw,2.75rem)] uppercase">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item}
              <span className="size-2 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Декоративные орбиты справа: тонкие окружности и красная точка на внешней. */
function HeroOrbits() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      className="pointer-events-none absolute -right-[30vw] top-1/2 -z-10 size-[min(150vw,64rem)] -translate-y-1/2 text-fg/15 sm:-right-[18vw] lg:-right-[8vw]"
    >
      <g className="hero-orbit-slow" style={{ transformOrigin: "300px 300px" }}>
        <circle cx="300" cy="300" r="290" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="10" r="7" className="fill-accent" />
      </g>
      <g className="hero-orbit-fast" style={{ transformOrigin: "300px 300px" }}>
        <circle
          cx="300"
          cy="300"
          r="210"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        <circle cx="510" cy="300" r="4" className="fill-fg/60" />
      </g>
      <circle cx="300" cy="300" r="130" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
