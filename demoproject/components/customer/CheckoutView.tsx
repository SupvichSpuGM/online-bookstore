"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Upload, RefreshCw } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";

type Step = 1 | 2 | 3;

export function CheckoutView() {
  const [step, setStep] = useState<Step>(1);
  const [fileName, setFileName] = useState("");
  const [orderId] = useState(`ORD-2568-${Math.floor(1000 + Math.random() * 8999)}`);
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.book.price * i.qty, 0);
  const shipping = subtotal >= 300 ? 0 : 50;
  const total = subtotal + shipping;

  const handleConfirm = () => {
    clearCart();
    setStep(3);
  };

  const steps = [{ n: 1, label: "ที่อยู่" }, { n: 2, label: "ชำระเงิน" }, { n: 3, label: "สำเร็จ" }];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map(({ n, label }, i) => (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= n ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{n}</div>
              <span className="text-xs mt-1 text-muted-foreground">{label}</span>
            </div>
            {i < 2 && <div className={`w-16 h-px mx-2 mb-5 transition-all ${step > n ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
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
          </div>
          <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors">
            ถัดไป: ชำระเงิน →
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
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

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2">สั่งซื้อสำเร็จ!</h2>
          <p className="text-muted-foreground text-sm mb-1">หมายเลขคำสั่งซื้อของคุณ</p>
          <p className="font-['DM_Mono'] text-lg font-bold text-accent mb-4">{orderId}</p>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            ทีมงานจะตรวจสอบหลักฐานการชำระเงินภายใน 1-2 ชั่วโมง<br />
            และจัดส่งสินค้าภายใน 1-3 วันทำการ
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={() => router.push("/orders")} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors">
              ติดตามคำสั่งซื้อ
            </button>
            <button onClick={() => router.push("/")} className="w-full py-3 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
