import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

// С Cache Components неизвестный slug отрисовывается потоком, и notFound() уже не меняет
// HTTP-статус (страница 404 приходит с кодом 200). Proxy отсекает такие адреса до рендера:
// переписывает их на несуществующий путь, и Next.js отвечает настоящим 404.
const known: Record<string, Set<string>> = {
  projects: new Set(projects.filter((p) => p.status === "published").map((p) => p.slug)),
  services: new Set(services.map((s) => s.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  const list = known[section];
  if (list && slug && rest.length === 0 && !list.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/_not-found-slug", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:slug", "/services/:slug"],
};
