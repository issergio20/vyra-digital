import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** H2 секции и необязательный вводный абзац справа от него на широких экранах. */
export function SectionHeading({
  id,
  title,
  children,
  className = "",
}: {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${className}`}>
      <Reveal className="lg:col-span-6">
        <h2
          id={id}
          className="font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]"
        >
          {title}
        </h2>
      </Reveal>
      {children ? (
        <Reveal delay={90} className="max-w-[48ch] lg:col-span-5 lg:col-start-8">
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}
