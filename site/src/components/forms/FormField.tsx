import type { ReactNode } from "react";

/**
 * Подпись, подсказка и ошибка поля. Сам элемент передаётся через `children` как функция,
 * чтобы получить согласованные id для aria-describedby.
 */
export function FormField({
  id,
  label,
  hint,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (aria: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {label}
        {optional ? <span className="font-normal text-fg-soft"> — по желанию</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-[length:var(--text-small)] text-fg-soft">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">
        {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-[length:var(--text-small)] font-semibold text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Общий вид полей: без заливки, рамка fg/45 (≥ 3:1 к полю в обеих темах), высота ≥ 48 px. */
export const controlClass =
  "w-full min-h-12 rounded-ui border border-fg/45 bg-transparent px-4 py-3 text-fg outline-offset-2 transition-[border-color] duration-150 hover:border-fg/80 focus:border-accent aria-[invalid=true]:border-2 aria-[invalid=true]:border-error";
