import DealsExplorer from "@/components/DealsExplorer";
import { dict } from "@/lib/i18n";
import { api, getPrefs } from "@/lib/server";
import type { Deal } from "@/lib/types";

export default async function DealsPage() {
  const { lang } = await getPrefs();
  const deals = (await api<Deal[]>("/deals")) ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="rise text-4xl font-black tracking-tight md:text-6xl">{dict[lang].deals.title}</h1>
      <p className="rise mt-3 text-lg text-fg-2">{dict[lang].deals.sub}</p>
      <DealsExplorer deals={deals} lang={lang} />
    </div>
  );
}
