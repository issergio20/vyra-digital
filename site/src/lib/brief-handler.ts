import { briefMetaSchema, briefSchema, toFieldErrors, type FieldErrors } from "./brief-schema";
import { formatBrief, type Transport } from "./send-brief";

// Логика приёма заявки без привязки к Next.js — так её можно проверить тестами.

export type BriefResult =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { ok: false; code: "invalid"; fieldErrors: FieldErrors } }
  | { status: 422; body: { ok: false; code: "spam" | "too_fast"; message: string } }
  | { status: 429; body: { ok: false; code: "rate_limited"; message: string } }
  | { status: 503; body: { ok: false; code: "not_configured"; message: string } }
  | { status: 502; body: { ok: false; code: "delivery_failed"; message: string } }
  | { status: 400; body: { ok: false; code: "bad_request"; message: string } };

export type HandlerDeps = {
  transports: Transport[];
  now?: () => number;
  /** Минимальное время между открытием формы и отправкой. */
  minFillMs?: number;
  rateLimit?: { max: number; windowMs: number };
};

type Store = {
  hits: Map<string, number[]>;
  done: Map<string, number>;
};

/**
 * Хранилища в памяти процесса: ограничение частоты по IP и уже доставленные requestId.
 * На нескольких серверах каждый считает сам — для небольшого сайта этого достаточно.
 */
export function createBriefHandler(deps: HandlerDeps) {
  const now = deps.now ?? Date.now;
  const minFillMs = deps.minFillMs ?? 3_000;
  const rate = deps.rateLimit ?? { max: 5, windowMs: 10 * 60_000 };
  const store: Store = { hits: new Map(), done: new Map() };

  function isRateLimited(ip: string): boolean {
    const t = now();
    const recent = (store.hits.get(ip) ?? []).filter((x) => t - x < rate.windowMs);
    recent.push(t);
    store.hits.set(ip, recent);
    return recent.length > rate.max;
  }

  return async function handle(payload: unknown, ip: string): Promise<BriefResult> {
    if (typeof payload !== "object" || payload === null) {
      return { status: 400, body: { ok: false, code: "bad_request", message: "Пустой запрос" } };
    }

    const meta = briefMetaSchema.safeParse(payload);
    if (!meta.success) {
      const honeypot = (payload as { website?: unknown }).website;
      if (typeof honeypot === "string" && honeypot.length > 0) {
        return { status: 422, body: { ok: false, code: "spam", message: "Заявка похожа на спам" } };
      }
      return {
        status: 400,
        body: { ok: false, code: "bad_request", message: "Обновите страницу и попробуйте ещё раз" },
      };
    }

    // Повтор той же попытки (двойной клик, повтор после обрыва сети) — не отправляем второй раз.
    if (store.done.has(meta.data.requestId)) return { status: 200, body: { ok: true } };

    if (now() - meta.data.startedAt < minFillMs) {
      return {
        status: 422,
        body: {
          ok: false,
          code: "too_fast",
          message: "Форма отправлена слишком быстро. Попробуйте ещё раз",
        },
      };
    }

    const parsed = briefSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        status: 400,
        body: { ok: false, code: "invalid", fieldErrors: toFieldErrors(parsed.error) },
      };
    }

    if (isRateLimited(ip)) {
      return {
        status: 429,
        body: {
          ok: false,
          code: "rate_limited",
          message: "Слишком много заявок подряд. Попробуйте через 10 минут",
        },
      };
    }

    if (deps.transports.length === 0) {
      return {
        status: 503,
        body: {
          ok: false,
          code: "not_configured",
          message: "Приём заявок через сайт ещё не настроен. Заявка не отправлена",
        },
      };
    }

    const text = formatBrief(parsed.data);
    const results = await Promise.allSettled(deps.transports.map((t) => t.send(text)));
    const delivered = results.some((r) => r.status === "fulfilled");

    if (!delivered) {
      // В лог — только факт сбоя и канал, без персональных данных.
      results.forEach((r, i) => {
        if (r.status === "rejected") console.error(`[brief] ${deps.transports[i].name} failed`);
      });
      return {
        status: 502,
        body: {
          ok: false,
          code: "delivery_failed",
          message: "Не удалось доставить заявку. Попробуйте ещё раз",
        },
      };
    }

    store.done.set(meta.data.requestId, now());
    return { status: 200, body: { ok: true } };
  };
}
