"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Icon, { type IconName } from "./Icon";
import { dict, type Lang } from "@/lib/i18n";
import { setCookie, useToken } from "@/lib/client";

type Theme = "light" | "dark" | undefined;
const next: Record<string, Theme> = { auto: "light", light: "dark", dark: undefined };

export function Logo({ lang }: { lang: Lang }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)] text-white shadow-lg">
        <Icon name="spark" className="size-5" />
      </span>
      <span className="text-lg">{dict[lang].brand}</span>
    </Link>
  );
}

export default function Nav({ lang, theme: initial }: { lang: Lang; theme: Theme }) {
  const t = dict[lang].nav;
  const path = usePathname();
  const router = useRouter();
  const token = useToken();
  const [theme, setTheme] = useState<Theme>(initial);

  const cycleTheme = () => {
    const n = next[theme ?? "auto"];
    setTheme(n);
    setCookie("theme", n ?? null);
    if (n) document.documentElement.dataset.theme = n;
    else delete document.documentElement.dataset.theme;
  };
  const toggleLang = () => {
    const n = lang === "fa" ? "en" : "fa";
    setCookie("lang", n);
    document.documentElement.lang = n;
    document.documentElement.dir = n === "fa" ? "rtl" : "ltr";
    router.refresh();
  };

  const links: [string, string, IconName][] = [
    ["/", t.home, "home"],
    ["/deals", t.deals, "grid"],
    token ? ["/dashboard", t.dashboard, "pie"] : ["/login", t.login, "user"],
  ];
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <>
      <header className="glass fixed inset-x-0 top-0 z-50 border-b border-line pt-[env(safe-area-inset-top)]">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo lang={lang} />
          <div className="hidden items-center gap-1 md:flex">
            {links.slice(0, 2).map(([h, label]) => (
              <Link key={h} href={h} className={`rounded-full px-4 py-2 text-sm transition ${active(h) ? "bg-line font-semibold" : "text-fg-2 hover:text-fg"}`}>
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="btn-ghost btn h-9 px-3 py-0 text-xs" aria-label={t.lang}>{t.lang}</button>
            <button onClick={cycleTheme} className="btn-ghost btn size-9 p-0" aria-label={t.theme} title={theme ?? "auto"}>
              <Icon name={theme === "light" ? "sun" : theme === "dark" ? "moon" : "auto"} className="size-4" />
            </button>
            <Link href={links[2][0]} className="btn btn-primary hidden h-9 py-0 text-sm md:inline-flex">{links[2][1]}</Link>
          </div>
        </nav>
      </header>
      {/* iOS-style tab bar on phones */}
      <nav className="glass fixed inset-x-0 bottom-0 z-50 border-t border-line pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {links.map(([h, label, icon]) => (
            <Link key={h} href={h} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition ${active(h) ? "text-accent" : "text-fg-2"}`}>
              <Icon name={icon} className="size-6" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
