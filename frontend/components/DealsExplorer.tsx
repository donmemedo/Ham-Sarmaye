"use client";
import { useState } from "react";
import DealCard from "./DealCard";
import Icon from "./Icon";
import { dict, type Lang } from "@/lib/i18n";
import type { Deal } from "@/lib/types";

export default function DealsExplorer({ deals, lang }: { deals: Deal[]; lang: Lang }) {
  const t = dict[lang];
  const [q, setQ] = useState("");
  const [ind, setInd] = useState("");
  const [risk, setRisk] = useState("");
  const s = q.trim().toLowerCase();
  const shown = deals.filter(
    (d) => (!ind || d.industry === ind) && (!risk || d.risk === risk) &&
      (!s || [d.name, d.tagline, d.location].some((x) => x.fa.includes(s) || x.en.toLowerCase().includes(s))),
  );
  const chip = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm transition ${on ? "bg-fg text-bg font-semibold" : "bg-elev border border-line text-fg-2 hover:text-fg"}`;

  return (
    <>
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 -mx-4 space-y-3 bg-bg/80 px-4 py-4 backdrop-blur-xl">
        <label className="relative block">
          <Icon name="search" className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-fg-2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.deals.search} className="field ps-12" type="search" />
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button className={chip(!ind)} onClick={() => setInd("")}>{t.deals.all}</button>
          {Object.entries(t.industry).map(([k, v]) => (
            <button key={k} className={chip(ind === k)} onClick={() => setInd(ind === k ? "" : k)}>{v}</button>
          ))}
          <span className="mx-1 w-px shrink-0 bg-line" />
          {(["", "A", "B", "C"] as const).map((r) => (
            <button key={r} className={chip(risk === r)} onClick={() => setRisk(r)}>{r ? t.risk[r] : t.deals.anyRisk}</button>
          ))}
        </div>
      </div>
      {shown.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((d, i) => <div key={d.slug} className="rise" style={{ animationDelay: `${i * 70}ms` }}><DealCard d={d} lang={lang} /></div>)}
        </div>
      ) : (
        <p className="py-24 text-center text-fg-2">{t.deals.empty}</p>
      )}
    </>
  );
}
