"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "./Icon";
import { ascii, compact, dict, num, toman, type Lang } from "@/lib/i18n";
import { call, useToken } from "@/lib/client";
import type { Deal } from "@/lib/types";

export default function InvestPanel({ d, lang }: { d: Deal; lang: Lang }) {
  const t = dict[lang];
  const router = useRouter();
  const token = useToken();
  const [amount, setAmount] = useState(5_000_000);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [err, setErr] = useState("");
  const left = d.target - d.raised;
  const profit = Math.round((amount * d.return * d.months) / 1200);

  const submit = async () => {
    if (!token) return router.push(`/login?next=/deals/${d.slug}`);
    setErr(""); setState("busy");
    try {
      await call(`/deals/${d.slug}/invest`, { amount });
      setState("done");
      router.refresh();
    } catch (e) {
      setErr(t.err[(e as Error).message] ?? t.err.error);
      setState("idle");
    }
  };

  if (state === "done")
    return (
      <div className="card p-8 text-center">
        <span className="pop mx-auto grid size-20 place-items-center rounded-full bg-good text-white shadow-[0_10px_40px_-10px_var(--good)]"><Icon name="check" className="size-10" /></span>
        <h3 className="mt-6 text-xl font-bold">{t.invest.success}</h3>
        <p className="mt-2 text-fg-2">{toman(amount, lang)} — {d.name[lang]}</p>
        <Link href="/dashboard" className="btn btn-primary mt-6 w-full">{t.invest.view}</Link>
        <button onClick={() => setState("idle")} className="btn mt-2 w-full text-fg-2">{t.invest.title}</button>
      </div>
    );

  return (
    <div className="card space-y-5 p-6">
      <h3 className="text-xl font-bold">{t.invest.title}</h3>
      <label className="block">
        <span className="text-sm text-fg-2">{t.invest.amount}</span>
        <input
          className="field mt-2 text-2xl font-bold tabular-nums"
          inputMode="numeric"
          value={amount ? num(amount, lang) : ""}
          onChange={(e) => setAmount(Number(ascii(e.target.value).replace(/\D/g, "")) || 0)}
        />
      </label>
      <div className="grid grid-cols-4 gap-2">
        {[1e6, 5e6, 1e7, 5e7].map((v) => (
          <button key={v} disabled={v > left} onClick={() => setAmount(v)}
            className={`rounded-xl border py-2 text-sm transition ${amount === v ? "border-accent bg-accent/10 font-semibold text-accent" : "border-line hover:border-fg-2"}`}>
            {compact(v, lang)}
          </button>
        ))}
      </div>
      <p className="text-xs text-fg-2">{t.invest.min}: {toman(d.min_invest, lang)}</p>
      <div className="space-y-2 rounded-2xl bg-bg p-4 text-sm">
        <div className="flex justify-between"><span className="text-fg-2">{t.invest.estimate}</span><b className="text-good">+{num(profit, lang)}</b></div>
        <div className="flex justify-between"><span className="text-fg-2">{t.invest.total}</span><b>{num(amount + profit, lang)} {t.unit}</b></div>
      </div>
      {err && <p role="alert" className="text-sm text-bad">{err}</p>}
      <button onClick={submit} disabled={state === "busy" || amount < d.min_invest || d.days_left === 0} className="btn btn-primary w-full py-4 text-base">
        {state === "busy" ? <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : token ? t.invest.confirm : t.invest.login}
      </button>
      <p className="text-center text-xs text-fg-2">{t.invest.note}</p>
    </div>
  );
}
