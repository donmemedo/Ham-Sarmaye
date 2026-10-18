"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "./Icon";
import { ascii, dict, type Lang } from "@/lib/i18n";
import { call, setToken } from "@/lib/client";

export default function LoginForm({ lang, next }: { lang: Lang; next: string }) {
  const t = dict[lang];
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [demo, setDemo] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = ascii(step === "phone" ? phone : code).trim();
    if (!v) return setErr(t.err.empty);
    setErr(""); setBusy(true);
    try {
      if (step === "phone") {
        const r = await call<{ demo_code?: string }>("/auth/otp", { phone: v });
        setDemo(r.demo_code ?? null); setStep("code");
      } else {
        const r = await call<{ token: string }>("/auth/verify", { phone: ascii(phone), code: v });
        setToken(r.token);
        router.push(next);
      }
    } catch (e) {
      setErr(t.err[(e as Error).message] ?? t.err.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-[80dvh] place-items-center overflow-hidden px-4 py-12">
      <div className="blob top-0 start-1/4 size-80 bg-[var(--accent)]" />
      <div className="blob bottom-0 end-1/4 size-80 bg-[var(--accent-2)] [animation-delay:-8s]" />
      <form onSubmit={submit} className="glass card rise relative w-full max-w-md p-8 md:p-10" noValidate>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white shadow-xl">
          <Icon name={step === "phone" ? "user" : "lock"} className="size-8" />
        </span>
        <h1 className="mt-6 text-center text-2xl font-black">{t.auth.title}</h1>
        {step === "phone" ? (
          <>
            <p className="mt-2 text-center text-sm leading-6 text-fg-2">{t.auth.sub}</p>
            <label className="mt-8 block text-sm font-medium">{t.auth.phone}
              <input autoFocus type="tel" inputMode="numeric" dir="ltr" autoComplete="tel" placeholder="09123456789"
                className="field mt-2 text-center text-lg tracking-widest" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!err} />
            </label>
          </>
        ) : (
          <>
            <p className="mt-2 text-center text-sm text-fg-2">{t.auth.codeSub} <b dir="ltr">{phone}</b></p>
            {demo && <p className="pop mt-5 rounded-2xl bg-accent/10 p-3 text-center text-sm text-accent">{t.auth.demo} <b className="text-lg tracking-[.3em]">{demo}</b></p>}
            <label className="mt-6 block text-sm font-medium">{t.auth.code}
              <input autoFocus inputMode="numeric" dir="ltr" autoComplete="one-time-code" maxLength={4}
                className="field mt-2 text-center text-3xl font-bold tracking-[1em]" value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!err} />
            </label>
          </>
        )}
        {err && <p role="alert" className="mt-3 text-sm text-bad">{err}</p>}
        <button disabled={busy} className="btn btn-primary mt-6 w-full py-4 text-base">
          {busy ? <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : step === "phone" ? t.auth.send : t.auth.verify}
        </button>
        {step === "code" && <button type="button" onClick={() => { setStep("phone"); setCode(""); setErr(""); }} className="btn mt-2 w-full text-sm text-fg-2">{t.auth.edit}</button>}
        <p className="mt-6 text-center text-xs text-fg-2">{t.auth.terms}</p>
      </form>
    </div>
  );
}
