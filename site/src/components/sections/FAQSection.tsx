import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Container } from "@/components/ui/Container";
import { homeFaq } from "@/content/home";
import { FAQAccordion } from "./FAQAccordion";

export function FAQSection() {
  return (
    <section aria-labelledby="faq-title" className="py-section">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <h2
            id="faq-title"
            className="font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]"
          >
            Частые вопросы
          </h2>
          <p className="mt-6 max-w-[36ch]">
            Не нашли ответ — спросите в заявке, отвечу до созвона.
          </p>
          <Link
            href="/process#faq"
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            Про согласования, правки и поддержку
            <ArrowIcon />
          </Link>
        </Reveal>
        <Reveal delay={90} className="lg:col-span-8">
          <FAQAccordion items={homeFaq} />
        </Reveal>
      </Container>
    </section>
  );
}
