"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  briefSchema,
  budgetOptions,
  deadlineOptions,
  serviceOptions,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/brief-schema";
import { site } from "@/content/site";
import { FormField, controlClass } from "./FormField";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string; fallback: boolean };

const fieldOrder = [
  "name",
  "contact",
  "service",
  "message",
  "budget",
  "deadline",
  "consent",
] as const;

/**
 * Форма обсуждения проекта (ТЗ §17). «Заявка отправлена» показывается только после ответа 200
 * от /api/brief. Пока получатель не настроен, сервер отвечает 503 — и форма честно об этом говорит.
 */
export function ProjectBriefForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const requestId = useRef<string>("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const serviceRef = useRef<HTMLSelectElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    startedAt.current = Date.now();
    requestId.current = crypto.randomUUID();
    // Предвыбор услуги из ссылки вида /contacts?service=ux-audit#brief.
    const fromUrl = new URLSearchParams(window.location.search).get("service");
    if (fromUrl && serviceRef.current && serviceOptions.some((o) => o.value === fromUrl)) {
      // Значение ставится прямо в DOM: на сервере адрес с параметром неизвестен.
      serviceRef.current.value = fromUrl;
    }
  }, []);

  /** Текст заявки из полей формы — для копирования или письма, если отправка не удалась. */
  function briefText(): string {
    const data = new FormData(formRef.current ?? undefined);
    const label = (options: readonly { value: string; label: string }[], value: string) =>
      options.find((o) => o.value === value)?.label ?? value;
    const lines = [
      `Имя: ${data.get("name") ?? ""}`,
      `Контакт: ${data.get("contact") ?? ""}`,
      `Что нужно: ${label(serviceOptions, String(data.get("service") ?? ""))}`,
      `Бюджет: ${label(budgetOptions, String(data.get("budget") ?? "")) || "не указан"}`,
      `Срок: ${label(deadlineOptions, String(data.get("deadline") ?? "")) || "не указан"}`,
      "",
      String(data.get("message") ?? ""),
    ];
    return lines.join("\n");
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(briefText());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function focusFirstError(next: FieldErrors) {
    const first = fieldOrder.find((key) => next[key]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "submitting") return; // защита от двойного клика

    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? ""),
      contact: String(data.get("contact") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
      budget: String(data.get("budget") ?? ""),
      deadline: String(data.get("deadline") ?? ""),
      consent: data.get("consent") === "on",
    };

    const parsed = briefSchema.safeParse(values);
    if (!parsed.success) {
      const next = toFieldErrors(parsed.error);
      setErrors(next);
      setStatus({ kind: "idle" });
      focusFirstError(next);
      return;
    }

    setErrors({});
    setCopied(false);
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          website: String(data.get("website") ?? ""),
          startedAt: startedAt.current,
          requestId: requestId.current,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; code: string; message?: string; fieldErrors?: FieldErrors }
        | null;

      if (response.ok && body?.ok) {
        setStatus({ kind: "success" });
        formRef.current?.reset();
        requestId.current = crypto.randomUUID();
        return;
      }

      if (body && !body.ok && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setStatus({ kind: "idle" });
        focusFirstError(body.fieldErrors);
        return;
      }

      setStatus({
        kind: "error",
        message:
          (body && !body.ok && body.message) || "Не удалось отправить заявку. Попробуйте ещё раз",
        // Сбой на стороне сайта (не настроен приём, ошибка доставки) — нужен другой путь.
        fallback: response.status >= 500,
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Нет связи с сервером. Проверьте интернет и попробуйте ещё раз — данные в форме сохранились",
        fallback: false,
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div role="status" className="rounded-ui border border-accent p-6 md:p-10">
        <p className="font-display text-[length:var(--text-statement)] font-normal leading-tight">
          Заявка отправлена
        </p>
        <p className="mt-4 max-w-[48ch]">
          Спасибо. Отвечу по указанному контакту и предложу время для короткого созвона.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="inline-flex min-h-11 items-center mt-6 font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="brief-form-title"
      className="relative grid gap-6 rounded-ui border border-line p-6 md:p-10"
    >
      <h3 id="brief-form-title" className="font-display text-[length:var(--text-lead)] font-normal">
        Форма заявки
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField id="brief-name" label="Имя" error={errors.name}>
          {(aria) => (
            <input
              {...aria}
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              className={controlClass}
            />
          )}
        </FormField>
        <FormField
          id="brief-contact"
          label="E-mail или телефон"
          hint="Для ответа на заявку"
          error={errors.contact}
        >
          {(aria) => (
            <input
              {...aria}
              name="contact"
              type="text"
              autoComplete="email"
              maxLength={120}
              className={controlClass}
            />
          )}
        </FormField>
      </div>

      <FormField id="brief-service" label="Что нужно" error={errors.service}>
        {(aria) => (
          <select
            {...aria}
            name="service"
            ref={serviceRef}
            defaultValue="other"
            className={`${controlClass} cursor-pointer`}
          >
            {/* Тот же порядок, что на сайте: основные пакеты, затем дополнительные. */}
            <optgroup label="Основные">
              {serviceOptions
                .filter((o) => o.group === "main")
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Дополнительно">
              {serviceOptions
                .filter((o) => o.group === "extra")
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
          </select>
        )}
      </FormField>

      <FormField
        id="brief-message"
        label="Задача"
        hint="Чем занимается компания, что должен делать сайт, ссылка на текущий сайт, если есть"
        error={errors.message}
      >
        {(aria) => (
          <textarea
            {...aria}
            name="message"
            rows={6}
            maxLength={2000}
            className={`${controlClass} resize-y`}
          />
        )}
      </FormField>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField id="brief-budget" label="Бюджет" optional error={errors.budget}>
          {(aria) => (
            <select
              {...aria}
              name="budget"
              defaultValue=""
              className={`${controlClass} cursor-pointer`}
            >
              {budgetOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField id="brief-deadline" label="Срок" optional error={errors.deadline}>
          {(aria) => (
            <select
              {...aria}
              name="deadline"
              defaultValue=""
              className={`${controlClass} cursor-pointer`}
            >
              {deadlineOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </FormField>
      </div>

      {/* Ловушка для ботов: скрыта от людей и программ чтения экрана. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="brief-website">Сайт</label>
        <input id="brief-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex gap-3">
          <input
            id="brief-consent"
            name="consent"
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "brief-consent-error" : undefined}
            className="mt-0.5 size-6 shrink-0 cursor-pointer accent-accent"
          />
          <label htmlFor="brief-consent" className="cursor-pointer">
            Даю согласие на обработку персональных данных по{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-accent-ink">
              политике конфиденциальности
            </Link>
          </label>
        </div>
        {errors.consent ? (
          <p
            id="brief-consent-error"
            className="mt-2 text-[length:var(--text-small)] font-semibold text-error"
          >
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div aria-live="polite" className="empty:hidden">
        {status.kind === "error" ? (
          <div className="rounded-ui border border-error px-4 py-3">
            <p role="alert" className="font-semibold text-error">
              {status.message}
            </p>
            {status.fallback ? (
              <div className="mt-3 grid gap-2">
                <p>
                  {site.contactEmail
                    ? "Текст заявки сохранён в форме — его можно отправить письмом."
                    : "Текст заявки сохранён в форме — скопируйте его, чтобы не потерять."}
                </p>
                <div className="flex flex-wrap gap-x-6">
                  {site.contactEmail ? (
                    <a
                      href={`mailto:${site.contactEmail}`}
                      // Текст письма собирается в момент нажатия — из того, что сейчас в форме.
                      onClick={(event) => {
                        event.currentTarget.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent("Заявка с сайта")}&body=${encodeURIComponent(briefText())}`;
                      }}
                      className="inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
                    >
                      Отправить письмом
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={copyBrief}
                    className="inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-[6px] hover:text-accent-ink"
                  >
                    {copied ? "Текст скопирован" : "Скопировать текст заявки"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={submitting}
          aria-disabled={submitting}
          className="inline-flex items-center justify-center rounded-ui bg-accent-strong min-h-[clamp(3.25rem,2.9rem+0.6vw,4.5rem)] px-[clamp(1.75rem,1.4rem+0.8vw,3rem)] text-[length:var(--text-button)] font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-accent-strong-pressed active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? "Отправляю…" : "Отправить заявку"}
        </button>
        <p className="text-[length:var(--text-small)] text-fg-soft">
          Нужны только имя, контакт и описание задачи.
        </p>
      </div>
    </form>
  );
}
