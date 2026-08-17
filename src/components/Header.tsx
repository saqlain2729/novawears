"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import SearchOverlay from "./SearchOverlay";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Earbuds", href: "/shop?category=earbuds" },
  { label: "Headphones", href: "/shop?category=headphones" },
  { label: "Chargers", href: "/shop?category=chargers" },
  { label: "Hands-Free", href: "/shop?category=hands-free" },
  { label: "Mobile Accessories", href: "/shop?category=mobile-accessories" },
  { label: "New Arrivals", href: "/shop?category=new-arrivals" },
];

export default function Header({ storeName }: { storeName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-paper/90 backdrop-blur-md border-b border-line-light shadow-sm"
            : "bg-paper border-b border-transparent"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl flex items-center justify-between px-5 lg:px-8 transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <button
            className="lg:hidden -ml-2 p-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <Link href="/" className="font-display text-xl md:text-2xl tracking-[0.15em] font-semibold">
            {storeName}
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide uppercase text-ink-soft">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-signal transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="p-1.5 hover:text-signal transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            <Link href="/admin" aria-label="Account" className="p-1.5 hidden sm:block hover:text-signal transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
              </svg>
            </Link>
            <button aria-label="Cart" onClick={() => setOpen(true)} className="relative p-1.5 hover:text-signal transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-ink text-paper text-[10px] min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute inset-y-0 left-0 w-[82%] max-w-sm bg-paper transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-20 border-b border-line-light">
            <span className="font-display text-lg tracking-[0.15em] font-semibold">{storeName}</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-5 py-3.5 text-sm uppercase tracking-wide border-b border-line-light/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
