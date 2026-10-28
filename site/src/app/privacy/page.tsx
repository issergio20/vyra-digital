import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { DraftText } from "@/components/ui/DraftText";
import { indexLabel } from "@/components/ui/SectionTitle";
import { ask } from "@/content/draft";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Как VYRA Digital обрабатывает персональные данные, оставленные в заявке на сайте.",
  alternates: { canonical: "/privacy" },
  // Черновик: не индексируется, пока текст не проверен и не заполнены реквизиты оператора.
  robots: { index: false, follow: true },
};

type Clause = { title: string; paragraphs: readonly string[] };

// Структура по 152-ФЗ. Юридическую проверку текста должен провести специалист — это не юридическая консультация.
const clauses: readonly Clause[] = [
  {
    title: "Кто обрабатывает данные",
    paragraphs: [ask("Оператор: ФИО или наименование, ИНН/ОГРНИП, адрес для обращений, e-mail.")],
  },
  {
    title: "Какие данные собираются",
    paragraphs: [
      "Имя; контакт для ответа — e-mail или телефон; описание задачи; по желанию — ориентир по бюджету и сроку.",
      "Сайт не просит паспортные данные, адрес и платёжные реквизиты.",
    ],
  },
  {
    title: "Зачем",
    paragraphs: [
      "Чтобы ответить на заявку, обсудить задачу и подготовить предварительную оценку работ.",
    ],
  },
  {
    title: "Основание",
    paragraphs: [
      "Согласие на обработку персональных данных, которое вы даёте, отмечая согласие в форме заявки.",
    ],
  },
  {
    title: "Где и сколько хранятся",
    paragraphs: [
      ask(
        "Куда попадает заявка (почта, Telegram), где расположены серверы, срок хранения переписки.",
      ),
    ],
  },
  {
    title: "Передача третьим лицам",
    paragraphs: [
      "Данные не продаются и не передаются для рекламы.",
      ask(
        "Перечень сервисов, через которые проходит заявка (хостинг, почтовый сервис или Telegram).",
      ),
    ],
  },
  {
    title: "Cookie и аналитика",
    paragraphs: [
      "Сейчас сайт не использует сторонние счётчики и рекламные cookie.",
      ask(
        "Если будет подключена Яндекс Метрика — описать её здесь и добавить уведомление о cookie.",
      ),
    ],
  },
  {
    title: "Ваши права",
    paragraphs: [
      "Вы можете узнать, какие ваши данные хранятся, попросить исправить их или удалить и отозвать согласие, написав оператору.",
    ],
  },
  {
    title: "Редакция",
    paragraphs: [ask("Дата вступления в силу и порядок изменения политики.")],
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <PageIntro
        crumbs={[
          { href: "/", label: "Главная" },
          { href: "/privacy", label: "Политика конфиденциальности" },
        ]}
        eyebrow="Документы"
        title="Политика конфиденциальности"
        lead={<p>Как обрабатываются данные, которые вы оставляете в заявке.</p>}
      />

      <section aria-label="Текст политики" className="py-section">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <DraftText
              text="[ЧЕРНОВИК] Текст нужно проверить у юриста и дополнить реквизитами оператора до публикации сайта."
              className="lg:sticky lg:top-28"
            />
          </div>
          <ol className="border-b border-line lg:col-span-8">
            {clauses.map((c, i) => (
              <li
                key={c.title}
                className="grid gap-4 border-t border-line py-8 md:grid-cols-[5rem_1fr] md:gap-8"
              >
                <span
                  aria-hidden="true"
                  className="pt-[0.3em] font-display text-[length:var(--text-small)] leading-none text-accent-ink"
                >
                  {indexLabel(i)}
                </span>
                <div className="max-w-[64ch]">
                  <h2 className="font-display text-[length:var(--text-lead)] font-normal leading-tight">
                    {c.title}
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {c.paragraphs.map((p) => (
                      <DraftText key={p} text={p} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </main>
  );
}
