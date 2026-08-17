"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/types";

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string;
  categoryId: string;
  sku: string;
  stock: string;
  lowStockThreshold: string;
  images: string;
  features: string;
  colors: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  status: "draft" | "published" | "hidden";
}

function toForm(p?: Product): FormState {
  return {
    name: p?.name || "",
    slug: p?.slug || "",
    description: p?.description || "",
    price: p ? String(p.price) : "",
    salePrice: p?.salePrice != null ? String(p.salePrice) : "",
    categoryId: p?.categoryId || "",
    sku: p?.sku || "",
    stock: p ? String(p.stock) : "0",
    lowStockThreshold: p ? String(p.lowStockThreshold) : "5",
    images: p?.images?.join("\n") || "",
    features: p?.features?.join("\n") || "",
    colors: p?.colors?.join(", ") || "",
    isFeatured: p?.isFeatured || false,
    isNewArrival: p?.isNewArrival || false,
    isBestSeller: p?.isBestSeller || false,
    status: p?.status || "published",
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(toForm(product));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file.`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5 MB.`);
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Could not upload ${file.name}`);
        }

        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length) {
        setForm((current) => ({
          ...current,
          images: current.images
            ? `${current.images}\n${uploadedUrls.join("\n")}`
            : uploadedUrls.join("\n"),
        }));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(urlToRemove: string) {
    setForm((current) => ({
      ...current,
      images: current.images
        .split("\n")
        .filter((url) => url.trim() && url.trim() !== urlToRemove)
        .join("\n"),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price),
      salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      categoryId: form.categoryId,
      sku: form.sku,
      stock: parseInt(form.stock, 10),
      lowStockThreshold: parseInt(form.lowStockThreshold, 10),
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      specifications: product?.specifications || [],
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      status: form.status,
    };

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";

    const method = product ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not save product.");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const input =
    "w-full border border-line-light px-4 py-2.5 text-sm outline-none focus:border-ink transition-colors";

  const label =
    "text-[11px] tracking-widest2 uppercase text-silver-dark mb-1.5 block";

  const imageUrls = form.images
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-6 p-8"
    >
      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 p-3">
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label}>Product Name</label>
          <input
            required
            className={input}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        <div>
          <label className={label}>Slug (URL)</label>
          <input
            required
            className={input}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea
          required
          rows={4}
          className={input}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={label}>Price</label>
          <input
            required
            type="number"
            step="0.01"
            className={input}
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>

        <div>
          <label className={label}>Sale Price</label>
          <input
            type="number"
            step="0.01"
            className={input}
            value={form.salePrice}
            onChange={(e) => set("salePrice", e.target.value)}
          />
        </div>

        <div>
          <label className={label}>SKU</label>
          <input
            required
            className={input}
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={label}>Category</label>

          <select
            required
            className={input}
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            <option value="">Select</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Stock</label>

          <input
            required
            type="number"
            className={input}
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
          />
        </div>

        <div>
          <label className={label}>Low Stock Threshold</label>

          <input
            required
            type="number"
            className={input}
            value={form.lowStockThreshold}
            onChange={(e) =>
              set("lowStockThreshold", e.target.value)
            }
          />
        </div>
      </div>

      {/* IMAGE UPLOAD */}

      <div>
        <label className={label}>Product Images</label>

        <div className="border border-dashed border-line-light p-6 text-center">
          <input
            id="product-images"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <label
            htmlFor="product-images"
            className="inline-flex cursor-pointer items-center justify-center bg-ink text-paper px-6 py-3 text-[12px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </label>

          <p className="text-xs text-silver-dark mt-3">
            JPG, PNG, WEBP or GIF • Maximum 5 MB per image
          </p>
        </div>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
            {imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative border border-line-light bg-white"
              >
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-36 object-contain"
                />

                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-ink text-paper text-[10px] px-2 py-1 uppercase tracking-wider">
                    Main Image
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 text-sm"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          rows={3}
          className={`${input} mt-4`}
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          placeholder="Or paste image URLs here, one URL per line..."
        />
      </div>

      <div>
        <label className={label}>Features (one per line)</label>

        <textarea
          rows={3}
          className={input}
          value={form.features}
          onChange={(e) => set("features", e.target.value)}
        />
      </div>

      <div>
        <label className={label}>Colors (comma separated)</label>

        <input
          className={input}
          value={form.colors}
          onChange={(e) => set("colors", e.target.value)}
          placeholder="Black, White"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) =>
              set("isFeatured", e.target.checked)
            }
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isNewArrival}
            onChange={(e) =>
              set("isNewArrival", e.target.checked)
            }
          />
          New Arrival
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isBestSeller}
            onChange={(e) =>
              set("isBestSeller", e.target.checked)
            }
          />
          Best Seller
        </label>
      </div>

      <div>
        <label className={label}>Status</label>

        <select
          className={input}
          value={form.status}
          onChange={(e) =>
            set(
              "status",
              e.target.value as FormState["status"]
            )
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-ink text-paper px-6 py-3 text-[12px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving…"
            : product
            ? "Update Product"
            : "Publish Product"}
        </button>
      </div>
    </form>
  );
}