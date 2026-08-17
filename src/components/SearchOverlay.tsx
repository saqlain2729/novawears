"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatMoneyClient } from "@/lib/format";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.products || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-paper animate-fade-in">
      <div className="mx-auto max-w-3xl px-5 pt-8">
        <div className="flex items-center gap-4 border-b border-ink pb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search earbuds, headphones, chargers…"
            className="flex-1 bg-transparent outline-none text-xl md:text-2xl font-display placeholder:text-silver-dark"
          />
          <button onClick={onClose} aria-label="Close search" className="p-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-8 space-y-1">
          {loading && <p className="text-sm text-silver-dark">Searching…</p>}
          {!loading && query && results.length === 0 && (
            <p className="text-sm text-silver-dark">No products found for &ldquo;{query}&rdquo;.</p>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              onClick={onClose}
              className="flex items-center justify-between py-3 border-b border-line-light hover:px-2 transition-all"
            >
              <span className="text-sm">{p.name}</span>
              <span className="text-sm font-mono text-silver-dark">
                {formatMoneyClient(p.salePrice ?? p.price)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
