import Link from "next/link";
import Icon from "./Icon";
import { dict, num, pct, toman, type Lang } from "@/lib/i18n";
import type { Deal } from "@/lib/types";

export const cover = (h: number) => ({
  background: `radial-gradient(90% 120% at 0% 0%, hsl(${h} 95% 66%), transparent 60%), radial-gradient(90% 120% at 100% 100%, hsl(${h + 50} 90% 58%), transparent 60%), linear-gradient(135deg, hsl(${h} 70% 32%), hsl(${h + 30} 70% 16%))`,
});
const riskColor = { A: "text-good", B: "text-warn", C: "text-bad" };

export function RiskBadge({ risk, lang }: { risk: Deal["risk"]; lang: Lang }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-elev/90 px-3 py-1 text-xs font-semibold ${riskColor[risk]}`}>
      <i className="size-1.5 rounded-full bg-current" />
      {dict[lang].risk[risk]}
    </span>
  );
}

export const progress = (d: Deal) => Math.min(100, Math.round((d.raised / d.target) * 100));

export default function DealCard({ d, lang }: { d: Deal; lang: Lang }) {
  const t = dict[lang];
  const p = progress(d);
  return (
    <Link href={`/deals/${d.slug}`} className="card spot lift group block overflow-hidden">
      <div className="relative h-44 overflow-hidden" style={cover(d.hue)}>
        <span className="absolute -bottom-8 end-3 select-none text-[8rem] font-black leading-none text-white/20 transition duration-700 group-hover:scale-110">{d.name[lang][0]}</span>
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">{t.industry[d.industry]}</span>
          <RiskBadge risk={d.risk} lang={lang} />
        </div>
        <span className="absolute bottom-4 start-4 flex items-center gap-1 text-xs text-white/85"><Icon name="pin" className="size-3.5" />{d.location[lang]}</span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-bold tracking-tight">{d.name[lang]}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-fg-2">{d.tagline[lang]}</p>
        </div>
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <b>{toman(d.raised, lang)}</b>
            <span className="text-fg-2">{pct(p, lang)}</span>
          </div>
          <div className="bar mt-2"><i style={{ width: `${p}%` }} /></div>
        </div>
        <div className="grid grid-cols-3 border-t border-line pt-4 text-center">
          {[[pct(d.return, lang), t.deal.ret], [num(d.investors, lang), t.deal.investors], [num(d.days_left, lang), t.deal.daysLeft]].map(([v, l]) => (
            <div key={l}><div className="font-bold">{v}</div><div className="mt-0.5 text-[11px] text-fg-2">{l}</div></div>
          ))}
        </div>
      </div>
    </Link>
  );
}
