"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Один общий обработчик прокрутки на все элементы. В отличие от IntersectionObserver,
// он раскрывает и то, что «перепрыгнули» (переход по якорю, скачок прокрутки),
// поэтому содержимое не может остаться скрытым выше экрана.
// Без requestAnimationFrame: он не выполняется во вкладке в фоне, а элементов немного.
const pending = new Set<HTMLElement>();

function revealVisible() {
  const limit = window.innerHeight * 0.92;
  for (const el of pending) {
    if (el.getBoundingClientRect().top < limit) {
      el.classList.add("reveal-in");
      el.classList.remove("reveal-wait");
      pending.delete(el);
    }
  }
  if (pending.size === 0) stopListening();
}

function startListening() {
  window.addEventListener("scroll", revealVisible, { passive: true });
  window.addEventListener("resize", revealVisible);
}

function stopListening() {
  window.removeEventListener("scroll", revealVisible);
  window.removeEventListener("resize", revealVisible);
}

/**
 * Вход части секции при прокрутке. Прячет только то, что ниже экрана в момент загрузки,
 * поэтому без JS и при reduced motion содержимое видно сразу.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("reveal-wait");
    if (pending.size === 0) startListening();
    pending.add(el);

    return () => {
      pending.delete(el);
      if (pending.size === 0) stopListening();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
