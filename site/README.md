# VYRA Digital — сайт

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · zod.
Документация проекта — в папке выше: стратегия, IA, дизайн-система, QA_REPORT.md.

## Запуск

Нужен Node.js 22+ (проверено на Node 24). Шрифт заголовков Benzin в репозиторий не входит —
перед первым запуском положите его файлы по инструкции в `src/fonts/README.md`.

```bash
npm install
npm run dev        # разработка, http://localhost:3000
npm run build      # production-сборка
npm run start      # запуск сборки
```

## Проверки

```bash
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run format     # Prettier
npm test           # юнит-тесты (Vitest): форма заявки
npm run test:e2e   # E2E (Playwright + axe) против production-сборки, порт 3200
```

E2E использует установленный Google Chrome (`channel: "chrome"`). Перед запуском нужен `npm run build`.

## Окружение

Скопируйте `.env.example` в `.env.local` и заполните:

| Переменная | Зачем |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Домен для canonical, sitemap и Open Graph |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Приём заявок — см. `../FORMS_SETUP.md` |

Без Telegram-переменных форма работает, но честно отвечает «приём заявок ещё не настроен».

## Где что лежит

| Путь | Содержимое |
|---|---|
| `src/content/` | Весь текст и данные: пакеты и цены (`packages.ts`), услуги, кейсы, процесс, FAQ, «О студии» |
| `src/content/draft.ts` | Правило черновиков: `ask()` и метка `[ЧЕРНОВИК]`, на сайте — жёлтая плашка |
| `src/app/` | Маршруты, `sitemap.ts`, `robots.ts`, картинки и иконки, `api/brief` |
| `src/components/` | `layout`, `hero`, `sections`, `case`, `forms`, `ui`, `motion`, `seo` |
| `src/lib/` | Форма (`brief-*`, `send-brief`), структурированные данные, шрифты для OG |
| `src/proxy.ts` | Настоящий 404 для неизвестных `/projects/*` и `/services/*` |
| `tests/unit`, `tests/e2e` | Vitest и Playwright |

## Перед публикацией

1. Найти и закрыть все черновики: `ask(` и `[ЧЕРНОВИК]` в `src/`.
2. Задать `NEXT_PUBLIC_SITE_URL` и получателя заявок.
3. `npm run build && npm run test:e2e` — всё зелёное.
