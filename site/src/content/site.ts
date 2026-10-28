export const site = {
  name: "VYRA Digital",
  /** Адрес сайта для canonical и Open Graph. Домен не выбран — задаётся через окружение. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  description:
    "B2B-компании со сложным продуктом: корпоративные сайты и каталоги для промышленности, строительства и технических услуг. Независимое digital-агентство, фиксированные пакеты и понятные сроки.",
  briefHref: "/contacts#brief",
  /**
   * E-mail для заявок — запасной канал, если форма не смогла отправить. Адрес владелец ещё
   * не дал (CONTENT_REQUIREMENTS.md §3), поэтому только из окружения; без него ссылка не выводится.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
} as const;

export type SocialLink = { id: "telegram" | "whatsapp" | "max"; label: string; href: string };

/**
 * Мессенджеры для кнопки в правом нижнем углу. Адреса владелец ещё не дал, поэтому только
 * из окружения: без переменной пункт не показывается, без всех трёх — нет и кнопки.
 */
export const socialLinks: readonly SocialLink[] = (
  [
    { id: "telegram", label: "Telegram", href: process.env.NEXT_PUBLIC_TELEGRAM_URL },
    { id: "whatsapp", label: "WhatsApp", href: process.env.NEXT_PUBLIC_WHATSAPP_URL },
    { id: "max", label: "MAX", href: process.env.NEXT_PUBLIC_MAX_URL },
  ] as const
).flatMap((s) => (s.href ? [{ id: s.id, label: s.label, href: s.href }] : []));

export type NavItem = { href: string; label: string };

export const mainNav: readonly NavItem[] = [
  { href: "/services", label: "Услуги" },
  { href: "/pricing", label: "Цены" },
  { href: "/projects", label: "Проекты" },
  { href: "/about", label: "Об агентстве" },
  { href: "/contacts", label: "Контакты" },
];
