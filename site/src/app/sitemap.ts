import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";

// Только индексируемые страницы: черновики кейсов и политика (noindex) сюда не попадают.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/services"), changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: url("/pricing"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/projects"), changeFrequency: "monthly", priority: 0.8 },
    ...projects
      .filter((p) => p.status === "published")
      .map((p) => ({
        url: url(`/projects/${p.slug}`),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
    { url: url("/process"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/contacts"), changeFrequency: "yearly", priority: 0.7 },
  ];
  return pages;
}
