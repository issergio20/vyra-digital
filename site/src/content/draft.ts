// Правило черновиков: текст, который ждёт данных от владельца, начинается с DRAFT.
// DraftText показывает его плашкой, а QA перед релизом ищет по коду «[ЧЕРНОВИК]» и «ask(».

export const DRAFT = "[ЧЕРНОВИК]";

export function isDraftText(text: string): boolean {
  return text.startsWith(DRAFT);
}

export const ask = (what: string) => `${DRAFT} ${what}`;
