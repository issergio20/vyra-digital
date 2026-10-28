# VYRA Digital

Сайт-портфолио и продажник независимого digital-агентства: корпоративные сайты и каталоги
для B2B-компаний со сложным продуктом.

- `site/` — сам сайт на Next.js: запуск, проверки и окружение — в [site/README.md](site/README.md).
- Документы проекта в корне: стратегия ([PRODUCT_STRATEGY.md](PRODUCT_STRATEGY.md)),
  структура ([INFORMATION_ARCHITECTURE.md](INFORMATION_ARCHITECTURE.md)), дизайн-система
  ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)), проверки ([QA_REPORT.md](QA_REPORT.md)) и другие.

Сайт в работе: данные владельца, кейсы и контакты помечены на страницах как черновики.

## Быстрый просмотр без установки

```bash
cd site
npm install
npm run build
npm run export:static
```

Появится папка `static-site/` — откройте в ней `index.html` двойным щелчком.
Шрифт Benzin для сборки нужно добавить самостоятельно: [site/src/fonts/README.md](site/src/fonts/README.md).
