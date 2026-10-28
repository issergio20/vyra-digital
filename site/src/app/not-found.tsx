import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="surface-dark flex min-h-svh flex-col justify-center bg-ground px-gutter pb-16 pt-32 text-fg">
      <p
        aria-hidden="true"
        className="font-display text-[clamp(6rem,26vw,30rem)] leading-[0.8] tracking-[-0.04em]"
      >
        4<span className="text-accent-ink">0</span>4
      </p>
      <h1 className="mt-10 border-t border-line pt-8 font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]">
        Такой страницы нет
      </h1>
      <p className="mt-6 max-w-[44ch] text-[length:var(--text-lead)] leading-snug">
        Возможно, раздел ещё готовится или ссылка устарела. На главной есть услуги, цены и ответы на
        частые вопросы.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink href="/">На главную</ButtonLink>
        <Link
          href="/#pricing"
          className="inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px]"
        >
          Цены и пакеты
        </Link>
      </div>
    </main>
  );
}
