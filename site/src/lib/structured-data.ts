import { isDraftText } from "@/content/draft";
import { site } from "@/content/site";

// Структурированные данные строго по видимому содержимому страницы (ТЗ §20):
// без рейтингов, отзывов, адресов и телефонов, которых нет на сайте.

const abs = (path: string) => new URL(path, site.url).toString();

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: abs("/"),
    description: site.description,
  };
}

export function breadcrumbLd(items: readonly { href: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: abs(item.href),
    })),
  };
}

/** Черновые ответы в разметку не попадают — только то, что уже можно утверждать. */
export function faqLd(items: readonly { question: string; answer: string }[]) {
  const ready = items.filter((q) => !isDraftText(q.answer));
  if (ready.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ready.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function serviceLd(service: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: abs(service.path),
    provider: { "@type": "Organization", name: site.name, url: abs("/") },
  };
}
