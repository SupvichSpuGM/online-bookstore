import { StaffNav } from "@/components/layout/StaffNav";

export default function StaffGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StaffNav />
      <main className="bg-secondary/20 min-h-screen">{children}</main>
    </>
  );
}
