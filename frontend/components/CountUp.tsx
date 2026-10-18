"use client";
import { useEffect, useRef, useState } from "react";
import { num, pct, toman, type Lang } from "@/lib/i18n";

export default function CountUp({ value, lang, kind = "num" }: { value: number; lang: Lang; kind?: "num" | "toman" | "pct" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(value);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600);
        setV(value * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [value]);
  const r = Math.round(v);
  return <span ref={ref} className="tabular-nums">{kind === "toman" ? toman(r, lang) : kind === "pct" ? pct(r, lang) : num(r, lang)}</span>;
}
