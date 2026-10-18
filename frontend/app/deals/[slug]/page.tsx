import Link from "next/link";
import { notFound } from "next/navigation";
import { cover, progress, RiskBadge } from "@/components/DealCard";
import Icon, { type IconName } from "@/components/Icon";
import InvestPanel from "@/components/InvestPanel";
import { dict, num, pct, toman } from "@/lib/i18n";
import { api, getPrefs } from "@/lib/server";
import type { Deal } from "@/lib/types";

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { lang } = await getPrefs();
  const d = await api<Deal>(`/deals/${(await params).slug}`);
  if (!d) notFound();
  const t = dict[lang];
  const p = progress(d);
  const metrics: [IconName, string, string][] = [
    ["trend", pct(d.return, lang), t.deal.ret],
    ["clock", `${num(d.months, lang)} ${t.deal.months}`, t.deal.duration],
    ["users", num(d.investors, lang), t.deal.investors],
    ["clock", num(d.days_left, lang), t.deal.daysLeft],
  ];
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="card reveal p-6 md:p-8"><h2 className="mb-5 text-xl font-bold">{title}</h2>{children}</section>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Link href="/deals" className="mb-4 inline-flex items-center gap-1 text-sm text-fg-2 hover:text-fg">
        <Icon name="arrow" className="size-4 rotate-180 rtl:rotate-0" />{t.deal.back}
      </Link>
      <header className="rise relative overflow-hidden rounded-[2rem] p-6 text-white md:p-12" style={cover(d.hue)}>
        <div className="grid-bg absolute inset-0 opacity-30" />
        <span className="absolute -bottom-16 end-6 text-[16rem] leading-none font-black text-white/15 select-none">{d.name[lang][0]}</span>
        <div className="relative flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/25 px-3 py-1 text-xs backdrop-blur-md">{t.industry[d.industry]}</span>
          <RiskBadge risk={d.risk} lang={lang} />
          <span className="flex items-center gap-1 text-xs text-white/85"><Icon name="pin" className="size-3.5" />{d.location[lang]}</span>
        </div>
        <h1 className="relative mt-16 text-4xl font-black tracking-tight md:text-6xl">{d.name[lang]}</h1>
        <p className="relative mt-3 max-w-xl text-lg text-white/85">{d.tagline[lang]}</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="card reveal flex flex-col items-center gap-6 p-6 sm:flex-row md:p-8">
            <div className="relative size-32 shrink-0">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#g)" strokeWidth="8" strokeLinecap="round" className="ring" strokeDasharray="264" strokeDashoffset={264 * (1 - p / 100)} />
                <defs><linearGradient id="g"><stop stopColor="var(--accent)" /><stop offset="1" stopColor="var(--accent-2)" /></linearGradient></defs>
              </svg>
              <b className="absolute inset-0 grid place-items-center text-2xl">{pct(p, lang)}</b>
            </div>
            <div className="text-center sm:text-start">
              <div className="text-3xl font-black">{toman(d.raised, lang)}</div>
              <div className="mt-1 text-fg-2">{t.deal.raised} {t.deal.of} {toman(d.target, lang)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {metrics.map(([icon, v, l]) => (
              <div key={l} className="card reveal p-5">
                <Icon name={icon} className="size-5 text-accent" />
                <div className="mt-3 text-xl font-bold">{v}</div>
                <div className="text-xs text-fg-2">{l}</div>
              </div>
            ))}
          </div>
          <div className="lg:hidden"><InvestPanel d={d} lang={lang} /></div>
          <Section title={t.deal.overview}><p className="leading-8 text-fg-2">{d.summary[lang]}</p></Section>
          <Section title={t.deal.highlights}>
            <ul className="space-y-3">
              {d.highlights.map((h) => (
                <li key={h.en} className="flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-good/15 text-good"><Icon name="check" className="size-4" /></span>{h[lang]}</li>
              ))}
            </ul>
          </Section>
          <Section title={t.deal.funds}>
            <div className="flex h-4 overflow-hidden rounded-full">
              {d.funds.map((f, i) => <i key={f.label.en} style={{ width: `${f.pct}%`, background: `hsl(${d.hue + i * 45} 80% ${55 + i * 8}%)` }} />)}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {d.funds.map((f, i) => (
                <div key={f.label.en} className="flex items-center gap-2 text-sm">
                  <i className="size-3 rounded-full" style={{ background: `hsl(${d.hue + i * 45} 80% ${55 + i * 8}%)` }} />
                  <span className="text-fg-2">{f.label[lang]}</span><b className="ms-auto">{pct(f.pct, lang)}</b>
                </div>
              ))}
            </div>
          </Section>
          <Section title={t.deal.risks}>
            <ul className="space-y-3">
              {d.risks.map((r) => (
                <li key={r.en} className="flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-warn/15 font-bold text-warn">!</span>{r[lang]}</li>
              ))}
            </ul>
          </Section>
          <Section title={t.deal.team}>
            <div className="grid gap-4 sm:grid-cols-2">
              {d.team.map((m, i) => (
                <div key={m.name.en} className="flex items-center gap-4 rounded-2xl bg-bg p-4">
                  <span className="grid size-12 place-items-center rounded-full font-bold text-white" style={cover(d.hue + i * 60)}>{m.name[lang][0]}</span>
                  <div><b>{m.name[lang]}</b><div className="text-sm text-fg-2">{m.role[lang]}</div></div>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <aside className="hidden lg:block"><div className="sticky top-24"><InvestPanel d={d} lang={lang} /></div></aside>
      </div>
    </div>
  );
}
