import { expect, test } from "@playwright/test";
import { pages } from "./pages";

// ТЗ, этап 8: нет ошибок консоли и неудачных запросов на страницах сайта.
test("нет ошибок в консоли и неудачных запросов", async ({ page }) => {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`${page.url()} console: ${msg.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`${page.url()} pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
  });

  for (const path of pages) {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState("networkidle");
  }

  expect(problems).toEqual([]);
});
