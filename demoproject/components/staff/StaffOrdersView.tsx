"use client";

import { useState } from "react";
import { Bell, Eye, X, Edit3, Save, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { statusCfg } from "@/lib/data";

const FILTERS = [["all","ทั้งหมด"],["pending","รอชำระ"],["payment_review","ตรวจสลิป"],["confirmed","ยืนยัน"],["shipping","จัดส่ง"],["delivered","สำเร็จ"]];
const NEXT_STATUS: Record<string, string> = { pending:"payment_review", payment_review:"confirmed", confirmed:"shipping", shipping:"delivered" };
const ALL_STATUSES = [
  ["pending", "รอชำระเงิน"],
  ["payment_review", "ตรวจสอบหลักฐาน"],
  ["confirmed", "ยืนยันแล้ว"],
  ["shipping", "กำลังจัดส่ง"],
  ["delivered", "จัดส่งสำเร็จ"],
  ["cancelled", "ยกเลิก"],
];

interface RawStaffOrder {
  id: number | string;
  customer?: string;
  customer_name?: string;
  date?: string;
  order_date?: string;
  total?: number;
  total_amount?: number;
  status: string;
  items?: number;
  address?: string;
  [key: string]: unknown;
}

interface ProcessedStaffOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
  address: string;
}

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
  orderItems: Array<{ title: string; author: string; quantity: number; price_per_unit: number }>;
}

