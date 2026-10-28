import { expect, test } from "@playwright/test";

// Обход сайта с главной: каждая внутренняя ссылка отвечает 200, каждый якорь существует.
test("все внутренние ссылки и якоря рабочие", async ({ request, isMobile }) => {
  test.skip(isMobile, "Ссылки не зависят от ширины");

  const seen = new Set<string>(["/"]);
  const queue = ["/"];
  const anchors: { from: string; path: string; hash: string }[] = [];
  const broken: string[] = [];
  const htmlByPath = new Map<string, string>();

  while (queue.length) {
    const path = queue.shift()!;
    const response = await request.get(path);
    if (response.status() !== 200) {
      broken.push(`${path} → ${response.status()}`);
      continue;
    }
    const html = await response.text();
    htmlByPath.set(path, html);

    for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const [rawPath, hash] = href.split("#");
      const target = (rawPath || path).split("?")[0];
      if (hash) anchors.push({ from: path, path: target, hash });
      if (target.startsWith("/") && !seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }

  for (const { from, path, hash } of anchors) {
    const html = htmlByPath.get(path) ?? "";
    if (!html.includes(`id="${hash}"`)) broken.push(`${from}: ${path}#${hash} — нет якоря`);
  }

  expect(broken).toEqual([]);
  expect(seen.size).toBeGreaterThanOrEqual(13);
});
