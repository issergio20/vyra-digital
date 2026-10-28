// Статическая копия сайта для просмотра без сервера: index.html на каждую страницу,
// стили в css/, шрифты в fonts/. Открывается двойным щелчком по index.html (file://).
//
//   npm run build && npm run export:static
//
// Берёт готовые HTML из сборки (.next/server/app), убирает скрипты Next.js — по file://
// они не загружаются — и подключает js/static.js: тема, меню, раскрытие услуг.
// Форма заявки в копии не отправляется: ей нужен сервер (/api/brief).
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const built = join(site, ".next");
const out = join(site, "..", "static-site");

if (!existsSync(join(built, "server", "app", "index.html"))) {
  console.error("Нет сборки. Сначала: npm run build");
  process.exit(1);
}

// Маршруты — тот же список, что проверяют e2e-тесты.
const pagesSource = readFileSync(join(site, "tests", "e2e", "pages.ts"), "utf8");
const routes = [...pagesSource.matchAll(/"(\/[^"]*)"/g)].map((m) => m[1]);

const sourceFor = (route) =>
  join(built, "server", "app", route === "/" ? "index.html" : `${route.slice(1)}.html`);
// Каждая страница — папка с index.html: /services/ux-audit → services/ux-audit/index.html
const targetFor = (route) => (route === "/" ? "index.html" : `${route.slice(1)}/index.html`);

// Чистится содержимое, а не сама папка: её может держать открытой Проводник.
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) rmSync(join(out, f), { recursive: true, force: true });
mkdirSync(join(out, "css"), { recursive: true });
mkdirSync(join(out, "fonts"), { recursive: true });
mkdirSync(join(out, "js"), { recursive: true });

// Стили: все CSS сборки одним файлом, шрифты — из media/ в fonts/.
const chunks = join(built, "static", "chunks");
const css = readdirSync(chunks)
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(join(chunks, f), "utf8"))
  .join("\n")
  .replaceAll("url(../media/", "url(../fonts/");
writeFileSync(join(out, "css", "style.css"), css);
for (const f of readdirSync(join(built, "static", "media"))) {
  copyFileSync(join(built, "static", "media", f), join(out, "fonts", f));
}
copyFileSync(join(site, "src", "app", "icon.svg"), join(out, "icon.svg"));
copyFileSync(join(site, "scripts", "static", "static.js"), join(out, "js", "static.js"));

const known = new Set(routes);

function rewrite(html, target) {
  // Путь от страницы к корню копии: «» для index.html, «../» для services/index.html…
  const up = posix.relative(posix.dirname(target), ".") || ".";
  const root = up === "." ? "" : `${up}/`;

  const toPage = (href) => {
    const [pathAndQuery, hash = ""] = href.split("#");
    const path = pathAndQuery.split("?")[0] || "/";
    if (!known.has(path)) return null;
    const file = targetFor(path);
    return `${root}${file}${hash ? `#${hash}` : ""}`;
  };

  return (
    html
      // Скрипты Next.js и их предзагрузка. Остаются JSON-LD и встроенный выбор темы.
      .replace(/<script\b[^>]*\bsrc="[^"]*"[^>]*><\/script>/g, "")
      .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g, (tag, body) =>
        // Данные React (self.__next_f) тоже содержат текст этого скрипта — оставляем только сам скрипт.
        body.startsWith("try{") && body.includes("vyra-theme") ? tag : "",
      )
      .replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/g, "")
      .replace(/<link\b[^>]*rel="apple-touch-icon"[^>]*\/?>/g, "")
      .replace(/<link\b[^>]*rel="canonical"[^>]*\/?>/g, "")
      // Стили, шрифты, значок.
      .replace(/href="\/_next\/static\/chunks\/[^"]+\.css"/g, `href="${root}css/style.css"`)
      .replace(/href="\/_next\/static\/media\/([^"]+)"/g, `href="${root}fonts/$1"`)
      .replace(/href="\/icon\.svg[^"]*"/g, `href="${root}icon.svg"`)
      // Ссылки между страницами — относительные, на конкретный index.html.
      .replace(/href="(\/[^"]*)"/g, (attr, href) => {
        const page = toPage(href);
        return page ? `href="${page}"` : attr;
      })
      .replace("</body>", `<script src="${root}js/static.js" defer></script></body>`)
  );
}

for (const route of routes) {
  const target = targetFor(route);
  const html = rewrite(readFileSync(sourceFor(route), "utf8"), target);
  mkdirSync(dirname(join(out, target)), { recursive: true });
  writeFileSync(join(out, target), html);
}
writeFileSync(
  join(out, "404.html"),
  rewrite(readFileSync(join(built, "server", "app", "_not-found.html"), "utf8"), "404.html"),
);

console.log(`Готово: ${routes.length} страниц → ${relative(process.cwd(), out) || out}`);
console.log(`Открыть: ${join(out, "index.html")}`);
