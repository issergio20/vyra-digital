import { serviceLabel, type Brief } from "./brief-schema";

// Доставка заявки. Сейчас поддерживается Telegram-бот: без дополнительных зависимостей,
// только fetch. Почта (SMTP) потребует отдельной библиотеки — см. FORMS_SETUP.md.

export type Transport = {
  name: string;
  send: (text: string) => Promise<void>;
};

export class TransportError extends Error {}

export function formatBrief(brief: Brief): string {
  const lines = [
    "Новая заявка с сайта VYRA Digital",
    "",
    `Имя: ${brief.name}`,
    `Контакт: ${brief.contact}`,
    `Услуга: ${serviceLabel(brief.service)}`,
    brief.budget ? `Бюджет: ${brief.budget}` : null,
    brief.deadline ? `Срок: ${brief.deadline}` : null,
    "",
    brief.message,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function telegramTransport(token: string, chatId: string, fetchImpl = fetch): Transport {
  return {
    name: "telegram",
    async send(text) {
      // Простой текст без parse_mode: пользовательский ввод не интерпретируется как разметка.
      const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new TransportError(`telegram responded ${response.status}`);
    },
  };
}

/** Получатели из окружения. Пустой список — приём заявок не настроен. */
export function transportsFromEnv(env: NodeJS.ProcessEnv = process.env): Transport[] {
  const list: Transport[] = [];
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    list.push(telegramTransport(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID));
  }
  return list;
}
