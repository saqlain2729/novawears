"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui";
import { formatMoneyClient } from "@/lib/format";
import { Order } from "@/types";

const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [status, q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  return (
    <div>
      <AdminPageHeader title="Orders" />
      <div className="p-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            placeholder="Search by order ID, name, or phone"
            className="flex-1 border border-line-light px-4 py-2.5 text-sm outline-none focus:border-ink"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-2 text-[11px] tracking-widest2 uppercase border ${
                  status === s ? "bg-ink text-paper border-ink" : "border-line-light text-silver-dark"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-silver-dark">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-silver-dark">No orders found.</p>
        ) : (
          <div className="border border-line-light divide-y divide-line-light">
            {orders.map((o) => (
              <div key={o.id}>
                <button
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-left hover:bg-paper-dim transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm">#{o.orderNumber}</span>
                    <span className="text-sm">{o.customerName}</span>
                    <span className="text-xs text-silver-dark">{o.phone}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatMoneyClient(o.total)}</span>
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-xs border border-line-light px-2 py-1.5 capitalize"
                    >
                      {STATUSES.filter((s) => s !== "all").map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </button>
                {expanded === o.id && (
                  <div className="px-4 pb-4 text-sm space-y-2 bg-paper-dim">
                    <p className="text-silver-dark">{o.address}, {o.city}, {o.province} {o.postalCode}</p>
                    {o.email && <p className="text-silver-dark">{o.email}</p>}
                    {o.notes && <p className="text-silver-dark italic">Note: {o.notes}</p>}
                    <div className="pt-2 space-y-1">
                      {o.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.productName}{item.color ? ` (${item.color})` : ""} × {item.quantity}</span>
                          <span>{formatMoneyClient(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-2 border-t border-line-light font-medium">
                      <span>Total (incl. {formatMoneyClient(o.shippingFee)} shipping)</span>
                      <span>{formatMoneyClient(o.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
