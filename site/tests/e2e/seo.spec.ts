import { expect, test } from "@playwright/test";
import { pages } from "./pages";

test.describe("SEO и маршруты", () => {
  test.skip(({ isMobile }) => isMobile, "Разметка не зависит от ширины — проверяем один раз");

  test("каждая страница: 200, один H1, title, description, canonical, lang", async ({ page }) => {
    const titles = new Map<string, string>();
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator("h1"), path).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "ru");

      const title = await page.title();
      expect(title.length, `${path}: title`).toBeGreaterThan(10);
      expect(titles.has(title), `${path}: title повторяет ${titles.get(title)}`).toBe(false);
      titles.set(title, path);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0, `${path}: description`).toBeGreaterThan(50);
      await expect(page.locator('link[rel="canonical"]'), path).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]'), path).toHaveCount(1);
    }
  });

  test("неизвестные адреса отвечают 404", async ({ request }) => {
    for (const path of ["/nope", "/projects/nope", "/services/nope"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
    }
  });

  test("черновые кейсы не публикуются и не попадают в sitemap", async ({ request }) => {
    expect((await request.get("/projects/construction-lab")).status()).toBe(404);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("/projects/construction-lab");
    expect(sitemap).not.toContain("/privacy");
    expect(sitemap).toContain("/services/ux-audit");
  });

  test("JSON-LD валиден и без выдуманных полей", async ({ page }) => {
    for (const path of ["/", "/services/ux-audit", "/pricing", "/projects"]) {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length, path).toBeGreaterThan(0);
      for (const block of blocks) {
        const data = JSON.parse(block);
        expect(JSON.stringify(data)).not.toMatch(/aggregateRating|review|telephone|address/i);
        expect(JSON.stringify(data)).not.toContain("[ЧЕРНОВИК]");
      }
    }
  });
});
