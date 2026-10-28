import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

// Картинка для соцсетей и мессенджеров: поле синьки, заголовок первого экрана, вордмарк.
export const alt = "VYRA Digital — B2B-компании со сложным продуктом";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0e1016",
        color: "#f4f4f6",
        padding: "64px 72px",
        fontFamily: "Inter Tight Cyrillic, Inter Tight",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: "Benzin", fontSize: 36, fontWeight: 400 }}>VYRA</span>
        <span style={{ fontSize: 28 }}>Digital</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: "Benzin", fontSize: 64, fontWeight: 400, lineHeight: 1.08 }}>
          B2B-компании
        </span>
        <span style={{ fontFamily: "Benzin", fontSize: 64, fontWeight: 400, lineHeight: 1.08 }}>
          со сложным продуктом
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28 }}>
        <div style={{ width: 56, height: 10, background: "#ff4533" }} />
        <span>Корпоративные сайты и каталоги · фиксированные пакеты</span>
      </div>
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
