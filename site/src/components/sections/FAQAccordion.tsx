import { DraftText } from "@/components/ui/DraftText";

/**
 * Аккордеон на нативных <details>: работает без JS, с клавиатуры и в поиске по странице.
 * Строки разделены линиями, без заливки; «+» в круге, как у строк услуг на главной.
 */
export function FAQAccordion({
  items,
}: {
  items: readonly { question: string; answer: string }[];
}) {
  return (
    <div className="border-b border-line">
      {items.map((item) => (
        <details key={item.question} className="group border-t border-line">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[length:var(--text-lead)] font-semibold leading-tight transition-colors duration-200 hover:text-accent-ink md:py-6 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 transition-transform duration-300 ease-out md:group-open:translate-x-2">
              {item.question}
            </span>
            <span
              aria-hidden="true"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-current transition-[rotate,background-color,border-color,color] duration-200 group-open:rotate-180 group-open:border-accent-strong group-open:bg-accent-strong group-open:text-white"
            >
              <svg viewBox="0 0 16 16" className="size-3.5">
                <path d="M2 8h12" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M8 2v12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="group-open:hidden"
                />
              </svg>
            </span>
          </summary>
          <div className="max-w-[60ch] pb-7 md:pl-2">
            <DraftText text={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
