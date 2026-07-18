import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart, Search, Star, Package, LayoutDashboard, BookOpen, Users, ArrowLeft,
  Plus, Minus, Trash2, Check, Bell, Eye, Edit, X, Upload, Home, CheckCircle,
  Clock, XCircle, Truck, AlertTriangle, ChevronRight, User, RefreshCw, Boxes,
  ChevronDown, ClipboardList, LogOut, FileText, BarChart2, Tag, ShoppingBag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "customer" | "staff" | "admin";
type CPage = "home" | "browse" | "detail" | "cart" | "checkout" | "orders" | "profile";
type SPage = "orders" | "inventory";
type APage = "dashboard" | "books" | "users";
type GPage = "home" | "browse" | "detail";

interface UserAccount {
  name: string; email: string; role: Role;
  phone: string; address: string; joined: string; avatar: string;
}

interface Book {
  id: number; title: string; author: string; price: number; originalPrice: number;
  category: string; rating: number; reviews: number; stock: number;
  imgId: string; isbn: string; description: string;
}
interface CartItem { book: Book; qty: number; }
interface Order {
  id: string; customer: string; date: string; total: number;
  status: "pending" | "payment_review" | "confirmed" | "shipping" | "delivered" | "cancelled";
  items: number; address: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  { id: 1, title: "ปีศาจ", author: "เสนีย์ เสาวพงศ์", price: 285, originalPrice: 320, category: "วรรณกรรมไทย", rating: 4.8, reviews: 234, stock: 45, imgId: "photo-1512820790803-83ca734da794", isbn: "978-616-7904-01-2", description: "นวนิยายอมตะที่สะท้อนสังคมไทยในยุคเปลี่ยนผ่าน เรื่องราวความรักและชนชั้นที่ข้ามพ้นกาลเวลา ถือเป็นหนึ่งในงานวรรณกรรมชั้นครูของไทย" },
  { id: 2, title: "คำพิพากษา", author: "ชาติ กอบจิตติ", price: 195, originalPrice: 220, category: "วรรณกรรมไทย", rating: 4.9, reviews: 412, stock: 23, imgId: "photo-1481627834876-b7833e8f5570", isbn: "978-616-7904-02-9", description: "ผลงานซีไรต์อันเลื่องชื่อ บอกเล่าเรื่องราวของฟักซึ่งตกอยู่ใต้อิทธิพลของสังคมและศีลธรรม คำถามเกี่ยวกับความยุติธรรมที่ยังคงหลอนผู้อ่านทุกยุคสมัย" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 325, originalPrice: 380, category: "Self-Help", rating: 4.7, reviews: 891, stock: 78, imgId: "photo-1544947950-fa07a98d237f", isbn: "978-0-735-21129-4", description: "An easy and proven way to build good habits and break bad ones. Tiny changes in behavior lead to remarkable results over time." },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", price: 445, originalPrice: 520, category: "ประวัติศาสตร์", rating: 4.8, reviews: 1203, stock: 12, imgId: "photo-1495446815901-a7297e633e8d", isbn: "978-0-062-31609-7", description: "A brief history of humankind — tracing the ways in which biology and history have defined us and enhanced our understanding of what it means to be human." },
  { id: 5, title: "สี่แผ่นดิน", author: "ม.ร.ว.คึกฤทธิ์ ปราโมช", price: 350, originalPrice: 400, category: "วรรณกรรมไทย", rating: 4.9, reviews: 567, stock: 8, imgId: "photo-1507003211169-0a1dd7228f2d", isbn: "978-616-7904-03-6", description: "มหากาพย์ชีวิตของ 'แม่พลอย' ผ่านสี่รัชกาล บันทึกวิถีชีวิตของสังคมไทยในราชสำนักอันละเอียดอ่อน" },
  { id: 6, title: "The Alchemist", author: "Paulo Coelho", price: 265, originalPrice: 300, category: "Fiction", rating: 4.6, reviews: 756, stock: 34, imgId: "photo-1509266272358-7701da638078", isbn: "978-0-06-231500-7", description: "A novel about following your dream. The story of Santiago, an Andalusian shepherd boy who yearns to travel the world in search of treasure." },
  { id: 7, title: "ข้างหลังภาพ", author: "ศรีบูรพา", price: 180, originalPrice: 200, category: "วรรณกรรมไทย", rating: 4.7, reviews: 389, stock: 56, imgId: "photo-1474932430478-367dbb6832c1", isbn: "978-616-7904-04-3", description: "นวนิยายรักอมตะที่ยืนนานกว่าทศวรรษ เรื่องราวความรักระหว่างนกน้อยและคุณหญิงที่เต็มไปด้วยความซาบซึ้ง" },
  { id: 8, title: "Zero to One", author: "Peter Thiel", price: 355, originalPrice: 420, category: "ธุรกิจ", rating: 4.5, reviews: 445, stock: 29, imgId: "photo-1543002588-bfa74002ed7e", isbn: "978-0-804-13929-8", description: "Notes on startups, or how to build the future. Peter Thiel shares contrarian thinking about business and innovation." },
  { id: 9, title: "ดอกส้มสีทอง", author: "ทมยันตี", price: 210, originalPrice: 240, category: "วรรณกรรมไทย", rating: 4.6, reviews: 298, stock: 41, imgId: "photo-1512436991641-6745cdb1723f", isbn: "978-616-7904-05-0", description: "นิยายโรแมนติกอมตะของนักเขียนหญิงแถวหน้าของไทย เรื่องราวที่สะท้อนคุณค่าของชีวิตและความรัก" },
  { id: 10, title: "Good to Great", author: "Jim Collins", price: 395, originalPrice: 460, category: "ธุรกิจ", rating: 4.5, reviews: 612, stock: 5, imgId: "photo-1456513080510-7bf3a84b82f8", isbn: "978-0-066-62099-5", description: "Why some companies make the leap and others do not. A study of what makes truly great companies different from the rest." },
];

const ORDERS: Order[] = [
  { id: "ORD-2568-0892", customer: "สมชาย วงศ์สุข", date: "13 ม.ค. 2568", total: 840, status: "pending", items: 3, address: "123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110" },
  { id: "ORD-2568-0891", customer: "นภา รัตนโชติ", date: "13 ม.ค. 2568", total: 510, status: "payment_review", items: 2, address: "456 ถ.เพชรบุรี แขวงมักกะสัน กรุงเทพฯ 10400" },
  { id: "ORD-2568-0890", customer: "กิตติ์ ชาญวิทย์", date: "12 ม.ค. 2568", total: 1250, status: "confirmed", items: 4, address: "789 ถ.ลาดพร้าว แขวงลาดพร้าว กรุงเทพฯ 10230" },
  { id: "ORD-2568-0889", customer: "มาลี สุริยา", date: "12 ม.ค. 2568", total: 325, status: "shipping", items: 1, address: "321 ถ.รัชดา แขวงดินแดง กรุงเทพฯ 10400" },
  { id: "ORD-2568-0888", customer: "ธนา พรมมา", date: "11 ม.ค. 2568", total: 695, status: "delivered", items: 2, address: "654 ถ.พระราม 9 แขวงห้วยขวาง กรุงเทพฯ 10310" },
  { id: "ORD-2568-0887", customer: "อรุณี แก้วใส", date: "11 ม.ค. 2568", total: 445, status: "cancelled", items: 1, address: "987 ถ.บรรทัดทอง แขวงรองเมือง กรุงเทพฯ 10330" },
  { id: "ORD-2568-0886", customer: "ประยุทธ์ สมบัติ", date: "10 ม.ค. 2568", total: 920, status: "delivered", items: 3, address: "246 ถ.สาทร แขวงยานนาวา กรุงเทพฯ 10120" },
];

const SALES_DATA = [
  { month: "ส.ค.", revenue: 42000, orders: 156 },
  { month: "ก.ย.", revenue: 38500, orders: 142 },
  { month: "ต.ค.", revenue: 51200, orders: 189 },
  { month: "พ.ย.", revenue: 47800, orders: 174 },
  { month: "ธ.ค.", revenue: 68900, orders: 251 },
  { month: "ม.ค.", revenue: 53400, orders: 197 },
];

const USERS = [
  { id: 1, name: "สมชาย วงศ์สุข", email: "somchai@email.com", role: "customer", joined: "10 ก.พ. 2567", orders: 12, spent: 4850 },
  { id: 2, name: "นภา รัตนโชติ", email: "napa@email.com", role: "customer", joined: "15 มี.ค. 2567", orders: 7, spent: 2340 },
  { id: 3, name: "กิตติวัฒน์ กุดั่น", email: "kitti@staff.com", role: "staff", joined: "1 ม.ค. 2568", orders: 0, spent: 0 },
  { id: 4, name: "ธนา พรมมา", email: "thana@email.com", role: "customer", joined: "3 เม.ย. 2567", orders: 19, spent: 7820 },
  { id: 5, name: "มาลี สุริยา", email: "malee@email.com", role: "customer", joined: "22 พ.ค. 2567", orders: 4, spent: 1250 },
  { id: 6, name: "ศิระเดช ศรีอ่ำ", email: "siradech@admin.com", role: "admin", joined: "1 ม.ค. 2568", orders: 0, spent: 0 },
];

const CATEGORIES = ["ทั้งหมด", "วรรณกรรมไทย", "Fiction", "Self-Help", "ธุรกิจ", "ประวัติศาสตร์"];

// ─── Status config ─────────────────────────────────────────────────────────────
const statusCfg: Record<string, { label: string; color: string; dot: string }> = {
  pending:         { label: "รอชำระเงิน",         color: "text-amber-700  bg-amber-50  border-amber-200",  dot: "bg-amber-500"  },
  payment_review:  { label: "ตรวจสอบหลักฐาน",     color: "text-blue-700   bg-blue-50   border-blue-200",   dot: "bg-blue-500"   },
  confirmed:       { label: "ยืนยันแล้ว",           color: "text-green-700  bg-green-50  border-green-200",  dot: "bg-green-500"  },
  shipping:        { label: "กำลังจัดส่ง",          color: "text-purple-700 bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  delivered:       { label: "จัดส่งสำเร็จ",         color: "text-gray-600   bg-gray-50   border-gray-200",   dot: "bg-gray-400"   },
  cancelled:       { label: "ยกเลิก",               color: "text-red-700    bg-red-50    border-red-200",    dot: "bg-red-500"    },
};

// ─── Shared helpers ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = statusCfg[status] ?? { label: status, color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function BookImg({ imgId, alt, className = "" }: { imgId: string; alt: string; className?: string }) {
  return (
    <img
      src={`https://images.unsplash.com/${imgId}?w=400&h=560&fit=crop&auto=format`}
      alt={alt}
      className={`object-cover bg-muted ${className}`}
    />
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
      ))}
    </span>
  );
}

// ─── CUSTOMER ─────────────────────────────────────────────────────────────────

