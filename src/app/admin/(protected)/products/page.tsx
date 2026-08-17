"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui";
import { formatMoneyClient } from "@/lib/format";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleStatus(p: Product) {
    const next = p.status === "published" ? "hidden" : "published";
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        action={
          <Link href="/admin/products/new" className="bg-ink text-paper px-5 py-2.5 text-[12px] tracking-widest2 uppercase">
            Add Product
          </Link>
        }
      />
      <div className="p-8">
        {loading ? (
          <p className="text-sm text-silver-dark">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-silver-dark">No products yet.</p>
        ) : (
          <div className="border border-line-light overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-line-light text-left text-[11px] tracking-widest2 uppercase text-silver-dark">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-line-light/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.name}
                        {p.isDemo && <span className="text-[9px] bg-signal/20 text-signal px-1.5 py-0.5">DEMO</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3">{formatMoneyClient(p.salePrice ?? p.price)}</td>
                    <td className="px-4 py-3">
                      {p.stock === 0 ? <span className="text-red-600">0</span> : p.stock <= p.lowStockThreshold ? <span className="text-signal">{p.stock}</span> : p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(p)} className="text-xs underline capitalize">
                        {p.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <Link href={`/admin/products/${p.id}`} className="text-xs underline">Edit</Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-xs underline text-red-600">Delete</button>
                    </td>
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
