import { Navbar } from "@/components/layout/Navbar";
import { GuestLoginToast } from "@/components/ui/GuestLoginToast";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* Global toast for guest "add to cart" warnings */}
      <GuestLoginToast />
    </>
  );
}
