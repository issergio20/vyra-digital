import { expect, test } from "@playwright/test";

// Светлая и тёмная тема: переключатель в шапке, выбор запоминается между страницами.
test("тема переключается и запоминается", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveAttribute("data-theme", "light");

  await page
    .getByRole("button", { name: /включить светлую тему/ })
    .first()
    .click();
  await expect(html).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    "rgb(255, 255, 255)",
  );

  await page.goto("/pricing");
  await expect(html).toHaveAttribute("data-theme", "light");

  await page
    .getByRole("button", { name: /включить тёмную тему/ })
    .first()
    .click();
  await expect(html).not.toHaveAttribute("data-theme", "light");
});
