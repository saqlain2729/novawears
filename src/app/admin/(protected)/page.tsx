"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader, StatCard } from "@/components/admin/ui";
import { formatMoneyClient } from "@/lib/format";

interface Overview {
  todaysOrders: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalInventory: number;
  salesByDay: { date: string; orders: number; revenue: number }[];
  currency: string;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="px-8 py-6 text-sm text-silver-dark">Loading…</div>;

  const maxRevenue = Math.max(...data.salesByDay.map((d) => d.revenue), 1);

  return (
    <div>
      <AdminPageHeader title="Overview" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Today's Orders" value={data.todaysOrders} accent />
          <StatCard label="Total Orders" value={data.totalOrders} />
          <StatCard label="Pending Orders" value={data.pendingOrders} />
          <StatCard label="Total Revenue" value={formatMoneyClient(data.totalRevenue, data.currency)} />
          <StatCard label="Products" value={data.totalProducts} />
          <StatCard label="Low Stock" value={data.lowStock} />
          <StatCard label="Out of Stock" value={data.outOfStock} />
          <StatCard label="Total Inventory" value={data.totalInventory} />
        </div>

        <div className="border border-line-light p-6">
          <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-6">Orders — Last 7 Days</p>
          <div className="flex items-end gap-3 h-40">
            {data.salesByDay.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-ink transition-all"
                  style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, d.orders > 0 ? 6 : 2)}%` }}
                  title={`${d.orders} orders · ${formatMoneyClient(d.revenue, data.currency)}`}
                />
                <span className="text-[10px] text-silver-dark">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
