"use client";

import Link from "next/link";
import { useRef } from "react";
import { mainNav, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Wordmark } from "./Wordmark";

/** Полноэкранное меню на <dialog>: фокус-ловушка и Esc — средствами браузера. */
export function MobileNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="min-h-12 px-1 font-semibold underline-offset-[6px] decoration-2 hover:underline"
      >
        Меню
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Меню сайта"
        className="surface-dark m-0 h-dvh max-h-none w-full max-w-none bg-ground p-0 text-fg backdrop:bg-black/70 open:flex open:flex-col"
        onClick={(event) => {
          if (event.target instanceof HTMLAnchorElement) close();
        }}
      >
        <div className="flex items-center justify-between px-gutter pt-5">
          <Wordmark />
          <button
            type="button"
            onClick={close}
            className="min-h-12 px-1 font-semibold underline-offset-[6px] decoration-2 hover:underline"
          >
            Закрыть
          </button>
        </div>
        <nav aria-label="Мобильная навигация" className="flex-1 px-gutter pt-12">
          <ul className="flex flex-col gap-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 font-display text-[1.75rem] tracking-[-0.01em] font-normal leading-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-gutter pb-8">
          <ButtonLink href={site.briefHref} className="w-full">
            Обсудить проект
          </ButtonLink>
        </div>
      </dialog>
    </div>
  );
}
