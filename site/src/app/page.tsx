import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeFaq } from "@/content/home";
import { faqLd, organizationLd } from "@/lib/structured-data";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { CTASection } from "@/components/sections/CTASection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProcessSection } from "@/components/sections/ProcessSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <JsonLd data={organizationLd()} />
      <JsonLd data={faqLd(homeFaq)} />
      <Hero />
      {/* Услуги и цены — одна лестница пакетов: раньше те же 4 пакета шли здесь дважды. */}
      <PricingSection />
      <AdvantagesSection />
      <ProcessSection />
      <FeaturedProjects />
      <FAQSection />
      <CTASection pricesHref="#pricing" />
    </main>
  );
}
