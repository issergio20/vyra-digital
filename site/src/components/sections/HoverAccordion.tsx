"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Раскрывает строки-<details> внутри по наведению мыши — как в образце. Короткая задержка,
 * чтобы строки не дёргались, когда курсор просто проходит мимо; ушёл курсор из списка —
 * строки сворачиваются. На тач-экранах и с клавиатуры работают обычные клик и Enter.
 */
export function HoverAccordion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let timer: number | undefined;
    const rows = [...root.querySelectorAll("details")];
    const openOnly = (row: HTMLDetailsElement | null) => {
      for (const r of rows) r.open = r === row;
    };

    const onEnter = (event: Event) => {
      window.clearTimeout(timer);
      const row = event.currentTarget as HTMLDetailsElement;
      timer = window.setTimeout(() => openOnly(row), 120);
    };
    const onLeave = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => openOnly(null), 200);
    };

    for (const r of rows) r.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(timer);
      for (const r of rows) r.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
