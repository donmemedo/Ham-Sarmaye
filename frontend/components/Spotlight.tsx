"use client";
import { useEffect } from "react";

// One listener for the whole app: feeds cursor position to the hovered .spot element's CSS vars.
export default function Spotlight() {
  useEffect(() => {
    const f = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.(".spot") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    addEventListener("pointermove", f, { passive: true });
    return () => removeEventListener("pointermove", f);
  }, []);
  return null;
}
