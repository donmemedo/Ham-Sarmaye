import type { Text } from "./i18n";

export type Deal = {
  slug: string; industry: string; risk: "A" | "B" | "C"; target: number; raised: number; investors: number;
  days_left: number; return: number; months: number; hue: number; min_invest: number;
  name: Text; tagline: Text; location: Text; summary: Text; highlights: Text[]; risks: Text[];
  team: { name: Text; role: Text }[]; funds: { label: Text; pct: number }[];
};
export type Stats = { raised: number; investors: number; deals: number; avg_return: number };
