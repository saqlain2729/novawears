"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatMoneyClient } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p className="font-display text-2xl mb-3">Your cart is waiting.</p>
        <p className="text-silver-dark text-sm mb-8">Browse the collection and find something you&apos;ll love.</p>
        <Link href="/shop" className="inline-block bg-ink text-paper px-8 py-3.5 text-[12px] tracking-widest2 uppercase">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-14">
      <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-10">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 divide-y divide-line-light border-y border-line-light">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}`} className="py-6 flex gap-5">
              <div className="relative w-24 h-28 bg-paper-dim shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium">{item.name.replace(/^DEMO — /, "")}</p>
                  {item.color && <p className="text-sm text-silver-dark mt-0.5">{item.color}</p>}
                  <p className="text-sm mt-1">{formatMoneyClient(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-line-light">
                    <button className="w-8 h-8" onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}>
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button className="w-8 h-8" onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button className="text-xs text-silver-dark underline" onClick={() => removeItem(item.productId, item.color)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="border border-line-light p-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-silver-dark">Subtotal</span>
              <span className="font-medium">{formatMoneyClient(subtotal)}</span>
            </div>
            <p className="text-xs text-silver-dark mb-6">Shipping and totals calculated at checkout.</p>
            <Link
              href="/checkout"
              className="block text-center bg-ink text-paper py-3.5 text-[13px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors"
            >
              Checkout
            </Link>
            <Link href="/shop" className="block text-center mt-3 text-[12px] tracking-widest2 uppercase text-silver-dark">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
