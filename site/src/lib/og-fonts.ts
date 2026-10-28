import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Шрифты для генерации картинок (Open Graph, иконки). Файлы WOFF из @fontsource (SIL OFL 1.1):
// латиница и кириллица — отдельные подмножества под разными именами; в стилях указывать оба:
// fontFamily: "Inter Tight Cyrillic, Inter Tight".

const dir = (pkg: string) => join(process.cwd(), "node_modules", "@fontsource", pkg, "files");
// Заголовок картинки — Benzin; Satori читает TTF/WOFF, но не WOFF2.
const benzinFile = join(process.cwd(), "src", "fonts", "Benzin font", "Benzin-Regular.ttf");

async function load(pkg: string, file: string) {
  return readFile(join(dir(pkg), file));
}

export async function ogFonts() {
  const [benzin, latin600, cyr600, latin400, cyr400] = await Promise.all([
    readFile(benzinFile),
    load("inter-tight", "inter-tight-latin-600-normal.woff"),
    load("inter-tight", "inter-tight-cyrillic-600-normal.woff"),
    load("inter-tight", "inter-tight-latin-400-normal.woff"),
    load("inter-tight", "inter-tight-cyrillic-400-normal.woff"),
  ]);
  const font = (name: string, data: Buffer, weight: 400 | 600) => ({
    name,
    data,
    weight,
    style: "normal" as const,
  });
  return [
    font("Benzin", benzin, 400),
    font("Inter Tight", latin600, 600),
    font("Inter Tight Cyrillic", cyr600, 600),
    font("Inter Tight", latin400, 400),
    font("Inter Tight Cyrillic", cyr400, 400),
  ];
}
