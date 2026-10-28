import { describe, expect, it } from "vitest";
import { briefSchema, toFieldErrors } from "@/lib/brief-schema";

const valid = {
  name: "Анна",
  contact: "anna@example.ru",
  service: "corporate",
  message: "Нужен новый сайт для производственной компании.",
  budget: "",
  deadline: "",
  consent: true,
};

describe("briefSchema", () => {
  it("принимает корректную заявку", () => {
    expect(briefSchema.safeParse(valid).success).toBe(true);
  });

  it.each(["+7 (914) 123-45-67", "89141234567", "a.b@mail.example"])(
    "принимает контакт %s",
    (contact) => {
      expect(briefSchema.safeParse({ ...valid, contact }).success).toBe(true);
    },
  );

  it.each(["123", "anna@", "позвоните мне", "+7 abc"])("отклоняет контакт %s", (contact) => {
    const result = briefSchema.safeParse({ ...valid, contact });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).contact).toBeTruthy();
  });

  it("требует согласие", () => {
    const result = briefSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).consent).toBe("Без согласия заявку отправить нельзя");
    }
  });

  it("отклоняет неизвестную услугу и бюджет", () => {
    const result = briefSchema.safeParse({ ...valid, service: "hack", budget: "1 ₽" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = toFieldErrors(result.error);
      expect(errors.service).toBeTruthy();
      expect(errors.budget).toBeTruthy();
    }
  });

  it("обрезает пробелы и проверяет длину описания", () => {
    const result = briefSchema.safeParse({ ...valid, message: "   коротко   " });
    expect(result.success).toBe(false);
  });

  it("бюджет и срок необязательны", () => {
    const result = briefSchema.safeParse({ ...valid, budget: undefined, deadline: undefined });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.budget).toBe("");
  });
});
