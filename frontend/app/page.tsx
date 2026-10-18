import Link from "next/link";
import CountUp from "@/components/CountUp";
import DealCard, { cover, progress } from "@/components/DealCard";
import Icon, { type IconName } from "@/components/Icon";
import { dict, num, pct, toman } from "@/lib/i18n";
import { api, getPrefs } from "@/lib/server";
import type { Deal, Stats } from "@/lib/types";

const featureIcons: IconName[] = ["shield", "id", "chart", "lock", "doc", "spark"];

export default async function Home() {
  const { lang } = await getPrefs();
  const t = dict[lang];
  const [stats, deals] = await Promise.all([api<Stats>("/stats"), api<Deal[]>("/deals")]);
  const top = deals![0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="blob -top-40 start-[-10%] size-[34rem] bg-[var(--accent)]" />
        <div className="blob top-20 end-[-15%] size-[30rem] bg-[var(--accent-2)] [animation-delay:-6s]" />
        <div className="blob -bottom-40 start-1/3 size-[26rem] bg-[var(--accent-3)] opacity-30 [animation-delay:-12s]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-24 md:min-h-[88dvh] md:grid-cols-[1.1fr_1fr] md:pt-10">
          <div>
            <span className="rise glass inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm text-fg-2">
              <Icon name="spark" className="size-4 text-accent" />{t.hero.badge}
            </span>
            <h1 className="rise mt-6 text-5xl leading-[1.1] font-black tracking-tight [animation-delay:.1s] sm:text-6xl lg:text-7xl">
              {t.hero.title1}<br /><span className="grad-text">{t.hero.title2}</span>
            </h1>
            <p className="rise mt-6 max-w-lg text-lg leading-8 text-fg-2 [animation-delay:.2s]">{t.hero.sub}</p>
            <div className="rise mt-9 flex flex-wrap gap-3 [animation-delay:.3s]">
              <Link href="/deals" className="btn btn-primary text-base">{t.hero.cta}<Icon name="arrow" className="size-4 rtl:rotate-180" /></Link>
              <Link href="/login" className="btn btn-ghost text-base">{t.hero.cta2}</Link>
            </div>
          </div>

          {/* floating 3D stack */}
          <div className="rise relative mx-auto w-full max-w-sm [animation-delay:.35s] [perspective:1400px]">
            <div className="float card overflow-hidden [transform:rotateY(-14deg)_rotateX(8deg)] rtl:[transform:rotateY(14deg)_rotateX(8deg)]">
              <div className="relative h-40" style={cover(top.hue)}>
                <span className="absolute -bottom-6 end-4 text-[7rem] leading-none font-black text-white/25">{top.name[lang][0]}</span>
              </div>
              <div className="space-y-3 p-5">
                <b className="text-lg">{top.name[lang]}</b>
                <div className="bar"><i style={{ width: `${progress(top)}%` }} /></div>
                <div className="flex justify-between text-sm text-fg-2"><span>{toman(top.raised, lang)}</span><span>{pct(progress(top), lang)}</span></div>
              </div>
            </div>
            <div className="float glass card absolute end-2 -top-8 flex items-center gap-3 px-4 py-3 [animation-delay:-2s] sm:-end-10">
              <span className="grid size-10 place-items-center rounded-full bg-good/15 text-good"><Icon name="trend" /></span>
              <div><b className="text-good">+{pct(top.return, lang)}</b><div className="text-xs text-fg-2">{t.deal.ret}</div></div>
            </div>
            <div className="float glass card absolute start-2 -bottom-10 flex items-center gap-3 px-4 py-3 [animation-delay:-4s] sm:-start-12">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[200, 280, 20, 150].map((h) => <span key={h} className="size-8 rounded-full border-2 border-[var(--elev)]" style={cover(h)} />)}
              </div>
              <div><b>{num(top.investors, lang)}</b><div className="text-xs text-fg-2">{t.deal.investors}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="card reveal grid grid-cols-2 gap-y-8 p-8 md:grid-cols-4">
          {([["raised", stats!.raised, "toman"], ["investors", stats!.investors, "num"], ["deals", stats!.deals, "num"], ["avgReturn", stats!.avg_return, "pct"]] as const).map(([k, v, kind]) => (
            <div key={k} className="text-center">
              <div className="text-2xl font-black tracking-tight md:text-4xl"><CountUp value={v} lang={lang} kind={kind} /></div>
              <div className="mt-2 text-sm text-fg-2">{t.stats[k]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pt-28">
        <h2 className="reveal text-center text-3xl font-black tracking-tight md:text-5xl">{t.how.title}</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <div key={i} className="card spot reveal p-7">
              <div className="grad-text text-6xl font-black">{num(i + 1, lang)}</div>
              <h3 className="mt-4 text-xl font-bold">{s.t}</h3>
              <p className="mt-2 leading-7 text-fg-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento features */}
      <section className="mx-auto max-w-6xl px-4 pt-28">
        <h2 className="reveal text-3xl font-black tracking-tight md:text-5xl">{t.features.title}</h2>
        <p className="reveal mt-3 text-lg text-fg-2">{t.features.sub}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.features.items.map((f, i) => (
            <div key={i} className={`card spot lift reveal p-7 ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
              <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent"><Icon name={featureIcons[i]} className="size-6" /></span>
              <h3 className={`mt-5 font-bold ${i === 0 ? "text-3xl" : "text-xl"}`}>{f.t}</h3>
              <p className="mt-2 leading-7 text-fg-2">{f.d}</p>
              {i === 0 && (
                <div className="mt-10 space-y-4">
                  {(["A", "B", "C"] as const).map((r, j) => (
                    <div key={r} className="flex items-center gap-4">
                      <span className="w-24 shrink-0 text-sm text-fg-2">{t.risk[r]}</span>
                      <div className="bar h-3 flex-1"><i style={{ width: `${[88, 62, 38][j]}%`, background: `var(--${["good", "warn", "bad"][j]})`, animationDelay: `${j * 0.15}s` }} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured deals */}
      <section className="mx-auto max-w-6xl px-4 pt-28">
        <div className="flex items-end justify-between">
          <h2 className="reveal text-3xl font-black tracking-tight md:text-5xl">{t.featured.title}</h2>
          <Link href="/deals" className="flex items-center gap-1 font-semibold text-accent">{t.featured.all}<Icon name="arrow" className="size-4 rtl:rotate-180" /></Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals!.slice(0, 3).map((d) => <div key={d.slug} className="reveal"><DealCard d={d} lang={lang} /></div>)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-28">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] p-10 text-center text-white md:p-20" style={cover(250)}>
          <div className="grid-bg absolute inset-0 opacity-40" />
          <h2 className="relative text-3xl font-black tracking-tight md:text-5xl">{t.cta.title}</h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-white/80">{t.cta.sub}</p>
          <Link href="/login" className="btn relative mt-8 bg-white text-base text-black">{t.cta.btn}<Icon name="arrow" className="size-4 rtl:rotate-180" /></Link>
        </div>
      </section>
    </>
  );
}
