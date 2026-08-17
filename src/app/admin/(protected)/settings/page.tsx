"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/ui";
import { StoreSettings } from "@/types";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setForm(d.settings));
  }, []);

  if (!form) return <div className="p-8 text-sm text-silver-dark">Loading…</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const input = "w-full border border-line-light px-4 py-2.5 text-sm outline-none focus:border-ink";
  const label = "text-[11px] tracking-widest2 uppercase text-silver-dark mb-1.5 block";

  return (
    <div>
      <AdminPageHeader title="Settings" />
      <form onSubmit={handleSubmit} className="p-8 max-w-2xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Store Name</label>
            <input className={input} value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
          </div>
          <div>
            <label className={label}>Currency</label>
            <input className={input} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Business Email</label>
            <input type="email" className={input} value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} />
          </div>
          <div>
            <label className={label}>WhatsApp Number (intl format, no +)</label>
            <input className={input} value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={label}>Shipping Fee</label>
            <input type="number" className={input} value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Free Shipping Over</label>
            <input type="number" className={input} value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Low Stock Threshold</label>
            <input type="number" className={input} value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: parseInt(e.target.value) })} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.codAvailable} onChange={(e) => setForm({ ...form, codAvailable: e.target.checked })} />
          Cash on Delivery available
        </label>

        <div>
          <label className={label}>Delivery Estimate</label>
          <input className={input} value={form.deliveryEstimate} onChange={(e) => setForm({ ...form, deliveryEstimate: e.target.value })} />
        </div>

        <div>
          <label className={label}>Store Announcement</label>
          <input className={input} value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={label}>Facebook URL</label>
            <input className={input} value={form.facebookUrl || ""} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
          </div>
          <div>
            <label className={label}>Instagram URL</label>
            <input className={input} value={form.instagramUrl || ""} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
          </div>
          <div>
            <label className={label}>TikTok URL</label>
            <input className={input} value={form.tiktokUrl || ""} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper px-6 py-3 text-[12px] tracking-widest2 uppercase disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-green-700">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
