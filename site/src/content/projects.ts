// Кейсы. Структура — ТЗ §12. Роль исполнителя и разрешение на публикацию не подтверждены
// (CONTENT_REQUIREMENTS.md §2), поэтому названия клиентов, ссылки и скриншоты не выводятся.
//
// Черновые тексты — через ask(), см. content/draft.ts.

import { ask } from "./draft";

export type CaseImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  /** Тип работ для карточки: «Корпоративный сайт», «Сайт-каталог». */
  kind: string;
  /** Услуга из services.ts, к которой ведёт «Похожая задача?». */
  service: string;
  /** draft — данные не подтверждены, страница закрыта от индексации и помечена. */
  status: "draft" | "published";
  /** Одна строка для карточки. */
  task: string;
  year?: string;
  /** Ссылка на сайт — только если владелец подтвердил, что её можно показывать. */
  url?: string;

  business: string;
  goal: string;
  audience: string;
  problem: string;
  role: string;
  constraints?: string;
  research?: string;
  architecture?: string;
  prototyping?: string;
  uiConcept?: string;
  decisions?: readonly string[];
  adaptive?: string;
  outcome: string;
  /** Только подтверждённые цифры и факты. Нет данных — секция не выводится. */
  results?: readonly string[];
  conclusions?: string;
  images?: readonly CaseImage[];
};

export const projects: readonly CaseStudy[] = [
  {
    slug: "industrial-contractor",
    title: "Промышленный подрядчик",
    industry: "Промышленное строительство",
    kind: "Корпоративный сайт",
    service: "corporate-websites",
    status: "draft",
    task: "Показать виды работ и объекты по регионам, привести заказчика к запросу расчёта.",
    business:
      "Компания выполняет сварочно-монтажные и строительные работы на промышленных объектах в разных регионах России.",
    goal: ask("Исходная задача клиента своими словами."),
    audience: ask(
      "Предположение, проверить: технические и коммерческие директора заказчиков, отделы закупок генподрядчиков, тендерные специалисты.",
    ),
    problem: ask("Что мешало заказчику понять компанию или оставить заявку до проекта."),
    role: ask(
      "Ваша роль: структура, прототипы, UI-дизайн, вёрстка, разработка; самостоятельно или в составе команды.",
    ),
    constraints: ask("Сроки, CMS, готовый фирменный стиль, контент."),
    research: ask(
      "Только реально проведённое: анализ конкурентов, аналитика старого сайта, интервью.",
    ),
    architecture: ask(
      "Карта страниц и ключевые сценарии: «найти вид работ», «посмотреть объекты», «запросить расчёт».",
    ),
    prototyping: ask("Есть ли прототипы, сколько страниц, что менялось после согласования."),
    uiConcept: ask("Визуальная концепция и почему она такая."),
    decisions: [ask("3–5 ключевых решений с объяснением, какую задачу каждое решает.")],
    adaptive: ask("Что сделано для телефона: меню, карточки объектов, форма."),
    outcome: ask("Что запущено и когда."),
    conclusions: ask("Что получилось, что можно улучшить."),
  },
  {
    slug: "construction-lab",
    title: "Строительная лаборатория",
    industry: "Строительные испытания",
    kind: "Сайт услуг с ценами",
    service: "corporate-websites",
    status: "draft",
    task: "Объяснить перечень испытаний и цены так, чтобы заказчик мог выбрать услугу сам.",
    business:
      "Аккредитованная лаборатория: испытания бетона и инертных материалов, обследование конструкций, измерения на объектах.",
    goal: ask("Исходная задача клиента своими словами."),
    audience: ask(
      "Предположение, проверить: подрядчики и застройщики, технадзор, проектировщики — тем, кому нужен протокол испытаний к сроку.",
    ),
    problem: ask("Что было сложно найти или понять до проекта."),
    role: ask("Ваша роль и состав команды."),
    constraints: ask("Ограничения проекта."),
    research: ask("Исследование и исходные данные — только фактические."),
    architecture: ask("Структура каталога услуг и путь «услуга → цена → заявка»."),
    prototyping: ask("Прототипы и согласование."),
    uiConcept: ask("Визуальная концепция."),
    decisions: [ask("Ключевые решения.")],
    adaptive: ask("Мобильная версия."),
    outcome: ask("Итоговый результат."),
    conclusions: ask("Выводы и возможные улучшения."),
  },
  {
    slug: "machinery-catalog",
    title: "Дилер спецтехники",
    industry: "Поставка оборудования",
    kind: "Сайт-каталог",
    service: "catalog-websites",
    status: "draft",
    task: "Собрать каталог техники с характеристиками и запросом стоимости по каждой модели.",
    business: "Официальный дилер спецтехники: продажа, лизинг, сервисное обслуживание и логистика.",
    goal: ask("Исходная задача клиента своими словами."),
    audience: ask(
      "Предположение, проверить: владельцы и механики строительных и добывающих компаний, отделы снабжения.",
    ),
    problem: ask("Как клиенты выбирали технику до появления каталога."),
    role: ask("Ваша роль: каталог, карточки, фильтры, интеграции."),
    constraints: ask("Ограничения: источник номенклатуры, CMS, сроки."),
    research: ask("Исследование и исходные данные."),
    architecture: ask("Структура категорий и сценарий «категория → модель → запрос стоимости»."),
    prototyping: ask("Прототипы карточки и листинга."),
    uiConcept: ask("Визуальная концепция."),
    decisions: [ask("Ключевые решения по каталогу.")],
    adaptive: ask("Каталог на телефоне: фильтры, сравнение, кнопка запроса."),
    outcome: ask("Итоговый результат."),
    conclusions: ask("Выводы и возможные улучшения."),
  },
];

/** На главной — первые три. Порядок массива задаёт порядок и навигацию между кейсами. */
export const featuredProjects = projects.slice(0, 3);

export function getProject(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  if (i === -1 || n < 2) return { prev: undefined, next: undefined };
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
