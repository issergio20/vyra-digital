// Тема сайта: тёмная (фирменная, по умолчанию) или светлая. Выбор хранится в localStorage
// и ставится атрибутом <html data-theme="light">; цвета — в globals.css.
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "vyra-theme";

/**
 * Скрипт для <head>: ставит сохранённую тему до первой отрисовки, чтобы страница
 * не мигала тёмной перед светлой.
 */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
