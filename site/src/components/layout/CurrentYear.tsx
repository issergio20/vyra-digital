import { cacheLife } from "next/cache";

// С Cache Components new Date() разрешён только внутри кэша: год входит в статическую
// оболочку и пересчитывается раз в сутки.
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
