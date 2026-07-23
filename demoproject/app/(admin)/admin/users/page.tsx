import { cookies } from "next/headers";
import { AdminUsersView } from "@/components/admin/AdminUsersView";

export const metadata = { title: "จัดการผู้ใช้ — Booka Admin" };
export const dynamic = "force-dynamic";

interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

async function getUsers(): Promise<ApiUser[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booka-token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/users?limit=100`,
      {
        cache: "no-store",
        headers: token ? { Cookie: `booka-token=${token}` } : {},
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.users ?? [];
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <AdminUsersView initialUsers={users} />;
}
