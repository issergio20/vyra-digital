import type { ReactNode } from "react";

/** Номер блока «/ 01 /» — как у строк услуг и этапов на главной; пробелы неразрывные. */
export const indexLabel = (i: number, digits = 2) =>
  `/ ${String(i + 1).padStart(digits, "0")} /`;

export const headingClass =
  "font-display text-[length:var(--text-head)] font-normal leading-none tracking-[-0.01em]";

/**
 * Заголовок секции внутренней страницы: красный номер над H2 Benzin. Номер — для глаза,
 * программам чтения экрана он ничего не добавляет.
 */
export function SectionTitle({
  id,
  index,
  children,
  className = "",
}: {
  id?: string;
  index?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {index === undefined ? null : (
        <p
          aria-hidden="true"
          className="mb-5 font-display text-[length:var(--text-small)] leading-none text-accent-ink"
        >
          {indexLabel(index)}
        </p>
      )}
      <h2 id={id} className={headingClass}>
        {children}
      </h2>
    </div>
  );
}
