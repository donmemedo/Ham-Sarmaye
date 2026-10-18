import Dashboard from "@/components/Dashboard";
import { getPrefs } from "@/lib/server";

export default async function DashboardPage() {
  return <Dashboard lang={(await getPrefs()).lang} />;
}
