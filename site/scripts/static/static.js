// Поведение статической копии (scripts/export-static.mjs) без React: то, что на сайте
// делают клиентские компоненты. Курсор и липкая шапка в копии не подключаются.
(() => {
  const root = document.documentElement;
  const KEY = "vyra-theme";

  // Тема — как ThemeToggle: атрибут data-theme на <html>, выбор в localStorage.
  const sun =
    '<svg aria-hidden="true" viewBox="0 0 24 24" class="size-[1.125rem]"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const moon =
    '<svg aria-hidden="true" viewBox="0 0 24 24" class="size-[1.125rem]"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>';
  const toggles = [...document.querySelectorAll("button[title='Светлая тема'], button[title='Тёмная тема']")];

  const paint = () => {
    const light = root.dataset.theme === "light";
    for (const b of toggles) {
      const [icon, label, hint] = b.children;
      icon.innerHTML = light ? moon : sun;
      label.textContent = light ? "Светло" : "Темно";
      hint.textContent = light ? ": включить тёмную тему" : ": включить светлую тему";
      b.title = light ? "Тёмная тема" : "Светлая тема";
    }
  };
  for (const b of toggles) {
    b.addEventListener("click", () => {
      const light = root.dataset.theme !== "light";
      if (light) root.dataset.theme = "light";
      else delete root.dataset.theme;
      try {
        localStorage.setItem(KEY, light ? "light" : "dark");
      } catch {
        // file:// в некоторых браузерах без localStorage — тема просто не запомнится.
      }
      paint();
    });
  }
  paint();

  // Мобильное меню — как MobileNavigation: <dialog>, Esc закрывает браузер.
  for (const opener of document.querySelectorAll("button[aria-haspopup='dialog']")) {
    const dialog = opener.nextElementSibling;
    if (!(dialog instanceof HTMLDialogElement)) continue;
    opener.addEventListener("click", () => dialog.showModal());
    dialog.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) dialog.close();
      if (target instanceof HTMLButtonElement && target.textContent.trim() === "Закрыть") {
        dialog.close();
      }
    });
  }

  // Услуги на главной раскрываются по наведению мыши — как HoverAccordion.
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const rows = [...document.querySelectorAll("details[name='home-services']")];
    const list = rows[0]?.parentElement;
    let timer;
    const openOnly = (row) => rows.forEach((r) => (r.open = r === row));
    for (const r of rows) {
      r.addEventListener("mouseenter", () => {
        clearTimeout(timer);
        timer = setTimeout(() => openOnly(r), 120);
      });
    }
    list?.addEventListener("mouseleave", () => {
      clearTimeout(timer);
      timer = setTimeout(() => openOnly(null), 200);
    });
  }

  // Форма: в копии без сервера заявка не уходит — говорим об этом прямо, «отправлено» не пишем.
  for (const form of document.querySelectorAll("form")) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let note = form.querySelector("[data-static-note]");
      if (!note) {
        note = document.createElement("p");
        note.dataset.staticNote = "";
        note.setAttribute("role", "alert");
        note.className = "rounded-ui border border-error px-4 py-3 font-semibold text-error";
        note.textContent =
          "Это локальная копия сайта: заявка отсюда не отправляется. Отправка работает только на сайте с сервером.";
        form.append(note);
      }
      note.scrollIntoView({ block: "nearest" });
    });
  }
})();