function CustomerNav({
  page, setPage, cartCount, user,
}: { page: CPage; setPage: (p: CPage) => void; cartCount: number; user?: UserAccount | null }) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <button onClick={() => setPage("home")} className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-6 h-6 text-accent" />
          <span className="font-['Playfair_Display'] text-lg font-semibold text-foreground leading-none">
            Booka
          </span>
        </button>

        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาหนังสือ ผู้แต่ง หรือ ISBN..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-sm border border-transparent focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <nav className="flex items-center gap-1">
          <button onClick={() => setPage("orders")} className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
            <ClipboardList className="w-4 h-4" /> คำสั่งซื้อ
          </button>
          <button onClick={() => setPage("cart")} className="relative p-2 rounded-md hover:bg-secondary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setPage("profile")} className={`p-1.5 rounded-md hover:bg-secondary transition-colors flex items-center gap-1.5 ${page === "profile" ? "bg-secondary" : ""}`}>
            {user ? (
              <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">{user.avatar}</div>
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

function HomePage({ setPage, setSelectedBook, addToCart }: {
  setPage: (p: CPage) => void;
  setSelectedBook: (b: Book) => void;
  addToCart: (b: Book) => void;
}) {
  const featured = BOOKS.slice(0, 4);
  const newArrivals = BOOKS.slice(4, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&fit=crop&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-['DM_Mono'] tracking-widest text-amber-400 uppercase mb-4">
              ร้านหนังสือออนไลน์ · CSI204
            </span>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              ค้นพบโลกใบใหม่<br />
              <span className="italic text-amber-400">ผ่านทุกบทอ่าน</span>
            </h1>
            <p className="text-blue-200 text-base mb-8 leading-relaxed">
              คัดสรรหนังสือคุณภาพกว่า 2,400 รายการ จัดส่งทั่วประเทศ พร้อมระบบติดตามพัสดุแบบ Real-time
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPage("browse")} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm">
                เลือกดูหนังสือ →
              </button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-sm border border-white/20">
                หนังสือแนะนำ
              </button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3 rotate-1">
            {BOOKS.slice(0, 4).map((b) => (
              <div key={b.id} className="rounded-lg overflow-hidden shadow-lg aspect-[3/4] bg-muted">
                <BookImg imgId={b.imgId} alt={b.title} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setPage("browse")}
              className="px-4 py-2 rounded-full text-sm border border-border bg-card hover:bg-accent hover:text-white hover:border-accent transition-all">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Playfair_Display'] text-2xl font-semibold">หนังสือยอดนิยม</h2>
          <button onClick={() => setPage("browse")} className="text-sm text-accent hover:underline flex items-center gap-1">
            ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featured.map((b) => (
            <BookCard key={b.id} book={b} onView={() => { setSelectedBook(b); setPage("detail"); }} onCart={() => addToCart(b)} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-secondary border-y border-border py-10">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Truck, title: "จัดส่งฟรี", desc: "เมื่อสั่งซื้อครบ ฿300" },
            { icon: RefreshCw, title: "คืนสินค้าได้", desc: "ภายใน 7 วัน ไม่มีเงื่อนไข" },
            { icon: ShoppingBag, title: "ชำระเงินง่าย", desc: "โอนแล้วแนบสลิปได้เลย" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-6">มาใหม่ล่าสุด</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {newArrivals.map((b) => (
            <BookCard key={b.id} book={b} onView={() => { setSelectedBook(b); setPage("detail"); }} onCart={() => addToCart(b)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BookCard({ book, onView, onCart }: { book: Book; onView: () => void; onCart: () => void }) {
  const [added, setAdded] = useState(false);
  const handleCart = () => {
    onCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
      <button onClick={onView} className="relative aspect-[3/4] bg-muted overflow-hidden">
        <BookImg imgId={book.imgId} alt={book.title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {book.stock <= 10 && (
          <span className="absolute top-2 left-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
            เหลือน้อย
          </span>
        )}
        {book.originalPrice > book.price && (
          <span className="absolute top-2 right-2 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded font-medium">
            ลด {Math.round((1 - book.price / book.originalPrice) * 100)}%
          </span>
        )}
      </button>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <button onClick={onView} className="text-left">
          <p className="font-medium text-sm leading-snug line-clamp-2 hover:text-accent transition-colors">{book.title}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{book.author}</p>
        </button>
        <div className="flex items-center gap-1 mt-auto">
          <Stars rating={book.rating} />
          <span className="text-[10px] text-muted-foreground font-['DM_Mono']">({book.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="font-semibold text-sm">฿{book.price}</span>
            {book.originalPrice > book.price && (
              <span className="text-muted-foreground text-xs line-through ml-1">฿{book.originalPrice}</span>
            )}
          </div>
          <button onClick={handleCart}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${added ? "bg-green-500 text-white" : "bg-secondary hover:bg-accent hover:text-white"}`}>
            {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function BrowsePage({ setPage, setSelectedBook, addToCart }: {
  setPage: (p: CPage) => void; setSelectedBook: (b: Book) => void; addToCart: (b: Book) => void;
}) {
  const [cat, setCat] = useState("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const filtered = BOOKS.filter((b) =>
    (cat === "ทั้งหมด" || b.category === cat) &&
    (b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
  ).sort((a, b) => sort === "price_asc" ? a.price - b.price : sort === "price_desc" ? b.price - a.price : b.reviews - a.reviews);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => setPage("home")} className="hover:text-foreground">หน้าหลัก</button>
        <ChevronRight className="w-3.5 h-3.5" /> <span className="text-foreground">เลือกดูหนังสือ</span>
      </div>
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-['DM_Mono']">หมวดหมู่</p>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${cat === c ? "bg-primary text-primary-foreground font-medium" : "hover:bg-secondary text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <hr className="my-4 border-border" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-['DM_Mono']">ราคา</p>
          <div className="space-y-2">
            {["ต่ำกว่า ฿200", "฿200–350", "฿350–500", "มากกว่า ฿500"].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded accent-accent" /> {r}
              </label>
            ))}
          </div>
        </aside>
        {/* Main */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none">
              <option value="popular">ยอดนิยม</option>
              <option value="price_asc">ราคา: น้อย–มาก</option>
              <option value="price_desc">ราคา: มาก–น้อย</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground mb-4">พบ {filtered.length} รายการ</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} onView={() => { setSelectedBook(b); setPage("detail"); }} onCart={() => addToCart(b)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookDetailPage({ book, setPage, addToCart }: { book: Book; setPage: (p: CPage) => void; addToCart: (b: Book) => void }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const handle = () => {
    for (let i = 0; i < qty; i++) addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => setPage("browse")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับไปเลือกหนังสือ
      </button>
      <div className="grid md:grid-cols-[280px_1fr] gap-10">
        <div>
          <div className="rounded-xl overflow-hidden shadow-lg aspect-[3/4] bg-muted">
            <BookImg imgId={book.imgId} alt={book.title} className="w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block text-xs font-['DM_Mono'] text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">{book.category}</span>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold leading-tight mb-2">{book.title}</h1>
            <p className="text-muted-foreground">โดย <span className="text-foreground font-medium">{book.author}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Stars rating={book.rating} />
            <span className="text-sm font-['DM_Mono'] text-muted-foreground">{book.rating} ({book.reviews} รีวิว)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-['Playfair_Display'] text-3xl font-bold">฿{book.price}</span>
            {book.originalPrice > book.price && (
              <span className="text-muted-foreground line-through text-lg">฿{book.originalPrice}</span>
            )}
            {book.originalPrice > book.price && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-medium">
                ประหยัด ฿{book.originalPrice - book.price}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{book.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["ISBN", book.isbn],
              ["คงเหลือ", `${book.stock} เล่ม`],
            ].map(([k, v]) => (
              <div key={k} className="bg-secondary rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-0.5 font-['DM_Mono']">{k}</p>
                <p className="font-medium">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="px-5 py-2.5 font-['DM_Mono'] text-sm border-x border-border">{qty}</span>
              <button onClick={() => setQty(Math.min(book.stock, qty + 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handle}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${added ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-accent"}`}>
              {added ? <><Check className="w-4 h-4" /> เพิ่มแล้ว!</> : <><ShoppingCart className="w-4 h-4" /> เพิ่มลงตะกร้า</>}
            </button>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-5">รีวิวจากผู้อ่าน</h2>
        <div className="space-y-4">
          {[
            { name: "สมชาย ว.", rating: 5, date: "10 ม.ค. 2568", text: "อ่านแล้วสะท้อนใจมาก เขียนได้ลึกซึ้งมาก แนะนำเลย" },
            { name: "นภา ร.", rating: 4, date: "5 ม.ค. 2568", text: "หนังสือดีมาก ส่งเร็ว บรรจุหีบห่ออย่างดี ขอบคุณครับ" },
            { name: "กิตติ ช.", rating: 5, date: "28 ธ.ค. 2567", text: "ซื้อมาอ่านครั้งที่สาม ยังคงประทับใจทุกครั้ง" },
          ].map((r) => (
            <div key={r.name} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">{r.name[0]}</div>
                  <span className="font-medium text-sm">{r.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-muted-foreground font-['DM_Mono']">{r.date}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CartPage({ cart, setCart, setPage }: {
  cart: CartItem[]; setCart: (c: CartItem[]) => void; setPage: (p: CPage) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.book.price * i.qty, 0);
  const shipping = subtotal >= 300 ? 0 : 50;
  const total = subtotal + shipping;

  const updateQty = (id: number, qty: number) => {
    if (qty === 0) setCart(cart.filter((i) => i.book.id !== id));
    else setCart(cart.map((i) => (i.book.id === id ? { ...i, qty } : i)));
  };

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
      <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-2">ตะกร้าว่างเปล่า</h2>
      <p className="text-muted-foreground mb-6">เริ่มเลือกหนังสือที่คุณชอบได้เลย</p>
      <button onClick={() => setPage("browse")} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent transition-colors">
        เลือกดูหนังสือ
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-6">ตะกร้าสินค้า ({cart.length} รายการ)</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.book.id} className="bg-card rounded-xl border border-border p-4 flex gap-4 items-center">
              <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                <BookImg imgId={item.book.imgId} alt={item.book.title} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug">{item.book.title}</p>
                <p className="text-muted-foreground text-xs">{item.book.author}</p>
                <p className="text-accent font-semibold text-sm mt-1">฿{item.book.price}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-border rounded-lg overflow-hidden text-sm">
                  <button onClick={() => updateQty(item.book.id, item.qty - 1)} className="px-2.5 py-1.5 hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="px-3 py-1.5 font-['DM_Mono']">{item.qty}</span>
                  <button onClick={() => updateQty(item.book.id, item.qty + 1)} className="px-2.5 py-1.5 hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => updateQty(item.book.id, 0)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-5 h-fit">
          <h2 className="font-['Playfair_Display'] text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">ยอดรวมสินค้า</span><span className="font-['DM_Mono']">฿{subtotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">ค่าจัดส่ง</span>
              <span className={`font-['DM_Mono'] ${shipping === 0 ? "text-green-600" : ""}`}>{shipping === 0 ? "ฟรี" : `฿${shipping}`}</span>
            </div>
            {shipping === 0 && <p className="text-xs text-green-600 bg-green-50 rounded-lg p-2 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> จัดส่งฟรีเมื่อซื้อครบ ฿300</p>}
            <hr className="border-border" />
            <div className="flex justify-between font-semibold text-base"><span>ยอดรวมทั้งสิ้น</span><span className="font-['DM_Mono'] text-accent">฿{total}</span></div>
          </div>
          <button onClick={() => setPage("checkout")} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent transition-colors text-sm">
            ดำเนินการชำระเงิน →
          </button>
          <button onClick={() => setPage("browse")} className="w-full py-2.5 mt-2 text-muted-foreground text-sm hover:text-foreground transition-colors">
            ← เลือกซื้อเพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, setCart, setPage }: {
  cart: CartItem[]; setCart: (c: CartItem[]) => void; setPage: (p: CPage) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fileName, setFileName] = useState("");
  const total = cart.reduce((s, i) => s + i.book.price * i.qty, 0) + (cart.reduce((s, i) => s + i.book.price * i.qty, 0) >= 300 ? 0 : 50);

  const handleConfirm = () => {
    setCart([]);
    setStep(3);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {[{ n: 1, label: "ที่อยู่" }, { n: 2, label: "ชำระเงิน" }, { n: 3, label: "สำเร็จ" }].map(({ n, label }, i) => (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= n ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{n}</div>
              <span className="text-xs mt-1 text-muted-foreground">{label}</span>
            </div>
            {i < 2 && <div className={`w-16 h-px mx-2 mb-5 transition-all ${step > n ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-5">ที่อยู่จัดส่ง</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1.5 block">ชื่อ</label><input defaultValue="สมชาย" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" /></div>
              <div><label className="text-xs text-muted-foreground mb-1.5 block">นามสกุล</label><input defaultValue="วงศ์สุข" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" /></div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1.5 block">เบอร์โทรศัพท์</label><input defaultValue="081-234-5678" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1.5 block">ที่อยู่</label><textarea defaultValue="123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย" rows={2} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1.5 block">จังหวัด</label><select className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm"><option>กรุงเทพมหานคร</option><option>เชียงใหม่</option><option>ขอนแก่น</option></select></div>
              <div><label className="text-xs text-muted-foreground mb-1.5 block">รหัสไปรษณีย์</label><input defaultValue="10110" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" /></div>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors">
            ถัดไป: ชำระเงิน →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-4">ชำระเงินผ่านการโอน</h2>
            <div className="bg-secondary rounded-xl p-5 text-center mb-5">
              <p className="text-xs text-muted-foreground mb-1 font-['DM_Mono']">บัญชีธนาคาร</p>
              <p className="font-['Playfair_Display'] text-lg font-semibold">Booka Online Bookstore</p>
              <p className="font-['DM_Mono'] text-2xl font-bold text-primary my-2">xxx-x-xxxxx-x</p>
              <p className="text-xs text-muted-foreground">ธนาคารกสิกรไทย</p>
              <hr className="border-border my-3" />
              <p className="text-xs text-muted-foreground mb-0.5">ยอดที่ต้องโอน</p>
              <p className="text-2xl font-bold text-accent font-['DM_Mono']">฿{total}</p>
            </div>
            <label className="block">
              <p className="text-sm font-medium mb-2">แนบหลักฐานการโอนเงิน</p>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{fileName || "คลิกหรือลากไฟล์มาวางที่นี่"}</p>
                <p className="text-xs text-muted-foreground mt-1">รองรับ JPG, PNG, PDF (ขนาดไม่เกิน 5MB)</p>
                <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
              </div>
            </label>
            <button onClick={handleConfirm} disabled={!fileName}
              className="w-full mt-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              ยืนยันการสั่งซื้อ
            </button>
          </div>
          <button onClick={() => setStep(1)} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← กลับไปแก้ไขที่อยู่
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2">สั่งซื้อสำเร็จ!</h2>
          <p className="text-muted-foreground text-sm mb-1">หมายเลขคำสั่งซื้อของคุณ</p>
          <p className="font-['DM_Mono'] text-lg font-bold text-accent mb-4">ORD-2568-0893</p>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            ทีมงานจะตรวจสอบหลักฐานการชำระเงินของคุณภายใน 1-2 ชั่วโมง<br />
            และจัดส่งสินค้าภายใน 1-3 วันทำการ
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={() => setPage("orders")} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors">
              ติดตามคำสั่งซื้อ
            </button>
            <button onClick={() => setPage("home")} className="w-full py-3 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerOrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>
      <div className="space-y-3">
        {ORDERS.slice(0, 5).map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-['DM_Mono'] text-sm font-medium text-primary">{o.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.date} · {o.items} รายการ</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">ยอดรวม: <span className="font-semibold text-foreground font-['DM_Mono']">฿{o.total}</span></p>
              <button className="text-xs text-accent hover:underline flex items-center gap-1">รายละเอียด <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STAFF ─────────────────────────────────────────────────────────────────────

function StaffNav({ page, setPage }: { page: SPage; setPage: (p: SPage) => void }) {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="font-['Playfair_Display'] font-semibold">Booka</span>
            <span className="text-blue-300 text-xs ml-1 font-['DM_Mono']">STAFF</span>
          </div>
          <nav className="flex gap-1">
            {([["orders", "จัดการคำสั่งซื้อ", ClipboardList], ["inventory", "จัดการสต็อก", Boxes]] as const).map(([id, label, Icon]) => (
              <button key={id} onClick={() => setPage(id as SPage)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${page === id ? "bg-white/20 text-white" : "text-blue-200 hover:bg-white/10"}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="text-blue-200">กิตติวัฒน์ กุดั่น</span>
        </div>
      </div>
    </header>
  );
}

function StaffOrdersPage() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const nextStatus: Record<string, string> = {
    pending: "payment_review",
    payment_review: "confirmed",
    confirmed: "shipping",
    shipping: "delivered",
  };

  const advance = (id: string) => {
    setOrders(orders.map((o) => o.id === id && nextStatus[o.status] ? { ...o, status: nextStatus[o.status] as Order["status"] } : o));
  };

  const cancel = (id: string) => {
    setOrders(orders.map((o) => o.id === id ? { ...o, status: "cancelled" } : o));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-xl font-bold">จัดการคำสั่งซื้อ</h1>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-['DM_Mono']">
            {orders.filter((o) => o.status === "payment_review").length} รอตรวจสอบ
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[["all", "ทั้งหมด"], ["pending", "รอชำระ"], ["payment_review", "ตรวจสลิป"], ["confirmed", "ยืนยัน"], ["shipping", "จัดส่ง"], ["delivered", "สำเร็จ"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === v ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted text-muted-foreground"}`}>{l}</button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["เลขคำสั่งซื้อ", "ลูกค้า", "วันที่", "รายการ", "ยอดรวม", "สถานะ", "จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shown.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3 font-['DM_Mono'] text-xs text-primary font-medium">{o.id}</td>
                <td className="px-4 py-3 font-medium">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{o.date}</td>
                <td className="px-4 py-3 text-center font-['DM_Mono']">{o.items}</td>
                <td className="px-4 py-3 font-['DM_Mono'] font-semibold">฿{o.total}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSelected(o)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    {nextStatus[o.status] && (
                      <button onClick={() => advance(o.id)} className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-accent transition-colors">
                        {o.status === "payment_review" ? "อนุมัติ" : "ถัดไป"}
                      </button>
                    )}
                    {!["delivered", "cancelled"].includes(o.status) && (
                      <button onClick={() => cancel(o.id)} className="px-2 py-1 text-red-600 border border-red-200 rounded text-xs hover:bg-red-50 transition-colors">ยกเลิก</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="text-center text-muted-foreground py-10 text-sm">ไม่มีคำสั่งซื้อในหมวดนี้</p>}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">รายละเอียดคำสั่งซื้อ</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-secondary rounded-lg p-3 space-y-2">
                {[["เลขคำสั่งซื้อ", selected.id], ["ลูกค้า", selected.customer], ["วันที่", selected.date], ["ยอดรวม", `฿${selected.total}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium font-['DM_Mono'] text-xs">{v}</span></div>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">ที่อยู่จัดส่ง</p>
                <p className="text-sm">{selected.address}</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">สถานะ</span>
                <StatusBadge status={selected.status} />
              </div>
              {selected.status === "payment_review" && (
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-secondary/50">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">หลักฐานการชำระเงิน</p>
                  <p className="text-xs text-accent mt-1">slip_payment_0891.jpg</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              {nextStatus[selected.status] && (
                <button onClick={() => { advance(selected.id); setSelected(null); }} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                  {selected.status === "payment_review" ? "อนุมัติการชำระเงิน" : "อัปเดตสถานะ"}
                </button>
              )}
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryPage() {
  const [books, setBooks] = useState(BOOKS.map((b) => ({ ...b })));
  const [editing, setEditing] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");
  const lowStock = books.filter((b) => b.stock <= 10);

  const saveStock = (id: number) => {
    const val = parseInt(editVal);
    if (!isNaN(val) && val >= 0) setBooks(books.map((b) => (b.id === id ? { ...b, stock: val } : b)));
    setEditing(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-xl font-bold">จัดการสต็อกสินค้า</h1>
        <span className="text-xs font-['DM_Mono'] text-muted-foreground">{books.length} รายการ</span>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">สินค้าใกล้หมด ({lowStock.length} รายการ)</p>
            <p className="text-xs text-amber-700 mt-0.5">{lowStock.map((b) => b.title).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["หนังสือ", "หมวดหมู่", "ISBN", "ราคา", "คงเหลือ", "สถานะ", "แก้ไขสต็อก"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((b) => (
              <tr key={b.id} className={`hover:bg-secondary/40 transition-colors ${b.stock <= 10 ? "bg-amber-50/50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 rounded overflow-hidden shrink-0 bg-muted">
                      <BookImg imgId={b.imgId} alt={b.title} className="w-full h-full" />
                    </div>
                    <div>
                      <p className="font-medium leading-snug text-xs">{b.title}</p>
                      <p className="text-muted-foreground text-[10px]">{b.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{b.category}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-[10px] text-muted-foreground">{b.isbn}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs font-medium">฿{b.price}</td>
                <td className="px-4 py-3 font-['DM_Mono'] font-bold text-sm">{b.stock}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${b.stock === 0 ? "bg-red-50 text-red-700 border-red-200" : b.stock <= 10 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                    {b.stock === 0 ? "หมดแล้ว" : b.stock <= 10 ? "ใกล้หมด" : "พร้อมขาย"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {editing === b.id ? (
                    <div className="flex items-center gap-1.5">
                      <input value={editVal} onChange={(e) => setEditVal(e.target.value)} type="number" min={0}
                        className="w-16 px-2 py-1 border border-accent rounded text-sm font-['DM_Mono'] focus:outline-none" autoFocus />
                      <button onClick={() => saveStock(b.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditing(null)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditing(b.id); setEditVal(String(b.stock)); }}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors">
                      <Edit className="w-3.5 h-3.5" /> แก้ไข
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN ─────────────────────────────────────────────────────────────────────

function AdminLayout({ page, setPage, children }: { page: APage; setPage: (p: APage) => void; children: React.ReactNode }) {
  const nav: [APage, string, React.ElementType][] = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["books", "จัดการหนังสือ", BookOpen],
    ["users", "จัดการผู้ใช้", Users],
  ];
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-primary text-primary-foreground flex flex-col fixed top-10 bottom-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="font-['Playfair_Display'] font-semibold">Booka</span>
          </div>
          <span className="text-[10px] font-['DM_Mono'] text-blue-300 uppercase tracking-widest">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setPage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${page === id ? "bg-white/20 text-white" : "text-blue-200 hover:bg-white/10"}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-primary text-sm font-bold">ศ</div>
            <div>
              <p className="text-sm text-white font-medium leading-none">ศิระเดช ศรีอ่ำ</p>
              <p className="text-[10px] text-blue-300 mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="ml-56 flex-1">{children}</main>
    </div>
  );
}

function AdminDashboard() {
  const kpis = [
    { label: "ยอดขายเดือนนี้", value: "฿53,400", change: "+11.7%", up: true, icon: BarChart2 },
    { label: "คำสั่งซื้อทั้งหมด", value: "197", change: "+4.2%", up: true, icon: ShoppingBag },
    { label: "หนังสือในสต็อก", value: "2,418", change: "-32 เล่ม", up: false, icon: Package },
    { label: "ลูกค้าลงทะเบียน", value: "1,084", change: "+23 คน", up: true, icon: Users },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">ภาพรวมระบบ — 13 มกราคม 2568</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="font-['Playfair_Display'] text-2xl font-bold">{value}</p>
            <p className={`text-xs mt-1 font-['DM_Mono'] ${up ? "text-green-600" : "text-red-500"}`}>{change} จากเดือนที่แล้ว</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5 mb-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium">รายได้รายเดือน (บาท)</h2>
            <span className="text-xs text-muted-foreground font-['DM_Mono']">ส.ค. 2567 – ม.ค. 2568</span>
          </div>
          <ResponsiveContainer id="rc-revenue" width="100%" height={200}>
            <AreaChart id="booka-revenue-chart" data={SALES_DATA}>
              <defs>
                <linearGradient id="bookaRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A2E44" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A2E44" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,18,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Mono" }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, "รายได้"]} />
              <Area type="monotone" dataKey="revenue" stroke="#1A2E44" strokeWidth={2} fill="url(#bookaRevenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-medium mb-5">จำนวนคำสั่งซื้อ</h2>
          <ResponsiveContainer id="rc-orders" width="100%" height={200}>
            <BarChart id="booka-orders-chart" data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,18,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "DM Mono" }} />
              <Tooltip formatter={(v: number) => [v, "คำสั่งซื้อ"]} />
              <Bar dataKey="orders" fill="#B45309" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-medium">คำสั่งซื้อล่าสุด</h2>
          <span className="text-xs text-muted-foreground">7 รายการ</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["เลขคำสั่งซื้อ", "ลูกค้า", "วันที่", "ยอดรวม", "สถานะ"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3 font-['DM_Mono'] text-xs text-primary font-medium">{o.id}</td>
                <td className="px-4 py-3 text-sm">{o.customer}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs font-semibold">฿{o.total}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminBooksPage() {
  const [books] = useState(BOOKS);
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการหนังสือ</h1>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> เพิ่มหนังสือใหม่
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["หนังสือ", "หมวดหมู่", "ราคา", "สต็อก", "ยอดรีวิว", "จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((b) => (
              <tr key={b.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-12 rounded overflow-hidden shrink-0 bg-muted">
                      <BookImg imgId={b.imgId} alt={b.title} className="w-full h-full" />
                    </div>
                    <div>
                      <p className="font-medium text-xs leading-tight">{b.title}</p>
                      <p className="text-muted-foreground text-[10px]">{b.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{b.category}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs">฿{b.price}</td>
                <td className="px-4 py-3">
                  <span className={`font-['DM_Mono'] text-xs font-bold ${b.stock <= 10 ? "text-amber-600" : "text-green-700"}`}>{b.stock}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-['DM_Mono']">{b.reviews}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">เพิ่มหนังสือใหม่</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[["ชื่อหนังสือ", "text", "ใส่ชื่อหนังสือ"], ["ผู้แต่ง", "text", "ชื่อผู้แต่ง"], ["ISBN", "text", "xxx-xxx-xxxxx-x-x"], ["ราคา (บาท)", "number", "0"], ["จำนวนสต็อก", "number", "0"]].map(([label, type, placeholder]) => (
                <div key={String(label)}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
                  <input type={String(type)} placeholder={String(placeholder)} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">หมวดหมู่</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm">
                  {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">คำอธิบาย</label>
                <textarea rows={3} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm resize-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">บันทึก</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminUsersPage() {
  const roleColor: Record<string, string> = {
    customer: "text-blue-700 bg-blue-50 border-blue-200",
    staff: "text-green-700 bg-green-50 border-green-200",
    admin: "text-purple-700 bg-purple-50 border-purple-200",
  };
  const roleLabel: Record<string, string> = { customer: "ลูกค้า", staff: "พนักงาน", admin: "แอดมิน" };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการผู้ใช้</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="ค้นหาผู้ใช้..." className="pl-8 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none w-48" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[["ลูกค้าทั้งหมด", USERS.filter(u => u.role === "customer").length, "text-blue-600"],
          ["พนักงาน", USERS.filter(u => u.role === "staff").length, "text-green-600"],
          ["แอดมิน", USERS.filter(u => u.role === "admin").length, "text-purple-600"]].map(([l, v, c]) => (
          <div key={String(l)} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`font-['Playfair_Display'] text-3xl font-bold ${c}`}>{v}</p>
            <p className="text-xs text-muted-foreground mt-1">{l}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["ผู้ใช้", "อีเมล", "บทบาท", "สมัครเมื่อ", "คำสั่งซื้อ", "ยอดรวม", "จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {USERS.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">{u.name[0]}</div>
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-['DM_Mono']">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColor[u.role]}`}>{roleLabel[u.role]}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                <td className="px-4 py-3 text-center font-['DM_Mono'] text-xs">{u.orders}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs font-medium">{u.spent > 0 ? `฿${u.spent.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── GUEST (unauthenticated) ──────────────────────────────────────────────────

function LoginPromptModal({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-7 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-7 h-7 text-accent" />
        </div>
        <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-2">เข้าสู่ระบบก่อนนะ</h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อเพิ่มสินค้าลงตะกร้าและสั่งซื้อหนังสือ
        </p>
        <button onClick={onLogin}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors mb-2">
          เข้าสู่ระบบ / สมัครสมาชิก
        </button>
        <button onClick={onClose} className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ยังไม่เข้าสู่ระบบ — เลือกดูต่อ
        </button>
      </div>
    </div>
  );
}

function GuestNavBar({ page, setPage, onLoginClick }: { page: GPage; setPage: (p: GPage) => void; onLoginClick: () => void }) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <button onClick={() => setPage("home")} className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-6 h-6 text-accent" />
          <span className="font-['Playfair_Display'] text-lg font-semibold text-foreground leading-none">Booka</span>
        </button>

        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="ค้นหาหนังสือ ผู้แต่ง หรือ ISBN..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-sm border border-transparent focus:border-accent focus:outline-none transition-colors"
            onFocus={() => setPage("browse")} />
        </div>

        <nav className="flex items-center gap-2">
          <button onClick={() => setPage("home")}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm transition-colors rounded-md ${page === "home" ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
            <Home className="w-4 h-4" /> หน้าแรก
          </button>
          <button onClick={() => setPage("browse")}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm transition-colors rounded-md ${page === "browse" ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
            <BookOpen className="w-4 h-4" /> หนังสือทั้งหมด
          </button>
          <button onClick={onLoginClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            <User className="w-4 h-4" /> เข้าสู่ระบบ
          </button>
        </nav>
      </div>
    </header>
  );
}

function GuestBookCard({ book, onView, onCartAttempt }: { book: Book; onView: () => void; onCartAttempt: () => void }) {
  return (
    <div className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
      <button onClick={onView} className="relative aspect-[3/4] bg-muted overflow-hidden">
        <BookImg imgId={book.imgId} alt={book.title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {book.stock <= 10 && (
          <span className="absolute top-2 left-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">เหลือน้อย</span>
        )}
        {book.originalPrice > book.price && (
          <span className="absolute top-2 right-2 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded font-medium">
            ลด {Math.round((1 - book.price / book.originalPrice) * 100)}%
          </span>
        )}
      </button>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <button onClick={onView} className="text-left">
          <p className="font-medium text-sm leading-snug line-clamp-2 hover:text-accent transition-colors">{book.title}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{book.author}</p>
        </button>
        <div className="flex items-center gap-1 mt-auto">
          <Stars rating={book.rating} />
          <span className="text-[10px] text-muted-foreground font-['DM_Mono']">({book.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="font-semibold text-sm">฿{book.price}</span>
            {book.originalPrice > book.price && (
              <span className="text-muted-foreground text-xs line-through ml-1">฿{book.originalPrice}</span>
            )}
          </div>
          <button onClick={onCartAttempt}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-secondary hover:bg-accent hover:text-white">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestHomePage({ setPage, setSelectedBook, onCartAttempt }: {
  setPage: (p: GPage) => void;
  setSelectedBook: (b: Book) => void;
  onCartAttempt: () => void;
}) {
  const featured = BOOKS.slice(0, 4);
  const newArrivals = BOOKS.slice(4, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&fit=crop&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-['DM_Mono'] tracking-widest text-amber-400 uppercase mb-4">
              ร้านหนังสือออนไลน์ · CSI204
            </span>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              ค้นพบโลกใบใหม่<br />
              <span className="italic text-amber-400">ผ่านทุกบทอ่าน</span>
            </h1>
            <p className="text-blue-200 text-base mb-8 leading-relaxed">
              คัดสรรหนังสือคุณภาพกว่า 2,400 รายการ จัดส่งทั่วประเทศ พร้อมระบบติดตามพัสดุแบบ Real-time
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPage("browse")} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm">
                เลือกดูหนังสือ →
              </button>
              <button onClick={onCartAttempt} className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-sm border border-white/20">
                เข้าสู่ระบบ / สมัครสมาชิก
              </button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3 rotate-1">
            {BOOKS.slice(0, 4).map((b) => (
              <div key={b.id} className="rounded-lg overflow-hidden shadow-lg aspect-[3/4] bg-muted">
                <BookImg imgId={b.imgId} alt={b.title} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest banner */}
      <section className="bg-accent/10 border-b border-accent/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-accent font-medium flex items-center gap-2">
            <User className="w-4 h-4" /> คุณกำลังเข้าชมในฐานะ Guest — สมัครสมาชิกเพื่อสั่งซื้อและติดตามคำสั่งซื้อของคุณ
          </p>
          <button onClick={onCartAttempt} className="text-xs px-3 py-1.5 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shrink-0">
            เข้าสู่ระบบ / สมัครสมาชิก
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setPage("browse")}
              className="px-4 py-2 rounded-full text-sm border border-border bg-card hover:bg-accent hover:text-white hover:border-accent transition-all">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Playfair_Display'] text-2xl font-semibold">หนังสือยอดนิยม</h2>
          <button onClick={() => setPage("browse")} className="text-sm text-accent hover:underline flex items-center gap-1">
            ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featured.map((b) => (
            <GuestBookCard key={b.id} book={b} onView={() => { setSelectedBook(b); setPage("detail"); }} onCartAttempt={onCartAttempt} />
          ))}
        </div>
      </section>

      {/* Benefits banner */}
      <section className="bg-secondary border-y border-border py-10">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Truck, title: "จัดส่งฟรี", desc: "เมื่อสั่งซื้อครบ ฿300" },
            { icon: RefreshCw, title: "คืนสินค้าได้", desc: "ภายใน 7 วัน ไม่มีเงื่อนไข" },
            { icon: ShoppingBag, title: "ชำระเงินง่าย", desc: "โอนแล้วแนบสลิปได้เลย" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-6">มาใหม่ล่าสุด</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {newArrivals.map((b) => (
            <GuestBookCard key={b.id} book={b} onView={() => { setSelectedBook(b); setPage("detail"); }} onCartAttempt={onCartAttempt} />
          ))}
        </div>
      </section>

      {/* CTA join */}
      <section className="bg-primary py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-white mb-3">พร้อมเริ่มอ่านแล้วหรือยัง?</h2>
          <p className="text-blue-200 text-sm mb-7 leading-relaxed">สมัครสมาชิกฟรี รับส่วนลด 10% สำหรับการสั่งซื้อครั้งแรก และติดตามคำสั่งซื้อได้ทันที</p>
          <button onClick={onCartAttempt} className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm">
            สมัครสมาชิกฟรี →
          </button>
        </div>
      </section>
    </div>
  );
}

function GuestBrowsePage({ setPage, setSelectedBook, onCartAttempt }: {
  setPage: (p: GPage) => void;
  setSelectedBook: (b: Book) => void;
  onCartAttempt: () => void;
}) {
  const [cat, setCat] = useState("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const filtered = BOOKS.filter((b) =>
    (cat === "ทั้งหมด" || b.category === cat) &&
    (b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
  ).sort((a, b) => sort === "price_asc" ? a.price - b.price : sort === "price_desc" ? b.price - a.price : b.reviews - a.reviews);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => setPage("home")} className="hover:text-foreground">หน้าแรก</button>
        <ChevronRight className="w-3.5 h-3.5" /> <span className="text-foreground">เลือกดูหนังสือ</span>
      </div>
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-['DM_Mono']">หมวดหมู่</p>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${cat === c ? "bg-primary text-primary-foreground font-medium" : "hover:bg-secondary text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <hr className="my-4 border-border" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-['DM_Mono']">ราคา</p>
          <div className="space-y-2">
            {["ต่ำกว่า ฿200", "฿200–350", "฿350–500", "มากกว่า ฿500"].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded accent-accent" /> {r}
              </label>
            ))}
          </div>
        </aside>
        {/* Main */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none">
              <option value="popular">ยอดนิยม</option>
              <option value="price_asc">ราคา: น้อย–มาก</option>
              <option value="price_desc">ราคา: มาก–น้อย</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground mb-4">พบ {filtered.length} รายการ</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((b) => (
              <GuestBookCard key={b.id} book={b} onView={() => { setSelectedBook(b); setPage("detail"); }} onCartAttempt={onCartAttempt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestBookDetailPage({ book, setPage, onCartAttempt }: { book: Book; setPage: (p: GPage) => void; onCartAttempt: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => setPage("browse")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับไปเลือกหนังสือ
      </button>
      <div className="grid md:grid-cols-[280px_1fr] gap-10">
        <div>
          <div className="rounded-xl overflow-hidden shadow-lg aspect-[3/4] bg-muted">
            <BookImg imgId={book.imgId} alt={book.title} className="w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block text-xs font-['DM_Mono'] text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">{book.category}</span>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold leading-tight mb-2">{book.title}</h1>
            <p className="text-muted-foreground">โดย <span className="text-foreground font-medium">{book.author}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Stars rating={book.rating} />
            <span className="text-sm font-['DM_Mono'] text-muted-foreground">{book.rating} ({book.reviews} รีวิว)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-['Playfair_Display'] text-3xl font-bold">฿{book.price}</span>
            {book.originalPrice > book.price && (
              <span className="text-muted-foreground line-through text-lg">฿{book.originalPrice}</span>
            )}
            {book.originalPrice > book.price && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-medium">
                ประหยัด ฿{book.originalPrice - book.price}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{book.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[["ISBN", book.isbn], ["คงเหลือ", `${book.stock} เล่ม`]].map(([k, v]) => (
              <div key={k} className="bg-secondary rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-0.5 font-['DM_Mono']">{k}</p>
                <p className="font-medium">{v}</p>
              </div>
            ))}
          </div>
          {/* Login prompt CTA */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">เข้าสู่ระบบเพื่อซื้อหนังสือเล่มนี้และติดตามการจัดส่ง</p>
            <button onClick={onCartAttempt}
              className="w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-accent">
              <ShoppingCart className="w-4 h-4" /> เข้าสู่ระบบเพื่อสั่งซื้อ
            </button>
            <button onClick={onCartAttempt}
              className="w-full py-2.5 rounded-lg font-medium text-sm border border-border hover:bg-secondary transition-colors text-muted-foreground">
              สมัครสมาชิกฟรี
            </button>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-5">รีวิวจากผู้อ่าน</h2>
        <div className="space-y-4">
          {[
            { name: "สมชาย ว.", rating: 5, date: "10 ม.ค. 2568", text: "อ่านแล้วสะท้อนใจมาก เขียนได้ลึกซึ้งมาก แนะนำเลย" },
            { name: "นภา ร.", rating: 4, date: "5 ม.ค. 2568", text: "หนังสือดีมาก ส่งเร็ว บรรจุหีบห่ออย่างดี ขอบคุณครับ" },
            { name: "กิตติ ช.", rating: 5, date: "28 ธ.ค. 2567", text: "ซื้อมาอ่านครั้งที่สาม ยังคงประทับใจทุกครั้ง" },
          ].map((r) => (
            <div key={r.name} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">{r.name[0]}</div>
                  <span className="font-medium text-sm">{r.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-muted-foreground font-['DM_Mono']">{r.date}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

const DEMO_ACCOUNTS: UserAccount[] = [
  { name: "สมชาย วงศ์สุข",    email: "customer@booka.app", role: "customer", phone: "081-234-5678", address: "123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110", joined: "10 ก.พ. 2567", avatar: "SC" },
  { name: "กิตติวัฒน์ กุดั่น", email: "staff@booka.app",    role: "staff",    phone: "082-345-6789", address: "—",                                               joined: "1 ม.ค. 2568",  avatar: "KK" },
  { name: "ศิระเดช ศรีอ่ำ",    email: "admin@booka.app",   role: "admin",    phone: "083-456-7890", address: "—",                                               joined: "1 ม.ค. 2568",  avatar: "SR" },
];

function LoginPage({ onLogin, onGuestMode }: { onLogin: (u: UserAccount) => void; onGuestMode?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const acct = DEMO_ACCOUNTS.find(a => a.email === email.trim());
    if (!acct || password !== "demo1234") {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(acct); }, 700);
  };

  const roleColor: Record<Role, string> = {
    customer: "border-amber-200 hover:border-amber-400 bg-amber-50/50",
    staff:    "border-blue-200  hover:border-blue-400  bg-blue-50/50",
    admin:    "border-purple-200 hover:border-purple-400 bg-purple-50/50",
  };
  const roleBadge: Record<Role, string> = {
    customer: "bg-amber-100 text-amber-700",
    staff:    "bg-blue-100 text-blue-700",
    admin:    "bg-purple-100 text-purple-700",
  };
  const roleLabel: Record<Role, string> = { customer: "Customer", staff: "Staff", admin: "Admin" };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[45%] bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&h=1200&fit=crop')", backgroundSize: "cover" }} />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-10">
            <BookOpen className="w-9 h-9 text-amber-400" />
            <span className="font-['Playfair_Display'] text-3xl font-semibold text-white tracking-tight">Booka</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            ระบบจำหน่ายหนังสือออนไลน์<br />
            <span className="font-['DM_Mono'] text-amber-400/80 text-xs tracking-widest uppercase">CSI204 · Digital Platform</span>
          </p>
          <div className="mt-12 grid gap-3">
            {["ค้นหาหนังสือกว่า 10,000 ชื่อ","ชำระเงินออนไลน์อย่างปลอดภัย","ติดตามสถานะจัดส่ง Real-time"].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="font-['Playfair_Display'] text-xl font-semibold text-foreground">Booka</span>
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-1">เข้าสู่ระบบ</h1>
          <p className="text-muted-foreground text-sm mb-7">ยินดีต้อนรับกลับมา กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">อีเมล</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                placeholder="กรอกอีเมลของคุณ"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground">รหัสผ่าน</label>
                <button type="button" className="text-xs text-accent hover:underline">ลืมรหัสผ่าน?</button>
              </div>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} required
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors pr-10" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-amber-600" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">จดจำฉันไว้ในระบบ</label>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm">
                <X className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> กำลังเข้าสู่ระบบ…</> : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-['DM_Mono']">DEMO ACCOUNTS</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid gap-2">
              {DEMO_ACCOUNTS.map(acct => (
                <button key={acct.role} type="button"
                  onClick={() => { setEmail(acct.email); setPassword("demo1234"); }}
                  className={`border rounded-lg px-3.5 py-2.5 text-left transition-all ${roleColor[acct.role]}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${roleBadge[acct.role]}`}>
                      {acct.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{acct.name}</p>
                      <p className="text-xs text-muted-foreground font-['DM_Mono']">{acct.email}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${roleBadge[acct.role]}`}>{roleLabel[acct.role]}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2.5 font-['DM_Mono']">password: demo1234</p>
          </div>

          {/* Guest browse option */}
          {onGuestMode && (
            <div className="mt-6 text-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">หรือ</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <button onClick={onGuestMode}
                className="w-full py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> เข้าชมร้านก่อน (ไม่ต้องล็อกอิน)
              </button>
              <p className="text-xs text-muted-foreground mt-2">สามารถดูหนังสือและข้อมูลได้ แต่ไม่สามารถสั่งซื้อได้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────────

function ProfilePage({ user, onBack, onLogout }: { user: UserAccount; onBack: () => void; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [saved, setSaved] = useState(false);

  const roleBadge: Record<Role, string> = {
    customer: "bg-amber-100 text-amber-700 border-amber-200",
    staff:    "bg-blue-100 text-blue-700 border-blue-200",
    admin:    "bg-purple-100 text-purple-700 border-purple-200",
  };
  const roleLabel: Record<Role, string> = { customer: "Customer", staff: "Staff", admin: "Admin" };

  const myOrders = ORDERS.slice(0, 4);
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">โปรไฟล์ของฉัน</h1>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-medium ml-2">
            <CheckCircle className="w-3.5 h-3.5" /> บันทึกแล้ว
          </span>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-primary to-primary/70 relative" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-card bg-primary flex items-center justify-center shadow-md shrink-0">
              <span className="text-white text-xl font-bold font-['Playfair_Display']">{user.avatar}</span>
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">{name}</h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadge[user.role]}`}>{roleLabel[user.role]}</span>
              </div>
              <p className="text-sm text-muted-foreground font-['DM_Mono']">{user.email}</p>
            </div>
            <button onClick={() => setEditing(e => !e)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${editing ? "bg-secondary border-border text-muted-foreground" : "bg-primary text-white border-transparent hover:bg-primary/90"}`}>
              <Edit className="w-3.5 h-3.5" />
              {editing ? "ยกเลิก" : "แก้ไขโปรไฟล์"}
            </button>
          </div>

          {/* Stats — customer only */}
          {user.role === "customer" && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[["คำสั่งซื้อทั้งหมด", String(myOrders.length), ClipboardList], ["ยอดใช้จ่าย", `฿${totalSpent.toLocaleString()}`, ShoppingBag], ["สมาชิกมาแล้ว", user.joined, User]].map(([label, val, Icon]) => (
                <div key={label as string} className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-lg font-semibold text-foreground">{val as string}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label as string}</p>
                </div>
              ))}
            </div>
          )}

          {/* Info / Edit form */}
          {editing ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">ชื่อ-นามสกุล</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">เบอร์โทรศัพท์</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">อีเมล</label>
                  <input value={user.email} disabled
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-secondary text-sm text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">สมาชิกตั้งแต่</label>
                  <input value={user.joined} disabled
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-secondary text-sm text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
              {user.role === "customer" && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">ที่อยู่จัดส่งหลัก</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none" />
                </div>
              )}
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">ยกเลิก</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              {[["ชื่อ-นามสกุล", name], ["เบอร์โทรศัพท์", phone], ["อีเมล", user.email], ["สมาชิกตั้งแต่", user.joined], ...(user.role === "customer" ? [["ที่อยู่จัดส่งหลัก", address]] : [])].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="text-foreground">{val || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders — customer only */}
      {user.role === "customer" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-foreground flex items-center gap-2"><ClipboardList className="w-4 h-4 text-accent" /> คำสั่งซื้อล่าสุด</h3>
            <button onClick={onBack} className="text-xs text-accent hover:underline">ดูทั้งหมด →</button>
          </div>
          <div className="divide-y divide-border">
            {myOrders.map(o => (
              <div key={o.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-['DM_Mono'] text-foreground">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.date} · {o.items} รายการ</p>
                </div>
                <p className="text-sm font-medium font-['DM_Mono']">฿{o.total.toLocaleString()}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  o.status === "pending" ? "text-amber-700 bg-amber-50 border-amber-200" :
                  o.status === "delivered" ? "text-gray-600 bg-gray-50 border-gray-200" :
                  o.status === "cancelled" ? "text-red-700 bg-red-50 border-red-200" :
                  "text-green-700 bg-green-50 border-green-200"
                }`}>
                  {o.status === "pending" ? "รอชำระเงิน" : o.status === "delivered" ? "จัดส่งสำเร็จ" : o.status === "cancelled" ? "ยกเลิก" : "กำลังดำเนินการ"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security section */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <h3 className="font-medium text-foreground">ความปลอดภัย</h3>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-sm text-left">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium text-foreground">เปลี่ยนรหัสผ่าน</p>
            <p className="text-xs text-muted-foreground">อัปเดตล่าสุด: 1 ม.ค. 2568</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <button onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
        <LogOut className="w-4 h-4" /> ออกจากระบบ
      </button>
    </div>
  );
}

// ─── WIREFRAME ────────────────────────────────────────────────────────────────

// Primitive wireframe building blocks
function WBox({ h = 8, label = "", note = "", className = "" }: { h?: number; label?: string; note?: string; className?: string }) {
  return (
    <div className={`relative bg-[#e8e8e8] border border-[#bbb] rounded flex flex-col items-center justify-center gap-0.5 ${className}`} style={{ minHeight: `${h * 4}px` }}>
      {label && <span className="text-[#666] text-[11px] font-['Courier_New'] text-center leading-tight px-1.5">{label}</span>}
      {note && <span className="text-[#999] text-[9px] font-['Courier_New'] italic">{note}</span>}
    </div>
  );
}

function WImg({ label = "Image" }: { label?: string }) {
  return (
    <div className="relative bg-[#d4d4d4] border border-[#bbb] rounded flex items-center justify-center overflow-hidden w-full h-full">
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#888" strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#888" strokeWidth="1.5" />
      </svg>
      <span className="text-[#666] text-[11px] font-['Courier_New'] z-10">{label}</span>
    </div>
  );
}

function WBtn({ label = "Button", primary = false, className = "" }: { label?: string; primary?: boolean; className?: string }) {
  return (
    <div className={`border rounded flex items-center justify-center px-3 py-1.5 ${primary ? "bg-[#555] border-[#555]" : "bg-[#e8e8e8] border-[#999]"} ${className}`}>
      <span className={`text-[11px] font-['Courier_New'] font-bold ${primary ? "text-white" : "text-[#555]"}`}>{label}</span>
    </div>
  );
}

function WInput({ label = "" }: { label?: string }) {
  return (
    <div className="border border-[#aaa] rounded bg-white px-2 py-1.5 flex items-center gap-1">
      <span className="text-[10px] font-['Courier_New'] text-[#aaa] flex-1">{label}</span>
      <div className="w-3 h-3 border border-[#ccc] rounded-sm" />
    </div>
  );
}

function WBadge({ label = "", color = "gray" }: { label?: string; color?: string }) {
  const c = color === "amber" ? "border-[#c89600] text-[#7a5c00]" : color === "green" ? "border-[#4a9c59] text-[#2d6b38]" : color === "blue" ? "border-[#4a7ac8] text-[#2d4e7a]" : color === "red" ? "border-[#c84a4a] text-[#7a2d2d]" : "border-[#aaa] text-[#555]";
  return <span className={`border rounded-full px-2 py-0.5 text-[10px] font-['Courier_New'] ${c}`}>{label}</span>;
}

function WSection({ title, note, children, className = "" }: { title?: string; note?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-dashed border-[#bbb] rounded-lg p-3 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[9px] font-['Courier_New'] text-[#999] uppercase tracking-widest">{title}</span>
          {note && <span className="text-[9px] font-['Courier_New'] text-[#bbb] italic">— {note}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function WArrow({ label = "" }: { label?: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex-1 border-t border-dashed border-[#bbb]" />
      <span className="text-[10px] font-['Courier_New'] text-[#bbb] shrink-0">{label} →</span>
      <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-[#bbb]" />
    </div>
  );
}

// Screen wrapper — renders a browser-chrome frame with label + badge
function WScreen({ title, badge, children, note }: { title: string; badge?: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="border-2 border-[#888] rounded-xl overflow-hidden shadow-md bg-white">
      {/* Browser chrome */}
      <div className="bg-[#d0d0d0] px-3 py-2 flex items-center gap-2 border-b border-[#bbb]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#bbb]" />
          <div className="w-3 h-3 rounded-full bg-[#bbb]" />
          <div className="w-3 h-3 rounded-full bg-[#bbb]" />
        </div>
        <div className="flex-1 bg-white border border-[#bbb] rounded px-2 py-0.5">
          <span className="text-[10px] font-['Courier_New'] text-[#aaa]">booka.csi204.app/{title.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
        {badge && <WBadge label={badge} color="gray" />}
      </div>
      {/* Screen content */}
      <div className="p-3 space-y-2.5 bg-[#f9f9f9]">{children}</div>
      {note && (
        <div className="bg-[#fffbea] border-t border-[#e8d96a] px-3 py-1.5">
          <span className="text-[10px] font-['Courier_New'] text-[#7a6a00]">📝 {note}</span>
        </div>
      )}
    </div>
  );
}

// Sidebar item
function WSideItem({ label, active, sub, onClick }: { label: string; active: boolean; sub?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-[11px] font-['Courier_New'] transition-colors flex items-center gap-2 ${active ? "bg-[#555] text-white" : "text-[#555] hover:bg-[#e0e0e0]"} ${sub ? "pl-6" : ""}`}>
      {sub && <span className="text-[#aaa]">└</span>}
      {label}
    </button>
  );
}

type WFScreen =
  | "Login" | "Profile"
  | "C-Home" | "C-Browse" | "C-Detail" | "C-Cart" | "C-Checkout" | "C-Orders"
  | "S-Orders" | "S-Inventory"
  | "A-Dashboard" | "A-Books" | "A-Users";

const SCREENS: { id: WFScreen; label: string; role: "customer"|"staff"|"admin"; group: string }[] = [
  { id: "Login",      label: "Login",         role: "customer", group: "Auth" },
  { id: "Profile",    label: "Profile",       role: "customer", group: "Auth" },
  { id: "C-Home",     label: "Home",          role: "customer", group: "Customer Flow" },
  { id: "C-Browse",   label: "Browse Books",  role: "customer", group: "Customer Flow" },
  { id: "C-Detail",   label: "Book Detail",   role: "customer", group: "Customer Flow" },
  { id: "C-Cart",     label: "Cart",          role: "customer", group: "Customer Flow" },
  { id: "C-Checkout", label: "Checkout",      role: "customer", group: "Customer Flow" },
  { id: "C-Orders",   label: "My Orders",     role: "customer", group: "Customer Flow" },
  { id: "S-Orders",   label: "Manage Orders", role: "staff",    group: "Staff Panel" },
  { id: "S-Inventory",label: "Inventory",     role: "staff",    group: "Staff Panel" },
  { id: "A-Dashboard",label: "Dashboard",     role: "admin",    group: "Admin Panel" },
  { id: "A-Books",    label: "Manage Books",  role: "admin",    group: "Admin Panel" },
  { id: "A-Users",    label: "Manage Users",  role: "admin",    group: "Admin Panel" },
];

// ── Individual screen wireframes ──────────────────────────────────────────────

function WF_Login() {
  return (
    <WScreen title="login" note="กรอกอีเมล + รหัสผ่าน → Validate → ถ้าถูกต้อง redirect ตาม Role | Demo accounts ให้กด autofill | ลืมรหัสผ่าน → email reset flow">
      <div className="flex gap-0 min-h-[480px]">
        {/* Left panel */}
        <WSection title="Left Panel — Brand (lg only)" className="w-48 shrink-0 mr-3">
          <div className="h-32 rounded overflow-hidden"><WImg label="Background" /></div>
          <WBox label="[ 📚 Booka Logo ]" h={12} />
          <WBox label="ระบบจำหน่ายหนังสือออนไลน์" h={8} note="tagline" />
          <div className="space-y-1">
            {["✓ ค้นหาหนังสือ 10,000+ ชื่อ","✓ ชำระเงินออนไลน์","✓ ติดตามสถานะ Real-time"].map(f => (
              <WBox key={f} label={f} h={6} />
            ))}
          </div>
        </WSection>
        {/* Right panel */}
        <div className="flex-1 space-y-2.5">
          <WBox label="เข้าสู่ระบบ (H1)" h={10} />
          <WBox label="ยินดีต้อนรับกลับมา…" h={6} note="subtext" />
          <WSection title="Login Form">
            <WBox label="อีเมล *" h={5} note="label" />
            <WInput label="กรอกอีเมลของคุณ" />
            <WBox label="รหัสผ่าน *  [ลืมรหัสผ่าน?]" h={5} note="label + link" />
            <div className="relative">
              <WInput label="••••••••" />
              <WBox label="👁" h={9} className="absolute right-0 top-0 w-9 border-none bg-transparent" />
            </div>
            <div className="flex gap-2 items-center">
              <WBox label="□" h={5} className="w-5 shrink-0" />
              <WBox label="จดจำฉันไว้ในระบบ" h={5} />
            </div>
            <WBox label="⚠ อีเมลหรือรหัสผ่านไม่ถูกต้อง" h={8} note="error state (conditional)" />
            <WBtn label="เข้าสู่ระบบ" primary className="w-full" />
          </WSection>
          <WSection title="Demo Accounts" note="กดเพื่อ autofill">
            {[["SC","สมชาย วงศ์สุข","customer@booka.app","Customer"],["KK","กิตติวัฒน์ กุดั่น","staff@booka.app","Staff"],["SR","ศิระเดช ศรีอ่ำ","admin@booka.app","Admin"]].map(([av,name,email,role]) => (
              <div key={role} className="flex items-center gap-2 border border-[#ddd] rounded-lg px-2 py-1.5">
                <WBox label={av} h={9} className="w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <WBox label={name} h={5} />
                  <WBox label={email} h={4} note="email" />
                </div>
                <WBadge label={role} />
              </div>
            ))}
            <WBox label="password: demo1234" h={5} note="hint" />
          </WSection>
        </div>
      </div>
    </WScreen>
  );
}

function WF_Profile() {
  return (
    <WScreen title="profile" note="เข้าถึงจาก 👤 icon ใน Navbar | แก้ไขได้: ชื่อ, เบอร์, ที่อยู่ | อีเมลและวันสมัครแก้ไขไม่ได้ | Logout → กลับหน้า Login">
      <WSection title="Back Button + Page Title">
        <div className="flex gap-2 items-center">
          <WBox label="← กลับ" h={9} className="w-20 shrink-0" />
          <WBox label="โปรไฟล์ของฉัน (H1)" h={9} />
          <WBadge label="✓ บันทึกแล้ว" color="green" />
        </div>
      </WSection>
      {/* Profile card */}
      <WSection title="Profile Card">
        <WBox label="Banner gradient" h={14} />
        <div className="flex gap-3 -mt-2 items-end">
          <WBox label="SR" h={20} className="w-20 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-1">
            <div className="flex gap-2 items-center">
              <WBox label="ชื่อ-นามสกุล" h={8} />
              <WBadge label="Customer" color="amber" />
            </div>
            <WBox label="email@booka.app" h={5} note="readonly" />
          </div>
          <WBtn label="✏ แก้ไขโปรไฟล์" className="shrink-0" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {[["4","คำสั่งซื้อทั้งหมด"],["฿2,620","ยอดใช้จ่าย"],["10 ก.พ. 2567","สมาชิกมาแล้ว"]].map(([v,l]) => (
            <div key={l} className="border border-[#ddd] rounded-xl p-3 text-center space-y-1 bg-white">
              <WBox label={v} h={8} className="font-bold" />
              <WBox label={l} h={5} note="label" />
            </div>
          ))}
        </div>
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {["ชื่อ-นามสกุล","เบอร์โทรศัพท์","อีเมล (readonly)","สมาชิกตั้งแต่ (readonly)","ที่อยู่จัดส่งหลัก"].map(f => (
            <div key={f} className="space-y-0.5">
              <WBox label={f} h={4} note="field label" />
              <WBox label="—" h={6} />
            </div>
          ))}
        </div>
      </WSection>
      {/* Edit form state */}
      <WSection title="Edit Form (เมื่อกด แก้ไขโปรไฟล์)" note="conditional render">
        <div className="grid grid-cols-2 gap-2">
          <WInput label="ชื่อ-นามสกุล *" />
          <WInput label="เบอร์โทรศัพท์ *" />
          <WInput label="อีเมล (disabled)" />
          <WInput label="วันสมัคร (disabled)" />
        </div>
        <WInput label="ที่อยู่จัดส่งหลัก (textarea)" />
        <div className="flex gap-2 justify-end">
          <WBtn label="ยกเลิก" />
          <WBtn label="✓ บันทึกการเปลี่ยนแปลง" primary />
        </div>
      </WSection>
      {/* Recent orders */}
      <WSection title="คำสั่งซื้อล่าสุด (Customer only)">
        {["ORD-2568-0892","ORD-2568-0891","ORD-2568-0890"].map(id => (
          <div key={id} className="flex gap-3 items-center border-b border-[#eee] pb-1.5">
            <div className="flex-1 space-y-0.5">
              <WBox label={id} h={5} note="order id" />
              <WBox label="13 ม.ค. 2568 · 3 รายการ" h={4} />
            </div>
            <WBox label="฿840" h={6} className="w-16 shrink-0" />
            <WBadge label="รอชำระ" color="amber" />
          </div>
        ))}
      </WSection>
      {/* Security + Logout */}
      <WSection title="Security">
        <div className="border border-[#ddd] rounded-xl px-3 py-2.5 flex items-center gap-3">
          <WBox label="👁" h={8} className="w-8 shrink-0 border-none bg-transparent" />
          <div className="flex-1">
            <WBox label="เปลี่ยนรหัสผ่าน" h={6} />
            <WBox label="อัปเดตล่าสุด: 1 ม.ค. 2568" h={4} note="meta" />
          </div>
          <WBox label="›" h={8} className="w-6 shrink-0 border-none bg-transparent" />
        </div>
      </WSection>
      <WBtn label="🚪 ออกจากระบบ" className="w-full border-red-200 text-red-600" />
    </WScreen>
  );
}

function WF_CHome() {
  return (
    <WScreen title="home" note="Hero มี CTA 'เริ่มค้นหาหนังสือ' → Browse | Featured Books และ New Arrivals แต่ละการ์ดคลิกได้ → Detail">
      {/* Navbar */}
      <WSection title="Navbar — sticky top">
        <div className="flex gap-2 items-center">
          <WBox label="[ 📚 Booka ]" h={10} className="w-28 shrink-0" />
          <WInput label="ค้นหาหนังสือ ผู้แต่ง หรือ ISBN…" />
          <WBox label="คำสั่งซื้อ" h={10} className="w-20 shrink-0" />
          <WBox label="🛒 (0)" h={10} className="w-14 shrink-0" />
          <WBox label="👤" h={10} className="w-10 shrink-0" />
        </div>
      </WSection>
      {/* Hero */}
      <WSection title="Hero Banner">
        <div className="h-36 rounded overflow-hidden"><WImg label="Background Image" /></div>
        <div className="space-y-1.5 px-1">
          <WBox label="HEADLINE TEXT — ร้านหนังสือออนไลน์คุณภาพ" h={10} />
          <WBox label="Subheadline — รวมวรรณกรรมไทยและนานาชาติ" h={7} />
          <div className="flex gap-2">
            <WBtn label="เริ่มค้นหาหนังสือ →" primary />
            <WBtn label="ดูโปรโมชัน" />
          </div>
        </div>
      </WSection>
      {/* Featured */}
      <WSection title="Featured Books" note="4 cards">
        <div className="grid grid-cols-4 gap-2">
          {["ปีศาจ","คำพิพากษา","Atomic Habits","Sapiens"].map(t => (
            <div key={t} className="space-y-1">
              <div className="h-28 rounded overflow-hidden"><WImg label={t} /></div>
              <WBox label={t} h={7} />
              <WBox label="เสนีย์ เสาวพงศ์" h={5} note="author" />
              <WBox label="★★★★☆" h={5} />
              <WBox label="฿ 285" h={6} />
              <WBtn label="+ ใส่ตะกร้า" />
            </div>
          ))}
        </div>
      </WSection>
      {/* New Arrivals */}
      <WSection title="New Arrivals" note="4 cards">
        <div className="grid grid-cols-4 gap-2">
          {["สี่แผ่นดิน","The Alchemist","ข้างหลังภาพ","Zero to One"].map(t => (
            <div key={t} className="space-y-1">
              <div className="h-24 rounded overflow-hidden"><WImg label={t} /></div>
              <WBox label={t} h={7} />
              <WBox label="฿ 350" h={6} />
              <WBtn label="+ ใส่ตะกร้า" />
            </div>
          ))}
        </div>
      </WSection>
    </WScreen>
  );
}

function WF_CBrowse() {
  return (
    <WScreen title="browse" note="กรองตาม Category และ Sort — ผลลัพธ์แสดง Grid 4 คอลัมน์ — คลิกการ์ด → Detail">
      <WSection title="Navbar — sticky top">
        <div className="flex gap-2 items-center">
          <WBox label="[ 📚 Booka ]" h={10} className="w-28 shrink-0" />
          <WInput label="ค้นหาหนังสือ…" />
          <WBox label="🛒 (2)" h={10} className="w-14 shrink-0" />
          <WBox label="👤" h={10} className="w-10 shrink-0" />
        </div>
      </WSection>
      <WSection title="Filter Bar">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {["ทั้งหมด","วรรณกรรมไทย","Fiction","Self-Help","ธุรกิจ","ประวัติศาสตร์"].map((c,i) => (
            <div key={c} className={`border rounded-full px-3 py-1 text-[11px] font-['Courier_New'] ${i===0 ? "bg-[#555] text-white border-[#555]" : "border-[#aaa] text-[#555]"}`}>{c}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <WBox label="Sort: ราคา ↑" h={8} className="w-32 shrink-0" />
          <WBox label="ช่วงราคา: ฿0 – ฿500" h={8} />
        </div>
      </WSection>
      <WSection title="Results Grid" note="8–10 items, pagination">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({length:8}).map((_,n) => (
            <div key={n} className="space-y-1 border border-[#ddd] rounded p-1.5 bg-white">
              <div className="h-24 rounded overflow-hidden"><WImg label={`Book ${n+1}`} /></div>
              <WBox label="ชื่อหนังสือ" h={6} />
              <WBox label="ผู้แต่ง" h={5} note="author" />
              <WBox label="★★★★☆  4.8" h={5} />
              <div className="flex gap-1">
                <WBox label="฿ 285" h={7} />
                <WBtn label="+" primary className="w-8 shrink-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {["‹","1","2","3","›"].map((p,i) => (
            <div key={i} className={`w-8 h-8 border rounded flex items-center justify-center text-[11px] font-['Courier_New'] ${p==="1" ? "bg-[#555] text-white border-[#555]" : "border-[#aaa] text-[#555]"}`}>{p}</div>
          ))}
        </div>
      </WSection>
    </WScreen>
  );
}

function WF_CDetail() {
  return (
    <WScreen title="browse/detail" note="คลิก Add to Cart → ตะกร้า update | Buy Now → ข้ามไป Checkout | Stock ≤ 5 แสดง Low Stock badge">
      <WSection title="Breadcrumb">
        <WBox label="หน้าแรก  ›  หนังสือทั้งหมด  ›  ปีศาจ" h={6} />
      </WSection>
      <WSection title="Product Detail">
        <div className="flex gap-4">
          <div className="w-36 h-52 rounded overflow-hidden shrink-0"><WImg label="Book Cover" /></div>
          <div className="flex-1 space-y-2">
            <WBox label="ปีศาจ  (H1 Title)" h={10} />
            <WBox label="เสนีย์ เสาวพงศ์" h={6} note="author" />
            <div className="flex gap-2">
              <WBox label="★★★★★  4.8" h={6} />
              <WBox label="234 รีวิว" h={6} />
            </div>
            <div className="flex gap-2 items-center">
              <WBox label="฿ 285" h={9} className="text-base font-bold" />
              <WBox label="~~฿ 320~~" h={7} note="strike" />
              <WBadge label="ลด 11%" color="amber" />
            </div>
            <WBox label="ISBN: 978-616-7904-01-2 · วรรณกรรมไทย" h={6} />
            <WBox label="นวนิยายอมตะที่สะท้อนสังคมไทย…" h={14} note="description" />
            <WBox label="คงเหลือ: 45 เล่ม" h={6} />
            <div className="flex gap-2">
              <WBox label="จำนวน  [ − 1 + ]" h={10} className="w-32 shrink-0" />
              <WBtn label="+ ใส่ตะกร้า" primary className="flex-1" />
              <WBtn label="ซื้อเลย →" className="flex-1" />
            </div>
          </div>
        </div>
      </WSection>
      <WSection title="Reviews" note="3 latest">
        {[["สมชาย ว.","★★★★★","หนังสือดีมาก อ่านแล้วประทับใจ"],["นภา ร.","★★★★☆","เนื้อหาลึกซึ้ง ต้องใช้เวลาอ่าน"],["กิตติ์ ช.","★★★★★","แนะนำให้ทุกคนอ่าน"]].map(([name,stars,text],i) => (
          <div key={i} className="flex gap-2 border-b border-[#eee] pb-2">
            <WBox label={name.charAt(0)} h={10} className="w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="flex gap-2"><WBox label={name} h={5} /><WBox label={stars} h={5} /></div>
              <WBox label={text} h={7} />
            </div>
          </div>
        ))}
      </WSection>
    </WScreen>
  );
}

function WF_CCart() {
  return (
    <WScreen title="cart" note="ปรับ qty → subtotal อัปเดต real-time | ลบรายการ → ยืนยัน dialog | Proceed → Checkout">
      <WSection title="Navbar — sticky top">
        <div className="flex gap-2 items-center">
          <WBox label="[ 📚 Booka ]" h={10} className="w-28 shrink-0" />
          <WInput label="ค้นหาหนังสือ…" />
          <WBox label="🛒 (3)" h={10} className="w-14 shrink-0" note="active" />
          <WBox label="👤" h={10} className="w-10 shrink-0" />
        </div>
      </WSection>
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <WSection title="Cart Items">
            {[["ปีศาจ","เสนีย์ เสาวพงศ์","285","1"],["Atomic Habits","James Clear","325","2"],["Sapiens","Yuval Harari","445","1"]].map(([t,a,p,q],i) => (
              <div key={i} className="flex gap-2 items-center border-b border-[#eee] pb-2">
                <div className="w-12 h-16 rounded overflow-hidden shrink-0"><WImg label={t} /></div>
                <div className="flex-1 space-y-1">
                  <WBox label={t} h={6} />
                  <WBox label={a} h={5} note="author" />
                  <WBox label={`฿ ${p}`} h={6} />
                </div>
                <div className="flex gap-1 items-center shrink-0">
                  <WBtn label="−" className="w-7 h-7" />
                  <WBox label={q} h={7} className="w-8" />
                  <WBtn label="+" className="w-7 h-7" />
                </div>
                <WBtn label="🗑" className="w-8 h-8 shrink-0" />
              </div>
            ))}
          </WSection>
        </div>
        <div className="w-48 shrink-0 space-y-2">
          <WSection title="Order Summary">
            <WBox label="Subtotal: ฿ 1,380" h={7} />
            <WBox label="Shipping: ฿ 50" h={7} />
            <div className="border-t border-[#ccc] pt-1">
              <WBox label="Total: ฿ 1,430" h={9} className="font-bold" />
            </div>
            <WBtn label="Proceed to Checkout →" primary className="w-full mt-1" />
            <WBtn label="← ซื้อต่อ" className="w-full" />
          </WSection>
          <WSection title="Promo Code">
            <WInput label="PROMO CODE" />
            <WBtn label="Apply" className="w-full" />
          </WSection>
        </div>
      </div>
    </WScreen>
  );
}

function WF_CCheckout() {
  return (
    <WScreen title="checkout" note="Step 1: ที่อยู่ → Step 2: ชำระเงิน → Step 3: ยืนยัน | โอนเงิน = อัปโหลดสลิป | สำเร็จ → My Orders">
      <WSection title="Progress Stepper">
        <div className="flex gap-1 items-center">
          {[["1","ที่อยู่"],["2","ชำระเงิน"],["3","ยืนยัน"]].map(([n,l],i) => (
            <React.Fragment key={n}>
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-['Courier_New'] font-bold ${i===0 ? "bg-[#555] border-[#555] text-white" : "border-[#bbb] text-[#bbb]"}`}>{n}</div>
                <span className={`text-[10px] font-['Courier_New'] ${i===0 ? "text-[#555] font-bold" : "text-[#bbb]"}`}>{l}</span>
              </div>
              {i < 2 && <div className="flex-1 border-t border-dashed border-[#ccc]" />}
            </React.Fragment>
          ))}
        </div>
      </WSection>
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <WSection title="Shipping Address">
            <div className="grid grid-cols-2 gap-2">
              <WInput label="ชื่อ-นามสกุล *" />
              <WInput label="เบอร์โทรศัพท์ *" />
            </div>
            <WInput label="ที่อยู่ *" />
            <div className="grid grid-cols-3 gap-2">
              <WInput label="จังหวัด" />
              <WInput label="รหัสไปรษณีย์" />
              <WInput label="ประเทศ" />
            </div>
          </WSection>
          <WSection title="Payment Method">
            <div className="grid grid-cols-3 gap-2">
              {[["💸 โอนเงิน","selected"],["💳 บัตรเครดิต",""],["📦 ชำระปลายทาง",""]].map(([m,s]) => (
                <div key={m} className={`border-2 rounded p-2 text-center text-[11px] font-['Courier_New'] ${s ? "border-[#555] bg-[#f0f0f0]" : "border-[#ddd]"}`}>{m}</div>
              ))}
            </div>
            <WSection title="Upload Slip (bank transfer)" note="image upload zone">
              <div className="border-2 border-dashed border-[#bbb] rounded-lg h-24 flex flex-col items-center justify-center gap-1">
                <WBox label="📎 คลิกหรือลากไฟล์สลิปมาวาง" h={8} className="border-none bg-transparent text-[#aaa]" />
                <span className="text-[9px] font-['Courier_New'] text-[#ccc]">PNG, JPG ขนาดไม่เกิน 5MB</span>
              </div>
            </WSection>
          </WSection>
        </div>
        <div className="w-48 shrink-0 space-y-2">
          <WSection title="Order Summary">
            {[["ปีศาจ (x1)","฿285"],["Atomic Habits (x2)","฿650"],["Sapiens (x1)","฿445"]].map(([n,p]) => (
              <div key={n} className="flex gap-1"><WBox label={n} h={5} /><WBox label={p} h={5} className="w-16 shrink-0" /></div>
            ))}
            <div className="border-t border-[#ccc] pt-1 space-y-1">
              <div className="flex gap-1"><WBox label="Shipping" h={5} /><WBox label="฿50" h={5} className="w-16 shrink-0" /></div>
              <div className="flex gap-1"><WBox label="Total" h={7} className="font-bold" /><WBox label="฿1,430" h={7} className="w-16 shrink-0 font-bold" /></div>
            </div>
            <WBtn label="✓ Confirm Order" primary className="w-full" />
          </WSection>
        </div>
      </div>
    </WScreen>
  );
}

function WF_COrders() {
  return (
    <WScreen title="my-orders" note="กรองด้วย status tab | คลิก Detail → drawer แสดงรายละเอียด | ยกเลิกได้เฉพาะ status=pending">
      <WSection title="Navbar — sticky top">
        <div className="flex gap-2 items-center">
          <WBox label="[ 📚 Booka ]" h={10} className="w-28 shrink-0" />
          <WInput label="ค้นหาหนังสือ…" />
          <WBox label="คำสั่งซื้อ" h={10} className="w-20 shrink-0 border-b-2 border-b-[#555]" note="active" />
          <WBox label="🛒 (0)" h={10} className="w-14 shrink-0" />
          <WBox label="👤" h={10} className="w-10 shrink-0" />
        </div>
      </WSection>
      <WSection title="Status Tabs">
        <div className="flex gap-1">
          {["ทั้งหมด","รอชำระ","ตรวจสอบ","ยืนยัน","จัดส่ง","สำเร็จ","ยกเลิก"].map((t,i) => (
            <div key={t} className={`px-2 py-1 rounded-t text-[10px] font-['Courier_New'] border ${i===0 ? "bg-[#555] text-white border-[#555]" : "bg-[#eee] text-[#666] border-[#ccc]"}`}>{t}</div>
          ))}
        </div>
      </WSection>
      <WSection title="Order List">
        {[["ORD-2568-0892","13 ม.ค. 2568","3 รายการ","฿ 840","รอชำระเงิน","amber"],["ORD-2568-0891","13 ม.ค. 2568","2 รายการ","฿ 510","ตรวจสอบหลักฐาน","blue"],["ORD-2568-0890","12 ม.ค. 2568","4 รายการ","฿ 1,250","ยืนยันแล้ว","green"],["ORD-2568-0889","12 ม.ค. 2568","1 รายการ","฿ 325","กำลังจัดส่ง","blue"],["ORD-2568-0888","11 ม.ค. 2568","2 รายการ","฿ 695","จัดส่งสำเร็จ","gray"]].map(([id,date,items,total,status,color]) => (
          <div key={id} className="flex items-center gap-3 border-b border-[#eee] py-2">
            <div className="flex-1 space-y-1">
              <WBox label={id} h={6} note="order id" />
              <div className="flex gap-2">
                <WBox label={date} h={5} />
                <WBox label={items} h={5} />
                <WBox label={total} h={5} />
              </div>
            </div>
            <WBadge label={status} color={color} />
            <WBtn label="ดูรายละเอียด" className="shrink-0" />
          </div>
        ))}
      </WSection>
    </WScreen>
  );
}

function WF_SOrders() {
  return (
    <WScreen title="staff/orders" note="Staff เห็นทุก order — กด View เพื่อ approve/update status — เปลี่ยน status จาก dropdown">
      <WSection title="Staff Navbar">
        <div className="flex gap-2 items-center">
          <WBox label="[ 📚 Booka Staff ]" h={10} className="w-36 shrink-0" />
          <div className="flex-1" />
          <WBox label="🔔 (3)" h={10} className="w-14 shrink-0" />
          <WBox label="👤 กิตติวัฒน์" h={10} className="w-28 shrink-0" />
        </div>
      </WSection>
      <WSection title="Tabs">
        <div className="flex gap-1">
          {["จัดการคำสั่งซื้อ","จัดการสต็อก"].map((t,i) => (
            <div key={t} className={`px-3 py-1.5 rounded-t text-[11px] font-['Courier_New'] border ${i===0 ? "bg-[#555] text-white border-[#555]" : "bg-[#eee] text-[#666] border-[#ccc]"}`}>{t}</div>
          ))}
        </div>
      </WSection>
      <WSection title="Filter + Search">
        <div className="flex gap-2">
          <WInput label="🔍 ค้นหา Order ID หรือชื่อลูกค้า…" />
          <WBox label="Status ▾" h={9} className="w-32 shrink-0" />
          <WBox label="วันที่ ▾" h={9} className="w-24 shrink-0" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[["ทั้งหมด","active"],["รอชำระ",""],["ตรวจสอบ",""],["ยืนยัน",""],["จัดส่ง",""],["สำเร็จ",""],["ยกเลิก",""]].map(([t,a]) => (
            <div key={t} className={`px-2 py-0.5 rounded-full border text-[10px] font-['Courier_New'] ${a ? "bg-[#555] text-white border-[#555]" : "border-[#ccc] text-[#666]"}`}>{t}</div>
          ))}
        </div>
      </WSection>
      <WSection title="Orders Table">
        <div className="space-y-0.5">
          <div className="grid grid-cols-7 gap-1">
            {["Order ID","ลูกค้า","วันที่","รายการ","ยอดรวม","สถานะ","Action"].map(h => (
              <WBox key={h} label={h} h={7} className="bg-[#d8d8d8] text-[9px]" />
            ))}
          </div>
          {[["ORD-0892","สมชาย ว.","13 ม.ค.","3","฿840","รอชำระ","amber"],["ORD-0891","นภา ร.","13 ม.ค.","2","฿510","ตรวจสอบ","blue"],["ORD-0890","กิตติ์ ช.","12 ม.ค.","4","฿1,250","ยืนยัน","green"],["ORD-0889","มาลี ส.","12 ม.ค.","1","฿325","จัดส่ง","blue"],["ORD-0888","ธนา พ.","11 ม.ค.","2","฿695","สำเร็จ","gray"]].map(([id,c,d,n,t,s,col]) => (
            <div key={id} className="grid grid-cols-7 gap-1">
              {[id,c,d,n,t].map((v,i) => <WBox key={i} label={v} h={8} />)}
              <WBadge label={s} color={col} />
              <div className="flex gap-1">
                <WBtn label="👁 View" className="flex-1" />
                <WBtn label="✏" className="w-7" />
              </div>
            </div>
          ))}
        </div>
      </WSection>
    </WScreen>
  );
}

function WF_SInventory() {
  return (
    <WScreen title="staff/inventory" note="Low stock (≤10) แสดง warning badge แดง — กด Restock เพื่ออัปเดตจำนวน — Real-time sync">
      <WSection title="Stats Cards">
        <div className="grid grid-cols-4 gap-2">
          {[["📚","หนังสือทั้งหมด","10 ชื่อ"],["⚠️","สต็อกต่ำ","3 รายการ"],["💰","มูลค่ารวม","฿ 42,350"],["📦","จัดส่งวันนี้","7 คำสั่ง"]].map(([icon,label,val]) => (
            <div key={label} className="border-2 border-[#ccc] rounded-lg p-3 bg-white space-y-1">
              <WBox label={icon} h={8} className="border-none bg-transparent" />
              <WBox label={val} h={10} className="font-bold" />
              <WBox label={label} h={5} note="metric" />
            </div>
          ))}
        </div>
      </WSection>
      <WSection title="Inventory Table">
        <div className="flex gap-2 mb-2">
          <WInput label="🔍 ค้นหาหนังสือ…" />
          <WBox label="หมวดหมู่ ▾" h={9} className="w-32 shrink-0" />
        </div>
        <div className="space-y-0.5">
          <div className="grid grid-cols-6 gap-1">
            {["ปก","ชื่อหนังสือ + ISBN","ราคา","สต็อก","สถานะ","Action"].map(h => (
              <WBox key={h} label={h} h={7} className="bg-[#d8d8d8] text-[9px]" />
            ))}
          </div>
          {BOOKS.slice(0,5).map(b => (
            <div key={b.id} className="grid grid-cols-6 gap-1 items-center">
              <div className="h-10 rounded overflow-hidden"><WImg label="📖" /></div>
              <div className="space-y-0.5">
                <WBox label={b.title} h={6} />
                <WBox label={b.isbn} h={4} note="isbn" />
              </div>
              <WBox label={`฿ ${b.price}`} h={8} />
              <WBox label={`${b.stock} เล่ม`} h={8} />
              <WBadge label={b.stock <= 10 ? "⚠ ต่ำ" : "ปกติ"} color={b.stock <= 10 ? "amber" : "green"} />
              <div className="flex gap-1">
                <WBtn label="✏ แก้ไข" className="flex-1" />
                <WBtn label="+ สต็อก" primary className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      </WSection>
    </WScreen>
  );
}

function WF_ADashboard() {
  return (
    <WScreen title="admin/dashboard" note="Dashboard overview — chart อัปเดต real-time — คลิก card → drill-down list">
      <WSection title="Admin Sidebar + Topbar layout">
        <div className="flex gap-0">
          <div className="w-36 shrink-0 border-r border-[#ddd] pr-2 space-y-1">
            <WBox label="[ 📚 Booka Admin ]" h={12} />
            {[["📊 Dashboard","active"],["📖 จัดการหนังสือ",""],["👥 จัดการผู้ใช้",""]].map(([m,a]) => (
              <div key={m} className={`px-2 py-1.5 rounded text-[10px] font-['Courier_New'] ${a ? "bg-[#555] text-white" : "text-[#555] hover:bg-[#eee]"}`}>{m}</div>
            ))}
            <div className="border-t border-[#eee] pt-1">
              <div className="px-2 py-1.5 text-[10px] font-['Courier_New'] text-red-500">🚪 Logout</div>
            </div>
          </div>
          <div className="flex-1 pl-3 space-y-2.5">
            <WSection title="Topbar">
              <div className="flex gap-2 items-center">
                <WBox label="Dashboard — ภาพรวมระบบ" h={8} />
                <WBox label="🔔 (5)" h={8} className="w-14 shrink-0" />
                <WBox label="👤 ศิระเดช (Admin)" h={8} className="w-36 shrink-0" />
              </div>
            </WSection>
            <WSection title="KPI Cards (4)">
              <div className="grid grid-cols-4 gap-2">
                {[["💰","รายได้รวม","฿ 301,800","+12%"],["📦","คำสั่งซื้อ","1,109","+8%"],["👥","ผู้ใช้ใหม่","48","+23%"],["📚","หนังสือขายดี","Atomic Habits","#1"]].map(([icon,label,val,sub]) => (
                  <div key={label} className="border-2 border-[#ccc] rounded-lg p-2 bg-white space-y-1">
                    <WBox label={`${icon} ${label}`} h={6} note="metric" />
                    <WBox label={val} h={9} className="font-bold" />
                    <WBox label={sub} h={5} note="change" />
                  </div>
                ))}
              </div>
            </WSection>
            <WSection title="Charts">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <WBox label="Area Chart — Revenue 6 เดือน" h={5} />
                  <div className="h-32 bg-[#e8e8e8] border border-[#bbb] rounded flex items-end justify-around px-2 pb-2 gap-1">
                    {[42,38,51,47,68,53].map((v,i) => (
                      <div key={i} className="flex-1 bg-[#888] rounded-t opacity-60" style={{height:`${v/68*100}%`}} />
                    ))}
                  </div>
                  <div className="flex justify-around">
                    {["ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.","ม.ค."].map(m => (
                      <span key={m} className="text-[8px] font-['Courier_New'] text-[#aaa]">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <WBox label="Bar Chart — Orders 6 เดือน" h={5} />
                  <div className="h-32 bg-[#e8e8e8] border border-[#bbb] rounded flex items-end justify-around px-2 pb-2 gap-1">
                    {[156,142,189,174,251,197].map((v,i) => (
                      <div key={i} className="flex-1 bg-[#aaa] rounded-t" style={{height:`${v/251*100}%`}} />
                    ))}
                  </div>
                  <div className="flex justify-around">
                    {["ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.","ม.ค."].map(m => (
                      <span key={m} className="text-[8px] font-['Courier_New'] text-[#aaa]">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </WSection>
            <WSection title="Recent Orders (5 rows)">
              <div className="space-y-0.5">
                <div className="grid grid-cols-5 gap-1">
                  {["Order ID","ลูกค้า","ยอดรวม","สถานะ","วันที่"].map(h => (
                    <WBox key={h} label={h} h={6} className="bg-[#d8d8d8] text-[9px]" />
                  ))}
                </div>
                {[["ORD-0892","สมชาย ว.","฿840","รอชำระ","amber"],["ORD-0891","นภา ร.","฿510","ตรวจสอบ","blue"],["ORD-0890","กิตติ์ ช.","฿1,250","ยืนยัน","green"]].map(([id,c,t,s,col]) => (
                  <div key={id} className="grid grid-cols-5 gap-1 items-center">
                    {[id,c,t].map((v,i) => <WBox key={i} label={v} h={7} />)}
                    <WBadge label={s} color={col} />
                    <WBox label="13 ม.ค." h={7} />
                  </div>
                ))}
              </div>
            </WSection>
          </div>
        </div>
      </WSection>
    </WScreen>
  );
}

function WF_ABooks() {
  return (
    <WScreen title="admin/books" note="คลิก + เพิ่มหนังสือ → Modal form | Edit → prefill form | Delete → confirm dialog | Upload cover image">
      <WSection title="Toolbar">
        <div className="flex gap-2">
          <WInput label="🔍 ค้นหาหนังสือ…" />
          <WBox label="หมวดหมู่ ▾" h={9} className="w-32 shrink-0" />
          <WBox label="Sort ▾" h={9} className="w-24 shrink-0" />
          <WBtn label="+ เพิ่มหนังสือ" primary className="w-28 shrink-0" />
        </div>
      </WSection>
      <WSection title="Books Table">
        <div className="space-y-0.5">
          <div className="grid grid-cols-7 gap-1">
            {["ปก","ชื่อหนังสือ","ผู้แต่ง","ราคา","สต็อก","หมวดหมู่","Action"].map(h => (
              <WBox key={h} label={h} h={7} className="bg-[#d8d8d8] text-[9px]" />
            ))}
          </div>
          {BOOKS.slice(0,5).map(b => (
            <div key={b.id} className="grid grid-cols-7 gap-1 items-center">
              <div className="h-12 rounded overflow-hidden"><WImg label="📖" /></div>
              <WBox label={b.title} h={9} />
              <WBox label={b.author} h={9} />
              <WBox label={`฿${b.price}`} h={9} />
              <WBox label={`${b.stock}`} h={9} />
              <WBox label={b.category} h={9} />
              <div className="flex gap-1">
                <WBtn label="✏" className="flex-1" />
                <WBtn label="🗑" className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      </WSection>
      <WSection title="Add/Edit Book — Modal Overlay" note="ปรากฏเมื่อคลิก + เพิ่ม หรือ Edit">
        <div className="border-2 border-[#888] rounded-xl bg-white p-4 space-y-2">
          <WBox label="× เพิ่มหนังสือใหม่  /  แก้ไขหนังสือ" h={9} />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <WInput label="ชื่อหนังสือ *" />
              <WInput label="ผู้แต่ง *" />
              <WInput label="ISBN *" />
              <div className="grid grid-cols-2 gap-1">
                <WInput label="ราคา (฿) *" />
                <WInput label="สต็อก *" />
              </div>
              <WBox label="หมวดหมู่ ▾" h={9} />
              <WInput label="ราคาปกติ (฿)" />
            </div>
            <div className="space-y-1.5">
              <div className="h-32 border-2 border-dashed border-[#bbb] rounded-lg flex flex-col items-center justify-center gap-1">
                <WBox label="📷 อัปโหลดรูปปก" h={8} className="border-none bg-transparent text-[#aaa]" />
                <span className="text-[9px] font-['Courier_New'] text-[#ccc]">JPG, PNG ≤ 5MB</span>
              </div>
              <WBox label="คำอธิบายหนังสือ (Textarea)" h={24} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <WBtn label="ยกเลิก" className="w-24" />
            <WBtn label="✓ บันทึก" primary className="w-24" />
          </div>
        </div>
      </WSection>
    </WScreen>
  );
}

function WF_AUsers() {
  return (
    <WScreen title="admin/users" note="กรองตาม Role — คลิก Edit เพื่อเปลี่ยน Role หรือ Deactivate account — ไม่สามารถลบ Admin ได้">
      <WSection title="Toolbar + Stats">
        <div className="flex gap-2 mb-2">
          <WInput label="🔍 ค้นหาชื่อหรืออีเมล…" />
          <WBox label="Role ▾" h={9} className="w-28 shrink-0" />
          <WBtn label="+ เพิ่มผู้ใช้" primary className="w-24 shrink-0" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["👥 ผู้ใช้ทั้งหมด","6 คน"],["🛒 ลูกค้า","4 คน"],["🔧 พนักงาน / Admin","2 คน"]].map(([l,v]) => (
            <div key={l} className="border rounded-lg p-2 bg-white flex gap-2 items-center">
              <WBox label={l} h={7} />
              <WBox label={v} h={7} className="w-16 shrink-0 font-bold" />
            </div>
          ))}
        </div>
      </WSection>
      <WSection title="Users Table">
        <div className="space-y-0.5">
          <div className="grid grid-cols-7 gap-1">
            {["#","ชื่อ-นามสกุล","อีเมล","บทบาท","วันสมัคร","คำสั่งซื้อ","Action"].map(h => (
              <WBox key={h} label={h} h={7} className="bg-[#d8d8d8] text-[9px]" />
            ))}
          </div>
          {USERS.map((u,i) => (
            <div key={u.id} className="grid grid-cols-7 gap-1 items-center">
              <WBox label={String(i+1)} h={8} />
              <WBox label={u.name} h={8} />
              <WBox label={u.email} h={8} />
              <WBadge label={u.role} color={u.role==="admin" ? "amber" : u.role==="staff" ? "blue" : "gray"} />
              <WBox label={u.joined} h={8} />
              <WBox label={String(u.orders)} h={8} />
              <div className="flex gap-1">
                <WBtn label="👁" className="flex-1" />
                <WBtn label="✏" className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      </WSection>
    </WScreen>
  );
}

// ── Master wireframe view ─────────────────────────────────────────────────────

function WireframeView({ role }: { role: Role }) {
  const allScreens = SCREENS.filter(s => s.role === role);
  const [active, setActive] = useState<WFScreen>(allScreens[0].id);

  const screenMap: Record<WFScreen, React.ReactNode> = {
    "Login": <WF_Login />,
    "Profile": <WF_Profile />,
    "C-Home": <WF_CHome />,
    "C-Browse": <WF_CBrowse />,
    "C-Detail": <WF_CDetail />,
    "C-Cart": <WF_CCart />,
    "C-Checkout": <WF_CCheckout />,
    "C-Orders": <WF_COrders />,
    "S-Orders": <WF_SOrders />,
    "S-Inventory": <WF_SInventory />,
    "A-Dashboard": <WF_ADashboard />,
    "A-Books": <WF_ABooks />,
    "A-Users": <WF_AUsers />,
  };

  const roleColor = role === "customer" ? "text-amber-700 bg-amber-50 border-amber-200"
    : role === "staff" ? "text-blue-700 bg-blue-50 border-blue-200"
    : "text-purple-700 bg-purple-50 border-purple-200";

  const currentScreen = SCREENS.find(s => s.id === active);

  // Reset to first screen when role changes
  React.useEffect(() => {
    setActive(allScreens[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <div className="flex h-[calc(100vh-40px)] bg-[#f4f4f2] font-['Courier_New']">
      {/* Sidebar */}
      <div className="w-52 shrink-0 bg-white border-r border-[#ddd] flex flex-col">
        {/* Project info */}
        <div className="px-4 py-3 border-b border-[#eee]">
          <p className="text-[11px] font-bold text-[#333] leading-tight">ระบบจำหน่ายหนังสือออนไลน์</p>
          <p className="text-[9px] text-[#999] mt-0.5">CSI204 · กลุ่ม 3 · Lo-Fi Wireframe</p>
        </div>
        {/* Screen count */}
        <div className="px-4 py-2 border-b border-[#eee] flex gap-2 items-center">
          <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${roleColor}`}>{role.toUpperCase()}</span>
          <span className="text-[9px] text-[#aaa]">{allScreens.length} screens</span>
        </div>
        {/* Screen list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {allScreens.map((s, i) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`w-full text-left px-3 py-2 rounded text-[11px] transition-colors flex items-center gap-2 ${active === s.id ? "bg-[#333] text-white" : "text-[#555] hover:bg-[#eee]"}`}>
              <span className={`text-[9px] w-4 shrink-0 font-bold ${active === s.id ? "text-white/60" : "text-[#bbb]"}`}>{String(i+1).padStart(2,"0")}</span>
              {s.label}
            </button>
          ))}
        </div>
        {/* Legend */}
        <div className="px-3 py-3 border-t border-[#eee] space-y-1.5">
          <p className="text-[9px] text-[#aaa] uppercase tracking-widest">Legend</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-[#e8e8e8] border border-[#bbb] rounded" />
            <span className="text-[9px] text-[#999]">Content block</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-[#d4d4d4] border border-[#bbb] rounded relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full"><line x1="0" y1="0" x2="100%" y2="100%" stroke="#888" strokeWidth="1"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#888" strokeWidth="1"/></svg>
            </div>
            <span className="text-[9px] text-[#999]">Image area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 border-2 border-dashed border-[#bbb] rounded" />
            <span className="text-[9px] text-[#999]">Section group</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-[#555] rounded" />
            <span className="text-[9px] text-[#999]">Primary button</span>
          </div>
        </div>
      </div>

      {/* Main canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Canvas header */}
        <div className="bg-white border-b border-[#ddd] px-4 py-2 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#aaa]">Screen</span>
            <span className="text-[12px] font-bold text-[#333]">{currentScreen?.label}</span>
          </div>
          <span className="text-[#ddd]">|</span>
          <div className="flex items-center gap-1">
            {allScreens.map((s,i) => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`w-5 h-5 rounded text-[9px] font-bold transition-colors ${active === s.id ? "bg-[#333] text-white" : "bg-[#eee] text-[#999] hover:bg-[#ddd]"}`}>
                {i+1}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-[10px] text-[#aaa]">
            <span>กิตติวัฒน์ · QA</span>
            <span>·</span>
            <span>ศุภวิชญ์ · Backend</span>
            <span>·</span>
            <span>ศิระเดช · UI/UX</span>
          </div>
        </div>
        {/* Scrollable canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {screenMap[active]}
          </div>
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<Role>("customer");
  const [cPage, setCPage] = useState<CPage>("home");
  const [sPage, setSPage] = useState<SPage>("orders");
  const [aPage, setAPage] = useState<APage>("dashboard");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [showGuestMode, setShowGuestMode] = useState(false);
  const [gPage, setGPage] = useState<GPage>("home");
  const [gSelectedBook, setGSelectedBook] = useState<Book | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleLogin = (u: UserAccount) => {
    setCurrentUser(u);
    setLoggedIn(true);
    setShowGuestMode(false);
    setRole(u.role);
    setCPage("home");
    setSPage("orders");
    setAPage("dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
    setCPage("home");
    setShowGuestMode(false);
  };

  const enterGuestMode = () => { setShowGuestMode(true); setGPage("home"); };
  const exitGuestMode = () => { setShowGuestMode(false); setShowLoginPrompt(false); };

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) return prev.map((i) => i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { book, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const roles: { id: Role; label: string; color: string }[] = [
    { id: "customer", label: "Customer", color: "bg-amber-600" },
    { id: "staff", label: "Staff", color: "bg-blue-700" },
    { id: "admin", label: "Admin", color: "bg-purple-700" },
  ];

  return (
    <div className={`min-h-screen ${wireframe ? "bg-white" : "bg-background"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Prototype top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-sm h-10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 font-['DM_Mono'] uppercase tracking-widest">Booka Prototype</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-white/40 font-['DM_Mono']">CSI204 · กลุ่ม 3</span>
          {loggedIn && currentUser && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/50 font-['DM_Mono']">logged in as {currentUser.email}</span>
              <button onClick={handleLogout} className="text-xs text-white/30 hover:text-white/60 font-['DM_Mono'] transition-colors">[logout]</button>
            </>
          )}
          {!loggedIn && showGuestMode && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-xs text-amber-400/70 font-['DM_Mono']">guest mode</span>
              <button onClick={exitGuestMode} className="text-xs text-white/30 hover:text-white/60 font-['DM_Mono'] transition-colors">[ออก]</button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setWireframe(w => !w)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-['Courier_New'] transition-all ${wireframe ? "bg-white text-gray-800 border-white font-bold" : "text-white/50 border-white/20 hover:border-white/50 hover:text-white/80"}`}>
            {wireframe ? "▣ Wireframe" : "▢ Wireframe"}
          </button>
          <span className="text-white/20">|</span>
          {!loggedIn && !showGuestMode ? (
            <span className="text-xs text-white/40 font-['DM_Mono']">กรุณาเข้าสู่ระบบ ↓</span>
          ) : !loggedIn && showGuestMode ? (
            <span className="text-xs text-white/40 font-['DM_Mono']">เข้าชมในฐานะ Guest</span>
          ) : (
            <>
              <span className="text-xs text-white/40 mr-1">View as:</span>
              {roles.map(({ id, label, color }) => (
                <button key={id} onClick={() => { setRole(id); setCPage("home"); setSPage("orders"); setAPage("dashboard"); }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${role === id ? `${color} text-white` : "text-white/40 hover:text-white/70"}`}>
                  {label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="pt-10">
        {showLoginPrompt && (
          <LoginPromptModal onLogin={exitGuestMode} onClose={() => setShowLoginPrompt(false)} />
        )}
        {wireframe ? (
          <WireframeView role={role} />
        ) : !loggedIn && !showGuestMode ? (
          <LoginPage onLogin={handleLogin} onGuestMode={enterGuestMode} />
        ) : !loggedIn && showGuestMode ? (
          <>
            <GuestNavBar page={gPage} setPage={setGPage} onLoginClick={exitGuestMode} />
            {gPage === "home" && <GuestHomePage setPage={setGPage} setSelectedBook={setGSelectedBook} onCartAttempt={() => setShowLoginPrompt(true)} />}
            {gPage === "browse" && <GuestBrowsePage setPage={setGPage} setSelectedBook={setGSelectedBook} onCartAttempt={() => setShowLoginPrompt(true)} />}
            {gPage === "detail" && gSelectedBook && <GuestBookDetailPage book={gSelectedBook} setPage={setGPage} onCartAttempt={() => setShowLoginPrompt(true)} />}
          </>
        ) : (
          <>
            {role === "customer" && (
              <>
                <CustomerNav page={cPage} setPage={setCPage} cartCount={cartCount} user={currentUser} />
                {cPage === "home" && <HomePage setPage={setCPage} setSelectedBook={setSelectedBook} addToCart={addToCart} />}
                {cPage === "browse" && <BrowsePage setPage={setCPage} setSelectedBook={setSelectedBook} addToCart={addToCart} />}
                {cPage === "detail" && selectedBook && <BookDetailPage book={selectedBook} setPage={setCPage} addToCart={addToCart} />}
                {cPage === "cart" && <CartPage cart={cart} setCart={setCart} setPage={setCPage} />}
                {cPage === "checkout" && <CheckoutPage cart={cart} setCart={setCart} setPage={setCPage} />}
                {cPage === "orders" && <CustomerOrdersPage />}
                {cPage === "profile" && currentUser && (
                  <ProfilePage user={currentUser} onBack={() => setCPage("home")} onLogout={handleLogout} />
                )}
              </>
            )}
            {role === "staff" && (
              <>
                <StaffNav page={sPage} setPage={setSPage} />
                {sPage === "orders" && <StaffOrdersPage />}
                {sPage === "inventory" && <InventoryPage />}
              </>
            )}
            {role === "admin" && (
              <AdminLayout page={aPage} setPage={setAPage}>
                {aPage === "dashboard" && <AdminDashboard />}
                {aPage === "books" && <AdminBooksPage />}
                {aPage === "users" && <AdminUsersPage />}
              </AdminLayout>
            )}
          </>
        )}
      </div>
    </div>
  );
}
