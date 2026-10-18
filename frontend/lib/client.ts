"use client";
import { useSyncExternalStore } from "react";

const read = () => {
  try { return localStorage.getItem("token"); } catch { return null; }
};
const subscribe = (f: () => void) => {
  addEventListener("auth", f); addEventListener("storage", f);
  return () => { removeEventListener("auth", f); removeEventListener("storage", f); };
};
export const useToken = () => useSyncExternalStore(subscribe, read, () => null);
export function setToken(t: string | null) {
  try { t ? localStorage.setItem("token", t) : localStorage.removeItem("token"); } catch {}
  dispatchEvent(new Event("auth"));
}

export async function call<T>(path: string, body?: unknown): Promise<T> {
  const token = read();
  const r = await fetch(`/api${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) setToken(null);
  if (!r.ok) throw new Error(typeof j.detail === "string" ? j.detail : "error");
  return j;
}

export function setCookie(k: string, v: string | null) {
  document.cookie = `${k}=${v ?? ""}; path=/; max-age=${v ? 31536000 : 0}; samesite=lax`;
}
