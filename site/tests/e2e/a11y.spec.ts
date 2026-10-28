import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pages } from "./pages";

test.describe("Доступность (axe, WCAG 2.1 AA)", () => {
  for (const path of pages) {
    test(`нет нарушений: ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" }); // без анимаций — контент сразу видим
      await page.goto(path);
      // При «меньше движения» остаётся короткое проявление (240 мс): ждём его конца,
      // иначе axe мерит контраст полупрозрачного текста. Бесконечные анимации не ждём.
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => undefined)),
        ),
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      );
      expect(summary, path).toEqual([]);
    });
  }
});

// Светлая тема, все аккордеоны раскрыты: проверяется и содержимое строк (красные строки услуг,
// состав пакетов, ответы FAQ), которое в тёмной теме axe не видит.
test.describe("Доступность в светлой теме, аккордеоны раскрыты", () => {
  for (const path of pages) {
    test(`нет нарушений: ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => localStorage.setItem("vyra-theme", "light"));
      await page.goto(path);
      await page.evaluate(async () => {
        for (const d of document.querySelectorAll("details")) d.open = true;
        await Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => undefined)),
        );
      });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      );
      expect(summary, path).toEqual([]);
    });
  }
});

test.describe("Клавиатура", () => {
  test("первый Tab — «Перейти к содержанию», Enter переводит фокус", async ({ page, isMobile }) => {
    test.skip(isMobile, "Клавиатурный сценарий — для десктопа");
    await page.goto("/pricing");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Перейти к содержанию" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#content")).toBeFocused();
  });

  test("мобильное меню: открывается, Esc закрывает", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Меню есть только на узких экранах");
    await page.goto("/");
    await page.getByRole("button", { name: "Меню" }).click();
    const dialog = page.getByRole("dialog", { name: "Меню сайта" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("FAQ раскрывается с клавиатуры", async ({ page, isMobile }) => {
    test.skip(isMobile, "Клавиатурный сценарий — для десктопа");
    await page.goto("/");
    const summary = page.locator("summary", { hasText: "Сколько правок входит в проект?" });
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Два круга на прототип, два на дизайн")).toBeVisible();
  });

  test("видимый фокус у ссылок и кнопок", async ({ page, isMobile }) => {
    test.skip(isMobile, "Клавиатурный сценарий — для десктопа");
    await page.goto("/");
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const outline = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el ? getComputedStyle(el).outlineStyle : "none";
      });
      expect(outline, `элемент №${i + 1} без видимого фокуса`).not.toBe("none");
    }
  });
});

test.describe("Движение", () => {
  test("при reduced motion нет скрытых блоков и анимаций входа", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator(".reveal-wait")).toHaveCount(0);
    const duration = await page
      .locator("h1")
      .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
    expect(duration).toBeLessThan(0.01);
  });
});
