import { describe, expect, it, vi } from "vitest";
import { createBriefHandler } from "@/lib/brief-handler";
import {
  formatBrief,
  telegramTransport,
  transportsFromEnv,
  type Transport,
} from "@/lib/send-brief";

const NOW = 1_800_000_000_000;

function payload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Анна",
    contact: "anna@example.ru",
    service: "ux-audit",
    message: "Сайт есть, заявок мало. Хотим понять почему.",
    consent: true,
    website: "",
    startedAt: NOW - 20_000,
    requestId: crypto.randomUUID(),
    ...overrides,
  };
}

function fakeTransport(impl: (text: string) => Promise<void> = async () => {}) {
  const send = vi.fn(impl);
  const transport: Transport = { name: "fake", send };
  return { transport, send };
}

describe("createBriefHandler", () => {
  it("без получателя отвечает 503 и ничего не отправляет", async () => {
    const handle = createBriefHandler({ transports: [], now: () => NOW });
    const result = await handle(payload(), "1.1.1.1");
    expect(result.status).toBe(503);
    expect(result.body).toMatchObject({ ok: false, code: "not_configured" });
  });

  it("доставляет корректную заявку и отвечает 200", async () => {
    const { transport, send } = fakeTransport();
    const handle = createBriefHandler({ transports: [transport], now: () => NOW });
    const result = await handle(payload(), "1.1.1.1");
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toContain("Услуга: UX-аудит сайта");
  });

  it("повтор с тем же requestId не отправляет заявку второй раз", async () => {
    const { transport, send } = fakeTransport();
    const handle = createBriefHandler({ transports: [transport], now: () => NOW });
    const body = payload();
    await handle(body, "1.1.1.1");
    const second = await handle(body, "1.1.1.1");
    expect(second.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("заполненная ловушка — 422 spam", async () => {
    const { transport, send } = fakeTransport();
    const handle = createBriefHandler({ transports: [transport], now: () => NOW });
    const result = await handle(payload({ website: "http://spam.example" }), "1.1.1.1");
    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({ code: "spam" });
    expect(send).not.toHaveBeenCalled();
  });

  it("слишком быстрая отправка — 422 too_fast", async () => {
    const { transport } = fakeTransport();
    const handle = createBriefHandler({ transports: [transport], now: () => NOW });
    const result = await handle(payload({ startedAt: NOW - 500 }), "1.1.1.1");
    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({ code: "too_fast" });
  });

  it("ошибки полей — 400 с fieldErrors", async () => {
    const { transport } = fakeTransport();
    const handle = createBriefHandler({ transports: [transport], now: () => NOW });
    const result = await handle(payload({ contact: "", consent: false }), "1.1.1.1");
    expect(result.status).toBe(400);
    if (result.body.ok === false && "fieldErrors" in result.body) {
      expect(Object.keys(result.body.fieldErrors).sort()).toEqual(["consent", "contact"]);
    } else {
      throw new Error("ожидались fieldErrors");
    }
  });

  it("без служебных полей — 400 bad_request", async () => {
    const handle = createBriefHandler({ transports: [], now: () => NOW });
    const result = await handle(payload({ requestId: undefined }), "1.1.1.1");
    expect(result.body).toMatchObject({ code: "bad_request" });
  });

  it("ограничивает частоту с одного IP", async () => {
    const { transport } = fakeTransport();
    const handle = createBriefHandler({
      transports: [transport],
      now: () => NOW,
      rateLimit: { max: 2, windowMs: 60_000 },
    });
    await handle(payload(), "2.2.2.2");
    await handle(payload(), "2.2.2.2");
    const third = await handle(payload(), "2.2.2.2");
    expect(third.status).toBe(429);
    const otherIp = await handle(payload(), "3.3.3.3");
    expect(otherIp.status).toBe(200);
  });

  it("сбой доставки — 502, успех не подтверждается", async () => {
    const { transport } = fakeTransport(async () => {
      throw new Error("down");
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const handle = createBriefHandler({ transports: [transport], now: () => NOW });
    const body = payload();
    const result = await handle(body, "1.1.1.1");
    expect(result.status).toBe(502);
    // В лог не попадают персональные данные.
    expect(error.mock.calls.flat().join(" ")).not.toContain("anna@example.ru");
    error.mockRestore();
  });
});

describe("send-brief", () => {
  it("без переменных окружения получателей нет", () => {
    expect(transportsFromEnv({} as NodeJS.ProcessEnv)).toEqual([]);
  });

  it("Telegram: отправляет простой текст без разметки", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    await telegramTransport("TOKEN", "42", fetchMock as unknown as typeof fetch).send("<b>x</b>");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.telegram.org/botTOKEN/sendMessage");
    const sent = JSON.parse(String(init.body));
    expect(sent).toMatchObject({ chat_id: "42", text: "<b>x</b>" });
    expect(sent.parse_mode).toBeUndefined();
  });

  it("Telegram: ошибка API превращается в исключение", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 401 }));
    await expect(
      telegramTransport("bad", "42", fetchMock as unknown as typeof fetch).send("x"),
    ).rejects.toThrow("telegram responded 401");
  });

  it("formatBrief пропускает пустые бюджет и срок", () => {
    const text = formatBrief({
      name: "Анна",
      contact: "anna@example.ru",
      service: "other",
      message: "Описание задачи",
      budget: "",
      deadline: "1–3 месяца",
      consent: true,
    });
    expect(text).not.toContain("Бюджет");
    expect(text).toContain("Срок: 1–3 месяца");
    expect(text).toContain("Услуга: Другое или пока не знаю");
  });
});
