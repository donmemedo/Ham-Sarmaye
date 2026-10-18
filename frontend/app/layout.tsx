import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/inter";
import "./globals.css";
import Nav, { Logo } from "@/components/Nav";
import RegisterSW from "@/components/RegisterSW";
import Spotlight from "@/components/Spotlight";
import { dict } from "@/lib/i18n";
import { getPrefs } from "@/lib/server";

export const metadata: Metadata = {
  title: "Iran Funders Club | ایران‌فاندرز کالب",
  description: "Crowdfunding & venture investing for Iranian startups and SMEs.",
  applicationName: "Iran Funders Club",
  appleWebApp: { capable: true, title: "ایران‌فاندرز", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f5f7" }, { media: "(prefers-color-scheme: dark)", color: "#000000" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, theme } = await getPrefs();
  const t = dict[lang];
  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"} data-theme={theme} suppressHydrationWarning>
      <body className="min-h-dvh overflow-x-clip">
        <Nav lang={lang} theme={theme} />
        <Spotlight />
        <RegisterSW />
        <main className="pt-[calc(4rem+env(safe-area-inset-top))] pb-24 md:pb-0">{children}</main>
        <footer className="border-t border-line pb-28 md:pb-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-10 text-sm text-fg-2 md:flex-row md:items-start md:justify-between">
            <Logo lang={lang} />
            <p className="max-w-xl leading-7">{t.footer.disclaimer}</p>
            <p>{t.footer.rights}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
