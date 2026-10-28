import type { ReactNode } from "react";

/** Общие поля страницы. Все секции используют одну пару отступов. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-gutter ${className}`}>{children}</div>;
}
