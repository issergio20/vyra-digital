import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPackage, priceText } from "@/content/packages";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Корпоративные сайты, сайты-каталоги, UX-аудит, UX/UI-дизайн и AI-автоматизация для B2B-компаний. Фиксированный состав работ, сроки и стартовые цены.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const support = getPackage("support");
  const mainServices = services.filter((s) => getPackage(s.packageSlug).group === "main");
  const extraServices = services.filter((s) => getPackage(s.packageSlug).group === "extra");

  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/services", label: "Услуги" },
        ]}
        eyebrow="Что мы делаем"
        title="Услуги"
        lead={
          <p>
            Сайты, каталоги и аудит — основные пакеты; дизайн в Figma, AI-автоматизация и поддержка
            — дополнительно. Если не уверены, с чего начать, — начните с аудита.
          </p>
        }
      />

      <section aria-labelledby="main-services-title" className="py-section">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <SectionTitle id="main-services-title" index={0} className="lg:col-span-6">
              Основные
            </SectionTitle>
            <p className="max-w-[48ch] lg:col-span-5 lg:col-start-8">
              Посадочная страница — отдельный пакет в разделе корпоративных сайтов.
            </p>
          </Reveal>
          <div className="mt-12 border-b border-line md:mt-16">
            {mainServices.map((service, i) => (
              <Reveal key={service.slug} delay={Math.min(i, 2) * 70}>
                <ServiceCard service={service} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="extra-services-title" className="pb-section">
        <Container>
          <Reveal>
            <SectionTitle id="extra-services-title" index={1}>
              Дополнительно
            </SectionTitle>
          </Reveal>
          <div className="mt-12 border-b border-line md:mt-16">
            {extraServices.map((service, i) => (
              <Reveal key={service.slug} delay={Math.min(i, 2) * 70}>
                <ServiceCard service={service} index={mainServices.length + i} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <p className="max-w-[60ch]">
              После запуска сайт можно перевести на абонемент: {support.title.toLowerCase()} —{" "}
              {priceText(support)} {support.priceNote}.{" "}
              <Link
                href="/pricing#support"
                className="font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
              >
                Условия поддержки
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </main>
  );
}
