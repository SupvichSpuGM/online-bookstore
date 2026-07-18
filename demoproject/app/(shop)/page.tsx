import { HomeView } from "@/components/customer/HomeView";
import { BOOKS } from "@/lib/data";

export const metadata = { title: "Booka — ร้านหนังสือออนไลน์" };

export default function HomePage() {
  return <HomeView books={BOOKS} />;
}
