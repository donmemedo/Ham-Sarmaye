import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export async function getPrefs() {
  const c = await cookies();
  const theme = c.get("theme")?.value;
  return { lang: (c.get("lang")?.value === "en" ? "en" : "fa") as Lang, theme: (theme === "light" || theme === "dark" ? theme : undefined) as "light" | "dark" | undefined };
}

export async function api<T>(path: string): Promise<T | null> {
  const r = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:8000"}/api${path}`, { cache: "no-store" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`API ${path}: ${r.status}`);
  return r.json();
}
