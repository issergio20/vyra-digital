import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyBar } from "@/components/layout/StickyBar";
import { services } from "@/content/services";
import { site, socialLinks } from "@/content/site";
import { SocialDock } from "@/components/layout/SocialDock";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Текст — Inter Tight: вариативный шрифт, 400 и 600 — по одному файлу на алфавит.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
});

// Заголовки — Benzin (файлы и лицензию на сайт предоставил владелец). Одно начертание,
// Regular 400, как в дизайн-системе-образце: широкий шрифт держит заголовок без жирности.
const benzin = localFont({
  src: "../fonts/Benzin font/Benzin-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-benzin",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `B2B-компании со сложным продуктом — ${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0e1016",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: скрипт темы меняет data-theme на <html> до гидратации.
    <html
      lang="ru"
      className={`${interTight.variable} ${benzin.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#content"
          className="sr-only z-50 rounded-ui bg-accent-strong px-4 py-3 text-[length:var(--text-button)] font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Перейти к содержанию
        </a>
        <div className="relative">
          <Header />
          <div id="content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Footer />
        </div>
        <StickyBar
          servicePackages={Object.fromEntries(services.map((s) => [s.slug, s.packageSlug]))}
        />
        <SocialDock links={socialLinks} />
        <CustomCursor />
      </body>
    </html>
  );
}
