import { expect, test } from "@playwright/test";

test.describe("Форма заявки", () => {
  test("ошибки под полями и фокус на первом ошибочном поле", async ({ page }) => {
    await page.goto("/contacts#brief");
    await page.getByRole("button", { name: "Отправить заявку" }).click();
    await expect(page.getByText("Укажите имя — хотя бы 2 символа")).toBeVisible();
    await expect(page.getByLabel("Имя")).toBeFocused();
    await expect(page.getByLabel("Имя")).toHaveAttribute("aria-invalid", "true");
  });

  test("предвыбор услуги из ссылки", async ({ page }) => {
    await page.goto("/contacts?service=catalog#brief");
    await expect(page.getByLabel("Что нужно")).toHaveValue("catalog");
  });

  test("без настроенного получателя — честная ошибка, а не «отправлено»", async ({ page }) => {
    await page.goto("/contacts#brief");
    await page.getByLabel("Имя").fill("Тест Тестов");
    await page.getByLabel("E-mail или телефон").fill("test@example.ru");
    await page.getByLabel("Задача").fill("Проверка формы автотестом на локальном сервере.");
    await page.getByLabel(/Даю согласие/).check();
    await page.waitForTimeout(3_100); // минимальное время заполнения
    await page.getByRole("button", { name: "Отправить заявку" }).click();
    await expect(page.getByText("Приём заявок через сайт ещё не настроен")).toBeVisible();
    await expect(page.getByText("Заявка отправлена")).toHaveCount(0);
    await expect(page.getByLabel("Имя")).toHaveValue("Тест Тестов");
    // Запасной путь: текст заявки можно унести, а не начинать заново.
    await expect(page.getByRole("button", { name: "Скопировать текст заявки" })).toBeVisible();
  });
});

test.describe("Вёрстка", () => {
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920, 2560]) {
    test(`нет горизонтальной прокрутки на ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "Ширины задаются явно");
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/pricing", "/process", "/services/catalog-websites", "/contacts"]) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(overflow, `${path} @${width}`).toBe(false);
      }
    });
  }
});

test("крупный шрифт (200 %) не выталкивает страницы вбок — WCAG 1.4.4", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Ширина задаётся явно");
  await page.setViewportSize({ width: 390, height: 844 });
  const { pages } = await import("./pages");
  for (const path of pages) {
    await page.goto(path);
    await page.addStyleTag({ content: "html{font-size:200%!important}" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
