import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PackageDetails } from "@/components/sections/PackageDetails";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { indexLabel, SectionTitle } from "@/components/ui/SectionTitle";
import { ctaText, getPackage, priceText } from "@/content/packages";
import { getProject } from "@/content/projects";
import { getService, services } from "@/content/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd, serviceLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.lead,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const main = getPackage(service.packageSlug);
  // «Похожий проект» — только опубликованный кейс, пустую карточку не показываем.
  const related = service.relatedProject ? getProject(service.relatedProject) : undefined;
  const project = related?.status === "published" ? related : undefined;
  const briefHref = `/contacts?service=${main.slug}#brief`;

  // Номера секций идут подряд: блок «Похожий проект» есть не у каждой услуги.
  let section = 0;
  const next = () => section++;

  return (
    <main>
      <JsonLd
        data={serviceLd({
          name: service.heading,
          description: service.lead,
          path: `/services/${service.slug}`,
        })}
      />
      <JsonLd data={faqLd(service.faq)} />
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/services", label: "Услуги" },
          { href: `/services/${service.slug}`, label: service.title },
        ]}
        eyebrow="Услуга"
        title={service.heading}
        lead={<p>{service.lead}</p>}
        aside={
          <div>
            <dl className="grid grid-cols-2 overflow-hidden rounded-ui border border-line">
              <div className="p-5">
                <dt className="text-[length:var(--text-small)] text-fg-soft">Срок</dt>
                <dd className="mt-2 font-display text-[length:var(--text-lead)] leading-tight">
                  {main.term}
                </dd>
              </div>
              <div className="border-l border-line p-5">
                <dt className="text-[length:var(--text-small)] text-fg-soft">Стоимость</dt>
                <dd className="mt-2 font-display text-[length:var(--text-lead)] leading-tight text-accent-ink">
                  {priceText(main)}
                </dd>
              </div>
            </dl>
            <ButtonLink href={briefHref} className="mt-6 w-full sm:w-auto">
              {ctaText(main)}
            </ButtonLink>
          </div>
        }
      />

      <section aria-labelledby="signs-title" className="py-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionTitle id="signs-title" index={next()}>
              Когда это нужно
            </SectionTitle>
            <p className="mt-6 max-w-[36ch]">
              Узнаёте свою ситуацию хотя бы в одном пункте — услуга подходит.
            </p>
          </Reveal>
          <ul className="border-b border-line lg:col-span-7 lg:col-start-6">
            {service.signs.map((sign, i) => (
              <li key={sign} className="border-t border-line">
                <Reveal
                  delay={Math.min(i, 3) * 60}
                  className="grid gap-3 py-7 sm:grid-cols-[4.5rem_1fr] sm:gap-6"
                >
                  <span
                    aria-hidden="true"
                    className="pt-[0.35em] font-display text-[length:var(--text-small)] leading-none text-accent-ink"
                  >
                    {indexLabel(i)}
                  </span>
                  <p className="max-w-[40ch] text-[length:var(--text-statement)] font-semibold leading-tight tracking-[-0.01em]">
                    {sign}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="packages-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="packages-title" index={next()}>
              {service.packageSlugs.length > 1 ? "Пакеты и условия" : "Состав и условия"}
            </SectionTitle>
          </Reveal>
          <div className="mt-12 grid gap-6 md:mt-16">
            {service.packageSlugs.map((slug) => (
              <Reveal key={slug}>
                <PackageDetails pack={getPackage(slug)} headingLevel="h3" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="steps-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="steps-title" index={next()}>
              Как проходит работа
            </SectionTitle>
          </Reveal>
          <ol className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
            {service.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={(i % 5) * 60} className="h-full">
                  <article className="group flex h-full flex-col rounded-ui border border-line p-6 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent md:p-7">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 items-center justify-center rounded-full border border-line font-display text-[length:var(--text-small)] text-accent-ink transition-[background-color,border-color,color] duration-300 group-hover:border-accent-strong group-hover:bg-accent-strong group-hover:text-white"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-10 text-[length:var(--text-lead)] font-semibold leading-tight">
                      <span className="visually-hidden">Шаг {i + 1}. </span>
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[length:var(--text-small)] leading-snug">{step.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {project ? (
        <section aria-labelledby="related-title" className="pb-section">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <SectionTitle id="related-title" index={next()}>
                Похожий проект
              </SectionTitle>
            </Reveal>
            <Reveal delay={90} className="lg:col-span-8">
              <ProjectCard project={project} large />
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="service-faq-title" className="pb-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionTitle id="service-faq-title" index={next()}>
              Вопросы
            </SectionTitle>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-8">
            <FAQAccordion items={service.faq} />
          </Reveal>
        </Container>
      </section>

      <CTASection briefHref={briefHref} />
    </main>
  );
}
