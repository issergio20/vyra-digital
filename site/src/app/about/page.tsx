import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { DraftText } from "@/components/ui/DraftText";
import { indexLabel, SectionTitle } from "@/components/ui/SectionTitle";
import { aiUsage, owner, principles, agencyFormat } from "@/content/about";

export const metadata: Metadata = {
  title: "Об агентстве",
  description:
    "VYRA Digital — независимое digital-агентство: один исполнитель на всём проекте, специалисты под задачу, AI для ускорения рутины и прозрачные условия.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/about", label: "Об агентстве" },
        ]}
        eyebrow="Агентство"
        title="Об агентстве"
        lead={
          <p>
            VYRA Digital — независимое digital-агентство. Сайты и каталоги для B2B-компаний со
            сложным продуктом делает один исполнитель, от брифа до запуска.
          </p>
        }
      />

      <section aria-labelledby="format-title" className="py-section">
        <Container>
          <Reveal>
            <SectionTitle id="format-title" index={0}>
              Формат агентства
            </SectionTitle>
          </Reveal>
          <ul className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3">
            {agencyFormat.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={i * 80} className="h-full">
                  <article className="flex h-full flex-col rounded-ui border border-line p-6 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent md:min-h-[20rem] md:p-8">
                    <span
                      aria-hidden="true"
                      className="font-display text-[length:var(--text-small)] text-accent-ink"
                    >
                      {indexLabel(i)}
                    </span>
                    <h3 className="mt-auto pt-12 font-display text-[length:var(--text-lead)] font-normal leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-4">{item.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="ai-title" className="pb-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionTitle id="ai-title" index={1}>
              Как я использую AI
            </SectionTitle>
          </Reveal>
          <div className="border-b border-line lg:col-span-8">
            {aiUsage.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 60}
                className="grid gap-3 border-t border-line py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:gap-8"
              >
                <h3 className="self-start text-[length:var(--text-lead)] font-semibold leading-tight">
                  {item.title}
                </h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="principles-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="principles-title" index={2}>
              Принципы
            </SectionTitle>
          </Reveal>
          <ul className="mt-12 border-b border-line md:mt-16">
            {principles.map((p, i) => (
              <li key={p} className="group border-t border-line">
                <Reveal
                  delay={Math.min(i, 3) * 60}
                  className="grid gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10"
                >
                  <span
                    aria-hidden="true"
                    className="pt-[0.4em] font-display text-[length:var(--text-small)] leading-none text-accent-ink md:col-span-2"
                  >
                    {indexLabel(i)}
                  </span>
                  <p className="max-w-[34ch] font-display text-[clamp(1.25rem,2.4vw,3.25rem)] font-normal leading-[1.1] transition-transform duration-300 ease-out md:col-span-10 md:group-hover:translate-x-2">
                    {p}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="who-title" className="pb-section">
        <Container>
          <Reveal className="grid gap-10 rounded-ui border border-line p-6 md:p-10 lg:grid-cols-12 lg:gap-8">
            <SectionTitle id="who-title" index={3} className="lg:col-span-5">
              Кто делает проекты
            </SectionTitle>
            <div className="grid content-start gap-6 lg:col-span-7">
              <p className="text-[length:var(--text-statement)] font-semibold leading-tight tracking-[-0.01em]">
                {owner.role}
              </p>
              <DraftText text={owner.pending} className="max-w-[60ch]" />
            </div>
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </main>
  );
}
