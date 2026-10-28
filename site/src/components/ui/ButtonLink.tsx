import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "signal" | "ink" | "outline" | "night";

const variants: Record<Variant, string> = {
  // Заливка — accent-strong: белый полужирный на ней проходит AA при любом размере.
  signal:
    "bg-accent-strong text-[length:var(--text-button)] font-semibold text-white hover:bg-accent-strong-pressed",
  ink: "bg-fg text-[length:var(--text-button)] font-semibold text-ground hover:bg-fg-soft",
  // Вторичное действие: красная кнопка на экране остаётся одна.
  outline:
    "border-2 border-fg/40 text-[length:var(--text-button)] font-semibold text-fg hover:border-fg hover:bg-fg hover:text-ground",
  // На красной заливке: тёмная в обеих темах.
  night:
    "bg-night text-[length:var(--text-button)] font-semibold text-white hover:bg-black",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "signal", className = "", ...props }: Props) {
  return (
    <Link
      className={`inline-flex items-center rounded-ui justify-center min-h-[clamp(3.25rem,2.9rem+0.6vw,4.5rem)] px-[clamp(1.75rem,1.4rem+0.8vw,3rem)] text-center leading-tight [overflow-wrap:anywhere] transition-[background-color,scale] duration-150 ease-out active:scale-[0.97] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
