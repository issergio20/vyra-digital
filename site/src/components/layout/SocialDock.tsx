"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SocialLink } from "@/content/site";

const icons: Record<SocialLink["id"], React.ReactNode> = {
  telegram: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
      <path
        d="M21.5 4.2 2.9 11.4c-1 .4-1 1.5 0 1.8l4.6 1.4 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.4 4.8 3.5c.7.5 1.6.1 1.8-.7L23 5.6c.2-1-.7-1.8-1.5-1.4Zm-3.3 4.1-8.4 7.6-.3 3.4-1.6-4.9 9.9-6.4c.3-.2.6.1.4.3Z"
        fill="currentColor"
      />
    </svg>
  ),
  whatsapp: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
      <path
        d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 7.6c.2 0 .5 0 .7.5l.8 1.9c.1.3 0 .5-.1.7l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.6c.2-.2.4-.2.7-.1l1.9.8c.4.2.5.5.4.8-.3 1.3-1.3 1.9-2.4 1.8-3.4-.4-6.3-3.3-6.7-6.7-.1-1.1.5-2.1 1.8-2.4Z"
        fill="currentColor"
      />
    </svg>
  ),
  max: (
    <span aria-hidden="true" className="font-display text-[0.8125rem] leading-none">
      MAX
    </span>
  ),
};

/**
 * Кнопка мессенджеров в правом нижнем углу, как в образце: по нажатию над ней
 * раскрывается столбик ссылок. Закрывается повторным нажатием, Esc и кликом мимо.
 * Показывается, только если задан хотя бы один адрес (см. socialLinks).
 */
export function SocialDock({ links }: { links: readonly SocialLink[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  if (links.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-end gap-2 md:bottom-6 md:right-6"
    >
      <ul id={listId} hidden={!open} className="flex flex-col items-end gap-2">
        {links.map((link, i) => (
          <li
            key={link.id}
            className="social-dock-item"
            style={{ "--i": links.length - 1 - i } as React.CSSProperties}
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Написать в ${link.label}`}
              title={link.label}
              className="inline-flex size-12 items-center justify-center rounded-ui bg-raised text-fg shadow-[0_6px_18px_rgb(0_0_0/0.22)] transition-[background-color,scale] duration-150 ease-out hover:bg-raised-hover hover:text-accent-ink active:scale-[0.94]"
            >
              {icons[link.id]}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? "Скрыть мессенджеры" : "Написать в мессенджер"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-14 items-center justify-center rounded-ui bg-accent-strong text-white shadow-[0_8px_24px_rgb(0_0_0/0.28)] transition-[background-color,scale] duration-150 ease-out hover:bg-accent-strong-pressed active:scale-[0.94]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-6 transition-transform duration-200 ease-out ${open ? "rotate-45" : ""}`}
        >
          {open ? (
            <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="2.2" />
          ) : (
            <path
              d="M4 5h16v11H9l-5 4V5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
