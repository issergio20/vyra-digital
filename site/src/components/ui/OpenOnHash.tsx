"use client";

import { useEffect } from "react";

/**
 * Раскрывает <details>, на который ведёт якорь (#landing, #support…): при загрузке
 * и при переходе по ссылке внутри страницы. Без JS блоки просто остаются свёрнутыми.
 */
export function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target instanceof HTMLDetailsElement && !target.open) {
        target.open = true;
        target.scrollIntoView();
      }
    };

    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return null;
}
