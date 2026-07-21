import { cookies } from "next/headers";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata = { title: "Dashboard — Booka Admin" };

async function getDashboard() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booka-token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/dashboard`,
      {
        cache: "no-store",
        headers: token ? { Cookie: `booka-token=${token}` } : {},
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const data = await getDashboard();
  return (
    <AdminDashboardView
      salesData={data?.salesData ?? []}
      orders={data?.orders ?? []}
      summary={data?.summary ?? null}
      topBooks={data?.topBooks ?? []}
    />
  );
}
