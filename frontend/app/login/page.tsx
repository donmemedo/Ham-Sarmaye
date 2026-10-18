import LoginForm from "@/components/LoginForm";
import { getPrefs } from "@/lib/server";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { lang } = await getPrefs();
  const next = (await searchParams).next;
  return <LoginForm lang={lang} next={next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"} />;
}
