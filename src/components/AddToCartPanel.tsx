"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addItem, setOpen } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(product.colors?.[0] || undefined);
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  function buildItem() {
    return {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      unitPrice: product.salePrice ?? product.price,
      quantity,
      color,
      stock: product.stock,
    };
  }

  return (
    <div className="space-y-6">
      {product.colors?.length > 0 && (
        <div>
          <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2.5">Color</p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 text-sm border ${
                  color === c ? "border-ink bg-ink text-paper" : "border-line-light"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2.5">Quantity</p>
        <div className="inline-flex items-center border border-line-light">
          <button className="w-10 h-10" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            className="w-10 h-10"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          disabled={outOfStock}
          onClick={() => addItem(buildItem())}
          className="w-full bg-ink text-paper py-4 text-[13px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors disabled:opacity-40"
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <button
          disabled={outOfStock}
          onClick={() => {
            addItem(buildItem());
            setOpen(false);
            router.push("/checkout");
          }}
          className="w-full border border-ink py-4 text-[13px] tracking-widest2 uppercase hover:bg-paper-dim transition-colors disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
