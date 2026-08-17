"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatMoneyClient } from "@/lib/format";

export default function CartDrawer({ currency = "PKR" }: { currency?: string }) {
  const { items, isOpen, setOpen, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-paper flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-line-light">
          <h2 className="font-display text-lg tracking-wide">Your Cart ({items.length})</h2>
          <button aria-label="Close cart" onClick={() => setOpen(false)} className="p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-lg">Your cart is waiting.</p>
            <button
              onClick={() => setOpen(false)}
              className="text-[12px] tracking-widest2 uppercase border-b border-ink pb-1"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 divide-y divide-line-light">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}`} className="py-5 flex gap-4">
                  <div className="relative w-20 h-24 bg-paper-dim shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name.replace(/^DEMO — /, "")}</p>
                    {item.color && <p className="text-xs text-silver-dark mt-0.5">{item.color}</p>}
                    <p className="text-sm mt-1">{formatMoneyClient(item.unitPrice, currency)}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-line-light">
                        <button
                          className="w-7 h-7 text-sm"
                          onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          className="w-7 h-7 text-sm"
                          onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-xs text-silver-dark underline"
                        onClick={() => removeItem(item.productId, item.color)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-6 border-t border-line-light space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Subtotal</span>
                <span className="font-medium">{formatMoneyClient(subtotal, currency)}</span>
              </div>
              <p className="text-xs text-silver-dark">Shipping and totals calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="block text-center bg-ink text-paper py-3.5 text-[13px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors"
              >
                Checkout
              </Link>
              <button onClick={() => setOpen(false)} className="block w-full text-center text-[12px] tracking-widest2 uppercase text-silver-dark">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
