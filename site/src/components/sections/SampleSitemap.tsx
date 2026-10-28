import { Reveal } from "@/components/motion/Reveal";

/**
 * Образец результата этапа «Структура и прототип» — пока нет опубликованных кейсов.
 * Это типовая карта сайта, а не проект клиента: так и подписано, без названий и цифр.
 */
const sections = [
  { title: "Главная", children: [] },
  {
    title: "Продукция",
    children: ["Категория", "Карточка: характеристики, PDF, запрос КП"],
  },
  { title: "Отрасли и решения", children: ["Решение для отрасли"] },
  { title: "Проекты", children: ["Проект: задача, объём, фото"] },
  { title: "О компании", children: ["Производство", "Сертификаты и допуски"] },
  { title: "Контакты", children: ["Запрос КП"] },
] as const;

const scenarios = [
  { who: "Инженер", path: "Продукция → карточка → характеристики и PDF" },
  { who: "Снабженец", path: "Категория → выбор позиций → запрос КП" },
  { who: "Директор", path: "Проекты → О компании → связаться" },
] as const;

export function SampleSitemap({
  headingId,
  title,
  headingLevel = "h3",
}: {
  headingId: string;
  title: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="rounded-ui border border-line p-6 md:p-10">
      <Heading
        id={headingId}
        className="font-display text-[length:var(--text-statement)] font-normal leading-tight"
      >
        {title}
      </Heading>
      <p className="mt-3 max-w-[60ch] text-fg-soft">
        Это пример, а не проект клиента. Так выглядит результат этапа «Структура и прототип»: карта
        страниц и сценарии, по которым посетитель доходит до заявки. Всё согласуется до дизайна.
      </p>

      <Reveal className="mt-8">
        <ol aria-label="Карта страниц" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {sections.map((section) => (
            <li
              key={section.title}
              className="rounded-ui border border-line p-4 transition-colors duration-300 hover:border-accent"
            >
              <p className="font-semibold">{section.title}</p>
              {section.children.length ? (
                <ul className="mt-3 grid gap-2 text-[length:var(--text-small)] text-fg-soft">
                  {section.children.map((child) => (
                    <li key={child}>{child}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-8">
        <p className="font-display text-[length:var(--text-small)] text-accent-ink">Сценарии</p>
        <ul className="mt-3 grid gap-3 md:grid-cols-3 md:gap-6">
          {scenarios.map((s) => (
            <li key={s.who} className="border-t border-line pt-3">
              <span className="block font-semibold">{s.who}</span>
              <span className="mt-1 block">{s.path}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
