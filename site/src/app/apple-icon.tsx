import { ImageResponse } from "next/og";

// Иконка для «Добавить на экран» в iOS: тот же знак, что в icon.svg, 180×180.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e1016",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32">
        <path d="M7 7h4.2L16 20.2 20.8 7H25l-7 18h-4z" fill="#f4f4f6" />
        <rect x="7" y="26" width="18" height="2" fill="#ff4533" />
      </svg>
    </div>,
    size,
  );
}
