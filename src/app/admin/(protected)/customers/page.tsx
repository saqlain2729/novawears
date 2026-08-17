"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/ui";
import { formatMoneyClient } from "@/lib/format";

interface CustomerRow {
  name: string;
  phone: string;
  email: string | null;
  orderCount: number;
  totalSpent: number;
  latestOrder: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers").then((r) => r.json()).then((d) => {
      setCustomers(d.customers || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <AdminPageHeader title="Customers" />
      <div className="p-8">
        {loading ? (
          <p className="text-sm text-silver-dark">Loading…</p>
        ) : customers.length === 0 ? (
          <p className="text-sm text-silver-dark">No customers yet.</p>
        ) : (
          <div className="border border-line-light overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-line-light text-left text-[11px] tracking-widest2 uppercase text-silver-dark">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3">Latest Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.phone} className="border-b border-line-light/60">
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3 text-silver-dark">{c.email || "—"}</td>
                    <td className="px-4 py-3">{c.orderCount}</td>
                    <td className="px-4 py-3">{formatMoneyClient(c.totalSpent)}</td>
                    <td className="px-4 py-3 text-silver-dark">{c.latestOrder?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
