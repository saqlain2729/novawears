"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatMoneyClient } from "@/lib/format";

const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory"];

interface OrderResult {
  orderNumber: string;
  total: number;
  subtotal: number;
  shippingFee: number;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  useEffect(() => {
    if (items.length === 0 && !result) router.replace("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, result]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, color: i.color })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setResult(data);
      clearCart();
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-3">Order Confirmed</p>
        <h1 className="font-display text-3xl tracking-tight mb-4">Thank you.</h1>
        <p className="text-silver-dark text-sm mb-1">Your order number is</p>
        <p className="font-mono text-xl mb-6">#{result.orderNumber}</p>
        <p className="text-sm text-silver-dark mb-8">
          Total: {formatMoneyClient(result.total)} · Cash on Delivery. We&apos;ll contact you shortly to confirm delivery.
        </p>
        <Link href="/shop" className="inline-block bg-ink text-paper px-8 py-3.5 text-[12px] tracking-widest2 uppercase">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) return null;

  const input = "w-full border border-line-light px-4 py-3 text-sm outline-none focus:border-ink transition-colors bg-paper";
  const label = "text-[11px] tracking-widest2 uppercase text-silver-dark mb-2 block";

  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-14">
      <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-10">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-12">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          <div>
            <label className={label}>Full Name</label>
            <input required className={input} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={label}>Phone Number</label>
              <input required className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className={label}>Email (optional)</label>
              <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={label}>Complete Address</label>
            <input required className={input} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={label}>City</label>
              <input required className={input} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className={label}>Province</label>
              <select required className={input} value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
                <option value="">Select</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Postal Code</label>
              <input className={input} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={label}>Order Notes (optional)</label>
            <textarea rows={3} className={input} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="border border-line-light p-4 flex items-center gap-3">
            <div className="w-4 h-4 border border-ink flex items-center justify-center">
              <div className="w-2 h-2 bg-ink" />
            </div>
            <span className="text-sm">Cash on Delivery</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper py-4 text-[13px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </form>

        <div>
          <div className="border border-line-light p-6 space-y-4">
            <p className="text-[11px] tracking-widest2 uppercase text-silver-dark">Order Summary</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}`} className="flex justify-between text-sm">
                  <span className="text-silver-dark truncate pr-2">
                    {item.name.replace(/^DEMO — /, "")} × {item.quantity}
                  </span>
                  <span>{formatMoneyClient(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-line-light pt-4 flex justify-between text-sm">
              <span className="text-silver-dark">Subtotal</span>
              <span className="font-medium">{formatMoneyClient(subtotal)}</span>
            </div>
            <p className="text-xs text-silver-dark">Shipping fee is calculated on the server and shown on your confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
