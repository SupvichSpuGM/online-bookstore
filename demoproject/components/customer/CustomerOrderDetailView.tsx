"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Receipt, Edit3, Upload, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BookImg } from "@/components/ui/BookImg";

interface OrderDetail {
  id: string;
  customer: string;
  customer_email: string;
  date: string;
  total: number;
  status: string;
  address: string;
  slip_image_url: string | null;
  tracking_number: string | null;
  items: Array<{
    id: number;
    book_id: number;
    title: string;
    author: string;
    quantity: number;
    price_per_unit: number;
    cover_image_url: string | null;
  }>;
}

export function CustomerOrderDetailView({ initialOrder }: { initialOrder: OrderDetail }) {
  const [order, setOrder] = useState<OrderDetail>(initialOrder);

  // States สำหรับแก้ไขที่อยู่
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressText, setAddressText] = useState(initialOrder.address);
  const [savingAddress, setSavingAddress] = useState(false);

  // States สำหรับแนบสลิป
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string>(initialOrder.slip_image_url || "");
  const [uploadingSlip, setUploadingSlip] = useState(false);

  // States สำหรับยกเลิกออเดอร์
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isEditable = ["pending", "payment_review"].includes(order.status);

  // ── 1. บันทึกการแก้ไขที่อยู่ ──────────────────────────────
  const handleSaveAddress = async () => {
    if (!addressText.trim()) return;
    setSavingAddress(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addressText }),
      });
      if (res.ok) {
        setOrder((prev) => ({ ...prev, address: addressText }));
        setIsEditingAddress(false);
        setMessage({ type: "success", text: "อัปเดตที่อยู่จัดส่งเรียบร้อยแล้ว" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "ไม่สามารถแก้ไขที่อยู่ได้" });
      }
    } catch {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setSavingAddress(false);
    }
  };

  // ── 2. แนบ / อัปเดตสลิปการโอนเงิน ─────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSlipPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSlip = async () => {
    if (!slipPreview) return;
    setUploadingSlip(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slip_image_url: slipPreview,
          status: "payment_review",
        }),
      });
      if (res.ok) {
        setOrder((prev) => ({
          ...prev,
          slip_image_url: slipPreview,
          status: "payment_review",
        }));
        setSlipFile(null);
        setMessage({ type: "success", text: "ส่งหลักฐานการโอนเงินเรียบร้อยแล้ว ระบบกำลังตรวจสอบ" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "ไม่สามารถอัปโหลดสลิปได้" });
      }
    } catch {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setUploadingSlip(false);
    }
  };

  // ── 3. ยกเลิกคำสั่งซื้อ ────────────────────────────────────
  const handleCancelOrder = async () => {
    setCancelling(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setOrder((prev) => ({ ...prev, status: "cancelled" }));
        setShowCancelModal(false);
        setMessage({ type: "success", text: "ยกเลิกคำสั่งซื้อและคืนสต็อกสินค้าเรียบร้อยแล้ว" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "ไม่สามารถยกเลิกคำสั่งซื้อได้" });
      }
    } catch {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับหน้ารายการสั่งซื้อ
      </Link>

      {/* Message alert */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-center justify-between border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-600' : 'bg-red-500/10 border-red-500/30 text-red-600'}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-card border border-border p-6 rounded-2xl">
        <div>
          <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-1">
            คำสั่งซื้อ <span className="font-['DM_Mono'] text-primary">#{order.id}</span>
          </h1>
          <p className="text-sm text-muted-foreground">ทำรายการเมื่อ {order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {isEditable && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              ยกเลิกคำสั่งซื้อ
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* ข้อมูลจัดส่ง & ที่อยู่ */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <MapPin className="w-5 h-5 text-primary" /> ที่อยู่จัดส่ง
            </div>
            {isEditable && !isEditingAddress && (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3 h-3" /> แก้ไขที่อยู่
              </button>
            )}
          </div>

          {isEditingAddress ? (
            <div className="space-y-3">
              <textarea
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                rows={3}
                className="w-full text-sm p-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none resize-none"
                placeholder="ป้อนที่อยู่จัดส่งใหม่..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAddress}
                  disabled={savingAddress}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-accent transition-colors"
                >
                  {savingAddress ? "กำลังบันทึก..." : "บันทึกที่อยู่"}
                </button>
                <button
                  onClick={() => { setIsEditingAddress(false); setAddressText(order.address); }}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-secondary transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="block text-foreground font-medium mb-1">{order.customer}</span>
              {order.address}
            </p>
          )}

          {order.tracking_number && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">เลขพัสดุสำหรับติดตาม</p>
              <p className="text-sm font-['DM_Mono'] font-bold text-blue-600 mt-0.5">{order.tracking_number}</p>
            </div>
          )}
        </div>

        {/* สลิปชำระเงิน */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Receipt className="w-5 h-5 text-primary" /> หลักฐานการโอนเงิน (สลิป)
          </div>

          {order.slip_image_url ? (
            <div className="space-y-3">
              <div className="bg-secondary rounded-lg border border-border overflow-hidden p-2 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.slip_image_url}
                  alt="สลิปการโอนเงิน"
                  className="w-full max-h-48 object-contain mx-auto rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x800/1e293b/818cf8?text=SLIP+ATTACHED";
                  }}
                />
              </div>

              {isEditable && (
                <label className="block text-center cursor-pointer">
                  <span className="text-xs text-primary hover:underline font-medium">📷 เปลี่ยนรูปสลิปใหม่</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          ) : (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs text-muted-foreground">คุณยังไม่ได้แนบหลักฐานการชำระเงิน</p>
              {isEditable && (
                <label className="inline-block px-4 py-2 border-2 border-dashed border-primary/40 hover:border-primary rounded-xl cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all text-xs font-medium text-primary">
                  <Upload className="w-4 h-4 mx-auto mb-1" />
                  เลือกรูปสลิปเพื่อแนบ
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          )}

          {slipFile && (
            <button
              onClick={handleUploadSlip}
              disabled={uploadingSlip}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
            >
              {uploadingSlip ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {uploadingSlip ? "กำลังอัปโหลด..." : "ยืนยันส่งสลิปนี้"}
            </button>
          )}
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="mt-6 bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Package className="w-5 h-5 text-primary" /> รายการสินค้า ({order.items.length})
          </div>
          <span className="text-sm font-semibold font-['DM_Mono'] text-accent">ยอดสุทธิ ฿{order.total.toLocaleString()}</span>
        </div>

        <div className="space-y-3 divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-4">
              <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                <BookImg cover_image_url={item.cover_image_url} alt={item.title} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.author}</p>
                <p className="text-xs font-['DM_Mono'] text-muted-foreground mt-0.5">฿{item.price_per_unit.toLocaleString()} × {item.quantity}</p>
              </div>
              <div className="text-right font-['DM_Mono'] font-semibold text-sm">
                ฿{(item.price_per_unit * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal ยืนยันการยกเลิกคำสั่งซื้อ */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยกเลิกคำสั่งซื้อ?</h3>
            <p className="text-xs text-muted-foreground mb-6">คุณต้องการยกเลิกคำสั่งซื้อ #{order.id} ใช่หรือไม่? สินค้าจะถูกคืนเข้าสต็อกโดยอัตโนมัติ</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
              >
                {cancelling ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
