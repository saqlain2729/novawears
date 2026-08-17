"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { label: "Overview", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar({ adminName, adminEmail }: { adminName: string; adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 bg-ink text-paper min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-lg tracking-[0.1em]">NOVAWEARS</p>
        <p className="text-[10px] tracking-widest2 uppercase text-silver-dark mt-1">Admin</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-sm transition-colors ${
                active ? "bg-white/10 text-paper" : "text-silver hover:text-paper"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-xs text-silver truncate">{adminName}</p>
        <p className="text-[11px] text-silver-dark truncate mb-3">{adminEmail}</p>
        <button onClick={handleLogout} className="text-[11px] tracking-widest2 uppercase text-silver-dark hover:text-paper transition-colors">
          Log Out
        </button>
      </div>
    </aside>
  );
}
