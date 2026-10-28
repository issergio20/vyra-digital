"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, summary, select, label, [role='button']";
const TEXT_INPUT = "input, textarea, [contenteditable='true']";

/**
 * Курсор: точка идёт за мышью без задержки, кольцо догоняет мягко. Над ссылками и кнопками
 * кольцо увеличивается, над полями ввода прячется — там нужен обычный текстовый курсор.
 * Только для мыши (hover + fine pointer) и без «меньше движения»; иначе — системный курсор.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      frame = 0;

    const loop = () => {
      // Кольцо проходит 20 % оставшегося пути за кадр — мягкая, но не вялая инерция.
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      frame = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      root.dataset.cursor = "on";
      const target = event.target as Element | null;
      root.dataset.cursorState = target?.closest(TEXT_INPUT)
        ? "text"
        : target?.closest(INTERACTIVE)
          ? "link"
          : "";
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const onLeave = () => delete root.dataset.cursor;
    const onDown = () => (root.dataset.cursorDown = "true");
    const onUp = () => delete root.dataset.cursorDown;

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      delete root.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
