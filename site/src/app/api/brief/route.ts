import { createBriefHandler } from "@/lib/brief-handler";
import { transportsFromEnv } from "@/lib/send-brief";

const handle = createBriefHandler({ transports: transportsFromEnv() });

/** Максимальный размер тела запроса: форма весит меньше 10 КБ. */
const MAX_BODY = 16 * 1024;

export async function POST(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) {
    return Response.json(
      { ok: false, code: "bad_request", message: "Нужен JSON" },
      { status: 415 },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return Response.json(
      { ok: false, code: "bad_request", message: "Слишком большой запрос" },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json(
      { ok: false, code: "bad_request", message: "Некорректный JSON" },
      { status: 400 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const result = await handle(payload, ip);
  return Response.json(result.body, { status: result.status });
}
