"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/ui";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Could not create category — slug may already exist.");
      setSaving(false);
      return;
    }
    setForm({ name: "", slug: "", description: "", image: "" });
    setSaving(false);
    load();
  }

  const input = "w-full border border-line-light px-4 py-2.5 text-sm outline-none focus:border-ink";
  const label = "text-[11px] tracking-widest2 uppercase text-silver-dark mb-1.5 block";

  return (
    <div>
      <AdminPageHeader title="Categories" />
      <div className="p-8 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 border border-line-light divide-y divide-line-light">
          {categories.map((c) => (
            <div key={c.id} className="px-4 py-3 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-silver-dark">/shop?category={c.slug}</p>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="px-4 py-6 text-sm text-silver-dark">No categories yet.</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[11px] tracking-widest2 uppercase text-silver-dark">New Category</p>
          <div>
            <label className={label}>Name</label>
            <input required className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={label}>Slug</label>
            <input required className={input} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea rows={2} className={input} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className={label}>Image URL</label>
            <input className={input} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper px-6 py-2.5 text-[12px] tracking-widest2 uppercase disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
