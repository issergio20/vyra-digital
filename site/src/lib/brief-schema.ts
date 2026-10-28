import { z } from "zod";
import { packages } from "@/content/packages";

// Одна схема для браузера и сервера (ТЗ §17). Собираем минимум персональных данных:
// имя, один контакт и описание задачи; бюджет и срок — по желанию.

export const serviceOptions = [
  ...packages.map((p) => ({ value: p.slug, label: p.title, group: p.group })),
  { value: "other", label: "Другое или пока не знаю", group: "extra" as const },
] as const;

export const budgetOptions = [
  { value: "", label: "Не указан" },
  { value: "до 100 тыс. ₽", label: "До 100 тыс. ₽" },
  { value: "100–300 тыс. ₽", label: "100–300 тыс. ₽" },
  { value: "300–500 тыс. ₽", label: "300–500 тыс. ₽" },
  { value: "больше 500 тыс. ₽", label: "Больше 500 тыс. ₽" },
] as const;

export const deadlineOptions = [
  { value: "", label: "Не указан" },
  { value: "в течение месяца", label: "В течение месяца" },
  { value: "1–3 месяца", label: "1–3 месяца" },
  { value: "больше 3 месяцев", label: "Больше 3 месяцев" },
] as const;

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];
const budgetValues = budgetOptions.map((o) => o.value) as [string, ...string[]];
const deadlineValues = deadlineOptions.map((o) => o.value) as [string, ...string[]];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Российские и международные номера: 10–15 цифр, допускаются +, пробелы, скобки, дефисы. */
function isPhone(value: string): boolean {
  if (!/^[+\d\s()-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export const briefSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя — хотя бы 2 символа")
    .max(80, "Имя слишком длинное — до 80 символов"),
  contact: z
    .string()
    .trim()
    .min(1, "Укажите e-mail или телефон для ответа")
    .max(120, "Слишком длинно — до 120 символов")
    .refine((v) => EMAIL.test(v) || isPhone(v), "Это не похоже на e-mail или телефон"),
  service: z.enum(serviceValues, { message: "Выберите услугу из списка" }),
  message: z
    .string()
    .trim()
    .min(10, "Опишите задачу хотя бы в паре предложений — от 10 символов")
    .max(2000, "Слишком длинно — до 2000 символов. Подробности обсудим на созвоне"),
  budget: z.enum(budgetValues).default(""),
  deadline: z.enum(deadlineValues).default(""),
  consent: z.literal(true, { message: "Без согласия заявку отправить нельзя" }),
});

/** Служебные поля антиспама и защиты от повторной отправки. Пользователь их не видит. */
export const briefMetaSchema = z.object({
  /** Ловушка для ботов: настоящий человек оставляет поле пустым. */
  website: z.string().max(0).optional().default(""),
  /** Время открытия формы (мс), чтобы отсечь мгновенную отправку. */
  startedAt: z.number().int().positive(),
  /** Ключ попытки: повторная отправка с тем же ключом не дублирует заявку. */
  requestId: z.string().uuid(),
});

export type BriefInput = z.input<typeof briefSchema>;
export type Brief = z.output<typeof briefSchema>;
export type FieldErrors = Partial<Record<keyof Brief, string>>;

/** Первая ошибка для каждого поля — в формате, удобном форме. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof Brief | undefined;
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

export function serviceLabel(value: string): string {
  return serviceOptions.find((o) => o.value === value)?.label ?? value;
}
