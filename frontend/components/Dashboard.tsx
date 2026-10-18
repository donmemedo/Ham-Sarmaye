"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cover } from "./DealCard";
import Icon from "./Icon";
import { date, dict, num, pct, toman, type Lang, type Text } from "@/lib/i18n";
import { call, setToken } from "@/lib/client";

type Holding = { slug: string; name: Text; industry: string; hue: number; return: number; months: number; amount: number };
type Portfolio = { phone: string; total: number; expected_profit: number; holdings: Holding[]; transactions: { slug: string; amount: number; created_at: string }[] };

export default function Dashboard({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const router = useRouter();
  const [p, setP] = useState<Portfolio | null>(null);

  useEffect(() => {
    call<Portfolio>("/me/portfolio").then(setP).catch(() => router.replace("/login?next=/dashboard"));
  }, [router]);

  if (!p)
    return (
      <div className="mx-auto grid max-w-6xl gap-5 px-4 pt-10 md:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="card h-36 animate-pulse" />)}
      </div>
    );

  const bySlug = Object.fromEntries(p.holdings.map((h) => [h.slug, h]));
  const C = 2 * Math.PI * 40;
  let acc = 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pt-10">
      <div className="rise flex items-end justify-between gap-4">
        <div>
          <p className="text-fg-2">{t.dash.hello} <span dir="ltr">{p.phone}</span></p>
          <h1 className="mt-1 text-4xl font-black tracking-tight md:text-5xl">{t.dash.title}</h1>
        </div>
        <button onClick={() => { setToken(null); router.push("/"); }} className="btn btn-ghost text-sm">
          <Icon name="out" className="size-4 rtl:rotate-180" />{t.nav.logout}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[[t.dash.total, toman(p.total, lang), "text-fg"], [t.dash.expected, `+${toman(p.expected_profit, lang)}`, "text-good"], [t.dash.count, num(p.holdings.length, lang), "text-fg"]].map(([l, v, c], i) => (
          <div key={l} className="card spot rise p-6" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="text-sm text-fg-2">{l}</div>
            <div className={`mt-2 text-3xl font-black tracking-tight ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      {!p.holdings.length ? (
        <div className="card rise p-12 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-accent/10 text-accent"><Icon name="pie" className="size-8" /></span>
          <p className="mt-5 text-fg-2">{t.dash.empty}</p>
          <Link href="/deals" className="btn btn-primary mt-6">{t.dash.explore}</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <section className="card rise p-6">
              <h2 className="text-lg font-bold">{t.dash.allocation}</h2>
              <div className="relative mx-auto mt-6 size-52">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                  {p.holdings.map((h) => {
                    const len = (h.amount / p.total) * C;
                    const el = <circle key={h.slug} cx="50" cy="50" r="40" fill="none" strokeWidth="14" stroke={`hsl(${h.hue} 85% 58%)`} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} />;
                    acc += len;
                    return el;
                  })}
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center"><div><b className="text-xl">{toman(p.total, lang)}</b><div className="text-xs text-fg-2">{t.dash.total}</div></div></div>
              </div>
            </section>
            <section className="card rise p-6">
              <h2 className="mb-4 text-lg font-bold">{t.dash.holdings}</h2>
              <ul className="divide-y divide-line">
                {p.holdings.map((h) => (
                  <li key={h.slug}>
                    <Link href={`/deals/${h.slug}`} className="flex items-center gap-4 py-3 transition hover:opacity-80">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl font-bold text-white" style={cover(h.hue)}>{h.name[lang][0]}</span>
                      <div className="min-w-0 flex-1">
                        <b className="block truncate">{h.name[lang]}</b>
                        <span className="text-xs text-fg-2">{t.industry[h.industry]} · {pct(h.return, lang)} {t.deal.ret}</span>
                      </div>
                      <div className="text-end"><b>{toman(h.amount, lang)}</b><div className="text-xs text-fg-2">{pct(Math.round((h.amount / p.total) * 100), lang)}</div></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section className="card rise p-6">
            <h2 className="mb-4 text-lg font-bold">{t.dash.txs}</h2>
            <ul className="divide-y divide-line">
              {p.transactions.map((x, i) => (
                <li key={i} className="flex items-center gap-4 py-3">
                  <span className="grid size-9 place-items-center rounded-full bg-accent/10 text-accent"><Icon name="arrow" className="size-4 -rotate-45 rtl:rotate-[-135deg]" /></span>
                  <div className="flex-1"><b>{bySlug[x.slug]?.name[lang]}</b><div className="text-xs text-fg-2">{date(x.created_at, lang)}</div></div>
                  <b className="tabular-nums">{num(x.amount, lang)} {t.unit}</b>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
