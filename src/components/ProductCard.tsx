"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatMoneyClient } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, currency = "PKR" }: { product: Product; currency?: string }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= product.lowStockThreshold;
  const onSale = product.salePrice != null && product.salePrice < product.price;

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-silver-dark text-xs">
              No image
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {onSale && (
              <span className="bg-ink text-paper text-[10px] tracking-wide uppercase px-2 py-1">Sale</span>
            )}
            {product.isNewArrival && (
              <span className="bg-paper text-ink border border-ink text-[10px] tracking-wide uppercase px-2 py-1">New</span>
            )}
          </div>

          {outOfStock && (
            <div className="absolute inset-0 bg-paper/70 flex items-center justify-center">
              <span className="text-[11px] tracking-widest2 uppercase text-ink-soft">Out of Stock</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              if (outOfStock) return;
              addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0] || "",
                unitPrice: product.salePrice ?? product.price,
                quantity: 1,
                color: product.colors?.[0],
                stock: product.stock,
              });
            }}
            disabled={outOfStock}
            className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-ink text-paper text-[11px] tracking-widest2 uppercase py-3 disabled:opacity-40"
          >
            {outOfStock ? "Unavailable" : "Quick Add"}
          </button>
        </div>

        <div className="mt-3.5 space-y-1">
          <h3 className="text-sm font-medium leading-snug">{product.name.replace(/^DEMO — /, "")}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={onSale ? "text-silver-dark line-through" : ""}>
              {formatMoneyClient(product.price, currency)}
            </span>
            {onSale && <span className="font-medium">{formatMoneyClient(product.salePrice!, currency)}</span>}
          </div>
          {lowStock && (
            <p className="text-[11px] tracking-wide uppercase text-signal">Low Stock — Only {product.stock} left</p>
          )}
        </div>
      </Link>
    </div>
  );
}