export function StaffOrdersView({ initialOrders }: { initialOrders: RawStaffOrder[] }) {
  const [orders, setOrders] = useState<ProcessedStaffOrder[]>(
    initialOrders.map((o) => ({
      id: String(o.id),
      customer: o.customer ?? o.customer_name ?? "ลูกค้า",
      date: o.date ?? o.order_date ?? "",
      total: o.total ?? o.total_amount ?? 0,
      status: o.status,
      items: o.items ?? 1,
      address: o.address ?? "ที่อยู่จัดส่ง",
    }))
  );
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'advance' | 'cancel', id: string, title: string, message: string } | null>(null);

  // ── States สำหรับโหมดแก้ไขรายละเอียดออเดอร์ ───────────
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    tracking_number: "",
    address: "",
    total: 0,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // ── ดึง Order detail จาก API ───────────────────────────────
  const openDetail = async (o: ProcessedStaffOrder) => {
    setDetailLoading(true);
    setIsEditing(false);
    try {
      const res = await fetch(`/api/orders/${o.id}`);
      if (res.ok) {
        const data = await res.json();
        const ord = data.order;
        const detail: OrderDetail = {
          id: String(ord.id),
          customer: ord.customer_name ?? o.customer,
          customer_email: ord.customer_email ?? "",
          date: ord.order_date ?? o.date,
          total: Number(ord.total_amount ?? o.total),
          status: ord.status,
          address: o.address,
          slip_image_url: ord.slip_image_url ?? null,
          tracking_number: ord.tracking_number ?? null,
          orderItems: (data.items ?? []).map((i: { title: string; author: string; quantity: number; price_per_unit: number }) => ({
            title: i.title,
            author: i.author,
            quantity: i.quantity,
            price_per_unit: Number(i.price_per_unit),
          })),
        };
        setSelected(detail);
      } else {
        setSelected({
          id: o.id, customer: o.customer, customer_email: "",
          date: o.date, total: o.total, status: o.status,
          address: o.address, slip_image_url: null,
          tracking_number: null, orderItems: [],
        });
      }
    } catch {
      setSelected({
        id: o.id, customer: o.customer, customer_email: "",
        date: o.date, total: o.total, status: o.status,
        address: o.address, slip_image_url: null,
        tracking_number: null, orderItems: [],
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const startEdit = () => {
    if (!selected) return;
    setEditForm({
      status: selected.status,
      tracking_number: selected.tracking_number ?? "",
      address: selected.address,
      total: selected.total,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!selected) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/orders/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editForm.status,
          tracking_number: editForm.tracking_number || null,
          address: editForm.address,
          total_amount: Number(editForm.total),
        }),
      });

      if (res.ok) {
        setSelected({
          ...selected,
          status: editForm.status,
          tracking_number: editForm.tracking_number || null,
          address: editForm.address,
          total: Number(editForm.total),
        });

        setOrders(orders.map(o => o.id === selected.id ? {
          ...o,
          status: editForm.status,
          address: editForm.address,
          total: Number(editForm.total),
        } : o));

        setIsEditing(false);
      }
    } catch (err) {
      console.error("Save order error", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const advance = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order || !NEXT_STATUS[order.status]) return;
    const nextStatus = NEXT_STATUS[order.status];
    const nextStatusLabel = statusCfg[nextStatus]?.label || nextStatus;
    setConfirmAction({
      type: 'advance',
      id,
      title: 'อัปเดตสถานะคำสั่งซื้อ',
      message: `คุณต้องการปรับสถานะคำสั่งซื้อ #${id} เป็น "${nextStatusLabel}" ใช่หรือไม่?`
    });
  };

  const cancel = (id: string) => {
    setConfirmAction({
      type: 'cancel',
      id,
      title: 'ยกเลิกคำสั่งซื้อ',
      message: `คุณต้องการยกเลิกคำสั่งซื้อ #${id} ใช่หรือไม่?\n\nระบบจะคืนสต็อกสินค้าทุกรายการในออเดอร์นี้โดยอัตโนมัติ`
    });
  };

  const doConfirm = async () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const newStatus = type === 'advance' ? NEXT_STATUS[order.status] : "cancelled";
    if (!newStatus) return;

    if (!isNaN(Number(id))) {
      try {
        await fetch(`/api/orders/${id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            tracking_number: newStatus === "shipping" ? "TH12345678" : undefined,
          }),
        });
      } catch (err) {
        console.error("Failed to update order status", err);
      }
    }

    setOrders(orders.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    setConfirmAction(null);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: newStatus } : null);
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
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === v ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["เลขคำสั่งซื้อ","ลูกค้า","วันที่","รายการ","ยอดรวม","สถานะ","จัดการ"].map((h) => (
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
                <td className="px-4 py-3 font-['DM_Mono'] font-semibold">฿{o.total.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openDetail(o)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="ดู/แก้ไข รายละเอียด"><Eye className="w-3.5 h-3.5" /></button>
                    {NEXT_STATUS[o.status] && (
                      <button onClick={() => advance(o.id)} className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-accent transition-colors">
                        {o.status === "payment_review" ? "อนุมัติ" : "ถัดไป"}
                      </button>
                    )}
                    {!["delivered","cancelled"].includes(o.status) && (
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

      {(selected || detailLoading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setSelected(null); setIsEditing(false); }}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">กำลังโหลด...</div>
            ) : selected && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-['Playfair_Display'] text-lg font-semibold flex items-center gap-2">
                    รายละเอียดคำสั่งซื้อ #{selected.id}
                    {isEditing && <span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded font-sans">โหมดแก้ไข</span>}
                  </h3>
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-muted text-xs font-medium rounded-lg transition-colors border border-border">
                        <Edit3 className="w-3.5 h-3.5" /> แก้ไขข้อมูล
                      </button>
                    )}
                    <button onClick={() => { setSelected(null); setIsEditing(false); }} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">สถานะคำสั่งซื้อ</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
                      >
                        {ALL_STATUSES.map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl} ({val})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">เลขติดตามพัสดุ (Tracking Number)</label>
                      <input
                        type="text"
                        value={editForm.tracking_number}
                        onChange={(e) => setEditForm(f => ({ ...f, tracking_number: e.target.value }))}
                        placeholder="เช่น TH12345678"
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-['DM_Mono'] focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">ยอดรวมสินค้า (บาท)</label>
                      <input
                        type="number"
                        value={editForm.total}
                        onChange={(e) => setEditForm(f => ({ ...f, total: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-['DM_Mono'] focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block font-medium">ที่อยู่จัดส่ง</label>
                      <textarea
                        rows={3}
                        value={editForm.address}
                        onChange={(e) => setEditForm(f => ({ ...f, address: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm resize-none focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border">
                      <button
                        onClick={saveEdit}
                        disabled={savingEdit}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" /> {savingEdit ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" /> ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm">
                    <div className="bg-secondary rounded-lg p-3 space-y-2">
                      {[["ลูกค้า", selected.customer], ["อีเมล", selected.customer_email || "—"], ["วันที่สั่ง", selected.date], ["ยอดรวม", `฿${selected.total.toLocaleString()}`]].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-medium font-['DM_Mono'] text-xs">{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">สถานะ</span>
                        <StatusBadge status={selected.status} />
                      </div>
                      {selected.tracking_number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">เลข Tracking</span>
                          <span className="font-['DM_Mono'] text-xs text-blue-500 font-semibold">{selected.tracking_number}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ที่อยู่จัดส่ง</p>
                      <p className="text-sm bg-secondary/50 p-2.5 rounded-lg border border-border">{selected.address}</p>
                    </div>

                    {selected.orderItems.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">รายการสินค้า ({selected.orderItems.length})</p>
                        <div className="space-y-1.5">
                          {selected.orderItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-secondary rounded-lg px-3 py-2">
                              <div>
                                <p className="text-xs font-medium">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.author}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-['DM_Mono']">x{item.quantity}</p>
                                <p className="text-xs font-['DM_Mono'] font-semibold">฿{(item.price_per_unit * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted-foreground mb-2 font-medium">หลักฐานการชำระเงิน (สลิป)</p>
                      {selected.slip_image_url ? (
                        <div className="space-y-2">
                          <div className="bg-secondary rounded-lg border border-border overflow-hidden p-2 text-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selected.slip_image_url}
                              alt="สลิปการโอนเงิน"
                              className="w-full max-h-64 object-contain mx-auto rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://placehold.co/600x800/1e293b/818cf8?text=SLIP+PAYMENT+VERIFIED";
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">หลักฐานการโอน</span>
                            <a
                              href={selected.slip_image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              เปิดรูปสลิปขนาดเต็ม ↗
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-secondary rounded-lg text-xs text-muted-foreground text-center">
                          {selected.status === "pending" ? "⏳ ลูกค้ายังไม่ได้แนบสลิป" : "— ไม่มีหลักฐานการชำระเงิน —"}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-5">
                      {NEXT_STATUS[selected.status] && (
                        <button
                          onClick={() => advance(selected.id)}
                          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                          {selected.status === "payment_review" ? "✅ อนุมัติการชำระเงิน" : "อัปเดตสถานะ"}
                        </button>
                      )}
                      {!["delivered","cancelled"].includes(selected.status) && (
                        <button
                          onClick={() => cancel(selected.id)}
                          className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          ❌ ยกเลิกออเดอร์
                        </button>
                      )}
                      <button onClick={() => setSelected(null)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ปิด</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200" onClick={() => setConfirmAction(null)}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <Bell className="w-12 h-12 text-primary mb-4 p-3 bg-primary/10 rounded-full" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">{confirmAction.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 whitespace-pre-line">{confirmAction.message}</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={doConfirm} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${confirmAction.type === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
