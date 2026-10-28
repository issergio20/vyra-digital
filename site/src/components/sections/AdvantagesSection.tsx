import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { advantages } from "@/content/home";

export function AdvantagesSection() {
  return (
    <section
      aria-labelledby="why-title"
      className="surface-dark bg-ground pb-section pt-[calc(var(--spacing-section)*0.6)] text-fg"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-12">
          <Reveal>
            <h2
              id="why-title"
              className="font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]"
            >
              Почему VYRA Digital
            </h2>
          </Reveal>
        </div>

        <ul className="grid content-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3">
          {advantages.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={(i % 3) * 80}>
                <h3 className="text-[length:var(--text-lead)] font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="mt-3">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
